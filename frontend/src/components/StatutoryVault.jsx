import React, { useState } from 'react';
import { STATUTORY_PROVISIONS } from '../data/legalActs.js';

export default function StatutoryVault({ jurisdiction, setJurisdiction }) {
  const currentData = jurisdiction === 'national' ? STATUTORY_PROVISIONS.national : STATUTORY_PROVISIONS.international;
  const [selectedActId, setSelectedActId] = useState(currentData.acts[0].id);

  const selectedAct = currentData.acts.find(a => a.id === selectedActId) || currentData.acts[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono mb-2">
            <span>⚖️</span>
            <span>Statutory Acts, Regulations & Treaties Vault</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
            {currentData.title}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-1">
            Governing statutory legal provisions for {currentData.jurisdiction} ({currentData.authorities.join(" • ")}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setJurisdiction(jurisdiction === 'national' ? 'international' : 'national');
              setSelectedActId(jurisdiction === 'national' ? 'wipo-gratk-2024' : 'patents-sec3p');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-200 border border-slate-700 text-xs font-mono font-semibold transition"
          >
            Switch to {jurisdiction === 'national' ? '🌐 International Treaties' : '🇮🇳 Indian National Acts'}
          </button>
        </div>
      </div>

      {/* Grid: Acts List + Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Acts List */}
        <div className="lg:col-span-4 space-y-2.5">
          {currentData.acts.map((act) => {
            const isSelected = act.id === selectedActId;
            return (
              <button
                key={act.id}
                onClick={() => setSelectedActId(act.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950 to-slate-900 border-emerald-400 text-stone-100 shadow-md ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/80 border-slate-800 text-stone-400 hover:text-stone-200 hover:bg-slate-900'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase text-emerald-400">{act.section}</div>
                <div className="text-sm font-bold text-stone-100 mt-0.5 font-serif">{act.title}</div>
                <div className="text-xs text-stone-400 mt-1 truncate">{act.act}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Act Full Text Reader */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-700/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedAct.section}</span>
                <h3 className="text-xl font-bold text-stone-100 font-serif mt-0.5">{selectedAct.title}</h3>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">{selectedAct.act}</div>
              </div>
              <a
                href={selectedAct.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-mono font-semibold transition border border-emerald-600 flex items-center gap-1"
              >
                <span>Official Portal</span>
                <span className="text-[10px]">↗</span>
              </a>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Statutory Provision & Legal Text
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-stone-200 leading-relaxed font-sans">
                {selectedAct.description}
              </div>
            </div>

            {/* Guidelines / Examination Directives */}
            {selectedAct.guidelines && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/40 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                  <span>💡</span>
                  <span>Examination Directives & Overcome Strategies</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">{selectedAct.guidelines}</p>
              </div>
            )}

            {/* Forms if present */}
            {selectedAct.forms && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                  Statutory Filing Forms Under this Act
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedAct.forms.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-emerald-900/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-400">{f.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{f.fee}</span>
                      </div>
                      <p className="text-xs text-stone-300">{f.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Routes if present */}
            {selectedAct.routes && (
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Applicable Regulatory Classification Routes
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-emerald-400">Classical Ayurvedic Drugs:</strong> {selectedAct.routes.classical}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-amber-400">Patent & Proprietary (P&P):</strong> {selectedAct.routes.patent_proprietary}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Phytopharmaceuticals:</strong> {selectedAct.routes.phytopharmaceutical}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
