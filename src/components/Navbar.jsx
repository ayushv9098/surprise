import React from 'react';
import AppleEmoji from './common/AppleEmoji';

export default function Navbar({ currentView, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-left cursor-pointer hover:opacity-80 active:scale-95 transition-all duration-150"
        >
          <span className="font-bold text-lg text-gray-900">WishCraft</span>
          <AppleEmoji emoji="✨" size={18} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {currentView !== 'builder' && currentView !== 'admin' && (
            <button
              onClick={() => onNavigate('builder')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
            >
              Create Free
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
