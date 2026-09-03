export const FIRST_SCHEDULE_TEXTS = [
  "Charaka Samhita", "Sushruta Samhita", "Astanga Hridaya", "Astanga Samgraha",
  "Bhavaprakasha Nighantu", "Bhaishajya Ratnavali", "Sahasrayogam", "Chakradatta",
  "Sharangadhara Samhita", "Rasa Ratna Samucchaya", "Rasa Tarangini", "Yoga Ratnakara",
  "Vaidyaka Shabda Sindhu", "Dhanvantari Nighantu", "Raja Nighantu", "Kaiyadeva Nighantu",
  "Materia Medica of Ayurveda", "Ayurvedic Pharmacopoeia of India (API)", "Ayurvedic Formulary of India (AFI)"
];

export const STATUTORY_PROVISIONS = {
  national: {
    title: "Indian Regulatory & IPR Regime",
    jurisdiction: "Republic of India",
    authorities: ["Indian Patent Office (IPO / CGPDTM)", "National Biodiversity Authority (NBA)", "Ministry of AYUSH", "State Biodiversity Boards (SBB)", "FSSAI"],
    acts: [
      {
        id: "patents-sec3p",
        act: "Indian Patents Act, 1970 (as amended)",
        section: "Section 3(p)",
        title: "Traditional Knowledge Exclusion Bar",
        description: "An invention which in effect is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components is NOT an invention.",
        guidelines: "To overcome § 3(p), the applicant must demonstrate synergistic bio-activity (experimental proofs showing interaction > sum of individual components) or a novel technological formulation/carrier (e.g., liposomal/nano-phyto delivery) that cannot be deduced from codified texts.",
        ruleRef: "Indian Patent Rules 2024; CGPDTM Guidelines for Examination of Patent Applications relating to Traditional Knowledge & Biological Material",
        riskLevel: "CRITICAL",
        portalUrl: "https://ipindia.gov.in"
      },
      {
        id: "patents-sec3d",
        act: "Indian Patents Act, 1970",
        section: "Section 3(d)",
        title: "Efficacy Enhancement Requirement for Known Substances",
        description: "The mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance is not patentable.",
        guidelines: "Extracts or purified fractions must demonstrate statistically significant therapeutic efficacy enhancement over standard crude extracts.",
        riskLevel: "HIGH",
        portalUrl: "https://ipindia.gov.in"
      },
      {
        id: "bda-sec6",
        act: "Biological Diversity Act, 2002 & 2023 Amendment",
        section: "Section 6 (Form III / SBB Prior Intimation)",
        title: "Mandatory ABS Approval for IPR Applications",
        description: "No person shall apply for any intellectual property right in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining prior approval of National Biodiversity Authority (NBA) or intimation to SBB.",
        guidelines: "Under the BDA (Amendment) Act 2023, registered AYUSH practitioners and codified traditional knowledge holders are exempt from benefit sharing for domestic manufacture, but prior approval (Form III) remains mandatory before the grant of patents.",
        forms: [
          { name: "Form I", purpose: "Access to Biological Resources by Non-Indian Entities / Commercial Utilization", fee: "₹10,000" },
          { name: "Form II", purpose: "Transfer of Biological Resource Research Results to Foreign Entities", fee: "₹5,000" },
          { name: "Form III", purpose: "Application for Approval for Applying for Intellectual Property Rights (Patents)", fee: "₹500 for Indian Individuals / ₹10,000 for Corporates" },
          { name: "Form IV", purpose: "Third-party Transfer of accessed biological resource", fee: "₹10,000" }
        ],
        portalUrl: "http://nbaindia.org"
      },
      {
        id: "dc-act-158b",
        act: "Drugs and Cosmetics Act, 1940 & Rules 1945",
        section: "Rule 158B & 1st Schedule",
        title: "Ayurvedic Drug Manufacturing Licensing & Proof of Safety/Efficacy",
        description: "Governs the licensing of Classical Ayurvedic Formulations (manufactured strictly per 54 authoritatively listed classical texts in the First Schedule) vs. Patent or Proprietary (P&P) Medicines.",
        routes: {
          classical: "Exempt from clinical trials; requires citations from First Schedule texts (e.g. Charaka Samhita, Sushruta Samhita, Sahasrayogam) + compliance with Ayurvedic Pharmacopoeia of India (API).",
          patent_proprietary: "Requires pilot clinical studies or published scientific evidence for safety & therapeutic rationale per Rule 158B.",
          phytopharmaceutical: "New category of standardized botanical drugs requiring complete chemical characterization, preclinical toxicology, and Phase I-III clinical trial data."
        },
        portalUrl: "https://ayush.gov.in"
      },
      {
        id: "fssai-ayurveda-aahar",
        act: "Food Safety and Standards (Ayurveda Aahar) Regulations, 2022",
        section: "Regulation 3 & Schedule A",
        title: "Ayurveda Aahar (Nutraceuticals & Dietary Regimens)",
        description: "Covers food prepared in accordance with the recipes or processes or principles described in authoritative Ayurvedic books listed in Schedule A. Shall not include synthetic vitamins or minerals.",
        guidelines: "Mandatory special logo requirement ('Ayurveda Aahar' green/brown emblem) and strict prohibition on disease therapeutic treatment claims.",
        portalUrl: "https://fssai.gov.in"
      },
      {
        id: "gi-act-1999",
        act: "Geographical Indications of Goods Act, 1999",
        section: "Section 8 & Section 20",
        title: "Protection of Regional Ayurvedic Herbs & Formulations",
        description: "Provides legal protection to geographical origin-specific goods (e.g. Malabar Pepper, Alleppey Cardamom, Kangra Tea, Navara Rice) preventing unauthorized commercial appropriation.",
        portalUrl: "https://ipindia.gov.in"
      },
      {
        id: "divya-pharmacy-case",
        act: "Landmark Case Law: Divya Pharmacy v. Union of India (2018)",
        section: "Uttarakhand HC Ruling on BDA § 21 & ABS",
        title: "Domestic Commercial Entities Subject to Benefit Sharing",
        description: "Landmark High Court ruling affirming that Indian commercial companies (including Divya Pharmacy / Patanjali) are legally obligated to share fair and equitable benefits with local biodiversity management committees (BMCs) under the Biological Diversity Act.",
        guidelines: "Established that 'Fair and Equitable Benefit Sharing' (FEBS) applies universally to conserve Indian biological heritage, though codified Vaidyas and domestic AYUSH practitioners gained subsequent legislative exemption in the 2023 Amendment Act.",
        portalUrl: "http://nbaindia.org"
      },
      {
        id: "ipo-tk-guidelines",
        act: "CGPDTM Guidelines for Examination of TK Patent Applications",
        section: "Patent Office Screening Guidelines (6-Step Test)",
        title: "Guidelines for Patents Involving Traditional Knowledge & Botanicals",
        description: "Official manual issued by the Indian Patent Office outlining the step-by-step examination procedure for claims based on codified AYUSH knowledge, prior-art concordance with TKDL, and non-obvious synergistic efficacy proofs.",
        portalUrl: "https://ipindia.gov.in"
      },
      {
        id: "nba-abs-guidelines-2024",
        act: "National Biodiversity Authority ABS Guidelines & Forms 2024",
        section: "Form I, II, III, IV & Benefit-Sharing Norms",
        title: "2024 Standardized ABS Application Protocols",
        description: "Official 2024 regulatory procedures for accessing Indian biological resources, commercialization royalties (0.1%-0.5% ex-factory), and obtaining Form III mandatory approval prior to grant of patent rights.",
        portalUrl: "http://nbaindia.org"
      }
    ]
  },
  international: {
    title: "International Treaties & Cross-Border Frameworks",
    jurisdiction: "Global / WIPO / CBD / WTO / WHO",
    authorities: ["World Intellectual Property Organization (WIPO)", "Convention on Biological Diversity (CBD) Secretariat", "WTO TRIPS Council", "European Patent Office (EPO)", "US FDA", "WHO"],
    acts: [
      {
        id: "wipo-gratk-2024",
        act: "WIPO Treaty on Intellectual Property, Genetic Resources and Associated Traditional Knowledge (GRATK 2024)",
        section: "Article 3 & 4",
        title: "Mandatory Disclosure of Origin for Patent Applicants",
        description: "Adopted by consensus at WIPO Geneva in May 2024. Obligates patent applicants worldwide to explicitly disclose the country of origin of genetic resources and the indigenous/local community providing associated traditional knowledge in their patent specifications.",
        sanctions: "Failure to disclose or fraudulent misrepresentation may lead to refusal of patent grants or post-grant revocation where intentional intent to deceive is established.",
        significance: "Historic win for developing nations and traditional knowledge sovereign rights (CBD/Nagoya compliance worldwide).",
        portalUrl: "https://www.wipo.int/treaties/en/ip/gratk/"
      },
      {
        id: "cbd-1992",
        act: "Convention on Biological Diversity (CBD 1992)",
        section: "Article 8(j) & Article 15",
        title: "Sovereign Rights over Genetic Resources & Traditional Knowledge",
        description: "Foundational international treaty recognizing national sovereignty of member states over their genetic biological resources, mandating Prior Informed Consent (PIC) and fair benefit sharing for indigenous communities.",
        portalUrl: "https://www.cbd.int"
      },
      {
        id: "nagoya-protocol",
        act: "Nagoya Protocol on Access and Benefit Sharing (to CBD)",
        section: "Article 5, 6, 7 & 15",
        title: "Prior Informed Consent (PIC) & Mutually Agreed Terms (MAT)",
        description: "International agreement creating a transparent legal framework for the fair and equitable sharing of benefits arising out of the utilization of genetic resources and traditional knowledge.",
        checkpoints: "Patent offices in signatory states (EU, UK, Japan, India) act as designated compliance checkpoints under the ABS Clearing-House (ABSCH).",
        portalUrl: "https://absch.cbd.int"
      },
      {
        id: "wto-trips",
        act: "WTO TRIPS Agreement (1994)",
        section: "Article 27.3(b) & Traditional Knowledge Review",
        title: "Trade-Related Aspects of Intellectual Property Rights",
        description: "Multilateral WTO agreement governing patentability of plants, animals, and microbiological processes. Defines developing countries' positions on mandatory disclosure of origin and protecting non-patentable traditional medicinal knowledge.",
        portalUrl: "https://www.wto.org/trips"
      },
      {
        id: "eu-thmpd",
        act: "EU Directive 2004/24/EC (THMPD)",
        section: "Article 16a to 16i",
        title: "Traditional Herbal Medicinal Products Directive",
        description: "Simplified registration pathway for Ayurvedic medicines in the European Union. Requires documentation of at least 30 years of traditional medicinal use, including at least 15 years within the EU community or reciprocal traditional regimes.",
        portalUrl: "https://health.ec.europa.eu"
      },
      {
        id: "usfda-botanical-dshea",
        act: "US FDA Dietary Supplement Health & Education Act (DSHEA 1994) & 21 CFR 111",
        section: "21 U.S.C. 321(ff) & 21 CFR 111 cGMP",
        title: "United States Dietary Supplement vs Botanical Drug Pathway",
        description: "AYUSH export to the United States primarily enters as Dietary Supplements under DSHEA, requiring strict cGMP compliance, structure/function claims, and prohibition of disease-treatment claims. Novel botanical extracts require New Dietary Ingredient (NDI) 75-day pre-market notifications.",
        portalUrl: "https://www.fda.gov"
      },
      {
        id: "who-gacp",
        act: "WHO Guidelines on Good Agricultural & Collection Practices (GACP 2003)",
        section: "Quality Standards for Herbal Raw Materials",
        title: "Global Quality Assurance for Medicinal Plant Harvest",
        description: "World Health Organization standards ensuring botanical authentication, contamination-free harvesting (heavy metals, pesticides, microbial load), and sustainable cultivation for global export compliance.",
        portalUrl: "https://www.who.int/medicines"
      },
      {
        id: "pct-rule4",
        act: "Patent Cooperation Treaty (PCT Regulations)",
        section: "PCT Rule 4.17 & Article 27",
        title: "Declaration of Inventorship & Genetic Resource Origin",
        description: "Standardized international filing route covering 157 countries. Applicants must ensure Indian NBA Form III approval is harmonized with PCT national phase entry deadlines (30/31 months).",
        portalUrl: "https://www.wipo.int/pct/en/"
      }
    ]
  }
};

export const TKDL_DATABASE_SAMPLE = [
  {
    id: "TKDL-AY-09214",
    formulationName: "Triphala Churna / Kwatha",
    sanskritName: "त्रिफला चूर्ण / क्वाथ",
    classicalSource: "Charaka Samhita, Chikitsa Sthana, Adhyaya 1; Bhavaprakasha Nighantu (Haritakyadi Varga)",
    ingredients: ["Haritaki (Terminalia chebula)", "Bibhitaki (Terminalia bellirica)", "Amalaki (Phyllanthus emblica)"],
    ratio: "1:1:1 equal parts",
    traditionalIndication: "Prameha (Metabolic disorders / Diabetes), Deepana, Pachana, Rasayana, Chakshushya (Eye disorders)",
    patentBarrierStatus: "High Section 3(p) Bar. Any basic herbal mixture, water/alcohol extract, or simple grind without synergistic non-obvious formulation is non-patentable.",
    overcomeStrategy: "Must use targeted nanoparticle encapsulation, novel standardized bioactive ratio showing synergistic lipid-lowering IC50 reduction, or specific sub-fraction extraction process."
  },
  {
    id: "TKDL-AY-14820",
    formulationName: "Ashwagandharishta / Ashwagandha Churna",
    sanskritName: "अश्वगन्धारिष्ट / अश्वगन्धा",
    classicalSource: "Bhaishajya Ratnavali, Murcha Rogadhikara, Shloka 114-120; Sharangadhara Samhita",
    ingredients: ["Ashwagandha (Withania somnifera)", "Musali (Chlorophytum tuberosum)", "Manjistha (Rubia cordifolia)", "Haridra (Curcuma longa)", "Dhataki Pushpa (Woodfordia fruticosa)"],
    traditionalIndication: "Murcha (Syncope), Apasmara (Epilepsy), Karshya (Emaciation), Rasayana (Immunomodulator)",
    patentBarrierStatus: "Barred under Section 3(p) for adaptogenic, anti-stress, and memory enhancement claims.",
    overcomeStrategy: "Patentable only for chemically novel withanolide glycoside derivatives or specific pharmacokinetic enhancement delivery systems (e.g. SNEDDS / Phytosomes)."
  },
  {
    id: "TKDL-AY-22910",
    formulationName: "Shallaki-Guggulu Sandhi Vata Yoga",
    sanskritName: "शल्लकी-गुग्गुलु योग",
    classicalSource: "Chakradatta, Amavata Rogadhikara; Sushruta Samhita, Chikitsa Sthana",
    ingredients: ["Shallaki (Boswellia serrata)", "Guggulu (Commiphora mukul)", "Shunthi (Zingiber officinale)", "Nirgundi (Vitex negundo)"],
    traditionalIndication: "Sandhivata (Osteoarthritis), Amavata (Rheumatoid arthritis), Shula (Pain management)",
    patentBarrierStatus: "High Section 3(p) Bar for topical or oral anti-inflammatory / anti-arthritic combinations.",
    overcomeStrategy: "Requires synergistic molecular docking data showing dual COX-2 / 5-LOX inhibition surpassing standard indomethacin with non-obvious bio-enhancement."
  },
  {
    id: "TKDL-AY-05531",
    formulationName: "Haridra Khanda",
    sanskritName: "हरिद्रा खण्ड",
    classicalSource: "Bhaishajya Ratnavali, Sheetapitta-Udarda-Kotha Chikitsa, Shloka 1-9",
    ingredients: ["Haridra (Curcuma longa)", "Ghrita (Clarified butter)", "Ksheera (Cow's Milk)", "Sharkara", "Trikatu", "Triphala"],
    traditionalIndication: "Sheetapitta (Allergic skin conditions / Urticaria), Kotha (Pruritus), Kandu",
    patentBarrierStatus: "Barred under Section 3(p) for topical wound healing, allergy, and skin soothing.",
    overcomeStrategy: "Must isolate specific tetrahydrocurcuminoid complex with novel transdermal microneedle patch matrix."
  }
];
