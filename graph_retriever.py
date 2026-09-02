"""Custom graph retriever: entity extraction → Cypher traversal → context."""

import json
from typing import List

from langchain_core.retrievers import BaseRetriever
from langchain_core.documents import Document
from langchain_neo4j import Neo4jGraph
from langchain_groq import ChatGroq

from config import FULLTEXT_INDEX


class GraphRetriever(BaseRetriever):
    """Retrieves context by finding relevant entities and traversing their graph neighborhood."""

    graph: Neo4jGraph
    llm: ChatGroq
    hops: int = 2

    def _get_relevant_documents(self, query: str) -> List[Document]:
        # Extract key entities from the query
        entity_prompt = f"""Extract the key entities (people, organizations, concepts, technologies)
from this question as a JSON list of strings.
Question: {query}
Response (JSON list only):"""
        entities_raw = self.llm.invoke(entity_prompt).content
        try:
            entities = json.loads(entities_raw)
        except (json.JSONDecodeError, TypeError):
            entities = [query]

        results = []
        for entity in entities[:5]:
            cypher = f"""
            CALL db.index.fulltext.queryNodes('{FULLTEXT_INDEX}', $entity)
            YIELD node, score
            WHERE score > 0.5
            WITH node LIMIT 3
            MATCH path = (node)-[*1..{self.hops}]-(neighbor)
            RETURN
                node.id as entity,
                collect(DISTINCT neighbor.id) as neighbors,
                collect(DISTINCT type(relationships(path)[0])) as rel_types
            LIMIT 10
            """
            try:
                rows = self.graph.query(cypher, {"entity": entity})
                for row in rows:
                    context = f"Entity: {row['entity']}\n"
                    context += f"Connected to: {', '.join(row['neighbors'][:10])}\n"
                    context += f"Via relationships: {', '.join(set(row['rel_types']))}"
                    results.append(
                        Document(
                            page_content=context,
                            metadata={"source": "graph", "entity": row["entity"]},
                        )
                    )
            except Exception as e:
                print(f"  Graph retrieval warning: {e}")

        # Fallback: if graph retrieval returned nothing, do a direct entity search
        if not results:
            try:
                rows = self.graph.query(
                    f"MATCH (n:__Entity__) WHERE toLower(n.id) CONTAINS toLower($q) "
                    f"RETURN n.id as entity, labels(n) as labels LIMIT 5",
                    {"q": query},
                )
                for row in rows:
                    results.append(
                        Document(
                            page_content=f"Entity: {row['entity']} (type: {', '.join(row['labels'])})",
                            metadata={"source": "graph", "entity": row["entity"]},
                        )
                    )
            except Exception:
                pass

        return results
