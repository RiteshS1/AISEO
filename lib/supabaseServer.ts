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

export async function saveReport(
  inputs: unknown,
  result: unknown,
  userId?: string | null
): Promise<string> {
  const supabase = getSupabase();
  const row: { inputs: unknown; result: unknown; user_id?: string | null } = {
    inputs,
    result,
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
): Promise<{ inputs: unknown; result: unknown } | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .select('inputs, result')
    .eq('report_id', reportId)
    .single();
  if (error || !data) return null;
  return { inputs: data.inputs, result: data.result };
}

export type ReportWithMeta = {
  inputs: unknown;
  result: unknown;
  email: string | null;
  status: string | null;
};

export async function getReportWithMeta(
  reportId: string
): Promise<ReportWithMeta | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .select('inputs, result, email, status')
    .eq('report_id', reportId)
    .single();
  if (error || !data) return null;
  return {
    inputs: data.inputs,
    result: data.result,
    email: data.email ?? null,
    status: data.status ?? null,
  };
}

export async function updateReportPending(
  reportId: string,
  email: string
): Promise<void> {
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from('reports')
    .select('status')
    .eq('report_id', reportId)
    .single();
  if (!existing) {
    throw new Error(`Report not found: ${reportId}`);
  }
  if (existing.status === 'approved') {
    throw new Error(`Report already approved: ${reportId}`);
  }
  const { error } = await supabase
    .from('reports')
    .update({ email, status: 'pending' })
    .eq('report_id', reportId);
  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
}

export async function setReportApproved(reportId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('reports')
    .update({ status: 'approved' })
    .eq('report_id', reportId);
  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
}

export async function setReportDenied(reportId: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('reports')
    .update({ status: 'denied' })
    .eq('report_id', reportId);
  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
}

export type Profile = { id: string; audit_count: number };

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, audit_count')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return { id: data.id, audit_count: data.audit_count };
}

export async function ensureProfile(userId: string): Promise<Profile> {
  const existing = await getProfile(userId);
  if (existing) return existing;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, audit_count: 0 })
    .select('id, audit_count')
    .single();
  if (error) throw new Error(`Supabase profile insert failed: ${error.message}`);
  if (!data) throw new Error('Supabase profile insert returned no row');
  return { id: data.id, audit_count: data.audit_count };
}

export type ReportListItem = {
  report_id: string;
  created_at: string;
  brandName?: string;
  status?: string | null;
  overallScore?: number;
};

export async function listReportsByUserId(userId: string): Promise<ReportListItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .select('report_id, created_at, inputs, result, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map((row) => ({
    report_id: row.report_id,
    created_at: row.created_at,
    brandName: (row.inputs as { brandName?: string })?.brandName,
    status: row.status ?? null,
    overallScore: (row.result as { overallScore?: number })?.overallScore,
  }));
}

export async function incrementAuditCount(userId: string): Promise<void> {
  const supabase = getSupabase();
  const profile = await getProfile(userId);
  const nextCount = (profile?.audit_count ?? 0) + 1;
  const { error } = await supabase
    .from('profiles')
    .update({ audit_count: nextCount, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw new Error(`Supabase increment failed: ${error.message}`);
}
