"""RAG retrievers: normal vector RAG (ChromaDB) and ensemble (graph + vector)."""

from typing import List

from langchain_core.retrievers import BaseRetriever
from langchain_core.documents import Document

from graph_retriever import GraphRetriever
from vector_index import get_retriever as get_chroma_retriever


def get_vector_retriever(k: int = 5):
    """Standard vector similarity retriever using ChromaDB (normal RAG)."""
    return get_chroma_retriever(k=k)


class EnsembleRetriever(BaseRetriever):
    """Combines results from multiple retrievers with weighted scoring."""

    retrievers: list
    weights: list[float]

    def _get_relevant_documents(self, query: str) -> List[Document]:
        all_docs = {}
        for retriever, weight in zip(self.retrievers, self.weights):
            try:
                docs = retriever.invoke(query)
                for i, doc in enumerate(docs):
                    key = doc.page_content[:200]
                    score = weight * (1.0 / (i + 1))
                    if key in all_docs:
                        all_docs[key]["score"] += score
                    else:
                        all_docs[key] = {"doc": doc, "score": score}
            except Exception as e:
                print(f"  Retriever warning: {e}")

        ranked = sorted(all_docs.values(), key=lambda x: x["score"], reverse=True)
        return [item["doc"] for item in ranked]


def get_ensemble_retriever(
    graph_retriever: GraphRetriever,
    graph_weight: float = 0.6,
    vector_weight: float = 0.4,
    k: int = 5,
) -> EnsembleRetriever:
    """Ensemble retriever combining graph traversal + ChromaDB vector similarity."""
    vector_ret = get_vector_retriever(k=k)

    ensemble = EnsembleRetriever(
        retrievers=[graph_retriever, vector_ret],
        weights=[graph_weight, vector_weight],
    )
    return ensemble
