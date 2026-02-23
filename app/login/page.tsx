'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-lime-500/30 flex flex-col items-center justify-center px-6 relative">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#d9ff00 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-[7px] p-8 shadow-2xl">
          <div className="inline-flex items-center gap-3 px-4 py-1 bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 rounded-[7px]">
            Sign in
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">
            Enter your credentials to access your dashboard
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-[10px] font-bold tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white transition-all text-[11px] font-medium rounded-[7px] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] font-bold tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-white transition-all text-[11px] font-medium rounded-[7px] placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lime-400 focus:border-lime-400"
              />
            </div>
            {error && (
              <p className="text-red-500 text-[10px] font-bold tracking-widest">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-lime-400 text-black font-black text-[11px] tracking-widest hover:bg-white transition-all rounded-[7px] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-lime-400 hover:text-white transition-colors">
              Register
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-lime-400 transition-colors"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-lime-400/30 border-t-lime-400 animate-spin rounded-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
