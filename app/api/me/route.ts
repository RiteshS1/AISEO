import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureProfile, listReportsByUserId } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const profile = await ensureProfile(user.id);
    const reports = await listReportsByUserId(user.id);
    return NextResponse.json({
      audit_count: profile.audit_count,
      reports,
    });
  } catch (err) {
    console.error('GET /api/me error:', err);
    return NextResponse.json(
      { error: 'Failed to load profile' },
      { status: 500 }
    );
  }
}
