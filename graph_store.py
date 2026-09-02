"""Neo4j graph connection, KG extraction, and storage."""

import warnings

warnings.filterwarnings("ignore", message=".*Pydantic serializer warnings.*")

from langchain_neo4j import Neo4jGraph
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_google_genai import ChatGoogleGenerativeAI

from config import (
    NODE_TYPES,
    RELATIONSHIP_TYPES,
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


def build_transformer() -> LLMGraphTransformer:
    """Create the LLMGraphTransformer with domain-specific schema."""
    llm_extractor = ChatGoogleGenerativeAI(model=LLM_EXTRACT, temperature=0)

    transformer = LLMGraphTransformer(
        llm=llm_extractor,
        allowed_nodes=NODE_TYPES,
        allowed_relationships=RELATIONSHIP_TYPES,
        node_properties=["description", "source"],
        relationship_properties=["confidence"],
        strict_mode=False,
    )
    return transformer


def extract_graph(
    transformer: LLMGraphTransformer,
    documents: list,
    batch_size: int = 20,
) -> list:
    """Extract graph documents from text chunks in batches."""
    from tqdm.auto import tqdm

    all_graph_docs = []
    for i in tqdm(range(0, len(documents), batch_size), desc="Extracting graph"):
        batch = documents[i : i + batch_size]
        graph_docs = transformer.convert_to_graph_documents(batch)
        all_graph_docs.extend(graph_docs)

    print(f"Extracted {len(all_graph_docs)} graph documents")
    if all_graph_docs:
        print(f"  Sample nodes: {[n.id for n in all_graph_docs[0].nodes[:5]]}")
    return all_graph_docs


def store_graph(graph: Neo4jGraph, graph_docs: list) -> None:
    """Store graph documents in Neo4j and create indexes."""
    graph.add_graph_documents(
        graph_docs,
        baseEntityLabel=True,
        include_source=True,
    )
    graph.refresh_schema()

    # Create required indexes
    graph.query(f"""
        CREATE FULLTEXT INDEX {FULLTEXT_INDEX} IF NOT EXISTS
        FOR (n:__Entity__) ON EACH [n.id]
    """)
    graph.query("CREATE INDEX entity_id IF NOT EXISTS FOR (n:__Entity__) ON (n.id)")

    node_count = graph.query("MATCH (n) RETURN count(n) as nodes")[0]["nodes"]
    rel_count = graph.query("MATCH ()-[r]->() RETURN count(r) as rels")[0]["rels"]
    print(f"Graph stored: {node_count} nodes, {rel_count} relationships")
