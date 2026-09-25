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
    .select('inputs, result, email, report_status, contact_name, user_id, admin_notes')
    .eq('report_id', reportId)
    .single();
  if (error || !data) return null;
  return {
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

export type Profile = { id: string; audit_count: number; is_admin: boolean };

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, audit_count, is_admin')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return { id: data.id, audit_count: data.audit_count, is_admin: Boolean(data.is_admin) };
}

export async function ensureProfile(userId: string): Promise<Profile> {
  const existing = await getProfile(userId);
  if (existing) return existing;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, audit_count: 0 })
    .select('id, audit_count, is_admin')
    .single();
  if (error) throw new Error(`Supabase profile insert failed: ${error.message}`);
  if (!data) throw new Error('Supabase profile insert returned no row');
  return { id: data.id, audit_count: data.audit_count, is_admin: Boolean(data.is_admin) };
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
