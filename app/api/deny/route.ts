import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getReportWithMeta, setReportDenied } from '@/lib/supabaseServer';

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

    await setReportDenied(reportId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Deny error:', err);
    return NextResponse.json(
      { error: 'Failed to deny report' },
      { status: 500 }
    );
  }
}
