'use client';

import AuditTool from '@/components/AuditTool';
import Link from 'next/link';

export default function AuditPageClient({ allowed }: { allowed: boolean }) {
  if (!allowed) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-8">
        <div className="max-w-lg w-full p-10 bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-[7px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="w-16 h-16 bg-lime-400/10 border border-lime-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-lime-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
            Reporting limit reached
          </h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed mb-6">
            Yes we know these reports have great info on your business! Unfortunately, you have reached your reporting limit. To start another AIEO report please register with one of our service plans.
          </p>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed mb-8">
            Have more questions? Reach out to us at{' '}
            <a
              href="mailto:rsphenomenal@gmail.com"
              className="text-lime-400 hover:text-white transition-colors underline underline-offset-2"
            >
              Contact
            </a>
            .
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-[7px] text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <AuditTool />
    </div>
  );
}
