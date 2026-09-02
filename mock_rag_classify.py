"""Formulation classifier (offline, no LLM needed)."""


def classify_formulation(category: str, sourcing: str, entityType: str):
    classification = "Patent & Proprietary (P&P) Medicine"
    regulatory_route = "D&C Act Rule 158B"
    patent_risk = "AMBER"
    abs_form = "NBA Form III"

    if category == "classical":
        classification = "Classical Ayurvedic Medicine"
        patent_risk = "RED"
        abs_form = "SBB Intimation" if entityType == "indian" else "NBA Form I"
    elif category == "phytopharmaceutical":
        classification = "Phytopharmaceutical Drug"
        patent_risk = "GREEN"
        abs_form = "NBA Form III + Form I"
    elif category == "cosmetic":
        classification = "Ayurvedic Cosmetic"
        patent_risk = "AMBER"
    elif category == "ayurveda_aahar":
        classification = "Ayurveda Aahar (Nutraceutical)"
        abs_form = "NBA Form I" if entityType == "foreign" else "SBB Intimation"

    if sourcing == "rare_himalayan":
        abs_form += " (CITES required)"

    return {
        "classification": classification,
        "regulatoryRoute": regulatory_route,
        "patentRiskLevel": patent_risk,
        "absForm": abs_form,
    }
