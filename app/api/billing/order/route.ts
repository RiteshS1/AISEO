import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createPaymentOrder } from '@/lib/supabaseServer';
import { getBillingPack, getRazorpay } from '@/lib/razorpayServer';

const bodySchema = z.object({ packType: z.enum(['pro', 'agency']) });

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid pack selection' }, { status: 400 });
    const pack = getBillingPack(parsed.data.packType);
    if (!pack) return NextResponse.json({ error: 'Invalid pack selection' }, { status: 400 });

    const receipt = `rcpt_${user.id}_${Date.now()}`.slice(0, 40);
    const order = await getRazorpay().orders.create({
      amount: pack.amount,
      currency: 'INR',
      receipt,
      notes: { user_id: user.id, pack_type: parsed.data.packType },
    });

    await createPaymentOrder({
      userId: user.id,
      razorpayOrderId: order.id,
      amount: pack.amount,
      packType: parsed.data.packType,
      credits: pack.credits,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: pack.amount,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      packType: parsed.data.packType,
    });
  } catch (error) {
    console.error('Billing order creation failed:', error);
    return NextResponse.json({ error: 'Unable to create payment order.' }, { status: 503 });
  }
}
