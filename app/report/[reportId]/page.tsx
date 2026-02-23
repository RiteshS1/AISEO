import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import DashboardNav from '@/app/dashboard/DashboardNav';
import ReportContent from './ReportContent';

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
}
