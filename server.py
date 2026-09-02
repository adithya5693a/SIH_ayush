"""FastAPI backend for the Ayurveda IPR GraphRAG assistant."""

import time
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import config

app = FastAPI(title="AYUSH IPR GraphRAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    query: str
    jurisdiction: str = "national"

class ChatResponse(BaseModel):
    answer: str
    sources: list = []
    query_type: str = "simple"

class ClassifyRequest(BaseModel):
    category: str = "classical"
    processingMethod: str = "standard_extract"
    sourcing: str = "cultivated"
    entityType: str = "indian"


_vector_retriever = None
_llm = None


def get_llm():
    global _llm
    if _llm is None:
        from langchain_groq import ChatGroq
        _llm = ChatGroq(model=config.LLM_GENERATE, temperature=0)
    return _llm


def get_vector_retriever():
    global _vector_retriever
    if _vector_retriever is None:
        from vector_index import get_retriever as _get
        _vector_retriever = _get(k=3)
    return _vector_retriever


@app.on_event("startup")
def startup():
    llm = get_llm()
    try:
        llm.invoke("Say ok")
        print(f"[startup] Groq ({config.LLM_GENERATE}): AVAILABLE")
    except Exception as e:
        print(f"[startup] Groq: FAILED ({e})")


@app.get("/")
def root():
    return {"status": "ok", "service": "AYUSH IPR GraphRAG", "llm": _llm is not None}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    retriever = get_vector_retriever()
    docs = retriever.invoke(req.query)
    # Truncate context to stay under TPM limit
    context = "\n\n".join([d.page_content[:800] for d in docs[:3]])

    # Try LLM with retry on rate limit
    for attempt in range(3):
        try:
            llm = get_llm()
            prompt = f"""You are an Ayurveda IPR legal assistant. Answer using ONLY the context below. Be concise. Cite the source document when possible.

Context:
{context}

Question: {req.query}

Answer:"""
            answer = llm.invoke(prompt).content
            return ChatResponse(
                answer=answer,
                sources=[d.metadata.get("source", "") for d in docs],
                query_type="graphrag",
            )
        except Exception as e:
            print(f"LLM attempt {attempt+1} failed: {e}")
            if attempt < 2:
                time.sleep(5)

    # Vector-only fallback
    parts = []
    for i, d in enumerate(docs[:3]):
        src = d.metadata.get("source", d.metadata.get("file_path", "doc"))
        parts.append(f"[{i+1}] ({src})\n{d.page_content[:600]}")
    answer = "Retrieved context from knowledge base:\n\n" + "\n\n---\n\n".join(parts)
    return ChatResponse(
        answer=answer,
        sources=[d.metadata.get("source", "") for d in docs],
        query_type="vector_only",
    )


@app.post("/api/classify")
def classify(req: ClassifyRequest):
    from mock_rag_classify import classify_formulation
    return classify_formulation(req.category, req.sourcing, req.entityType)


@app.get("/api/tkdl-search")
def tkdl_search(q: str = Query(...)):
    return {"query": q, "results": [], "message": "TKDL search not yet implemented"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
