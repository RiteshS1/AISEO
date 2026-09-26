import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendConsultationRequest } from '@/lib/discordServer';

const consultationSchema = z.object({
  email: z.string().email(),
  service: z.string().min(1).max(120),
  message: z.string().min(20).max(2000),
});

export async function POST(request: Request) {
  try {
    const parsed = consultationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please complete all fields correctly.' }, { status: 400 });
    }
    await sendConsultationRequest(parsed.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Consultation request failed:', error);
    return NextResponse.json({ error: 'Unable to send your request right now.' }, { status: 503 });
  }
}