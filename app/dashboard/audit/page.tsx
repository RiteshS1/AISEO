import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabaseServer';
import AuditPageClient from './AuditPageClient';

export default async function DashboardAuditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await getProfile(user.id);
  const auditCount = profile?.audit_count ?? 0;
  const limit = 2;
  const allowed = auditCount < limit;

  return (
    <div className="p-8 md:p-12 relative">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto">
        <AuditPageClient allowed={allowed} />
      </div>
    </div>
  );
}
