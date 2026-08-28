import React, { useState } from 'react';
import { I18N } from '../data/i18n.js';
import { FIRST_SCHEDULE_TEXTS } from '../data/legalActs.js';

export default function AdvancedRegulatoryDeepDive({ jurisdiction, language }) {
  const t = I18N[language] || I18N.en;

  const [turnover, setTurnover] = useState(150); // in Lakhs
  const [entityType, setEntityType] = useState('indian_msme');

  const turnoverNum = Number(turnover) || 0;
  let absRate = "0.1% - 0.2%";
  let calculatedFee = (turnoverNum * 100000 * 0.0015).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  let exemptionNote = "Standard Benefit Sharing rate applicable under Section 21 of BDA 2023.";

  if (entityType === 'indian_individual') {
    exemptionNote = "EXEMPT under BDA (Amendment) Act 2023 § 7 for domestic registered Vaidyas & traditional practitioners.";
    calculatedFee = "₹0 (Fully Exempted)";
  } else if (entityType === 'cultivated_only') {
    exemptionNote = "EXEMPT under BDA 2023 for certified cultivated medicinal plants with farmer provenance.";
    calculatedFee = "₹0 (Exempted under Section 40)";
  }

  const citesSpecies = [
    { name: "Saussurea costata (Kuth)", status: "CITES Appendix I", exportReq: "Strict prohibition from wild; cultivated certificate from State Forest Dept + DGFT permit required." },
    { name: "Nardostachys jatamansi (Jatamansi)", status: "CITES Appendix II", exportReq: "Export allowed only under Legal Procurement Certificate (LPC) and Non-Detriment Finding (NDF) certificate." },
    { name: "Pterocarpus santalinus (Red Sanders)", status: "CITES Appendix II", exportReq: "Restricted export quota; mandatory wildlife warden transit pass and DNA fingerprint authentication." },
    { name: "Taxus wallichiana (Talispatra)", status: "CITES Appendix II", exportReq: "Mandatory certificate of origin verifying sourcing from non-wild plantation zones." }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/70 to-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-700/40 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono mb-2">
          <span>🔬</span>
          <span>Advanced Statutory Analytics Suite</span>
        </div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
          {t.advTitle}
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl">
          {t.advSubtitle}
        </p>
      </div>

      {/* Grid: ABS Calculator + CITES Screening */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: ABS Benefit Sharing Calculator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-800/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-stone-100 font-serif flex items-center gap-2">
                <span>💰</span>
                <span>{t.advCalculatorTitle}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                BDA 2023 AMENDMENT
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-stone-300 font-semibold">Applicant Legal Category:</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-800/60 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
              >
                <option value="indian_msme">Indian MSME / Startup (100% Indian Equity)</option>
                <option value="indian_individual">Indian Individual / Registered AYUSH Vaidya</option>
                <option value="foreign_entity">Foreign Corporation / NRI / Non-Indian Shareholding</option>
                <option value="cultivated_only">Commercial Manufacturer (Cultivated Botanicals Only)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-stone-300">{t.advGrossTurnover}</span>
                <span className="text-amber-400 font-bold">₹{turnoverNum} Lakhs</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/60 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-stone-400">Statutory Benefit Sharing Rate:</span>
                <span className="text-emerald-300 font-bold">{absRate}</span>
              </div>
              <div className="flex justify-between text-xs font-mono border-t border-slate-800 pt-2">
                <span className="text-stone-300 font-bold">{t.advEstimatedFee}</span>
                <span className="text-amber-400 font-bold text-base">{calculatedFee}</span>
              </div>
              <div className="text-[11px] text-emerald-300/90 pt-1">
                <strong>{t.advExemptionStatus}</strong> {exemptionNote}
              </div>
            </div>
          </div>

          {/* First Schedule Classical Texts Concordance */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-800/60 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-stone-100 font-serif flex items-center gap-2">
              <span>📖</span>
              <span>{t.advClassicalTextsTitle}</span>
            </h3>
            <p className="text-xs text-stone-400">
              Formulations strictly derived from these 54 texts are eligible for clinical trial exemptions under Rule 158B:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {FIRST_SCHEDULE_TEXTS.map((text, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-stone-300 font-serif">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: CITES International Screening */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-amber-800/60 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-stone-100 font-serif flex items-center gap-2">
                <span>🌲</span>
                <span>{t.advCitesTitle}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                CROSS-BORDER CLEARANCE
              </span>
            </div>

            <div className="space-y-3">
              {citesSpecies.map((sp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-amber-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-100 font-serif">{sp.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                      {sp.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{sp.exportReq}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
