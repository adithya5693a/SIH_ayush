import React, { useState, useRef, useEffect } from 'react';
import { I18N } from '../data/i18n.js';
import { queryRagLegalAssistant } from '../services/mockRagEngine.js';
import { askLegalAssistantApi } from '../services/api.js';

export default function AIChatAssistant({
  jurisdiction,
  language,
  chatMode,
  messages,
  setMessages,
  initialQuery
}) {
  const t = I18N[language] || I18N.en;
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDockedOpen, setIsDockedOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const samplePrompts = jurisdiction === 'national' ? [
    "Can I patent a modified Triphala formulation with a novel nano-delivery lipid carrier?",
    "What are the mandatory NBA Form III requirements before the grant of an Indian patent?",
    "How can I prove synergistic bio-enhancement to overcome Section 3(p) and Section 3(e)?",
    "What is the difference between Classical Ayurvedic medicine and Rule 158B P&P medicine?",
    "Is a standardized Ashwagandha extract with 5% withanolides patentable in India?",
    "What are the FSSAI compliance requirements for manufacturing Ayurveda-Aahar gummies?"
  ] : [
    "How does the WIPO GRATK Treaty (2024) mandate Country of Origin disclosure for Indian botanicals?",
    "What are the foreign prior-art hurdles at USPTO (35 U.S.C. 102/103) when facing TKDL citations?",
    "What is the compliance route for exporting Ayurvedic herbal formulations as US FDA Dietary Supplements?",
    "How to synchronize PCT international phase filings with Indian NBA Form III approval?",
    "What are the EU THMPD registration requirements for traditional Indian herbal medicines?",
    "Does exporting CITES-listed Saussurea costata require special ABS clearing-house clearance?"
  ];

  const handleSend = async (queryText) => {
    const text = (typeof queryText === 'string' ? queryText : inputQuery || '').trim();
    if (!text) return;

    const userMsg = {
      id: Date.now() + '-user',
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const responseData = await askLegalAssistantApi(text, jurisdiction);
      const assistantMsg = {
        id: Date.now() + '-ai',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: responseData
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error querying backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialWelcome = {
      id: 'welcome-' + Date.now(),
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: queryRagLegalAssistant("Welcome", jurisdiction)
    };
    setMessages([initialWelcome]);
  };

  const handleDownloadBrief = () => {
    let briefContent = `# AYUSH IPR & ABS Regulatory Counsel Summary\nGenerated: ${new Date().toLocaleString()}\nJurisdiction: ${jurisdiction.toUpperCase()}\n\n`;
    messages.forEach((m, idx) => {
      if (m.sender === 'user') {
        briefContent += `## Query ${idx + 1}: ${m.text}\n\n`;
      } else if (m.content) {
        briefContent += `### Executive Guidance:\n${m.content.executiveSummary}\n\n### Statutory Citations:\n${m.content.citationsPills?.join(', ')}\n\n### Action Items:\n${m.content.actionableSteps?.map(s => `- ${s}`).join('\n')}\n\n---\n\n`;
      }
    });
    const blob = new Blob([briefContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AYUSH_IPR_Compliance_Brief_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== '') {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Chat Contents Component
  const renderChatBody = (isDocked = false) => (
    <div className={`flex flex-col ${isDocked ? 'h-[520px]' : 'h-full'} bg-slate-950/95 text-stone-100 rounded-2xl border border-emerald-900/60 shadow-2xl overflow-hidden`}>
      {/* Chat Title Header */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/40 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-sm shadow">
            🌿
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-100 font-serif">{t.chatHeaderTitle}</h3>
            <div className="text-[10px] text-emerald-300 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{jurisdiction === 'national' ? '🇮🇳 IN Statutory RAG Grounding' : '🌐 WIPO / PCT RAG Grounding'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleDownloadBrief}
            className="text-[11px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-stone-300 border border-slate-700 transition flex items-center gap-1"
            title="Download Legal Brief"
          >
            <span>📥</span>
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={handleClearChat}
            className="text-[11px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-stone-300 border border-slate-700 transition"
            title="Clear Chat History"
          >
            🗑️
          </button>
          {isDocked && (
            <button
              onClick={() => setIsDockedOpen(false)}
              className="text-stone-400 hover:text-stone-100 p-1 text-sm ml-1"
              title="Minimize"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        <span className="text-[10px] font-mono text-emerald-400 font-bold whitespace-nowrap">Suggested:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-0.5 rounded-full bg-slate-950 text-stone-300 border border-emerald-900/80 hover:border-emerald-500 hover:text-emerald-200 text-[10px] whitespace-nowrap transition truncate max-w-[220px]"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-xs">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl rounded-tr-sm p-3.5 shadow-md border border-emerald-600/40">
                  <div className="text-[9px] text-emerald-200/80 font-mono mb-1">{msg.timestamp}</div>
                  <p className="font-medium leading-relaxed text-xs">{msg.text}</p>
                </div>
              </div>
            );
          }

          const c = msg.content;
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[95%] bg-slate-900 text-stone-200 rounded-2xl rounded-tl-sm p-4 shadow-lg border border-emerald-800/60 space-y-3">
                {/* Assistant Header & Grounding Meter */}
                <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-stone-100 text-xs">RAG Legal Counsel</span>
                    <span className="text-[9px] text-stone-400 font-mono">{msg.timestamp}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-mono text-[10px] font-bold">
                    Grounding: {c.confidenceScore}
                  </span>
                </div>

                {/* Plain-Language Guidance */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{t.execGuidanceTitle}</div>
                  <p className="text-stone-100 leading-relaxed font-sans text-xs">{c.executiveSummary}</p>
                </div>

                {/* Mandatory Statutory Citation Pills */}
                {c.citationsPills && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">{t.statCitationsTitle}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.citationsPills.map((pill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-600/50 text-[10px] font-mono font-semibold flex items-center gap-1">
                          <span>📜</span>
                          <span>{pill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Statutory Breakdown */}
                {c.statutoryBreakdown && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-teal-400 font-bold uppercase">{t.statBreakdownTitle}</div>
                    <div className="space-y-1.5">
                      {c.statutoryBreakdown.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-emerald-900/60 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-300 font-mono">{item.citation}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold bg-slate-900 text-amber-400 border border-slate-700">{item.status}</span>
                          </div>
                          <p className="text-[11px] text-stone-300 leading-normal">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actionable Next Steps */}
                {c.actionableSteps && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/40 space-y-1">
                    <div className="text-[10px] font-mono text-emerald-300 font-bold uppercase flex items-center gap-1">
                      <span>✅</span>
                      <span>{t.actionItemsTitle}</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-stone-300">
                      {c.actionableSteps.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Official Registry Links */}
                {c.registryLinks && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-800 text-[10px]">
                    <span className="font-mono text-stone-400 font-semibold">{t.officialPortalsTitle}</span>
                    {c.registryLinks.map((l, idx) => (
                      <a key={idx} href={l.url} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono hover:bg-slate-700 transition flex items-center gap-0.5 border border-slate-700">
                        <span>{l.label}</span>
                        <span>↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2.5 p-3.5 bg-slate-900 rounded-xl border border-emerald-800/60 text-emerald-300 text-xs font-mono animate-pulse">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Grounding statutory reasoning across Patents Act § 3(p), BDA 2023 & WIPO GRATK...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-emerald-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 bg-slate-950 border border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition disabled:opacity-40 flex items-center gap-1 shadow"
          >
            <span>{t.chatSendBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );

  // Split-Screen Layout
  if (chatMode === 'split') {
    return (
      <div className="h-[750px] sticky top-24">
        {renderChatBody(false)}
      </div>
    );
  }

  // Docked Floating Layout
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isDockedOpen ? (
        <div className="w-[380px] sm:w-[480px] shadow-2xl animate-fadeIn">
          {renderChatBody(true)}
        </div>
      ) : (
        <button
          onClick={() => setIsDockedOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-2xl border border-emerald-400/50 flex items-center gap-2 hover:scale-105 transition"
        >
          <span className="text-base">🌿</span>
          <span>Open AI Legal Counsel</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        </button>
      )}
    </div>
  );
}
