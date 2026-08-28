import React, { useState } from 'react';
import Header from './components/Header.jsx';
import LegalDisclaimer from './components/LegalDisclaimer.jsx';
import ClassifierWizard from './components/ClassifierWizard.jsx';
import InternationalClassifierWizard from './components/InternationalClassifierWizard.jsx';
import AdvancedRegulatoryDeepDive from './components/AdvancedRegulatoryDeepDive.jsx';
import AIChatAssistant from './components/AIChatAssistant.jsx';
import { queryRagLegalAssistant } from './services/mockRagEngine.js';

export default function App() {
  // Exact 4 Top Bar Toggle States
  const [jurisdiction, setJurisdiction] = useState('national'); // 'national' | 'international'
  const [chatMode, setChatMode] = useState('split'); // 'docked' | 'split'
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [workflowMode, setWorkflowMode] = useState('standard'); // 'standard' | 'advanced'

  // Omnipresent Persistent Chat Session State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: queryRagLegalAssistant("Welcome to AYUSH IPR Assistant", "national")
    }
  ]);
  const [chatTriggerQuery, setChatTriggerQuery] = useState('');

  const handleAskAIFromWizard = (query) => {
    setChatTriggerQuery(query);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col antialiased">
      {/* 1. TOP HEADER WITH EXACTLY 4 TOGGLE SWITCHES */}
      <Header
        jurisdiction={jurisdiction}
        setJurisdiction={setJurisdiction}
        chatMode={chatMode}
        setChatMode={setChatMode}
        language={language}
        setLanguage={setLanguage}
        workflowMode={workflowMode}
        setWorkflowMode={setWorkflowMode}
      />

      {/* 2. MANDATORY LEGAL STATUTORY DISCLAIMER BANNER */}
      <LegalDisclaimer language={language} />

      {/* 3. MAIN WORKSPACE VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {chatMode === 'split' ? (
          /* SPLIT-SCREEN DYNAMIC WORKSPACE LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Main Diagnostic & Regulatory Workflows (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {jurisdiction === 'national' ? (
                <ClassifierWizard
                  language={language}
                  onAskAI={handleAskAIFromWizard}
                />
              ) : (
                <InternationalClassifierWizard
                  language={language}
                  onAskAI={handleAskAIFromWizard}
                />
              )}

              {/* Render Deep-Dive Suite if Advanced Mode active */}
              {workflowMode === 'advanced' && (
                <AdvancedRegulatoryDeepDive
                  jurisdiction={jurisdiction}
                  language={language}
                />
              )}
            </div>

            {/* Right: Omnipresent Persistent AI Assistant (5 cols) */}
            <div className="lg:col-span-5">
              <AIChatAssistant
                jurisdiction={jurisdiction}
                language={language}
                chatMode="split"
                messages={chatMessages}
                setMessages={setChatMessages}
                initialQuery={chatTriggerQuery}
              />
            </div>
          </div>
        ) : (
          /* DOCKED FLOATING WORKSPACE LAYOUT */
          <div className="space-y-6">
            {jurisdiction === 'national' ? (
              <ClassifierWizard
                language={language}
                onAskAI={handleAskAIFromWizard}
              />
            ) : (
              <InternationalClassifierWizard
                language={language}
                onAskAI={handleAskAIFromWizard}
              />
            )}

            {/* Render Deep-Dive Suite if Advanced Mode active */}
            {workflowMode === 'advanced' && (
              <AdvancedRegulatoryDeepDive
                jurisdiction={jurisdiction}
                language={language}
              />
            )}

            {/* Omnipresent Docked Floating Panel */}
            <AIChatAssistant
              jurisdiction={jurisdiction}
              language={language}
              chatMode="docked"
              messages={chatMessages}
              setMessages={setChatMessages}
              initialQuery={chatTriggerQuery}
            />
          </div>
        )}
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-950 border-t border-emerald-900/40 py-5 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-base">🌿</span>
            <span className="font-serif font-bold text-stone-200">AYUSH IPR, ABS & Regulatory Compliance Assistant</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-stone-500">
            <span>Patents Act 1970 § 3(p)</span>
            <span>•</span>
            <span>BDA 2023 Form III</span>
            <span>•</span>
            <span>WIPO GRATK Treaty (2024)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
