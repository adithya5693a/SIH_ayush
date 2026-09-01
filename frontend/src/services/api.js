import { runClassifierDiagnostic, queryRagLegalAssistant, searchTkdlDatabase } from './mockRagEngine.js';

const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:8000';

export async function askLegalAssistantApi(query, jurisdiction = 'national') {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, jurisdiction }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // Graceful fallback to local RAG knowledge engine for offline demos
    console.info('Using local AYUSH RAG Engine fallback:', error.message);
  }
  
  // Return simulated high-fidelity grounded response
  return queryRagLegalAssistant(query, jurisdiction);
}

export async function classifyFormulationApi(answers) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Fallback
  }
  return runClassifierDiagnostic(answers);
}

export async function queryTkdlApi(term) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/tkdl-search?q=${encodeURIComponent(term)}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Fallback
  }
  return searchTkdlDatabase(term);
}
