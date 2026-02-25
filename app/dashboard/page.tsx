import { createClient } from '@/lib/supabase/server';
import { getProfile, listReportsByUserId } from '@/lib/supabaseServer';
import Link from 'next/link';

const CALCOM_URL = 'https://cal.com/ritesh-sharma-hfn1t8/15min';
const CONTACT_SALES_EMAIL = 'mailto:support@getnifty.in';

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
  const userEmail = user.email ?? '';

  return (
    <div className="p-8 md:p-12">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
          Hey, {displayName}
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-10">
          Your audits and usage
        </p>

        {/* Bento grid: Profile, Schedule Call, Upgrade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Card 1: User Profile & Plan */}
          <div className="p-6 bg-slate-900/40 border border-white/10 rounded-[7px] backdrop-blur-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">
              Your profile
            </span>
            <p className="text-white font-bold uppercase tracking-tight mb-1 truncate">
              {displayName}
            </p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate mb-4" title={userEmail}>
              {userEmail}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
              Current Plan: Free Tier
            </p>
            <p className="text-lime-400 text-sm font-black">
              {auditCount} / {limit} Free Audits Remaining
            </p>
            <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-lime-400/80 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, 100 - (auditCount / limit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Book Strategy Call */}
          <div className="p-6 bg-slate-900/40 border border-lime-400/20 rounded-[7px] backdrop-blur-sm hover:border-lime-400/40 transition-colors">
            <div className="w-10 h-10 rounded-[7px] bg-lime-400/10 border border-lime-400/30 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-2">
              AI Visibility Strategy
            </h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-6">
              Review your AIEO audit with our lead consultants.
            </p>
            <a
              href={CALCOM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-lime-400 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-[7px] hover:bg-white transition-all"
            >
              Schedule Call
            </a>
          </div>

          {/* Card 3: Upgrade to Pro */}
          <div className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/10 rounded-[7px] backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/5 rounded-full -mr-8 -mt-8" />
            <div className="w-10 h-10 rounded-[7px] bg-lime-400/10 border border-lime-400/30 flex items-center justify-center mb-4 relative">
              <svg className="w-5 h-5 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-2">
              Unlock GetNifty Pro
            </h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-6">
              Unlimited audits, competitor tracking, and dedicated semantic engineering.
            </p>
            <a
              href={CONTACT_SALES_EMAIL}
              className="inline-flex items-center justify-center gap-2 w-full py-3 border-2 border-lime-400/50 text-lime-400 font-black uppercase text-[11px] tracking-[0.2em] rounded-[7px] hover:bg-lime-400/10 hover:border-lime-400 transition-all"
            >
              Contact Sales
            </a>
          </div>
        </div>

        {/* Run new audit - full width CTA */}
        <div className="mb-10">
          <Link
            href="/dashboard/audit"
            className="inline-flex items-center justify-center gap-2 w-full py-5 bg-lime-400 text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-[7px] hover:bg-white transition-all"
          >
            Run new audit
          </Link>
        </div>

        {/* Past reports */}
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
