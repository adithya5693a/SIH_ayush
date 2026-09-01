"""All configuration constants for the GraphRAG pipeline."""

import os
from dotenv import load_dotenv

load_dotenv()

# --- API Keys ---
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "sk-your-key-here")

# --- Neo4j Connection ---
os.environ["NEO4J_URI"] = os.getenv("NEO4J_URI", "bolt://localhost:7687")
os.environ["NEO4J_USERNAME"] = os.getenv("NEO4J_USERNAME", "neo4j")
os.environ["NEO4J_PASSWORD"] = os.getenv("NEO4J_PASSWORD", "password")

# --- LM Studio (Local Embeddings) ---
LMSTUDIO_BASE_URL = os.getenv("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")

# --- Paths ---
PDF_PATH = "data/your_document.pdf"

# --- Chunking ---
CHUNK_SIZE = 1024
CHUNK_OVERLAP = 200

# --- Embeddings (LM Studio - local) ---
EMBED_MODEL = "nomic-embed-text"
EMBED_DIMENSIONS = 768

# --- LLMs (OpenAI - cloud) ---
LLM_EXTRACT = "gpt-4o-mini"      # Cheaper, for KG extraction
LLM_GENERATE = "gpt-4o"          # Stronger, for final answers

# --- Neo4j Index Names ---
VECTOR_INDEX = "pdf_vector_index"
KEYWORD_INDEX = "pdf_keyword_index"
FULLTEXT_INDEX = "entity_fulltext"

# --- Graph Schema (generic) ---
NODE_TYPES = [
    "Concept",
    "Phenomenon",
    "Substance",
    "Process",
    "Technology",
    "Ecosystem",
    "Organization",
    "Location",
]

RELATIONSHIP_TYPES = [
    "CAUSES",
    "CONTRIBUTES_TO",
    "LEADS_TO",
    "IMPACTS",
    "EMITS",
    "ABSORBS",
    "MITIGATES",
    "PART_OF",
    "LOCATED_IN",
    "RELATED_TO",
]
