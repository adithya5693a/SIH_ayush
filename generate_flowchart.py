"""Generate a PNG flowchart for the GraphRAG pipeline (ChromaDB + Neo4j)."""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

fig, ax = plt.subplots(1, 1, figsize=(14, 18))
ax.set_xlim(0, 14)
ax.set_ylim(0, 18)
ax.axis("off")
fig.patch.set_facecolor("white")

# Colors
C_PDF = "#E3F2FD"
C_SPLIT = "#FFF3E0"
C_KG = "#F3E5F5"
C_VEC = "#E8F5E9"
C_RET = "#FFF9C4"
C_ROUTE = "#FFECB3"
C_ANS = "#FFCDD2"
C_EDGE = "#37474F"
C_TEXT = "#212121"
C_TITLE = "#1565C0"


def box(x, y, w, h, text, color, fontsize=9, bold=False):
    rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.15",
                          facecolor=color, edgecolor=C_EDGE, linewidth=1.5)
    ax.add_patch(rect)
    weight = "bold" if bold else "normal"
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            fontsize=fontsize, fontweight=weight, color=C_TEXT)


def arrow(x1, y1, x2, y2, label=""):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>", color=C_EDGE, lw=1.8))
    if label:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx + 0.15, my, label, fontsize=7, color="#546E7A", style="italic")


def diamond(x, y, w, h, text, color):
    pts = [(x + w / 2, y + h), (x + w, y + h / 2), (x + w / 2, y), (x, y + h / 2)]
    poly = plt.Polygon(pts, facecolor=color, edgecolor=C_EDGE, linewidth=1.5)
    ax.add_patch(poly)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            fontsize=8, color=C_TEXT, fontweight="bold")


# Title
ax.text(7, 17.5, "GraphRAG Pipeline", ha="center", fontsize=18, fontweight="bold", color=C_TITLE)
ax.text(7, 17.1, "ChromaDB (Vector) + Neo4j (Graph)", ha="center", fontsize=10, color="#78909C")

# Step 1: PDF
box(4.5, 16.0, 5, 0.8, "PDF Document", C_PDF, fontsize=11, bold=True)

# Step 2: Load & Split
box(4.5, 14.5, 5, 0.8, "PyMuPDF Loader + Text Splitter\n(chunk_size=1024, overlap=200)", C_SPLIT, fontsize=8)
arrow(7, 16.0, 7, 15.3)

# Step 3: Two branches
box(0.5, 12.5, 4.5, 0.9, "LLMGraphTransformer\n(GPT-4o-mini)", C_KG, fontsize=8)
arrow(5, 14.9, 2.75, 13.4, "extract entities\n& relationships")

box(9, 12.5, 4.5, 0.9, "Embeddings\n(LM Studio: nomic-embed-text)", C_VEC, fontsize=8)
arrow(9, 14.9, 11.25, 13.4, "embed chunks")

# Step 4: Storage
box(0.5, 10.8, 4.5, 0.9, "Neo4j Property Graph\n(Nodes + Relationships)", C_KG, fontsize=8)
arrow(2.75, 12.5, 2.75, 11.7)

box(9, 10.8, 4.5, 0.9, "ChromaDB Vector Store\n(local, no server needed)", C_VEC, fontsize=8)
arrow(11.25, 12.5, 11.25, 11.7)

# Step 5: Indexes
box(0.5, 9.3, 4.5, 0.7, "Fulltext Index: entity_fulltext\nIndex: entity_id", C_KG, fontsize=7)
arrow(2.75, 10.8, 2.75, 10.0)

box(9, 9.3, 4.5, 0.7, "Collection: pdf_chunks\nCosine similarity search", C_VEC, fontsize=7)
arrow(11.25, 10.8, 11.25, 10.0)

# Query Input
box(4.5, 7.8, 5, 0.8, "User Query", C_RET, fontsize=11, bold=True)

# Classifier
diamond(5, 6.1, 4, 1.2, "Classify\nQuery Type", C_ROUTE)
arrow(7, 7.8, 7, 7.3)

# Three routes
box(0.3, 4.3, 3.8, 0.8, "Vector Search\n(Simple queries)", C_VEC, fontsize=8)
arrow(5, 6.7, 2.2, 5.1, "simple")

box(5.1, 4.3, 3.8, 0.8, "Graph Traversal\n(Relational queries)", C_KG, fontsize=8)
arrow(7, 6.1, 7, 5.1, "relational")

box(9.9, 4.3, 3.8, 0.8, "Hybrid Retrieval\n(Complex queries)", C_RET, fontsize=8)
arrow(9, 6.7, 11.8, 5.1, "complex")

# Ensemble Retriever
box(9.9, 2.8, 3.8, 0.8, "EnsembleRetriever\n(graph 60% + vector 40%)", C_RET, fontsize=7)
arrow(11.8, 4.3, 11.8, 3.6)

# Generate
box(4.5, 1.3, 5, 0.9, "GPT-4o Answer Generation\n(with source citations)", C_ANS, fontsize=9, bold=True)

arrow(2.2, 4.3, 5.5, 2.2)
arrow(7, 4.3, 7, 2.2)
arrow(11.8, 2.8, 8.5, 2.2)

# Output
box(4.5, 0.0, 5, 0.8, "Final Answer + Citations", "#ECEFF1", fontsize=10, bold=True)
arrow(7, 1.3, 7, 0.8)

plt.tight_layout()
plt.savefig("/Users/adithya/SIH Project/graphrag_flowchart.png", dpi=150, bbox_inches="tight",
            facecolor="white", edgecolor="none")
print("Saved: graphrag_flowchart.png")
