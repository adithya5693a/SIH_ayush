"""LangGraph workflow: classify → route → retrieve → generate."""

from typing import TypedDict, Annotated, List, Literal

import operator
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

from config import LLM_GENERATE


# --- State ---
class GraphRAGState(TypedDict):
    query: str
    query_type: str
    retrieved_docs: List[str]
    cypher_query: str
    graph_results: str
    final_answer: str
    messages: Annotated[List[BaseMessage], operator.add]


def build_workflow(graph, graph_retriever):
    """Build and compile the LangGraph workflow."""

    llm_generator = ChatOpenAI(model=LLM_GENERATE, temperature=0)

    # --- Retriever setup (ChromaDB for normal vector RAG) ---
    from rag import get_vector_retriever, get_ensemble_retriever

    vector_retriever = get_vector_retriever(k=5)

    ensemble_retriever = get_ensemble_retriever(
        graph_retriever, graph_weight=0.6, vector_weight=0.4
    )

    # --- Node functions ---
    def classify_query(state: GraphRAGState) -> GraphRAGState:
        prompt = f"""Classify this query into ONE category:
- 'simple': direct fact lookup, definition, simple question
- 'relational': asks about relationships, connections, 'how X relates to Y'
- 'complex': multi-hop, thematic, requires traversing multiple concepts

Query: {state['query']}
Category (one word only):"""
        result = llm_generator.invoke(prompt).content.strip().lower()
        valid = {"simple", "relational", "complex"}
        return {**state, "query_type": result if result in valid else "simple"}

    def vector_retrieval_node(state: GraphRAGState) -> GraphRAGState:
        docs = vector_retriever.invoke(state["query"])
        return {**state, "retrieved_docs": [d.page_content for d in docs]}

    def graph_retrieval_node(state: GraphRAGState) -> GraphRAGState:
        cypher_prompt = f"""You are an expert Neo4j Cypher query generator.

Graph Schema:
{graph.schema}

Generate a Cypher query to answer this question.
Use MATCH patterns, traverse 1-3 hops, RETURN relevant context.
Return ONLY the Cypher query, no explanation.

Question: {state['query']}
Cypher:"""
        cypher = llm_generator.invoke(cypher_prompt).content.strip()
        try:
            graph_results = graph.query(cypher)
            result_str = str(graph_results[:20])
        except Exception as e:
            result_str = f"Graph query failed: {e}. Falling back to vector search."
            docs = vector_retriever.invoke(state["query"])
            result_str += "\n" + "\n".join([d.page_content for d in docs])
        return {**state, "cypher_query": cypher, "graph_results": result_str}

    def hybrid_retrieval_node(state: GraphRAGState) -> GraphRAGState:
        docs = ensemble_retriever.invoke(state["query"])
        return {**state, "retrieved_docs": [d.page_content for d in docs]}

    def generate_answer(state: GraphRAGState) -> GraphRAGState:
        context_parts = []
        if state.get("retrieved_docs"):
            context_parts.append(
                "## Retrieved Context:\n" + "\n---\n".join(state["retrieved_docs"])
            )
        if state.get("graph_results"):
            context_parts.append(
                "## Graph Context:\n" + state["graph_results"]
            )
        context = "\n\n".join(context_parts)

        answer_prompt = f"""You are a helpful AI assistant with access to a knowledge graph and document index.
Answer the question using ONLY the provided context.
If the context doesn't contain the answer, say so explicitly.
Cite your sources when possible.

Context:
{context}

Question: {state['query']}

Answer:"""
        answer = llm_generator.invoke(answer_prompt).content
        return {**state, "final_answer": answer}

    def route_query(state: GraphRAGState) -> Literal["vector", "graph", "hybrid"]:
        t = state.get("query_type", "simple")
        if t == "simple":
            return "vector"
        elif t == "relational":
            return "graph"
        return "hybrid"

    # --- Build graph ---
    workflow = StateGraph(GraphRAGState)

    workflow.add_node("classifier", classify_query)
    workflow.add_node("vector_retrieve", vector_retrieval_node)
    workflow.add_node("graph_retrieve", graph_retrieval_node)
    workflow.add_node("hybrid_retrieve", hybrid_retrieval_node)
    workflow.add_node("generate", generate_answer)

    workflow.set_entry_point("classifier")

    workflow.add_conditional_edges(
        "classifier",
        route_query,
        {"vector": "vector_retrieve", "graph": "graph_retrieve", "hybrid": "hybrid_retrieve"},
    )

    workflow.add_edge("vector_retrieve", "generate")
    workflow.add_edge("graph_retrieve", "generate")
    workflow.add_edge("hybrid_retrieve", "generate")
    workflow.add_edge("generate", END)

    app = workflow.compile()
    print("LangGraph workflow compiled")
    print("  simple     -> vector -> generate")
    print("  relational -> graph  -> generate")
    print("  complex    -> hybrid -> generate")
    return app
