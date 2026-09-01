"""PDF loading and text splitting."""

from langchain_community.document_loaders.pdf import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import CHUNK_SIZE, CHUNK_OVERLAP


def load_pdf(pdf_path: str) -> list:
    """Load a PDF and split into chunks."""
    print(f"Loading PDF: {pdf_path}")
    loader = PyMuPDFLoader(pdf_path)
    raw_documents = loader.load()
    print(f"Loaded {len(raw_documents)} pages from PDF")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
        length_function=len,
    )

    documents = text_splitter.split_documents(raw_documents)
    avg_len = sum(len(d.page_content) for d in documents) // len(documents)
    print(f"Split into {len(documents)} chunks (avg {avg_len} chars)")
    return documents
