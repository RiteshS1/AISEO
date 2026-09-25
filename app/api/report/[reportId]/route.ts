import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfile, getReport, getReportWithMeta, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  if (!reportId) {
    return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Report storage not configured' }, { status: 503 });
  }
  const url = new URL(request.url);
  const withMeta = url.searchParams.get('meta') === '1';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (withMeta) {
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const profile = await getProfile(user.id);
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const report = await getReportWithMeta(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json({
      reportId: report.report_id,
      createdAt: report.created_at,
      inputs: report.inputs,
      result: report.result,
      reportStatus: report.report_status,
      contactName: report.contact_name,
      email: report.email,
      userId: report.user_id,
      adminNotes: report.admin_notes,
    });
  }
  const report = await getReport(reportId);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  if (report.report_status !== 'published') {
    if (!user || report.user_id !== user.id) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json({ reportStatus: report.report_status });
  }
  return NextResponse.json({ inputs: report.inputs, result: report.result, reportStatus: report.report_status });
}
