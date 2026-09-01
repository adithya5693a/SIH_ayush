"""Main entry point: ingests PDF, builds graph, answers queries."""

import os
import sys

from config import PDF_PATH, LLM_GENERATE


def ingest(pdf_path: str = PDF_PATH):
    """Full ingestion pipeline: load PDF -> extract KG -> store in Neo4j."""
    from pdf_loader import load_pdf
    from graph_store import connect_graph, build_transformer, extract_graph, store_graph
    from vector_index import create_vector_index

    documents = load_pdf(pdf_path)

    graph = connect_graph()
    transformer = build_transformer()
    graph_docs = extract_graph(transformer, documents)
    store_graph(graph, graph_docs)

    vector_index = create_vector_index(graph)
    return graph, vector_index


def setup_app(graph, vector_index):
    """Build the LangGraph workflow."""
    from graph_retriever import GraphRetriever
    from workflow import build_workflow
    from langchain_openai import ChatOpenAI

    llm = ChatOpenAI(model=LLM_GENERATE, temperature=0)
    graph_retriever = GraphRetriever(graph=graph, llm=llm, hops=2)

    return build_workflow(vector_index, graph, graph_retriever)


def ask_graphrag(app, query: str) -> str:
    """Run a query through the GraphRAG pipeline."""
    result = app.invoke({"query": query, "messages": []})
    return result["final_answer"]


def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <pdf_path>")
        print("  or:  python main.py  (uses default PDF_PATH from config.py)")
        pdf = PDF_PATH
    else:
        pdf = sys.argv[1]

    if not os.path.exists(pdf):
        print(f"PDF not found: {pdf}")
        print("Place your PDF in the data/ directory and update PDF_PATH in config.py")
        sys.exit(1)

    print("=" * 60)
    print("GraphRAG Pipeline")
    print("=" * 60)

    graph, vector_index = ingest(pdf)
    app = setup_app(graph, vector_index)

    print("\nReady! Ask questions about your document.")
    print("Type 'quit' to exit.\n")

    while True:
        query = input("Question: ").strip()
        if not query or query.lower() in ("quit", "exit", "q"):
            break

        print(f"\nRouting query...")
        answer = ask_graphrag(app, query)
        print(f"\nAnswer:\n{answer}\n")
        print("-" * 60)


if __name__ == "__main__":
    main()
