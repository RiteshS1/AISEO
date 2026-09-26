import BillingClient from './BillingClient';

export const metadata = {
  title: 'Billing | AISEO by Ritesh',
  robots: { index: false, follow: false },
};

export default function BillingPage() {
  return (
    <div className="p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-lime-400 text-[10px] font-black uppercase tracking-widest mb-4">Credits</p>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-3">Billing</h1>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-10">One-time audit credit packs. No subscription.</p>
        <BillingClient />
      </div>
    </div>
  );
}
