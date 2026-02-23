'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuditTool from '@/components/AuditTool';
import type { AuditToolInitialData } from '@/components/AuditTool';
import type { AuditInputs } from '@/lib/schemas/auditInputs';
import type { AuditResult } from '@/types';

type ReportMeta = {
  inputs: unknown;
  result: unknown;
  email: string | null;
  status: string | null;
};

export default function AdminReviewPage() {
  const params = useParams();
  const reportId = typeof params.reportId === 'string' ? params.reportId : undefined;
  const [data, setData] = useState<ReportMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [denying, setDenying] = useState(false);
  const [approved, setApproved] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setLoading(false);
      setError('Missing report ID');
      return;
    }
    fetch(`/api/report/${reportId}?meta=1`)
      .then((res) => {
        if (!res.ok) throw new Error('Report not found');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch(() => setError('Report not found'))
      .finally(() => setLoading(false));
  }, [reportId]);

  const handleApprove = async () => {
    if (!reportId || !data || data.status !== 'pending') return;
    setApproving(true);
    try {
      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });
      if (!res.ok) throw new Error('Approve failed');
      setApproved(true);
      setData((prev) => (prev ? { ...prev, status: 'approved' } : null));
    } catch {
      setError('Failed to approve');
    } finally {
      setApproving(false);
    }
  };

  const handleDeny = async () => {
    if (!reportId || !data || data.status !== 'pending') return;
    setDenying(true);
    try {
      const res = await fetch('/api/deny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });
      if (!res.ok) throw new Error('Deny failed');
      setDenied(true);
      setData((prev) => (prev ? { ...prev, status: 'denied' } : null));
    } catch {
      setError('Failed to deny');
    } finally {
      setDenying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50">
        <section className="pt-20 pb-20 px-6 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-lime-400/30 border-t-lime-400 animate-spin rounded-full" />
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-50">
        <section className="pt-20 pb-20 px-6">
          <p className="text-red-500 font-bold uppercase tracking-widest">{error ?? 'Not found'}</p>
        </section>
      </div>
    );
  }

  const initialData: AuditToolInitialData = {
    inputs: data.inputs as AuditInputs,
    result: data.result as AuditResult,
  };

  const showApproveBar = data.status === 'pending' && !approved && !denied;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30">
      <section className={`pt-20 relative scroll-mt-20 ${showApproveBar ? 'pb-28' : 'pb-20'} px-6`}>
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="relative max-w-5xl mx-auto">
            {approved && (
              <div className="mb-6 p-4 bg-lime-400/10 border border-lime-400/30 rounded-[7px]">
                <p className="text-lime-400 text-[10px] font-black uppercase tracking-widest">
                  Approved. Lead sent to CRM.
                </p>
              </div>
            )}
            {denied && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-[7px]">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">
                  Request denied. Report not sent.
                </p>
              </div>
            )}
            <AuditTool initialData={initialData} isAdminView />
          </div>
        </div>
      </section>

      {showApproveBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-lime-500 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleDeny}
              disabled={denying || approving}
              className="flex-1 max-w-xs py-5 border border-slate-500 text-slate-300 font-black uppercase text-sm tracking-[0.2em] rounded-[7px] hover:bg-slate-800 hover:border-slate-400 transition-all disabled:opacity-50"
            >
              {denying ? 'Denying…' : 'Deny'}
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={approving || denying}
              className="flex-1 max-w-xl py-5 bg-lime-400 text-black font-black uppercase text-sm tracking-[0.3em] rounded-[7px] hover:bg-white transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(217,255,0,0.3)]"
            >
              {approving ? 'Sending to CRM…' : 'Approve & Send to CRM'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
