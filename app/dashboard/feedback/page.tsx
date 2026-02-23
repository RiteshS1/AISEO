import { createClient } from '@/lib/supabase/server';
import FeedbackForm from './FeedbackForm';

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userEmail = user?.email ?? '';

  return (
    <div className="p-8 md:p-12">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="p-10 md:p-14 bg-slate-900/40 border border-white/10 rounded-[12px] backdrop-blur-sm">
          <FeedbackForm userEmail={userEmail} />
        </div>
      </div>
    </div>
  );
}
