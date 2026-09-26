import Razorpay from 'razorpay';

export const BILLING_PACKS = {
  pro: { amount: 9900, credits: 3, label: 'Pro Pack' },
  agency: { amount: 29900, credits: 10, label: 'Agency Pack' },
} as const;

export type PackType = keyof typeof BILLING_PACKS;

export function getBillingPack(packType: string) {
  if (packType !== 'pro' && packType !== 'agency') return null;
  return BILLING_PACKS[packType];
}

export function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay server credentials are not configured.');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}
