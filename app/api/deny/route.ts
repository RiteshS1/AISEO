import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AdminAuthError, requireAdmin } from '@/lib/adminServer';
import { getReportWithMeta, rejectReportAndRefund } from '@/lib/supabaseServer';

const bodySchema = z.object({
  reportId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { reportId } = parsed.data;

    const report = await getReportWithMeta(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    if (!['pending_approval', 'in_review'].includes(report.report_status)) {
      return NextResponse.json(
        { error: 'Report cannot be rejected in its current state' },
        { status: 409 }
      );
    }

    const refunded = await rejectReportAndRefund(reportId);
    if (!refunded) return NextResponse.json({ error: 'Report could not be rejected or refunded' }, { status: 409 });

    return NextResponse.json({ success: true, reportStatus: 'rejected' });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Deny error:', err);
    return NextResponse.json(
      { error: 'Failed to deny report' },
      { status: 500 }
    );
  }
}
