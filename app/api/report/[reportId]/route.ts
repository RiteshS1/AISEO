import { NextResponse } from 'next/server';
import { getReport, isSupabaseConfigured } from '@/lib/supabaseServer';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;
  if (!reportId) {
    return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Report storage not configured' }, { status: 503 });
  }
  const report = await getReport(reportId);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }
  return NextResponse.json({ inputs: report.inputs, result: report.result });
}
