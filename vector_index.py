"""ChromaDB vector store for normal RAG with local HuggingFace embeddings."""

import chromadb
from chromadb.utils import embedding_functions

from config import CHROMA_DIR, CHROMA_COLLECTION, EMBED_MODEL


def get_embedding_function():
    """Create ChromaDB-compatible embedding function using local HuggingFace model."""
    return embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBED_MODEL,
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


def get_retriever(k: int = 5, jurisdiction: str = None):
    """Get a retriever from ChromaDB for normal vector RAG, with optional jurisdiction filtering."""
    from langchain_chroma import Chroma
    from langchain_huggingface import HuggingFaceEmbeddings

    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)

    vectorstore = Chroma(
        client=get_chroma_client(),
        collection_name=CHROMA_COLLECTION,
        embedding_function=embeddings,
    )

    search_kwargs = {"k": k}
    if jurisdiction in ("national", "international"):
        search_kwargs["filter"] = {"jurisdiction": jurisdiction}

    return vectorstore.as_retriever(search_kwargs=search_kwargs)
