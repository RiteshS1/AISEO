import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getReportWithMeta, setReportApproved } from '@/lib/supabaseServer';
import { addSubscriber } from '@/lib/mailerliteServer';

const bodySchema = z.object({
  reportId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
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
    if (report.status !== 'pending') {
      return NextResponse.json(
        { error: 'Report is not pending approval' },
        { status: 400 }
      );
    }
    if (!report.email) {
      return NextResponse.json(
        { error: 'Report has no email' },
        { status: 400 }
      );
    }

    const inputs = report.inputs as {
      brandName?: string;
      industry?: string;
      websiteUrl?: string;
      keywords?: string;
    };
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
    const reportUrl =
      host ? `${protocol}://${host}/report/${reportId}` : undefined;

    const overallScore = (report.result as { overallScore?: number })?.overallScore;

    addSubscriber({
      email: report.email,
      brandName: inputs.brandName ?? '',
      industry: inputs.industry ?? '',
      websiteUrl: inputs.websiteUrl ?? '',
      keywords: inputs.keywords ?? '',
      reportUrl,
      ...(report.contact_name ? { name: report.contact_name } : {}),
      ...(overallScore != null ? { ai_score: overallScore } : {}),
    }).catch((err) => console.error('MailerLite sync failed:', err));

    await setReportApproved(reportId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Approve error:', err);
    return NextResponse.json(
      { error: 'Failed to approve report' },
      { status: 500 }
    );
  }
}
