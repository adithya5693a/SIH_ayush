"""Test script for the RAG pipeline using OpenRouter and ChromaDB."""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "openai/gpt-4o-mini"
PDF_PATH = "Geographical Indications of Goods Act 1999.pdf"

if not OPENROUTER_API_KEY:
    print("❌ OPENROUTER_API_KEY is not set in .env")
    sys.exit(1)

print("=" * 65)
print("1. Testing OpenRouter Connection...")
print("=" * 65)

from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL,
    temperature=0.2,
)

try:
    test_res = llm.invoke("Say 'OpenRouter is working!' in exactly 4 words.")
    print(f"✅ OpenRouter Response: {test_res.content.strip()}\n")
except Exception as e:
    print(f"❌ Failed to connect to OpenRouter: {e}")
    sys.exit(1)

print("=" * 65)
print("2. Loading and Chunking PDF Document...")
print("=" * 65)

if not os.path.exists(PDF_PATH):
    print(f"❌ PDF file not found at: {PDF_PATH}")
    sys.exit(1)

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = PyMuPDFLoader(PDF_PATH)
docs = loader.load()
print(f"📄 Loaded {len(docs)} pages from '{PDF_PATH}'")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""],
)
chunks = text_splitter.split_documents(docs)
print(f"✂️  Created {len(chunks)} text chunks")

print("\n" + "=" * 65)
print("3. Building Vector Store (ChromaDB + HuggingFace Embeddings)...")
print("=" * 65)

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
)

# In-memory or temporary local ChromaDB for testing
vector_store = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    collection_name="gi_act_chunks",
)
retriever = vector_store.as_retriever(search_kwargs={"k": 4})
print("✅ Vector index built successfully in ChromaDB\n")


def ask_rag(question: str):
    print(f"❓ Question: {question}")
    retrieved_docs = retriever.invoke(question)
    
    print(f"🔍 Retrieved {len(retrieved_docs)} relevant context chunks:")
    for idx, doc in enumerate(retrieved_docs, 1):
        page = doc.metadata.get("page", "Unknown")
        preview = doc.page_content.replace("\n", " ")[:150]
        print(f"   [{idx}] (Page {page}): {preview}...")

    context = "\n\n---\n\n".join(
        [f"[Source: Page {d.metadata.get('page', 'Unknown')}]\n" + d.page_content for d in retrieved_docs]
    )

    prompt = f"""You are a specialized legal AI assistant for AYUSH and IPR laws.
Answer the question accurately based ONLY on the provided legal document context.
If the answer cannot be found in the context, state that clearly.
Always cite the relevant section or page numbers when available.

Context:
{context}

Question: {question}

Detailed Answer:"""

    response = llm.invoke(prompt)
    print("\n💡 AI Answer:")
    print(response.content)
    print("-" * 65 + "\n")


print("=" * 65)
print("4. Testing RAG Queries on the Act...")
print("=" * 65 + "\n")

test_questions = [
    "What is the definition and meaning of 'geographical indication' under this Act?",
    "What are the penalties or punishments for applying false geographical indications?",
]

for q in test_questions:
    ask_rag(q)

print("🎉 RAG Pipeline Test Complete!")
