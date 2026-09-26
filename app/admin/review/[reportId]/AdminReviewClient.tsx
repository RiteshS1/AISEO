'use client';

import { useEffect, useState } from 'react';
import AuditTool from '@/components/AuditTool';
import type { AuditToolInitialData } from '@/components/AuditTool';
import type { AuditInputs } from '@/lib/schemas/auditInputs';
import type { AuditResult } from '@/types';

type ReportMeta = {
  reportId: string;
  createdAt: string;
  inputs: unknown;
  result: unknown;
  reportStatus: string;
  contactName: string | null;
  email: string | null;
  userId: string | null;
  adminNotes: string | null;
};

export default function AdminReviewClient({ reportId }: { reportId: string }) {
  const [data, setData] = useState<ReportMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/report/${reportId}?meta=1`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Report not found');
        return res.json();
      })
      .then(setData)
      .catch(() => setError('Report not found'))
      .finally(() => setLoading(false));
  }, [reportId]);

  const transition = async (endpoint: string, nextStatus: string) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });
      if (!res.ok) throw new Error('Request failed');
      const responseData = await res.json().catch(() => ({}));
      setData((current) => (current ? { ...current, ...responseData, reportStatus: responseData.reportStatus ?? nextStatus } : null));
    } catch {
      setError('The request could not be completed. Refresh and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#020617] text-slate-50 p-20 text-center">Loading review...</div>;
  }
  if (error || !data) {
    return <div className="min-h-screen bg-[#020617] text-red-400 p-20 text-center">{error ?? 'Report not found'}</div>;
  }

  const initialData: AuditToolInitialData | undefined = data.result
    ? { inputs: data.inputs as AuditInputs, result: data.result as AuditResult }
    : undefined;
  const canGenerate = data.reportStatus === 'pending_approval';
  const canPublish = data.reportStatus === 'in_review';
  const canReject = canGenerate || canPublish;
  const inputs = data.inputs as { brandName?: string; industry?: string; websiteUrl?: string };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30">
      <section className={`pt-20 px-6 ${canGenerate || canPublish ? 'pb-28' : 'pb-20'}`}>
        <div className="max-w-5xl mx-auto">
          {error && <p className="mb-6 text-red-400 text-sm">{error}</p>}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-5 bg-slate-900/60 border border-white/10 rounded-[7px]">
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Requester</p>
              <p className="text-white text-sm font-bold mt-1">{data.contactName ?? 'Unknown'}</p>
              <p className="text-slate-400 text-xs mt-1 break-all">{data.email ?? 'No email'}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Business</p>
              <p className="text-white text-sm font-bold mt-1">{inputs.brandName ?? 'Unknown brand'}</p>
              <p className="text-slate-400 text-xs mt-1">{inputs.industry ?? 'Unknown industry'}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Website</p>
              <p className="text-white text-sm font-bold mt-1 break-all">{inputs.websiteUrl ?? 'Not provided'}</p>
              <p className="text-slate-400 text-xs mt-1">{new Date(data.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Status / ID</p>
              <p className="text-lime-400 text-sm font-bold mt-1">{data.reportStatus}</p>
              <p className="text-slate-400 text-xs mt-1 break-all">{data.reportId}</p>
            </div>
            {data.adminNotes && (
              <p className="sm:col-span-2 lg:col-span-4 text-amber-300 text-xs border-t border-white/10 pt-4">
                Previous generation note: {data.adminNotes}
              </p>
            )}
          </div>
          {initialData ? (
            <AuditTool initialData={initialData} isAdminView />
          ) : (
            <div className="p-8 bg-slate-900/50 border border-white/10 rounded-[7px]">
              <p className="text-slate-300 font-bold uppercase tracking-widest">Awaiting generation approval</p>
              <p className="text-slate-500 text-sm mt-3">Status: {data.reportStatus}</p>
            </div>
          )}
        </div>
      </section>
      {(canGenerate || canPublish) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-lime-500 p-4">
          <div className="max-w-5xl mx-auto flex gap-4">
            {canReject && (
              <button type="button" onClick={() => transition('/api/deny', 'rejected')} disabled={busy} className="flex-1 py-5 border border-slate-500 text-slate-300 font-black uppercase text-sm rounded-[7px] disabled:opacity-50">
                Reject
              </button>
            )}
            <button
              type="button"
              onClick={() => transition(canGenerate ? '/api/approve' : '/api/publish', canGenerate ? 'in_review' : 'published')}
              disabled={busy}
              className="flex-1 py-5 bg-lime-400 text-black font-black uppercase text-sm rounded-[7px] disabled:opacity-50"
            >
              {busy ? 'Working...' : canGenerate ? 'Approve & Generate' : 'Publish Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
