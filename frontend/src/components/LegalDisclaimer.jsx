import React from 'react';
import { I18N } from '../data/i18n.js';

export default function LegalDisclaimer({ language }) {
  const t = I18N[language] || I18N.en;

  return (
    <div className="bg-amber-950/40 border-y border-amber-500/30 text-amber-200/90 py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold text-sm">⚖️</span>
          <span className="font-medium text-xs leading-relaxed">
            {t.legalBanner}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-amber-300/70 font-mono">
          <span>Patents Act § 3(p)</span>
          <span>•</span>
          <span>BDA 2023 Form III</span>
          <span>•</span>
          <span>WIPO GRATK Treaty</span>
        </div>
      </div>
    </div>
  );
}
