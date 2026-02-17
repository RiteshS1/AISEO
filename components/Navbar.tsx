
import React from 'react';
import { SectionId } from '../types';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 leading-none">
              <span className="text-xl font-black tracking-tighter uppercase text-white">AISEO</span>
              <span className="text-[10px] text-lime-400 font-bold lowercase tracking-widest mono uppercase">by GetNifty</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <a href={`#${SectionId.Synergy}`} className="hover:text-white transition-colors">Search vs AI</a>
            <a href={`#${SectionId.Audit}`} className="hover:text-white transition-colors">The Audit</a>
            <a href={`#${SectionId.Solution}`} className="hover:text-white transition-colors">Our Focus</a>
            <a href={`#${SectionId.Contact}`} className="bg-lime-400 text-black px-6 py-3 rounded-[7px] hover:bg-white transition-all duration-300 shadow-lg font-black">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
