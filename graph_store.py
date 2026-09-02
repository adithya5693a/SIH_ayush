"""Neo4j graph connection, KG extraction, and storage."""

import json
import warnings

warnings.filterwarnings("ignore", message=".*Pydantic serializer warnings.*")

from langchain_neo4j import Neo4jGraph
from langchain_groq import ChatGroq

from config import (
    LLM_EXTRACT,
    FULLTEXT_INDEX,
)


def connect_graph() -> Neo4jGraph:
    """Connect to Neo4j and return the graph instance."""
    import os

    graph = Neo4jGraph(
        url=os.environ["NEO4J_URI"],
        username=os.environ["NEO4J_USERNAME"],
        password=os.environ["NEO4J_PASSWORD"],
        enhanced_schema=True,
        sanitize=True,
        refresh_schema=True,
    )
    print("Connected to Neo4j")
    return graph


EXTRACT_PROMPT = """Extract entities and relationships from this legal text about Indian IP law.

Return ONLY a JSON object:
{{
  "entities": [
    {{"name": "Entity Name", "type": "Concept"}},
    ...
  ],
  "relationships": [
    {{"source": "Source Entity", "target": "Target Entity", "type": "RELATED_TO"}},
    ...
  ]
}}

Entity types: Concept, Organization, Location, Process, Technology, Substance, Act, Section
Relationship types: CAUSES, CONTRIBUTES_TO, LEADS_TO, IMPACTS, PART_OF, LOCATED_IN, RELATED_TO, GOVERNS, DEFINES, AMENDS

Text:
{text}

JSON:"""


def extract_and_store(graph: Neo4jGraph, documents: list, batch_size: int = 5) -> None:
    """Extract entities/relationships from documents and store directly in Neo4j."""
    from tqdm.auto import tqdm

    llm = ChatGroq(model=LLM_EXTRACT, temperature=0)
    total_nodes = 0
    total_rels = 0

    for i in tqdm(range(0, len(documents), batch_size), desc="Extracting & storing"):
        batch = documents[i : i + batch_size]
        for doc in batch:
            text = doc.page_content[:2000]
            prompt = EXTRACT_PROMPT.format(text=text)
            try:
                response = llm.invoke(prompt)
                content = response.content
                start = content.find("{")
                end = content.rfind("}") + 1
                if start < 0 or end <= start:
                    continue
                data = json.loads(content[start:end])

                # Store entities
                for e in data.get("entities", []):
                    name = e["name"].strip()[:200]
                    etype = e.get("type", "Concept").strip()
                    graph.query(
                        "MERGE (n:__Entity__ {id: $name}) "
                        "SET n.type = $etype, n.source = $source",
                        {"name": name, "etype": etype, "source": doc.metadata.get("source", "")},
                    )
                    total_nodes += 1

                # Store relationships
                for r in data.get("relationships", []):
                    src = r["source"].strip()[:200]
                    tgt = r["target"].strip()[:200]
                    rtype = r.get("type", "RELATED_TO").strip()
                    graph.query(
                        "MATCH (a:__Entity__ {id: $src}) "
                        "MATCH (b:__Entity__ {id: $tgt}) "
                        f"MERGE (a)-[r:{rtype}]->(b)",
                        {"src": src, "tgt": tgt},
                    )
                    total_rels += 1

            except json.JSONDecodeError:
                continue
            except Exception as e:
                print(f"  Warning: {e}")
                continue

    # Create indexes
    graph.query(f"""
        CREATE FULLTEXT INDEX {FULLTEXT_INDEX} IF NOT EXISTS
        FOR (n:__Entity__) ON EACH [n.id]
    """)
    graph.query("CREATE INDEX entity_id IF NOT EXISTS FOR (n:__Entity__) ON (n.id)")
    graph.refresh_schema()

    node_count = graph.query("MATCH (n) RETURN count(n) as nodes")[0]["nodes"]
    rel_count = graph.query("MATCH ()-[r]->() RETURN count(r) as rels")[0]["rels"]
    print(f"Extraction done: {total_nodes} nodes extracted, {total_rels} rels extracted")
    print(f"Neo4j totals: {node_count} nodes, {rel_count} relationships")
