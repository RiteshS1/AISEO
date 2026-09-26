import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { sendFeedback } from '@/lib/discordServer';

const feedbackSchema = z.object({
  feedback: z.string().trim().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const parsed = feedbackSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Feedback must be between 10 and 2000 characters.' }, { status: 400 });

    await sendFeedback({ email: user.email, feedback: parsed.data.feedback });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback submission failed:', error);
    return NextResponse.json({ error: 'Unable to submit feedback right now.' }, { status: 503 });
  }
}