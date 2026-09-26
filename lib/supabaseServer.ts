import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.NEXT_PRIVATE_SERVICE_ROLE_API_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!url || !serviceRoleKey) {
    throw new Error('Supabase environment variables are missing.');
  }
  if (!_client) {
    _client = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return _client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && serviceRoleKey);
}

export type ReportStatus =
  | 'draft'
  | 'pending_approval'
  | 'generating'
  | 'in_review'
  | 'published'
  | 'rejected';

export async function saveReport(
  inputs: unknown,
  result: unknown = null,
  userId?: string | null
): Promise<string> {
  const supabase = getSupabase();
  const row: {
    inputs: unknown;
    result: unknown;
    report_status: ReportStatus;
    user_id?: string | null;
  } = {
    inputs,
    result,
    report_status: 'draft',
  };
  if (userId != null) {
    row.user_id = userId;
  }
  const { data, error } = await supabase
    .from('reports')
    .insert(row)
    .select('report_id')
    .single();
  if (error) {
    throw new Error(`Supabase Insert Failed: ${error.message}`);
  }
  if (!data?.report_id) {
    throw new Error('Supabase Insert Failed: no report_id returned.');
  }
  return data.report_id;
}

export async function getReport(
  reportId: string
): Promise<{
  inputs: unknown;
  result: unknown;
  report_status: ReportStatus;
  user_id: string | null;
} | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .select('inputs, result, report_status, user_id')
    .eq('report_id', reportId)
    .single();
  if (error || !data) return null;
  return {
    inputs: data.inputs,
    result: data.result,
    report_status: data.report_status as ReportStatus,
    user_id: data.user_id ?? null,
  };
}

export type ReportWithMeta = {
  report_id: string;
  created_at: string;
  inputs: unknown;
  result: unknown;
  email: string | null;
  report_status: ReportStatus;
  contact_name: string | null;
  user_id: string | null;
  admin_notes: string | null;
};

export async function getReportWithMeta(
  reportId: string
): Promise<ReportWithMeta | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .select('report_id, created_at, inputs, result, email, report_status, contact_name, user_id, admin_notes')
    .eq('report_id', reportId)
    .single();
  if (error || !data) return null;
  return {
    report_id: data.report_id,
    created_at: data.created_at,
    inputs: data.inputs,
    result: data.result,
    email: data.email ?? null,
    report_status: data.report_status as ReportStatus,
    contact_name: data.contact_name ?? null,
    user_id: data.user_id ?? null,
    admin_notes: data.admin_notes ?? null,
  };
}

export async function updateReportPending(
  reportId: string,
  email: string,
  contactName: string | undefined,
  userId: string
): Promise<void> {
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from('reports')
    .select('report_status, user_id')
    .eq('report_id', reportId)
    .single();
  if (!existing) {
    throw new Error(`Report not found: ${reportId}`);
  }
  if (existing.user_id !== userId) {
    throw new Error(`Report not found: ${reportId}`);
  }
  if (existing.report_status !== 'draft') {
    throw new Error(`Report is not a draft: ${reportId}`);
  }
  const { error } = await supabase
    .from('reports')
    .update({
      email,
      report_status: 'pending_approval',
      contact_name: contactName ?? null,
    })
    .eq('report_id', reportId);
  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
}

export async function beginReportGeneration(reportId: string): Promise<void> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .update({ report_status: 'generating' })
    .eq('report_id', reportId)
    .eq('report_status', 'pending_approval')
    .select('report_id')
    .maybeSingle();
  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
  if (!data) throw new Error(`Report is no longer awaiting approval: ${reportId}`);
}

export async function saveGeneratedReport(reportId: string, result: unknown): Promise<void> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .update({ result, report_status: 'in_review' })
    .eq('report_id', reportId)
    .eq('report_status', 'generating')
    .select('report_id')
    .maybeSingle();
  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
  if (!data) throw new Error(`Report is no longer generating: ${reportId}`);
}

export async function setReportStatus(
  reportId: string,
  from: ReportStatus,
  to: ReportStatus
): Promise<void> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .update({ report_status: to })
    .eq('report_id', reportId)
    .eq('report_status', from)
    .select('report_id')
    .maybeSingle();
  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
  if (!data) throw new Error(`Report cannot transition from ${from}: ${reportId}`);
}

export async function markGenerationRetryable(reportId: string, note: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('reports')
    .update({ report_status: 'pending_approval', admin_notes: note })
    .eq('report_id', reportId)
    .eq('report_status', 'generating');
  if (error) throw new Error(`Supabase recovery update failed: ${error.message}`);
}

export type Profile = {
  id: string;
  audit_count: number;
  credits_remaining: number;
  credits_used: number;
  plan: 'free' | 'pro' | 'agency';
  is_admin: boolean;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, audit_count, credits_remaining, credits_used, plan, is_admin')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    audit_count: data.audit_count,
    credits_remaining: data.credits_remaining,
    credits_used: data.credits_used,
    plan: (data.plan ?? 'free') as Profile['plan'],
    is_admin: Boolean(data.is_admin),
  };
}

export async function ensureProfile(userId: string): Promise<Profile> {
  const existing = await getProfile(userId);
  if (existing) return existing;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, audit_count: 0 })
    .select('id, audit_count, credits_remaining, credits_used, plan, is_admin')
    .single();
  if (error) throw new Error(`Supabase profile insert failed: ${error.message}`);
  if (!data) throw new Error('Supabase profile insert returned no row');
  return {
    id: data.id,
    audit_count: data.audit_count,
    credits_remaining: data.credits_remaining,
    credits_used: data.credits_used,
    plan: (data.plan ?? 'free') as Profile['plan'],
    is_admin: Boolean(data.is_admin),
  };
}

export type ReportListItem = {
  report_id: string;
  created_at: string;
  brandName?: string;
  report_status?: ReportStatus;
  overallScore?: number;
};

export async function listReportsByUserId(userId: string): Promise<ReportListItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .select('report_id, created_at, inputs, result, report_status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => ({
    report_id: row.report_id,
    created_at: row.created_at,
    brandName: (row.inputs as { brandName?: string })?.brandName,
    report_status: row.report_status as ReportStatus,
    overallScore:
      row.report_status === 'published'
        ? (row.result as { overallScore?: number })?.overallScore
        : undefined,
  }));
}

export async function reserveAuditSlot(userId: string): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('reserve_audit_slot', { p_user_id: userId });
  if (error) throw new Error(`Supabase quota reservation failed: ${error.message}`);
  return data === true;
}

export async function refundAuditSlot(userId: string): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('refund_audit_slot', { p_user_id: userId });
  if (error) throw new Error(`Supabase quota refund failed: ${error.message}`);
  return data === true;
}

export async function rejectReportAndRefund(reportId: string): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('reject_report_and_refund', {
    p_report_id: reportId,
  });
  if (error) throw new Error(`Supabase rejection refund failed: ${error.message}`);
  return data === true;
}

export type PaymentOrder = {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  pack_type: 'pro' | 'agency';
  credits: number;
};

export async function createPaymentOrder(order: {
  userId: string;
  razorpayOrderId: string;
  amount: number;
  packType: 'pro' | 'agency';
  credits: number;
}): Promise<void> {
  const { error } = await getSupabase().from('payment_orders').insert({
    user_id: order.userId,
    razorpay_order_id: order.razorpayOrderId,
    amount: order.amount,
    currency: 'INR',
    status: 'pending',
    pack_type: order.packType,
    credits: order.credits,
  });
  if (error) throw new Error(`Payment order insert failed: ${error.message}`);
}

export async function getPaymentOrder(razorpayOrderId: string): Promise<PaymentOrder | null> {
  const { data, error } = await getSupabase()
    .from('payment_orders')
    .select('id, user_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, pack_type, credits')
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle();
  if (error || !data) return null;
  return data as PaymentOrder;
}

export async function fulfillPayment(orderId: string, paymentId: string, packType: 'pro' | 'agency'): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('fulfill_payment', {
    p_order_id: orderId,
    p_payment_id: paymentId,
    p_pack_type: packType,
  });
  if (error) throw new Error(`Payment fulfillment failed: ${error.message}`);
  return data === true;
}
