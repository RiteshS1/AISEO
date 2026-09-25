import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabaseServer';

export class AdminAuthError extends Error {
  status: 401 | 403;

  constructor(message: string, status: 401 | 403) {
    super(message);
    this.status = status;
  }
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new AdminAuthError('Unauthorized', 401);

  const profile = await getProfile(user.id);
  if (!profile?.is_admin) throw new AdminAuthError('Forbidden', 403);

  return { user, profile };
}