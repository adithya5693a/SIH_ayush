import React from 'react';
import { DEMO_SCENARIOS } from '../data/legalActs.js';

export default function DemoScenarios({ onSelectScenario }) {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 border border-emerald-800/40 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono mb-2">
          <span>🎯</span>
          <span>Smart India Hackathon Jury Evaluation Suite</span>
        </div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
          Pre-Loaded Interactive Demo Scenarios
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl">
          Click any scenario below to immediately load and evaluate complex real-world AYUSH IPR, ABS compliance, and regulatory routing workflows.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DEMO_SCENARIOS.map((sc) => (
          <div
            key={sc.id}
            onClick={() => onSelectScenario(sc)}
            className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-900/60 hover:border-emerald-500/80 hover:bg-slate-900 transition-all duration-200 cursor-pointer shadow-xl space-y-4 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 uppercase">
                  {sc.tag}
                </span>
                <h3 className="text-base font-bold text-stone-100 font-serif mt-2 group-hover:text-emerald-300 transition">
                  {sc.title}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">{sc.subtitle}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-emerald-800/60 flex items-center justify-center text-xl text-emerald-400 group-hover:scale-110 transition shadow">
                ⚡
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Query Prompt
              </div>
              <p className="text-xs text-stone-300 line-clamp-2 italic">
                "{sc.query}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                Statutory Outcome
              </div>
              <p className="text-xs text-stone-200">{sc.quickSummary}</p>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
              <span>Execute Live Decision Workflow</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
