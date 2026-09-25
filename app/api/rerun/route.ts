import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AdminAuthError, requireAdmin } from '@/lib/adminServer';
import { runAudit } from '@/lib/auditServer';
import {
  getReportWithMeta,
  markGenerationRetryable,
  saveGeneratedReport,
  setReportStatus,
} from '@/lib/supabaseServer';
import type { AuditInputs } from '@/lib/schemas/auditInputs';

export const maxDuration = 60;

const bodySchema = z.object({ reportId: z.string().uuid() });

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    const report = await getReportWithMeta(parsed.data.reportId);
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    if (!['generating', 'in_review', 'rejected'].includes(report.report_status)) {
      return NextResponse.json({ error: 'Report cannot be rerun in its current state' }, { status: 409 });
    }
    if (report.report_status !== 'generating') {
      await setReportStatus(parsed.data.reportId, report.report_status, 'generating');
    }
    try {
      const result = await runAudit(report.inputs as AuditInputs);
      await saveGeneratedReport(parsed.data.reportId, result);
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : 'Unknown Gemini failure';
      await markGenerationRetryable(parsed.data.reportId, message.slice(0, 2000));
      console.error('Rerun generation failed:', message);
      throw generationError;
    }
    return NextResponse.json({ success: true, reportStatus: 'in_review' });
  } catch (err) {
    if (err instanceof AdminAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error('Rerun report error:', err);
    return NextResponse.json({ error: 'Failed to rerun report' }, { status: 500 });
  }
}