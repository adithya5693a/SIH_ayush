"""Extended RAG test with diverse questions on Geographical Indications of Goods Act 1999."""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "openai/gpt-4o-mini"
PDF_PATH = "Geographical Indications of Goods Act 1999.pdf"

from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

llm = ChatOpenAI(
    model=MODEL_NAME,
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL,
    temperature=0.2,
)

# Load & Chunk
loader = PyMuPDFLoader(PDF_PATH)
docs = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(docs)

# Vector Store
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",
    model_kwargs={"device": "cpu"},
)
vector_store = Chroma.from_documents(documents=chunks, embedding=embedding_model)
retriever = vector_store.as_retriever(search_kwargs={"k": 4})


def ask_rag(q_num: int, question: str):
    print(f"\n{'='*70}")
    print(f"📌 TEST QUERY #{q_num}: {question}")
    print(f"{'='*70}")
    
    retrieved_docs = retriever.invoke(question)
    print(f"\n🔍 Retrieved {len(retrieved_docs)} Relevant Document Chunks:")
    for idx, doc in enumerate(retrieved_docs, 1):
        page = doc.metadata.get("page", 0) + 1  # 1-indexed page
        preview = doc.page_content.replace("\n", " ").strip()[:140]
        print(f"  • [Chunk {idx} | Page {page}]: \"{preview}...\"")

    context = "\n\n---\n\n".join(
        [f"[Source: Page {d.metadata.get('page', 0) + 1}]\n" + d.page_content for d in retrieved_docs]
    )

    prompt = f"""You are a legal AI specialist in Indian IPR and Geographical Indications law.
Answer the following question clearly and concisely based ONLY on the provided legal context.
If specific sections or sub-sections are mentioned in the context, cite them.

Context:
{context}

Question: {question}

Detailed Answer:"""

    response = llm.invoke(prompt)
    print("\n💡 AI Generated Answer:")
    print(response.content.strip())


test_questions = [
    "Who can apply for registration of a geographical indication, and what must be included in the application?",
    "What types of geographical indications are prohibited from registration?",
    "What is the duration of registration of a geographical indication, and how can it be renewed?",
    "What constitutes an infringement of a registered geographical indication?",
    "What is the provision regarding registration of homonymous geographical indications?"
]

for i, q in enumerate(test_questions, 1):
    ask_rag(i, q)

print(f"\n{'='*70}")
print("🎉 All 5 test questions completed successfully!")
print(f"{'='*70}\n")
