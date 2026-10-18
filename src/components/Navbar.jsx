import React from 'react';
import { Sparkles, ShieldCheck, Heart, PlusCircle } from 'lucide-react';

export default function Navbar({ currentView, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-rose-100/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-rose-200/50 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xl tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                WishCraft
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Create aesthetic surprise websites in 2 mins
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView !== 'builder' && (
            <button
              onClick={() => onNavigate('builder')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200/60 hover:shadow-lg hover:shadow-rose-300/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Surprise</span>
            </button>
          )}

          {currentView === 'builder' && (
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Templates
            </button>
          )}

          {/* Admin Control Link */}
          <button
            onClick={() => onNavigate('admin')}
            title="Owner Management Panel"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>
        </div>
      </div>
    </header>
  );
}
