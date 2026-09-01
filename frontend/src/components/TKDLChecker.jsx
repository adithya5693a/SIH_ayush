import React, { useState } from 'react';
import { TKDL_DATABASE_SAMPLE } from '../data/legalActs.js';
import { queryTkdlApi } from '../services/api.js';

export default function TKDLChecker({ onNavigateToChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(TKDL_DATABASE_SAMPLE);
  const [selectedEntry, setSelectedEntry] = useState(TKDL_DATABASE_SAMPLE[0]);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    const matched = await queryTkdlApi(term);
    setResults(matched);
    if (matched.length > 0) {
      setSelectedEntry(matched[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 border border-emerald-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono mb-2">
              <span>📚</span>
              <span>CSIR • Ministry of AYUSH • TKDL Database Prior Art Repository</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
              TKDL & Prior-Art Traditional Knowledge Checker
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl">
              Simulate patent examination prior-art clearance searches against 400,000+ formulations across Ayurveda, Unani, Siddha, and Sowa-Rigpa to assess Section 3(p) patent bar vulnerability.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by formulation name, herb (e.g. Triphala, Ashwagandha, Curcumin, Shallaki), or classical text..."
              className="w-full bg-slate-950 border border-emerald-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 shadow-inner"
            />
            <span className="absolute left-3.5 top-3.5 text-stone-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Grid: Search Results List + Deep Forensic Entry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Results List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Matches Found ({results.length})</span>
            <span>Click to inspect classical prior-art shloka</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {results.map((item) => {
              const isSelected = selectedEntry?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEntry(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-950 to-slate-900 border-emerald-400 shadow-md ring-1 ring-emerald-400/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-emerald-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{item.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                      Section 3(p) Risk
                    </span>
                  </div>
                  <div className="text-sm font-bold text-stone-100 mt-1 font-serif">{item.formulationName}</div>
                  <div className="text-xs text-emerald-300/80 font-serif">{item.sanskritName}</div>
                  <p className="text-xs text-stone-400 mt-1.5 line-clamp-2">{item.classicalSource}</p>
                </div>
              );
            })}

            {results.length === 0 && (
              <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-stone-400 text-xs">
                No matching traditional knowledge record found in local sample. Your novel formulation may have clear prior-art space!
              </div>
            )}
          </div>
        </div>

        {/* Deep Inspector Pane */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEntry ? (
            <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-700/50 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">{selectedEntry.id}</span>
                  <h3 className="text-lg font-bold text-stone-100 font-serif">{selectedEntry.formulationName}</h3>
                  <div className="text-xs text-emerald-400 font-serif">{selectedEntry.sanskritName}</div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-950 text-emerald-300 border border-emerald-700">
                  Codified Prior-Art
                </span>
              </div>

              {/* Classical Source Citation */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  1. Classical Ayurvedic Text & Shloka Citation
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-800/40 text-xs text-stone-200 font-serif italic">
                  "{selectedEntry.classicalSource}"
                </div>
              </div>

              {/* Ingredients & Indications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/60 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Botanical Ingredients
                  </div>
                  <ul className="space-y-1 text-xs text-stone-300">
                    {selectedEntry.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/60 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                    Traditional Indications (Roga)
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">{selectedEntry.traditionalIndication}</p>
                </div>
              </div>

              {/* Patent Barrier Analysis under Section 3(p) */}
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-700/40 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold flex items-center gap-2">
                  <span>⛔</span>
                  <span>Indian Patent Office (IPO) Section 3(p) Examination Posture</span>
                </div>
                <p className="text-xs text-rose-100/90 leading-relaxed">{selectedEntry.patentBarrierStatus}</p>
              </div>

              {/* Overcome Strategy */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                  <span>💡</span>
                  <span>Recommended Patent Claim Drafting Strategy to Overcome § 3(p)</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">{selectedEntry.overcomeStrategy}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigateToChat(`How can I draft patent claims for an invention derived from ${selectedEntry.formulationName} (${selectedEntry.id}) to overcome the Section 3(p) traditional knowledge bar?`)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>🤖 Consult AI Assistant on Overcoming ${selectedEntry.id}</span>
                <span>→</span>
              </button>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-stone-400">
              Select an entry from the list to view its complete TKDL shloka citations and patent barrier analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
