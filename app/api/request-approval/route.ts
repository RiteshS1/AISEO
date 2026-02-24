import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getReport, updateReportPending } from '@/lib/supabaseServer';
import { sendApprovalRequest } from '@/lib/discordServer';

const bodySchema = z.object({
  contactName: z.string().min(1, 'Full name is required'),
  email: z.string().email(),
  brandName: z.string(),
  industry: z.string(),
  websiteUrl: z.string(),
  keywords: z.string(),
  reportId: z.string().uuid(),
  reportUrl: z.string().optional(),
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

    const { reportId, email, brandName, industry, websiteUrl, contactName } = parsed.data;

    const report = await getReport(reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const overallScore =
      (report.result as { overallScore?: number })?.overallScore ?? 0;

    await updateReportPending(reportId, email);

    const host = request.headers.get('host');
    if (!host) {
      throw new Error('Missing Host header');
    }
    const protocol =
      request.headers.get('x-forwarded-proto') ?? 'https';
    const reviewUrl = `${protocol}://${host}/admin/review/${reportId}`;

    await sendApprovalRequest({
      contactName,
      brandName,
      email,
      industry,
      websiteUrl,
      overallScore,
      reviewUrl,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed';
    if (message.includes('DISCORD_WEBHOOK_URL')) {
      return NextResponse.json(
        { error: 'Approval service is not configured' },
        { status: 503 }
      );
    }
    if (message.includes('Report not found') || message.includes('already approved')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error('Request approval error:', err);
    return NextResponse.json(
      { error: 'Failed to submit for approval' },
      { status: 500 }
    );
  }
}
