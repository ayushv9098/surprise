import React from 'react';
import AppleEmoji from './common/AppleEmoji';

export default function Navbar({ _currentView, onNavigate, brandName = 'Dearly' }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-150 group"
          aria-label="Dearly Home"
        >
          <img
            src="/favicon.svg"
            alt="Dearly logo"
            className="w-6 h-6 rounded-[7px] shadow-xs group-hover:scale-105 transition-transform duration-150"
          />
          <span className="font-bold text-lg text-gray-900 tracking-tight">{brandName}</span>
          <AppleEmoji emoji="✨" size={16} />
        </button>

        {/* Clean minimal right side (no clutter) */}
        <div className="flex items-center gap-3" />
      </div>
    </header>
  );
}
