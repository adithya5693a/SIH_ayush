"""All configuration constants for the GraphRAG pipeline."""

import os
from dotenv import load_dotenv

load_dotenv()

# --- API Keys ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# --- Neo4j Connection ---
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

os.environ["NEO4J_URI"] = NEO4J_URI
os.environ["NEO4J_USERNAME"] = NEO4J_USERNAME
os.environ["NEO4J_PASSWORD"] = NEO4J_PASSWORD

# --- Paths ---
PDF_PATH = "data/Geographical Indications of Goods Act 1999.pdf"

# --- Chunking ---
CHUNK_SIZE = 1024
CHUNK_OVERLAP = 200

# --- Embeddings (HuggingFace - local) ---
EMBED_MODEL = "all-MiniLM-L6-v2"

# --- LLMs (Groq) ---
LLM_EXTRACT = "openai/gpt-oss-120b"    # Larger model for structured extraction
LLM_GENERATE = "allam-2-7b"            # Fast model for chat answers

# --- ChromaDB ---
CHROMA_DIR = "chroma_db_ayush"
CHROMA_COLLECTION = "ayush_statutory_corpus"

# --- Neo4j Index Names ---
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
