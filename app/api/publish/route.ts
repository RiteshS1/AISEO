import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AdminAuthError, requireAdmin } from '@/lib/adminServer';
import { getReportWithMeta, setReportStatus } from '@/lib/supabaseServer';

const bodySchema = z.object({ reportId: z.string().uuid() });

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    const report = await getReportWithMeta(parsed.data.reportId);
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    if (report.report_status !== 'in_review') {
      return NextResponse.json({ error: 'Report is not ready to publish' }, { status: 409 });
    }
    await setReportStatus(parsed.data.reportId, 'in_review', 'published');
    return NextResponse.json({ success: true, reportStatus: 'published' });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Publish report error:', err);
    return NextResponse.json({ error: 'Failed to publish report' }, { status: 500 });
  }
}