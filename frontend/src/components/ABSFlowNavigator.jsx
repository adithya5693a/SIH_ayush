import React, { useState } from 'react';

export default function ABSFlowNavigator({ jurisdiction }) {
  const [activeStep, setActiveStep] = useState(1);
  const [entityType, setEntityType] = useState('indian_msme');
  const [annualTurnover, setAnnualTurnover] = useState('100'); // in Lakhs

  const steps = [
    {
      id: 1,
      title: "1. Botanical Sourcing & Provenance Check",
      desc: "Identify whether the biological resource is wild, cultivated, or imported.",
      statute: "BDA 2002/2023 Section 2(c) & Section 3",
      action: "Obtain Herbarium specimen certificate, Geographical Origin proof, and GPS coordinates of collection site if wild harvest."
    },
    {
      id: 2,
      title: "2. Entity Determination (NBA vs. SBB Routing)",
      desc: "Classify applicant entity structure under Section 3(2) of the Biological Diversity Act.",
      statute: "Section 3(2) (Foreign / NRI / FDI) vs Section 7 (Indian Entities)",
      action: "Foreign entities MUST apply to National Biodiversity Authority (NBA) under Form I. 100% Indian entities file intimation to State Biodiversity Board (SBB)."
    },
    {
      id: 3,
      title: "3. Form Selection & Pre-Filing Documentation",
      desc: "Select the statutory form corresponding to the commercial/IP activity.",
      statute: "NBA Regulations 2014 & Form I/II/III Rules",
      action: "Form I (Access/Commercialization), Form II (Transfer of Research), Form III (Application for IPR/Patents), Form IV (Third-Party Transfer)."
    },
    {
      id: 4,
      title: "4. Benefit Sharing Agreement (ABS Calculation)",
      desc: "Negotiate Mutually Agreed Terms (MAT) and Fair & Equitable Benefit Sharing.",
      statute: "Section 21 of BDA & ABS Guidelines 2014",
      action: "Standard rate: 0.1% to 0.5% of ex-factory sale price, or upfront lump-sum payment negotiated with BMC/SBB."
    },
    {
      id: 5,
      title: "5. IPR Grant Clearance & Post-Grant Compliance",
      desc: "Submit NBA Form III Approval Order to the Indian Patent Office (IPO).",
      statute: "Section 6 of BDA 2023 (Mandatory before Patent Grant)",
      action: "Patent controller cannot seal/grant patent without receiving Form III clearance order from NBA."
    }
  ];

  // Calculate estimated ABS fee
  const turnoverVal = parseFloat(annualTurnover) || 0;
  let absRate = "0.1% - 0.2%";
  let estimatedFee = (turnoverVal * 100000 * 0.0015).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  let exemptionStatus = "Standard Benefit Sharing Applicable";

  if (entityType === 'indian_individual') {
    exemptionStatus = "EXEMPT under BDA 2023 Amendment (Sec 7) for domestic Vaidyas/Practitioners";
    estimatedFee = "₹0 (Exempted)";
  } else if (entityType === 'cultivated_only') {
    exemptionStatus = "EXEMPT under BDA 2023 for certified cultivated medicinal plants";
    estimatedFee = "₹0 (Exempted under Section 40)";
  }

  return (
    <div className="space-y-6">
      {/* Navigator Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 border border-emerald-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono mb-2">
              <span>📋</span>
              <span>National Biodiversity Authority (NBA) • BDA 2023 Amendment</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
              ABS Compliance Flow & Benefit Sharing Navigator
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl">
              End-to-end statutory roadmap for accessing Indian biological resources, obtaining Prior Informed Consent (PIC), executing Mutually Agreed Terms (MAT), and filing NBA Form III for patent grants.
            </p>
          </div>
        </div>

        {/* 5 Steps Tracker Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-6 pt-4 border-t border-emerald-800/30">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`p-3 rounded-xl text-left transition-all border ${
                activeStep === s.id
                  ? 'bg-emerald-900/70 border-emerald-400 text-emerald-200 shadow-lg ring-1 ring-emerald-400/40'
                  : 'bg-slate-900/50 border-slate-800 text-stone-400 hover:text-stone-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-400">Step 0{s.id}</div>
              <div className="text-xs font-bold truncate mt-0.5">{s.title.split('. ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step Detail Card & Interactive ABS Fee Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {steps.map((s) => {
            if (s.id !== activeStep) return null;
            return (
              <div key={s.id} className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-900/60 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow">
                      {s.id}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-stone-100 font-serif">{s.title}</h3>
                      <span className="text-xs text-emerald-400 font-mono">{s.statute}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                    Active Phase
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Statutory Rationale & Objective
                  </div>
                  <p className="text-sm text-stone-200 leading-relaxed font-sans">{s.desc}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/60 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                    <span>⚡</span>
                    <span>Required Statutory Action & Evidentiary Documents</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{s.action}</p>
                </div>

                {/* Statutory Forms Directory */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                    Applicable Statutory Forms
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-300">Form I (Access)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-stone-400 border border-slate-700">Fee: ₹10,000</span>
                      </div>
                      <p className="text-[11px] text-stone-400">For non-Indian individuals and foreign companies accessing bio-resources.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-emerald-300">Form III (IPR / Patents)</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-stone-400 border border-slate-700">Fee: ₹500 - ₹10k</span>
                      </div>
                      <p className="text-[11px] text-stone-400">Mandatory approval required prior to the grant of patents in or outside India.</p>
                    </div>
                  </div>
                </div>

                {/* Step controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-stone-300 hover:bg-slate-700 disabled:opacity-40 transition"
                  >
                    ← Previous Phase
                  </button>
                  <button
                    disabled={activeStep === 5}
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 transition"
                  >
                    Next Phase →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive ABS Fee Estimator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 via-emerald-950/50 to-slate-900 rounded-2xl p-6 border border-emerald-700/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <h3 className="font-serif font-bold text-stone-100 text-base">ABS Benefit Sharing Estimator</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                BDA 2023
              </span>
            </div>

            {/* Entity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-stone-300 font-semibold">Applicant Classification:</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-800/60 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-400"
              >
                <option value="indian_msme">Indian MSME / Startup (100% Indian Equity)</option>
                <option value="indian_individual">Indian Individual / Registered AYUSH Vaidya</option>
                <option value="foreign_entity">Foreign Entity / MNC / Foreign Shareholding</option>
                <option value="cultivated_only">Commercial Manufacturer (Cultivated Botanicals Only)</option>
              </select>
            </div>

            {/* Annual Turnover Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-stone-300 font-semibold">Ex-Factory Gross Turnover (in ₹ Lakhs):</label>
                <span className="text-xs font-mono font-bold text-amber-400">₹{turnoverVal} Lakhs</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={annualTurnover}
                onChange={(e) => setAnnualTurnover(e.target.value)}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Calculation Output Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-mono">Applicable Benefit Sharing Rate:</span>
                <span className="text-xs font-mono font-bold text-emerald-300">{absRate}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-xs text-stone-300 font-mono font-bold">Estimated Annual ABS Contribution:</span>
                <span className="text-base font-mono font-bold text-amber-400">{estimatedFee}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-[11px] text-emerald-300 leading-normal">
                <strong>Status:</strong> {exemptionStatus}
              </div>
            </div>

            {/* Portal Action */}
            <a
              href="http://nbaindia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-200 font-semibold text-xs transition flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>🏛️ Visit National Biodiversity Authority (NBA) Portal</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
