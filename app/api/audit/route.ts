import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auditInputsSchema } from '@/lib/schemas/auditInputs';
import {
  saveReport,
  ensureProfile,
  reserveAuditSlot,
  refundAuditSlot,
} from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureProfile(user.id);
    const body = await request.json();
    const parsed = auditInputsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid audit inputs', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const inputs = parsed.data;
    const reserved = await reserveAuditSlot(user.id);
    if (!reserved) return NextResponse.json({ error: 'No audit credits remaining' }, { status: 403 });
    let reportId: string;
    try {
      reportId = await saveReport(inputs, null, user.id);
    } catch (saveError) {
      await refundAuditSlot(user.id);
      throw saveError;
    }
    return NextResponse.json({
      success: true,
      reportId,
      reportStatus: 'draft',
    });
  } catch (err) {
    console.error('Audit Error:', err);
    return NextResponse.json(
      {
        success: false,
        error:
          'The audit service is temporarily unavailable or formatting failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
