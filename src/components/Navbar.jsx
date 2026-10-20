import React from 'react';
import { ShieldCheck } from 'lucide-react';
import AppleEmoji from './common/AppleEmoji';

export default function Navbar({ onNavigate }) {
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

        {/* Actions / Trust Badge */}
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% Private & Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
