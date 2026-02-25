import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Terms of Service | GetNifty AIEO',
  description: 'Terms of service for GetNifty AIEO – AI Engine Optimization platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-24">
        <div className="p-10 md:p-16 bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-[7px] shadow-2xl text-center">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            Coming Soon
          </p>
          <p className="text-slate-500 text-xs mt-6 mb-10">
            We are preparing our terms of service. Please check back later.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-lime-400 text-black font-black text-[11px] uppercase tracking-widest rounded-[7px] hover:bg-white transition-all"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
