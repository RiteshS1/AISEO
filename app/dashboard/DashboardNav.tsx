'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const nav = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/audit', label: 'New AIEO Audit' },
    { href: '/dashboard/understanding-aieo', label: 'Understanding AIEO' },
    { href: '/dashboard/why-getnifty', label: 'Why GetNifty?' },
    { href: '/dashboard/feedback', label: 'Feedback' },
  ];

  return (
    <aside className="w-56 shrink-0 border-r border-white/5 bg-slate-950/50 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
          AISEO
        </span>
        <span className="text-xs font-bold text-lime-400 uppercase tracking-widest">
          by GetNifty
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-3 text-[11px] font-bold uppercase tracking-widest rounded-[7px] transition-all ${
                active
                  ? 'bg-lime-400/20 text-lime-400 border border-lime-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5 space-y-2">
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate px-2" title={userEmail}>
          {userEmail}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-[7px] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
