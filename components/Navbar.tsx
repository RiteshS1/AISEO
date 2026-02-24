'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { SectionId } from '../types';

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: 'smooth' });
}

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeAndScroll = useCallback((sectionId: string) => {
    setMobileOpen(false);
    setTimeout(() => scrollToSection(sectionId), 100);
  }, []);

  const navItems = [
    { id: SectionId.Synergy, label: 'Search vs AI' },
    { id: SectionId.Audit, label: 'The Audit' },
    { id: SectionId.Solution, label: 'Our Focus' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 leading-none">
              <span className="text-xl font-black tracking-tighter uppercase text-white">AISEO</span>
              <span className="text-[10px] text-lime-400 font-bold tracking-widest">by GetNifty</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className="hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                {label}
              </button>
            ))}
            <Link href="/register" className="bg-lime-400 text-black px-6 py-3 rounded-[7px] hover:bg-white transition-all duration-300 shadow-lg font-black">
              Get Started
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <div className="flex lg:hidden items-center gap-4">
            <Link href="/register" className="bg-lime-400 text-black px-4 py-2.5 rounded-[7px] hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest">
              Get Started
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-[7px] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          style={{ minHeight: '50vh' }}
        >
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-2">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => closeAndScroll(id)}
                className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-[7px] transition-all"
              >
                {label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-white/5">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block w-full py-4 text-center bg-lime-400 text-black rounded-[7px] font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
