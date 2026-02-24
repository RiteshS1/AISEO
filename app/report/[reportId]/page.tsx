import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import DashboardNav from '@/app/dashboard/DashboardNav';
import ReportContent from './ReportContent';

function ReportError() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-md p-10 bg-slate-900/40 border border-white/10 rounded-[12px] text-center">
        <p className="text-slate-400 text-sm font-medium mb-2">Report not found or unavailable</p>
        <p className="text-slate-500 text-xs">The link may be invalid or the report may no longer be accessible.</p>
      </div>
    </div>
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user ?? null;

    const { reportId } = await params;
    const content = <ReportContent />;

    if (user) {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30 flex">
          <DashboardNav userEmail={user.email ?? ''} />
          <main className="flex-1 min-w-0">{content}</main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30">
        <Navbar />
        <ReportContent compact={false} />
      </div>
    );
  } catch (err) {
    console.error('Report fetch error:', err);
    return <ReportError />;
  }
}
