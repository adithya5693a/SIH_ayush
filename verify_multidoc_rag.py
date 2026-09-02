"""Verify Multi-document RAG across all 20 ingested acts."""

import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "openai/gpt-4o-mini"
CHROMA_PERSIST_DIR = "chroma_db_ayush"
COLLECTION_NAME = "ayush_statutory_corpus"

from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL,
    temperature=0.1,
)

embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
)

vector_store = Chroma(
    collection_name=COLLECTION_NAME,
    embedding_function=embedding_model,
    persist_directory=CHROMA_PERSIST_DIR,
)

retriever = vector_store.as_retriever(search_kwargs={"k": 3})


def test_query(question: str):
    print(f"\n{'='*70}")
    print(f"❓ QUESTION: {question}")
    print(f"{'='*70}")
    
    docs = retriever.invoke(question)
    print(f"🔍 Top Retrieved Documents:")
    for i, d in enumerate(docs, 1):
        doc_name = d.metadata.get("document_name", "Unknown")
        page = d.metadata.get("page_number", "Unknown")
        cat = d.metadata.get("category", "General")
        print(f"  [{i}] Doc: {doc_name} | Page: {page} | Category: {cat}")

    context = "\n\n---\n\n".join(
        [f"[Document: {d.metadata.get('document_name')} | Page: {d.metadata.get('page_number')}]\n" + d.page_content for d in docs]
    )

    prompt = f"""You are an authoritative AYUSH and Indian Legal IPR Assistant.
Answer the following question based ONLY on the provided legal excerpts.
Cite the exact Document name, Section/Rule number, and Page number.

Context:
{context}

Question: {question}

Answer:"""

    res = llm.invoke(prompt)
    print("\n💡 AI Answer:")
    print(res.content.strip())


queries = [
    "Under FSSAI Ayurveda Aahar Regulations 2022, what is the definition of 'Ayurveda Aahar' and what products are excluded?",
    "Under Biological Diversity Act, what are the exemptions for AYUSH practitioners from Access and Benefit Sharing (ABS)?",
    "What is the requirement under Section 3(p) of the Patents Act regarding Traditional Knowledge?",
]

for q in queries:
    test_query(q)
