import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  fulfillPayment,
  getPaymentOrder,
} from '@/lib/supabaseServer';

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payment response' }, { status: 400 });

    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = parsed.data;
    const order = await getPaymentOrder(orderId);
    if (!order || order.user_id !== user.id) return NextResponse.json({ error: 'Payment order not found' }, { status: 404 });

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error('Razorpay server credentials are not configured.');
    const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
    const valid = expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!valid) return NextResponse.json({ error: 'Payment signature mismatch' }, { status: 400 });

    if (order.status === 'paid') {
      if (order.razorpay_payment_id !== paymentId) return NextResponse.json({ error: 'Payment already reconciled' }, { status: 409 });
      return NextResponse.json({ success: true, credits: order.credits, alreadyProcessed: true });
    }

    const fulfilled = await fulfillPayment(orderId, paymentId, order.pack_type);
    if (!fulfilled) return NextResponse.json({ error: 'Payment could not be reconciled' }, { status: 409 });

    return NextResponse.json({ success: true, credits: order.credits });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Unable to verify payment.' }, { status: 503 });
  }
}
