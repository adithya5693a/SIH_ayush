import React, { useState } from 'react';

export default function FacilitatorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Dr. Rajesh Sharma',
    organization: 'AyurVeda Bio-Tech Labs (MSME)',
    email: 'rajesh@ayurvedabio.in',
    phone: '+91 98765 43210',
    formulationName: 'Standardized Withanolide Nano-Extract',
    statutoryIssue: 'Overcoming Section 3(p) objection & NBA Form III filing',
    state: 'Karnataka'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const facilitators = [
    { name: "TISC - Karnataka Innovation Centre", location: "Bengaluru", specialization: "Ayurvedic Patents & § 3(p) Clearance" },
    { name: "National AYUSH IP Cell", location: "New Delhi", specialization: "NBA Form I/II/III & TKDL Prior Art Defense" },
    { name: "Kerala Traditional Knowledge Facilitation Cell", location: "Thiruvananthapuram", specialization: "Classical Formulations & Geographical Indications (GI)" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl shadow">
              🛡️
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-100 font-serif">
                Connect with Certified AYUSH IP Facilitator
              </h3>
              <p className="text-xs text-emerald-400 font-mono">Ministry of AYUSH • TISC & Registered Patent Attorney Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {formSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-400 text-3xl flex items-center justify-center mx-auto animate-bounce">
              ✓
            </div>
            <h4 className="text-lg font-bold text-stone-100 font-serif">Consultation Request Dispatched!</h4>
            <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
              Your inquiry regarding <strong className="text-emerald-300">"{formData.formulationName}"</strong> has been routed to the certified AYUSH Patent Facilitation Desk. A registered Patent Agent will contact you within 24 hours.
            </p>
            <button
              onClick={() => {
                setFormSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs transition hover:bg-emerald-500"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              Facing complex Section 3(p) objections, First Examination Reports (FER), or mandatory NBA Form III submissions? Request official facilitation from empaneled IP facilitators.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-stone-300 font-semibold">Innovator / Lead Name:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-300 font-semibold">Organization / MSME:</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-300 font-semibold">Official Email:</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-300 font-semibold">Contact Phone:</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-stone-300 font-semibold">Formulation / Invention Title:</label>
              <input
                type="text"
                required
                value={formData.formulationName}
                onChange={(e) => setFormData({ ...formData, formulationName: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-stone-300 font-semibold">Primary Statutory Assistance Needed:</label>
              <textarea
                rows="2"
                required
                value={formData.statutoryIssue}
                onChange={(e) => setFormData({ ...formData, statutoryIssue: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-400"
              ></textarea>
            </div>

            {/* Regional Facilitators */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Empaneled Regional Facilitation Centers</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {facilitators.map((fac, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-0.5">
                    <div className="font-bold text-stone-200 truncate">{fac.name}</div>
                    <div className="text-stone-400">{fac.location}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-lg"
              >
                Submit Consultation Request →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
