"""ChromaDB vector store for normal RAG with LM Studio embeddings."""

import chromadb
from chromadb.utils import embedding_functions

from config import CHROMA_DIR, CHROMA_COLLECTION, LMSTUDIO_BASE_URL, EMBED_MODEL


def get_embedding_function():
    """Create ChromaDB-compatible embedding function pointing to LM Studio."""
    return embedding_functions.OpenAIEmbeddingFunction(
        model_name=EMBED_MODEL,
        api_base=LMSTUDIO_BASE_URL,
        api_key="lm-studio",
    )


def get_chroma_client() -> chromadb.ClientAPI:
    """Get or create ChromaDB persistent client."""
    return chromadb.PersistentClient(path=CHROMA_DIR)


def create_vector_store(documents: list):
    """Store document chunks in ChromaDB with embeddings."""
    client = get_chroma_client()
    ef = get_embedding_function()

    # Delete existing collection if it exists, then recreate
    try:
        client.delete_collection(CHROMA_COLLECTION)
    except ValueError:
        pass

    collection = client.create_collection(
        name=CHROMA_COLLECTION,
        embedding_function=ef,
        metadata={"hnsw:space": "cosine"},
    )

    # Add documents in batches
    batch_size = 100
    for i in range(0, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        collection.add(
            ids=[f"doc_{i + j}" for j in range(len(batch))],
            documents=[d.page_content for d in batch],
            metadatas=[d.metadata for d in batch],
        )

    print(f"ChromaDB: stored {len(documents)} chunks in '{CHROMA_COLLECTION}'")
    return collection


def get_vector_store():
    """Connect to existing ChromaDB collection."""
    client = get_chroma_client()
    ef = get_embedding_function()
    return client.get_collection(
        name=CHROMA_COLLECTION,
        embedding_function=ef,
    )


def get_retriever(k: int = 5):
    """Get a retriever from ChromaDB for normal vector RAG."""
    from langchain_chroma import Chroma
    from langchain_openai import OpenAIEmbeddings

    embeddings = OpenAIEmbeddings(
        model=EMBED_MODEL,
        base_url=LMSTUDIO_BASE_URL,
        api_key="lm-studio",
    )

    vectorstore = Chroma(
        client=get_chroma_client(),
        collection_name=CHROMA_COLLECTION,
        embedding_function=embeddings,
    )

    return vectorstore.as_retriever(search_kwargs={"k": k})
