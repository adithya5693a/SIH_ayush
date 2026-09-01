import React from 'react';
import { I18N } from '../data/i18n.js';

export default function Header({
  jurisdiction,
  setJurisdiction,
  chatMode,
  setChatMode,
  language,
  setLanguage,
  workflowMode,
  setWorkflowMode
}) {
  const t = I18N[language] || I18N.en;

  return (
    <header className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/40 text-stone-100 shadow-xl sticky top-0 z-40">
      {/* Top Bar with Title & EXACT 4 TOGGLES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
              🌿
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-stone-100 flex items-center gap-2">
                AYUSH <span className="text-amber-400 font-sans font-extrabold text-base sm:text-lg">IPR & ABS ASSISTANT</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-semibold uppercase">
                {jurisdiction === 'national' ? '🇮🇳 IN Mode' : '🌐 WIPO Mode'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/70 truncate max-w-md">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* EXACTLY 4 TOGGLE SWITCHES */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* 1. Jurisdiction Mode Toggle */}
          <div className="bg-slate-950/90 p-1 rounded-xl border border-emerald-800/60 flex items-center shadow-inner">
            <button
              onClick={() => setJurisdiction('national')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                jurisdiction === 'national'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md border border-emerald-400/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Indian Patents Act, BDA 2023, FSSAI, D&C Act"
            >
              <span>🇮🇳</span>
              <span>{t.national}</span>
            </button>
            <button
              onClick={() => setJurisdiction('international')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                jurisdiction === 'international'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="WIPO GRATK Treaty, Nagoya Protocol, TRIPS, PCT"
            >
              <span>🌐</span>
              <span>{t.international}</span>
            </button>
          </div>

          {/* 2. AI Chatbot Display Mode Toggle */}
          <div className="bg-slate-950/90 p-1 rounded-xl border border-emerald-800/60 flex items-center shadow-inner">
            <button
              onClick={() => setChatMode('docked')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                chatMode === 'docked'
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-600/50 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Docked Floating Panel"
            >
              <span>📌</span>
              <span>{t.chatDocked}</span>
            </button>
            <button
              onClick={() => setChatMode('split')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                chatMode === 'split'
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-400/50 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Split-Screen Dynamic Workspace"
            >
              <span>⚡</span>
              <span>{t.chatSplit}</span>
            </button>
          </div>

          {/* 3. Multi-Language Switcher */}
          <div className="bg-slate-950/90 p-1 rounded-xl border border-emerald-800/60 flex items-center text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                language === 'en'
                  ? 'bg-emerald-800 text-emerald-100 border border-emerald-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                language === 'hi'
                  ? 'bg-emerald-800 text-emerald-100 border border-emerald-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* 4. Workflow Mode Toggle */}
          <div className="bg-slate-950/90 p-1 rounded-xl border border-emerald-800/60 flex items-center shadow-inner">
            <button
              onClick={() => setWorkflowMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                workflowMode === 'standard'
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Standard Diagnostic Flow"
            >
              <span>⚙️</span>
              <span>{t.workflowStandard}</span>
            </button>
            <button
              onClick={() => setWorkflowMode('advanced')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                workflowMode === 'advanced'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border border-amber-400/40 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Advanced Regulatory / ABS Deep-Dive"
            >
              <span>🔬</span>
              <span>{t.workflowAdvanced}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
