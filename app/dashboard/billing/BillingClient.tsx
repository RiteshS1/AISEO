'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const packs = [
  { packType: 'pro', name: 'Pro Pack', price: '₹99', credits: '3 additional audits' },
  { packType: 'agency', name: 'Agency Pack', price: '₹299', credits: '10 additional audits' },
] as const;

export default function BillingClient() {
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [creditsUsed, setCreditsUsed] = useState<number | null>(null);
  const [plan, setPlan] = useState<'free' | 'pro' | 'agency'>('free');
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadSummary = async () => {
    const response = await fetch('/api/billing');
    if (!response.ok) throw new Error('Unable to load credit balance.');
    const data = await response.json();
    setCreditsRemaining(data.creditsRemaining);
    setCreditsUsed(data.creditsUsed);
    setPlan(data.plan ?? 'free');
  };

  useEffect(() => {
    loadSummary().catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load credit balance.'));
  }, []);

  const buyPack = async (packType: 'pro' | 'agency') => {
    setLoadingPack(packType);
    setMessage('');
    setError('');
    try {
      const orderResponse = await fetch('/api/billing/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packType }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error ?? 'Unable to create payment order.');
      if (!order.keyId) throw new Error('Razorpay checkout is not configured.');
      if (!window.Razorpay) throw new Error('Payment checkout is still loading. Please try again.');

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'AISEO by Ritesh',
        description: `${packType === 'pro' ? '3' : '10'} additional AI audits`,
        order_id: order.orderId,
        handler: async (payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyResponse = await fetch('/api/billing/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payment),
            });
            const result = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(result.error ?? 'Unable to verify payment.');
            await loadSummary();
            setMessage(`${result.credits} audit credits added.`);
          } catch (verificationError) {
            setError(verificationError instanceof Error ? verificationError.message : 'Unable to verify payment.');
          } finally {
            setLoadingPack(null);
          }
        },
        modal: { ondismiss: () => setLoadingPack(null) },
      });
      checkout.open();
    } catch (purchaseError) {
      setError(purchaseError instanceof Error ? purchaseError.message : 'Unable to complete purchase.');
      setLoadingPack(null);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="p-6 bg-slate-900/40 border border-lime-400/30 rounded-[7px]">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Free Starter</p>
          <p className="text-3xl font-black text-white mb-2">2 audits</p>
          <p className="text-slate-400 text-xs">Included with your account</p>
          <p className="text-lime-400 text-sm font-black mt-6">{creditsRemaining ?? '—'} credits remaining</p>
          <p className="text-slate-500 text-xs mt-1">{creditsUsed ?? '—'} credits used</p>
        </div>
        {packs.map((pack) => (
          <div key={pack.packType} className={`p-6 bg-slate-900/40 border rounded-[7px] ${plan === pack.packType ? 'border-lime-400/50' : 'border-white/10'}`}>
            {plan === pack.packType && <p className="text-[10px] text-lime-400 font-black uppercase tracking-widest mb-4">Current Active Plan</p>}
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">{pack.name}</p>
            <p className="text-3xl font-black text-white mb-2">{pack.price}</p>
            <p className="text-slate-400 text-xs">{pack.credits}, one-time</p>
            <button type="button" onClick={() => buyPack(pack.packType)} disabled={loadingPack !== null} className="w-full mt-6 py-3 bg-lime-400 text-black font-black uppercase text-[10px] tracking-widest rounded-[7px] disabled:opacity-50">
              {loadingPack === pack.packType ? 'Opening checkout...' : plan === pack.packType ? 'Add More Credits' : 'Upgrade Plan'}
            </button>
          </div>
        ))}
      </div>
      {message && <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{message}</p>}
      {error && <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>}
    </>
  );
}
