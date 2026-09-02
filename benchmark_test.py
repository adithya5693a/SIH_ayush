"""Comprehensive Benchmark Test Suite for AYUSH Multi-Act Legal RAG."""

import os
import time
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

retriever = vector_store.as_retriever(search_kwargs={"k": 4})


def run_benchmark(q_id: int, category: str, question: str):
    print("\n" + "=" * 75)
    print(f"📋 TEST #{q_id} | CATEGORY: {category}")
    print(f"❓ QUESTION: {question}")
    print("=" * 75)
    
    t0 = time.time()
    docs = retriever.invoke(question)
    retrieval_time = time.time() - t0
    
    print(f"🔍 Retrieved {len(docs)} Chunks in {retrieval_time*1000:.1f}ms:")
    for idx, d in enumerate(docs, 1):
        doc_name = d.metadata.get("document_name", "Unknown")
        page = d.metadata.get("page_number", "Unknown")
        snippet = d.page_content.replace("\n", " ").strip()[:120]
        print(f"   [{idx}] {doc_name} (Page {page}): \"{snippet}...\"")

    context = "\n\n---\n\n".join(
        [f"[Source Document: {d.metadata.get('document_name')} | Page {d.metadata.get('page_number')}]\n" + d.page_content for d in docs]
    )

    prompt = f"""You are an authoritative legal intelligence AI specialized in Indian AYUSH regulations, IPR, ABS, and Food Safety laws.
Answer the following query clearly and rigorously based ONLY on the provided statutory context.
Always cite the source document name, specific Section/Rule number (if present), and Page number.

Statutory Context:
{context}

Question: {question}

Structured Legal Answer:"""

    t1 = time.time()
    res = llm.invoke(prompt)
    generation_time = time.time() - t1
    
    print(f"\n💡 AI Legal Answer (Generated in {generation_time:.2f}s):")
    print(res.content.strip())
    print("-" * 75)


benchmark_questions = [
    (1, "Food Safety & AYUSH Nutraceuticals", "What are the labeling requirements and mandatory logo provisions for Ayurveda Aahar products under FSSAI Regulations 2022?"),
    (2, "Misleading Ads & Magic Remedies", "What categories of advertisements and claims for curing diseases are prohibited under the Drugs and Magic Remedies (Objectionable Advertisements) Act 1954?"),
    (3, "Biodiversity & Foreign Access", "What are the restrictions and penalties under the Biological Diversity Act for transferring research results or accessing biological resources without NBA approval?"),
    (4, "Plant Breeder Rights vs Farmers", "What rights are guaranteed to farmers regarding saving, using, and selling farm seeds under Section 39 of the PPVFR Act 2001?"),
    (5, "Trade Marks & Geographical Origin", "How does the Trade Marks Act 1999 handle the registration of trademarks that contain geographical names or indications?")
]

print("\n🚀 Starting Comprehensive Benchmark on 20 Statutory Documents...")
total_start = time.time()

for q_id, cat, q in benchmark_questions:
    run_benchmark(q_id, cat, q)

total_elapsed = time.time() - total_start
print(f"\n🏁 Benchmark Completed in {total_elapsed:.2f} seconds!")
