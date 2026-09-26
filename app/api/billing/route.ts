import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const profile = await getProfile(user.id);
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json({
      plan: profile.plan,
      creditsRemaining: profile.credits_remaining,
      creditsUsed: profile.credits_used,
    });
  } catch (error) {
    console.error('Billing summary failed:', error);
    return NextResponse.json({ error: 'Unable to load billing summary.' }, { status: 500 });
  }
}
