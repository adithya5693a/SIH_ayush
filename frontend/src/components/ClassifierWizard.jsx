import React, { useState } from 'react';
import { I18N } from '../data/i18n.js';
import { runNationalClassifierDiagnostic } from '../services/mockRagEngine.js';

export default function ClassifierWizard({ language, onAskAI }) {
  const t = I18N[language] || I18N.en;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    category: 'proprietary',
    processingMethod: 'standardized_extract',
    sourcing: 'india_cultivated',
    entityType: 'indian_msme'
  });

  const [result, setResult] = useState(() => runNationalClassifierDiagnostic(answers));

  const handleSelect = (key, val) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    setResult(runNationalClassifierDiagnostic(updated));
  };

  const steps = [
    {
      id: 1,
      title: t.natStep1Title,
      desc: t.natStep1Desc,
      key: "category",
      options: [
        { id: "classical", label: t.natStep1Opt1Label, badge: t.natStep1Opt1Badge, desc: t.natStep1Opt1Desc },
        { id: "proprietary", label: t.natStep1Opt2Label, badge: t.natStep1Opt2Badge, desc: t.natStep1Opt2Desc },
        { id: "phytopharmaceutical", label: t.natStep1Opt3Label, badge: t.natStep1Opt3Badge, desc: t.natStep1Opt3Desc },
        { id: "ayurveda_aahar", label: t.natStep1Opt4Label, badge: t.natStep1Opt4Badge, desc: t.natStep1Opt4Desc },
        { id: "cosmetic", label: t.natStep1Opt5Label, badge: t.natStep1Opt5Badge, desc: t.natStep1Opt5Desc }
      ]
    },
    {
      id: 2,
      title: t.natStep2Title,
      desc: t.natStep2Desc,
      key: "processingMethod",
      options: [
        { id: "traditional_method", label: t.natStep2Opt1Label, badge: t.natStep2Opt1Badge, desc: t.natStep2Opt1Desc },
        { id: "standardized_extract", label: t.natStep2Opt2Label, badge: t.natStep2Opt2Badge, desc: t.natStep2Opt2Desc },
        { id: "nano_carrier", label: t.natStep2Opt3Label, badge: t.natStep2Opt3Badge, desc: t.natStep2Opt3Desc },
        { id: "novel_synergy", label: t.natStep2Opt4Label, badge: t.natStep2Opt4Badge, desc: t.natStep2Opt4Desc }
      ]
    },
    {
      id: 3,
      title: t.natStep3Title,
      desc: t.natStep3Desc,
      key: "sourcing",
      options: [
        { id: "india_cultivated", label: t.natStep3Opt1Label, badge: t.natStep3Opt1Badge, desc: t.natStep3Opt1Desc },
        { id: "india_wild", label: t.natStep3Opt2Label, badge: t.natStep3Opt2Badge, desc: t.natStep3Opt2Desc },
        { id: "rare_himalayan", label: t.natStep3Opt3Label, badge: t.natStep3Opt3Badge, desc: t.natStep3Opt3Desc },
        { id: "community_tk", label: t.natStep3Opt4Label, badge: t.natStep3Opt4Badge, desc: t.natStep3Opt4Desc }
      ]
    },
    {
      id: 4,
      title: t.natStep4Title,
      desc: t.natStep4Desc,
      key: "entityType",
      options: [
        { id: "indian_individual", label: t.natStep4Opt1Label, badge: t.natStep4Opt1Badge, desc: t.natStep4Opt1Desc },
        { id: "indian_msme", label: t.natStep4Opt2Label, badge: t.natStep4Opt2Badge, desc: t.natStep4Opt2Desc },
        { id: "foreign", label: t.natStep4Opt3Label, badge: t.natStep4Opt3Badge, desc: t.natStep4Opt3Desc }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-5 sm:p-6 border border-emerald-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono mb-2">
              <span>🇮🇳</span>
              <span>Indian Patents Act § 3(p) • BDA 2023 • D&C Act Rule 158B</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
              {t.nationalWizardTitle}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl">
              {t.nationalWizardDesc}
            </p>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-emerald-800/30">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`p-2.5 rounded-xl text-left transition-all border ${
                step === s.id
                  ? 'bg-emerald-900/70 border-emerald-400 text-emerald-200 shadow-md ring-1 ring-emerald-400/30'
                  : 'bg-slate-900/50 border-slate-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-400">{t.step} 0{s.id}</div>
              <div className="text-xs font-bold truncate mt-0.5">{s.title.split('. ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Wizard Form on Left + Instant Matrix Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Question Step */}
        <div className="lg:col-span-7 space-y-4">
          {steps.map((s) => {
            if (s.id !== step) return null;
            return (
              <div key={s.id} className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-900/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-100 font-serif flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                      {s.id}
                    </span>
                    {s.title}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">{t.step} {s.id} / 4</span>
                </div>
                <p className="text-xs text-stone-400">{s.desc}</p>

                <div className="space-y-3 pt-2">
                  {s.options.map((opt) => {
                    const isSelected = answers[s.key] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelect(s.key, opt.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-950/90 to-slate-900 border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                            : 'bg-slate-950/60 border-slate-800 hover:border-emerald-700/50 hover:bg-slate-900/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-stone-600'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>}
                            </div>
                            <span className="font-semibold text-stone-100 text-sm">{opt.label}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/40 whitespace-nowrap">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-2 ml-7 leading-relaxed">{opt.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Step navigation buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-stone-300 hover:bg-slate-700 disabled:opacity-40 transition"
                  >
                    {t.prevStep}
                  </button>
                  {step < 4 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow"
                    >
                      {t.nextStep}
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <span>✓</span>
                      <span>Diagnostic Ready</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Instant Matrix Result Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 via-emerald-950/60 to-slate-900 rounded-2xl p-6 border border-emerald-700/50 shadow-2xl space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <h3 className="font-serif font-bold text-stone-100 text-base">{t.liveEvaluation}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                INDIAN REGIME
              </span>
            </div>

            {/* 1. Legal Classification */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-800/50 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">{t.matrixLegalClass}</div>
              <div className="text-sm font-bold text-stone-100">{result.classification}</div>
              <div className="text-xs text-stone-300 font-serif">{result.regulatoryRoute}</div>
              <div className="text-[11px] text-stone-400 mt-1">{result.clinicalProofReq}</div>
            </div>

            {/* 2. Patentability Posture */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-800/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">{t.matrixPatentPosture}</div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  result.patentRiskLevel === 'RED' ? 'bg-rose-950 text-rose-300 border border-rose-600' :
                  result.patentRiskLevel === 'AMBER' ? 'bg-amber-950 text-amber-300 border border-amber-600' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-600'
                }`}>
                  {result.patentRiskLevel === 'RED' ? '⛔ § 3(p) HIGH BAR' :
                   result.patentRiskLevel === 'AMBER' ? '⚠️ OVERCOME BY SYNERGY' :
                   '✅ PATENTABLE FORMULATION'}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">{result.patentPosture}</p>
            </div>

            {/* 3. Mandatory ABS Forms */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-800/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">{t.matrixAbsReq}</div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-600 font-bold">
                  {result.absForm}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">{result.absRequired}</p>
            </div>

            {/* Action to query AI */}
            <button
              onClick={() => onAskAI(`What are the claim drafting strategies and NBA Form III filing timelines for a ${result.classification}? How can we overcome the Section 3(p) prior art rejection?`)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>{t.consultAiOnRoute}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
