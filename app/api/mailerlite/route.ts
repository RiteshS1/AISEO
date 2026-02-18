import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addSubscriber } from '@/lib/mailerliteServer';

const bodySchema = z.object({
  email: z.string().email(),
  brandName: z.string(),
  industry: z.string(),
  websiteUrl: z.string(),
  keywords: z.string(),
  reportUrl: z.string().optional(),
  reportId: z.string().optional(),
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
    const { reportId, reportUrl: clientReportUrl, ...rest } = parsed.data;
    const host = request.headers.get('host');
    const fullReportUrl =
      reportId && host
        ? `https://${host}/report/${reportId}`
        : clientReportUrl;
    const ok = await addSubscriber({ ...rest, reportUrl: fullReportUrl });
    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error('MailerLite API error:', err);
    return NextResponse.json({ error: 'Failed to add subscriber' }, { status: 500 });
  }
}
