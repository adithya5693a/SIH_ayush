"""Generate a PNG flowchart for the GraphRAG pipeline."""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

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
            fontsize=fontsize, fontweight=weight, color=C_TEXT, wrap=True)


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


# ── Title ──
ax.text(7, 17.5, "GraphRAG Pipeline", ha="center", fontsize=18, fontweight="bold", color=C_TITLE)

# ── Step 1: PDF Input ──
box(4.5, 16.2, 5, 0.8, "PDF Document", C_PDF, fontsize=11, bold=True)

# ── Step 2: Load & Split ──
box(4.5, 14.7, 5, 0.8, "PyMuPDF Loader + Text Splitter\n(chunk_size=1024, overlap=200)", C_SPLIT, fontsize=8)
arrow(7, 16.2, 7, 15.5)

# ── Step 3: Two branches ──
# Left branch: KG Extraction
box(0.5, 12.7, 4.5, 0.9, "LLMGraphTransformer\n(GPT-4o-mini)", C_KG, fontsize=8)
arrow(5, 15.1, 2.75, 13.6, "extract entities\n& relationships")

# Right branch: Embeddings
box(9, 12.7, 4.5, 0.9, "Embeddings\n(LM Studio: nomic-embed-text)", C_VEC, fontsize=8)
arrow(9, 15.1, 11.25, 13.6, "embed chunks")

# ── Step 4: Storage ──
box(0.5, 11.0, 4.5, 0.9, "Neo4j Property Graph\n(Nodes + Relationships)", C_KG, fontsize=8)
arrow(2.75, 12.7, 2.75, 11.9)

box(9, 11.0, 4.5, 0.9, "Neo4j Hybrid Vector Index\n(Vector + BM25 Keyword)", C_VEC, fontsize=8)
arrow(11.25, 12.7, 11.25, 11.9)

# ── Step 5: Indexes ──
box(0.5, 9.5, 4.5, 0.7, "Fulltext Index: entity_fulltext\nIndex: entity_id", C_KG, fontsize=7)
arrow(2.75, 11.0, 2.75, 10.2)

box(9, 9.5, 4.5, 0.7, "Vector Index: pdf_vector_index\nKeyword Index: pdf_keyword_index", C_VEC, fontsize=7)
arrow(11.25, 11.0, 11.25, 10.2)

# ── Query Input ──
box(4.5, 8.0, 5, 0.8, "User Query", C_RET, fontsize=11, bold=True)

# ── Classifier ──
diamond(5, 6.3, 4, 1.2, "Classify\nQuery Type", C_ROUTE)
arrow(7, 8.0, 7, 7.5)

# ── Three routes ──
# Simple -> Vector
box(0.3, 4.5, 3.8, 0.8, "Vector Search\n(Simple queries)", C_VEC, fontsize=8)
arrow(5, 6.9, 2.2, 5.3, "simple")

# Relational -> Graph
box(5.1, 4.5, 3.8, 0.8, "Graph Traversal\n(Relational queries)", C_KG, fontsize=8)
arrow(7, 6.3, 7, 5.3, "relational")

# Complex -> Hybrid
box(9.9, 4.5, 3.8, 0.8, "Hybrid Retrieval\n(Complex queries)", C_RET, fontsize=8)
arrow(9, 6.9, 11.8, 5.3, "complex")

# ── Ensemble Retriever (from hybrid) ──
box(9.9, 3.0, 3.8, 0.8, "EnsembleRetriever\n(graph 60% + vector 40%)", C_RET, fontsize=7)
arrow(11.8, 4.5, 11.8, 3.8)

# ── Merge arrows to generate ──
box(4.5, 1.5, 5, 0.9, "GPT-4o Answer Generation\n(with source citations)", C_ANS, fontsize=9, bold=True)

arrow(2.2, 4.5, 5.5, 2.4)
arrow(7, 4.5, 7, 2.4)
arrow(11.8, 3.0, 8.5, 2.4)

# ── Output ──
box(4.5, 0.0, 5, 0.8, "Final Answer + Citations", "#ECEFF1", fontsize=10, bold=True)
arrow(7, 1.5, 7, 0.8)

plt.tight_layout()
plt.savefig("/Users/adithya/SIH Project/graphrag_flowchart.png", dpi=150, bbox_inches="tight",
            facecolor="white", edgecolor="none")
print("Saved: graphrag_flowchart.png")
