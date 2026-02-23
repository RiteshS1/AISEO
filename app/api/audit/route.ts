import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auditInputsSchema } from '@/lib/schemas/auditInputs';
import { runAudit } from '@/lib/auditServer';
import {
  saveReport,
  ensureProfile,
  incrementAuditCount,
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
    const profile = await ensureProfile(user.id);
    if (profile.audit_count >= 2) {
      return NextResponse.json(
        { error: 'Free audit limit reached' },
        { status: 403 }
      );
    }
    const body = await request.json();
    const parsed = auditInputsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid audit inputs', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const inputs = parsed.data;
    const result = await runAudit(inputs);
    const reportId = await saveReport(inputs, result, user.id);
    await incrementAuditCount(user.id);
    return NextResponse.json({
      success: true,
      reportId,
      result,
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
