import { NextResponse } from 'next/server';
import { auditInputsSchema } from '@/lib/schemas/auditInputs';
import { runAudit } from '@/lib/auditServer';
import { saveReport } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
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
    const reportId = await saveReport(inputs, result);
    return NextResponse.json({
      success: true,
      reportId,
      result,
    });
  } catch (err) {
    console.error('Audit Error:', err);
    return NextResponse.json(
      { success: false, error: 'The audit service is temporarily unavailable or formatting failed. Please try again.' },
      { status: 500 }
    );
  }
}
