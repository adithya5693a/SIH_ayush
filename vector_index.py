"""Neo4j hybrid vector index setup with LM Studio embeddings."""

import os

from langchain_neo4j import Neo4jVector
from langchain_openai import OpenAIEmbeddings

from config import (
    EMBED_MODEL,
    EMBED_DIMENSIONS,
    LMSTUDIO_BASE_URL,
    VECTOR_INDEX,
    KEYWORD_INDEX,
)


def get_embeddings() -> OpenAIEmbeddings:
    """Create embeddings instance pointing to LM Studio."""
    return OpenAIEmbeddings(
        model=EMBED_MODEL,
        dimensions=EMBED_DIMENSIONS,
        base_url=LMSTUDIO_BASE_URL,
        api_key="lm-studio",
    )


def create_vector_index(graph) -> Neo4jVector:
    """Create or connect to the hybrid vector index on Neo4j."""
    embeddings = get_embeddings()

    vector_index = Neo4jVector.from_existing_graph(
        embedding=embeddings,
        search_type="hybrid",
        node_label="Document",
        text_node_properties=["text"],
        embedding_node_property="embedding",
        index_name=VECTOR_INDEX,
        keyword_index_name=KEYWORD_INDEX,
        url=os.environ["NEO4J_URI"],
        username=os.environ["NEO4J_USERNAME"],
        password=os.environ["NEO4J_PASSWORD"],
    )
    print("Hybrid vector index ready")
    return vector_index
