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

  const bottomNav = [
    { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/dashboard/audit', label: 'New Audit', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  return (
    <>
      {/* Desktop sidebar: hidden on md and below */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-white/5 bg-slate-950/50 flex-col">
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

      {/* Mobile: fixed bottom nav (md and below) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/5 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-4">
          {bottomNav.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-[7px] transition-all ${
                  active ? 'text-lime-400' : 'text-slate-400 hover:text-white'
                }`}
                aria-label={label}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-[7px] text-slate-400 hover:text-white transition-all"
            aria-label="Log out"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
