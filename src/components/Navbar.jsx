import React from 'react';

export default function Navbar({ currentView, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-left cursor-pointer"
        >
          <span className="font-bold text-lg text-gray-900">WishCraft</span>
          <span className="text-base">✨</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {currentView !== 'builder' && (
            <button
              onClick={() => onNavigate('builder')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              Create Free
            </button>
          )}

          {currentView === 'builder' && (
            <button
              onClick={() => onNavigate('home')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Templates
            </button>
          )}

          <button
            onClick={() => onNavigate('admin')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'admin'
                ? 'text-gray-900'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
