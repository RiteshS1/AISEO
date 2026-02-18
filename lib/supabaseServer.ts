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

export async function saveReport(inputs: unknown, result: unknown): Promise<string> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('reports')
    .insert({ inputs, result })
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
