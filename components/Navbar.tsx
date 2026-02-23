import React from 'react';
import Link from 'next/link';
import { SectionId } from '../types';

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: 'smooth' });
}

const Navbar: React.FC = () => {
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
          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <button type="button" onClick={() => scrollToSection(SectionId.Synergy)} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Search vs AI
            </button>
            <button type="button" onClick={() => scrollToSection(SectionId.Audit)} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              The Audit
            </button>
            <button type="button" onClick={() => scrollToSection(SectionId.Solution)} className="hover:text-white transition-colors bg-transparent border-none cursor-pointer">
              Our Focus
            </button>
            <Link href="/register" className="bg-lime-400 text-black px-6 py-3 rounded-[7px] hover:bg-white transition-all duration-300 shadow-lg font-black">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
