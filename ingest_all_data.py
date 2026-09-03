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

# Mapping document names to legal categories and jurisdiction
def get_document_metadata(filename: str):
    name = filename.lower()
    
    # Jurisdiction detection
    international_keywords = ["wipo", "gratk", "convention_on_biological_diversity", "cbd", "nagoya", "trips", "wto", "eu_directive", "thmpd", "dshea", "who_gacp"]
    is_international = any(kw in name for kw in international_keywords)
    jurisdiction = "international" if is_international else "national"
    
    # Granular Legal Category
    if "caselaw" in name or "divya_pharmacy" in name:
        category = "Landmark Case Law & ABS Judicial Precedents"
    elif "wipo" in name or "gratk" in name:
        category = "WIPO GRATK Treaty (Genetic Resources & TK 2024)"
    elif "nagoya" in name:
        category = "Nagoya Protocol on ABS & Genetic Resources"
    elif "convention_on_biological_diversity" in name:
        category = "Convention on Biological Diversity (CBD 1992)"
    elif "trips" in name or "wto" in name:
        category = "WTO TRIPS Agreement (Article 27.3(b))"
    elif "eu_directive" in name:
        category = "EU Traditional Herbal Directive (THMPD 2004/24/EC)"
    elif "dshea" in name or "us_fda" in name:
        category = "US FDA Dietary Supplement Health & Education Act (DSHEA)"
    elif "who_gacp" in name:
        category = "WHO Good Agricultural & Collection Practices (GACP)"
    elif "ipo_guidelines" in name:
        category = "CGPDTM Guidelines for Traditional Knowledge Patents"
    elif "first_schedule" in name:
        category = "D&C Act First Schedule (54 Authoritative Classical Texts)"
    elif "nba_abs" in name:
        category = "NBA ABS Guidelines & Statutory Application Forms (2024)"
    elif "patent" in name:
        category = "Patents Act & Rules (Section 3(p), 3(d), 3(e))"
    elif "biodiversity" in name:
        category = "Biological Diversity Act & ABS Framework"
    elif "drugs_and_cosmetics" in name or "clinical" in name or "devices" in name:
        category = "Drugs, Cosmetics & Clinical Licensing (Rule 158B)"
    elif "geographical" in name:
        category = "Geographical Indications of Goods"
    elif "fssai" in name or "aahar" in name:
        category = "Ayurveda Aahar & Food Safety (FSSAI 2022)"
    elif "trade_marks" in name:
        category = "Trade Marks & Brand Origin"
    elif "copyright" in name:
        category = "Copyright & Codified Treatises"
    elif "designs" in name:
        category = "Industrial Designs & Ayurvedic Packaging"
    elif "ppvfr" in name:
        category = "Plant Varieties Protection & Farmers Rights (PPVFR 2001)"
    elif "magic_remedies" in name:
        category = "Objectionable Advertisements & Magic Remedies Act"
    else:
        category = "AYUSH Statutory & Regulatory Compliance"
        
    return category, jurisdiction


def main():
    start_time = time.time()
    # Match both *.pdf and *.PDF case-insensitively
    all_files = os.listdir(DATA_DIR)
    pdf_files = sorted([os.path.join(DATA_DIR, f) for f in all_files if f.lower().endswith(".pdf")])

    
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
        category, jurisdiction = get_document_metadata(filename)
        
        try:
            loader = PyMuPDFLoader(pdf_path)
            docs = loader.load()
            total_pages += len(docs)
            
            # Enrich metadata for each page
            for doc in docs:
                doc.metadata["document_name"] = filename
                doc.metadata["category"] = category
                doc.metadata["jurisdiction"] = jurisdiction
                doc.metadata["page_number"] = doc.metadata.get("page", 0) + 1

            chunks = text_splitter.split_documents(docs)
            # Re-ensure metadata is intact on chunks
            for c in chunks:
                c.metadata["document_name"] = filename
                c.metadata["category"] = category
                c.metadata["jurisdiction"] = jurisdiction
                c.metadata["page_number"] = c.metadata.get("page", 0) + 1

            all_chunks.extend(chunks)
            print(f" • [{jurisdiction.upper()[:4]}] {filename[:40]:<40} | {len(docs):>3} pages -> {len(chunks):>4} chunks")
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
