"""Ingest all 20 AYUSH legal and regulatory PDFs into a persistent ChromaDB vector store."""

import os
import glob
import time
from tqdm import tqdm
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

DATA_DIR = "data"
CHROMA_PERSIST_DIR = "chroma_db_ayush"
COLLECTION_NAME = "ayush_statutory_corpus"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# Mapping document names to legal categories
def categorize_document(filename: str) -> str:
    name = filename.lower()
    if "patent" in name:
        return "Patents & IPR"
    elif "biodiversity" in name:
        return "Biodiversity & ABS"
    elif "drugs_and_cosmetics" in name or "clinical" in name or "devices" in name:
        return "Drugs, Cosmetics & Clinical Licensing"
    elif "geographical" in name:
        return "Geographical Indications"
    elif "fssai" in name or "aahar" in name:
        return "Ayurveda Aahar & Food Safety"
    elif "trade_marks" in name:
        return "Trade Marks"
    elif "copyright" in name:
        return "Copyright"
    elif "designs" in name:
        return "Industrial Designs"
    elif "ppvfr" in name:
        return "Plant Varieties & Farmers Rights"
    elif "magic_remedies" in name:
        return "Advertisements & Magic Remedies"
    return "AYUSH Regulatory Compliance"


def main():
    start_time = time.time()
    pdf_files = sorted(glob.glob(os.path.join(DATA_DIR, "*.pdf")))
    
    if not pdf_files:
        print(f"❌ No PDF files found in '{DATA_DIR}'")
        return

    print("=" * 70)
    print(f"🌿 AYUSH Legal Knowledge Ingestion Pipeline")
    print(f"Found {len(pdf_files)} legal documents in '{DATA_DIR}'")
    print("=" * 70)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    all_chunks = []
    total_pages = 0

    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        category = categorize_document(filename)
        
        try:
            loader = PyMuPDFLoader(pdf_path)
            docs = loader.load()
            total_pages += len(docs)
            
            # Enrich metadata for each page
            for doc in docs:
                doc.metadata["document_name"] = filename
                doc.metadata["category"] = category
                doc.metadata["page_number"] = doc.metadata.get("page", 0) + 1

            chunks = text_splitter.split_documents(docs)
            # Re-ensure metadata is intact on chunks
            for c in chunks:
                c.metadata["document_name"] = filename
                c.metadata["category"] = category
                c.metadata["page_number"] = c.metadata.get("page", 0) + 1

            all_chunks.extend(chunks)
            print(f" • {filename[:45]:<45} | {len(docs):>3} pages -> {len(chunks):>4} chunks")
        except Exception as e:
            print(f" ❌ Error processing {filename}: {e}")

    print("\n" + "=" * 70)
    print(f"📊 SUMMARY:")
    print(f" • Total Documents: {len(pdf_files)}")
    print(f" • Total Pages:     {total_pages}")
    print(f" • Total Chunks:    {len(all_chunks)}")
    print("=" * 70)

    print(f"\n🧠 Initializing Embedding Model ('{EMBEDDING_MODEL_NAME}')...")
    embedding_model = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},
    )

    print(f"💾 Creating persistent ChromaDB index at '{CHROMA_PERSIST_DIR}'...")
    
    # Store in batches of 500 chunks to maintain smooth memory usage
    batch_size = 500
    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embedding_model,
        persist_directory=CHROMA_PERSIST_DIR,
    )

    for i in tqdm(range(0, len(all_chunks), batch_size), desc="Indexing Chunks"):
        batch = all_chunks[i : i + batch_size]
        vector_store.add_documents(documents=batch)

    elapsed = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"✅ Ingestion Complete! Stored {len(all_chunks)} chunks in {elapsed:.1f} seconds.")
    print(f"Persistent Database Location: '{CHROMA_PERSIST_DIR}'")
    print("=" * 70)


if __name__ == "__main__":
    main()
