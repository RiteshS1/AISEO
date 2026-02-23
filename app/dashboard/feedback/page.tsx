'use client';

import { useState } from 'react';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setFeedback('');
  };

  return (
    <div className="p-8 md:p-12">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="p-10 md:p-14 bg-slate-900/40 border border-white/10 rounded-[12px] backdrop-blur-sm">
          <span className="text-lime-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
            We listen
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">
            Feedback
          </h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">
            Share your thoughts or suggestions. (Not wired to backend yet.)
          </p>

          {submitted ? (
            <div className="p-6 bg-lime-400/10 border border-lime-400/30 rounded-[7px] animate-in fade-in duration-300">
              <p className="text-lime-400 text-[11px] font-black uppercase tracking-widest">
                Thank you for your feedback.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                Submit again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  Your feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition-all text-[11px] font-bold uppercase tracking-widest rounded-[7px] resize-y min-h-[120px]"
                />
              </div>
              <button
                type="submit"
                disabled={!feedback.trim()}
                className="w-full py-5 bg-lime-400 text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-[7px] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
