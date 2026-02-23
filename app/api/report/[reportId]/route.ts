import { NextResponse } from 'next/server';
import { getReport, getReportWithMeta, isSupabaseConfigured } from '@/lib/supabaseServer';

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
  if (withMeta) {
    const report = await getReportWithMeta(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json({
      inputs: report.inputs,
      result: report.result,
      email: report.email,
      status: report.status,
    });
  }
  const report = await getReport(reportId);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  return NextResponse.json({ inputs: report.inputs, result: report.result });
}
