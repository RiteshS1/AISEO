import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getReport, updateReportPending } from '@/lib/supabaseServer';
import { sendApprovalRequest } from '@/lib/discordServer';

const bodySchema = z.object({
  contactName: z.string().min(1).optional(),
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

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { reportId, contactName } = parsed.data;
    const email = user.email;
    if (!email) return NextResponse.json({ error: 'Authenticated email is required' }, { status: 400 });
    const resolvedContactName = contactName?.trim() || (user.user_metadata?.full_name as string | undefined) || user.email?.split('@')[0] || 'User';

    const report = await getReport(reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const inputs = report.inputs as { brandName?: string; industry?: string; websiteUrl?: string };

    await updateReportPending(reportId, email, resolvedContactName, user.id);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL is missing');
    const reviewUrl = `${siteUrl.replace(/\/$/, '')}/admin/review/${reportId}`;

    await sendApprovalRequest({
      contactName: resolvedContactName,
      brandName: inputs.brandName ?? '',
      email,
      industry: inputs.industry ?? '',
      websiteUrl: inputs.websiteUrl ?? '',
      overallScore: 0,
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
    if (message.includes('Report not found') || message.includes('not a draft')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error('Request approval error:', err);
    return NextResponse.json(
      { error: 'Failed to submit for approval' },
      { status: 500 }
    );
  }
}
