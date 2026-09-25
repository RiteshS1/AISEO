import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AdminAuthError, requireAdmin } from '@/lib/adminServer';
import { runAudit } from '@/lib/auditServer';
import {
  beginReportGeneration,
  getReportWithMeta,
  markGenerationRetryable,
  saveGeneratedReport,
} from '@/lib/supabaseServer';
import { sendReviewReady } from '@/lib/discordServer';
import type { AuditInputs } from '@/lib/schemas/auditInputs';

export const maxDuration = 60;

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
    if (report.report_status !== 'pending_approval') {
      return NextResponse.json(
        { error: 'Report is not awaiting approval' },
        { status: 409 }
      );
    }
    await beginReportGeneration(reportId);
    try {
      const result = await runAudit(report.inputs as AuditInputs);
      await saveGeneratedReport(reportId, result);
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : 'Unknown Gemini failure';
      await markGenerationRetryable(reportId, message.slice(0, 2000));
      throw generationError;
    }
    try {
      await sendReviewReady(reportId, report.contact_name ?? 'Unknown');
    } catch (notificationError) {
      console.error('Review-ready Discord notification failed:', notificationError);
    }

    return NextResponse.json({ success: true, reportStatus: 'in_review' });
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('Approve error:', err);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
