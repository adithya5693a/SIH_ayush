import React, { useState } from 'react';
import { I18N } from '../data/i18n.js';
import { runInternationalClassifierDiagnostic } from '../services/mockRagEngine.js';

export default function InternationalClassifierWizard({ language, onAskAI }) {
  const t = I18N[language] || I18N.en;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    treatyRoute: 'pct_route',
    geneticDisclosure: 'indian_origin_tk',
    priorArtStandard: 'uspto',
    exportCategory: 'us_dietary_supplement'
  });

  const [result, setResult] = useState(() => runInternationalClassifierDiagnostic(answers));

  const handleSelect = (key, val) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    setResult(runInternationalClassifierDiagnostic(updated));
  };

  const steps = [
    {
      id: 1,
      title: t.intlStep1Title,
      desc: t.intlStep1Desc,
      key: "treatyRoute",
      options: [
        { id: "pct_route", label: t.intlStep1Opt1Label, badge: t.intlStep1Opt1Badge, desc: t.intlStep1Opt1Desc },
        { id: "direct_paris", label: t.intlStep1Opt2Label, badge: t.intlStep1Opt2Badge, desc: t.intlStep1Opt2Desc },
        { id: "madrid_system", label: t.intlStep1Opt3Label, badge: t.intlStep1Opt3Badge, desc: t.intlStep1Opt3Desc },
        { id: "hague_system", label: t.intlStep1Opt4Label, badge: t.intlStep1Opt4Badge, desc: t.intlStep1Opt4Desc }
      ]
    },
    {
      id: 2,
      title: t.intlStep2Title,
      desc: t.intlStep2Desc,
      key: "geneticDisclosure",
      options: [
        { id: "indian_origin_tk", label: t.intlStep2Opt1Label, badge: t.intlStep2Opt1Badge, desc: t.intlStep2Opt1Desc },
        { id: "multi_country", label: t.intlStep2Opt2Label, badge: t.intlStep2Opt2Badge, desc: t.intlStep2Opt2Desc },
        { id: "synthesized_analogue", label: t.intlStep2Opt3Label, badge: t.intlStep2Opt3Badge, desc: t.intlStep2Opt3Desc }
      ]
    },
    {
      id: 3,
      title: t.intlStep3Title,
      desc: t.intlStep3Desc,
      key: "priorArtStandard",
      options: [
        { id: "uspto", label: t.intlStep3Opt1Label, badge: t.intlStep3Opt1Badge, desc: t.intlStep3Opt1Desc },
        { id: "epo", label: t.intlStep3Opt2Label, badge: t.intlStep3Opt2Badge, desc: t.intlStep3Opt2Desc },
        { id: "jpo_asia", label: t.intlStep3Opt3Label, badge: t.intlStep3Opt3Badge, desc: t.intlStep3Opt3Desc }
      ]
    },
    {
      id: 4,
      title: t.intlStep4Title,
      desc: t.intlStep4Desc,
      key: "exportCategory",
      options: [
        { id: "us_dietary_supplement", label: t.intlStep4Opt1Label, badge: t.intlStep4Opt1Badge, desc: t.intlStep4Opt1Desc },
        { id: "eu_thmpd", label: t.intlStep4Opt2Label, badge: t.intlStep4Opt2Badge, desc: t.intlStep4Opt2Desc },
        { id: "eu_novel_food", label: t.intlStep4Opt3Label, badge: t.intlStep4Opt3Badge, desc: t.intlStep4Opt3Desc },
        { id: "tga_australia", label: t.intlStep4Opt4Label, badge: t.intlStep4Opt4Badge, desc: t.intlStep4Opt4Desc }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 rounded-2xl p-5 sm:p-6 border border-amber-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono mb-2">
              <span>🌐</span>
              <span>WIPO GRATK Treaty (2024) • PCT System • Nagoya Protocol • WTO TRIPS</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
              {t.intlWizardTitle}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-3xl">
              {t.intlWizardDesc}
            </p>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-amber-800/30">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`p-2.5 rounded-xl text-left transition-all border ${
                step === s.id
                  ? 'bg-amber-900/70 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-slate-900/50 border-slate-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase text-amber-400">{t.step} 0{s.id}</div>
              <div className="text-xs font-bold truncate mt-0.5">{s.title.split('. ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: International Wizard Step + International Matrix Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Step */}
        <div className="lg:col-span-7 space-y-4">
          {steps.map((s) => {
            if (s.id !== step) return null;
            return (
              <div key={s.id} className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-amber-900/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-100 font-serif flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-mono font-bold">
                      {s.id}
                    </span>
                    {s.title}
                  </h3>
                  <span className="text-xs font-mono text-amber-400">{t.step} {s.id} / 4</span>
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
                            ? 'bg-gradient-to-r from-amber-950/80 to-slate-900 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                            : 'bg-slate-950/60 border-slate-800 hover:border-amber-700/50 hover:bg-slate-900/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${isSelected ? 'border-amber-400 bg-amber-500' : 'border-stone-600'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>}
                            </div>
                            <span className="font-semibold text-stone-100 text-sm">{opt.label}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-700/40 whitespace-nowrap">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-2 ml-7 leading-relaxed">{opt.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation */}
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
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition shadow"
                    >
                      {t.nextStep}
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1">
                      <span>✓</span>
                      <span>International Assessment Ready</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: International Regulatory Matrix Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-900 rounded-2xl p-6 border border-amber-700/50 shadow-2xl space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <h3 className="font-serif font-bold text-stone-100 text-base">{t.liveEvaluation}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 border border-amber-700">
                WIPO / GLOBAL
              </span>
            </div>

            {/* 1. International Filing Strategy */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-800/50 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">{t.matrixLegalClass}</div>
              <div className="text-sm font-bold text-stone-100">{result.filingStrategy}</div>
              <div className="text-xs text-stone-300 font-serif">{result.marketPathway}</div>
            </div>

            {/* 2. Mandatory WIPO GRATK Treaty Disclosure */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-800/50 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">{t.matrixIntlChecklist}</div>
              <p className="text-xs text-stone-200 leading-relaxed font-sans">{result.gratkDisclosure}</p>
            </div>

            {/* 3. Foreign Patent Office Prior-Art Hurdles */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-800/50 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">{t.matrixPatentPosture}</div>
              <p className="text-xs text-stone-300 leading-relaxed">{result.foreignPriorArtRisk}</p>
            </div>

            {/* Action */}
            <button
              onClick={() => onAskAI(`How should I structure the PCT patent application and WIPO GRATK mandatory origin declaration for a ${result.marketPathway} to withstand USPTO and EPO prior-art examination?`)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>{t.consultAiOnRoute}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
