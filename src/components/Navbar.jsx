import React from 'react';
import DearlyLogo from './common/DearlyLogo';

export default function Navbar({ _currentView, onNavigate, brandName = 'Dearly' }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate?.('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-150 group"
          aria-label="Dearly Home"
        >
          <DearlyLogo size={28} className="group-hover:scale-105 transition-transform duration-150" />
          <span className="font-['Playfair_Display'] font-bold text-[22px] tracking-[-0.01em] text-slate-950 select-none">{brandName}</span>
        </button>

        {/* Clean minimal right side (no clutter) */}
        <div className="flex items-center gap-3" />
      </div>
    </header>
  );
}
