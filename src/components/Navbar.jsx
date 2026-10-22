import React from 'react';
import AppleEmoji from './common/AppleEmoji';

export default function Navbar({ _currentView, onNavigate, brandName = 'Wishly' }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-left cursor-pointer hover:opacity-80 active:scale-95 transition-all duration-150"
        >
          <span className="font-bold text-lg text-gray-900">{brandName}</span>
          <AppleEmoji emoji="✨" size={18} />
        </button>

        {/* Clean minimal right side (no clutter) */}
        <div className="flex items-center gap-3" />
      </div>
    </header>
  );
}
