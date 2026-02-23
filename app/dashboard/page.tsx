import { createClient } from '@/lib/supabase/server';
import { getProfile, listReportsByUserId } from '@/lib/supabaseServer';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(user.id);
  const reports = await listReportsByUserId(user.id);
  const auditCount = profile?.audit_count ?? 0;
  const limit = 2;
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split('@')[0] ||
    'there';

  return (
    <div className="p-8 md:p-12">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
          Hey, {displayName}
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-10">
          Your audits and usage
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="p-6 bg-slate-900/40 border border-white/10 rounded-[7px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
              Free audits
            </span>
            <p className="text-3xl font-black text-lime-400">
              {auditCount} <span className="text-slate-500 text-lg">/ {limit}</span>
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
              used
            </p>
          </div>
          <div className="p-6 bg-slate-900/40 border border-white/10 rounded-[7px] flex flex-col justify-center">
            <Link
              href="/dashboard/audit"
              className="inline-flex items-center justify-center gap-2 w-full py-4 bg-lime-400 text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-[7px] hover:bg-white transition-all"
            >
              Run new audit
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-black uppercase tracking-tighter text-white mb-4">
            Past reports
          </h2>
          {reports.length === 0 ? (
            <div className="p-8 bg-slate-900/40 border border-white/10 rounded-[7px] text-center">
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                No reports yet. Run your first audit above.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {reports.map((r) => {
                const statusLabel =
                  r.status === 'approved'
                    ? 'Approved – report sent'
                    : r.status === 'denied'
                      ? 'Denied by admin – report not sent'
                      : 'Pending review';
                const statusClass =
                  r.status === 'approved'
                    ? 'text-lime-400'
                    : r.status === 'denied'
                      ? 'text-red-400'
                      : 'text-amber-400';
                return (
                  <li key={r.report_id}>
                    <Link
                      href={`/report/${r.report_id}`}
                      className="block p-4 bg-slate-900/40 border border-white/10 rounded-[7px] hover:border-lime-400/30 transition-all"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-white font-bold uppercase tracking-tight">
                          {r.brandName ?? 'Report'}
                        </span>
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                          {new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${statusClass}`}>
                        {statusLabel}
                      </p>
                      {r.overallScore != null && (
                        <p className="text-slate-500 text-[10px] mt-1">
                          Score: {r.overallScore}
                        </p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
