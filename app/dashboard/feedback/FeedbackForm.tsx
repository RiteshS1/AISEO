'use client';

import { useState } from 'react';

export default function FeedbackForm({ userEmail }: { userEmail: string }) {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFeedback('');
    }, 1000);
  };

  return (
    <>
      <span className="text-lime-400 text-[10px] font-black tracking-[0.4em] block mb-4">
        We listen
      </span>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
        Feedback
      </h1>
      <p className="text-slate-500 text-[11px] font-bold tracking-widest leading-relaxed mb-10">
        Tell us how we can improve. (Not wired to backend yet.)
      </p>

      {submitted ? (
        <div className="p-6 bg-lime-400/10 border border-lime-400/30 rounded-[7px] animate-in fade-in duration-300">
          <p className="text-lime-400 text-[11px] font-black tracking-widest">
            Thank you for your feedback.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 text-[10px] font-bold tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            Submit again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-400 text-[10px] font-bold tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full bg-white/5 border border-white/10 px-6 py-4 text-slate-500 cursor-not-allowed text-[11px] font-medium rounded-[7px] focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-[10px] font-bold tracking-widest mb-2">
              How can we improve?
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your suggestions..."
              rows={5}
              className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400 transition-all text-[11px] font-medium rounded-[7px] resize-y min-h-[120px]"
            />
          </div>
          <button
            type="submit"
            disabled={!feedback.trim() || loading}
            className="w-full py-5 bg-lime-400 text-black font-black text-[11px] tracking-widest rounded-[7px] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black animate-spin rounded-full" />
                Processing...
              </>
            ) : (
              'Submit feedback'
            )}
          </button>
        </form>
      )}
    </>
  );
}
