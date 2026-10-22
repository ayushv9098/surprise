import React from 'react';
import { Sparkles } from 'lucide-react';

export default function TemplateFooter({ onCreateClick, onNavigateCreate, dark = false }) {
  const handleClick = (e) => {
    const handler = onCreateClick || onNavigateCreate;
    if (handler) {
      e.preventDefault();
      handler();
    }
  };

  return (
    <footer className={`w-full py-12 px-4 text-center mt-16 relative z-20 ${dark ? 'border-t border-indigo-900/30' : 'border-t border-rose-100/50'}`}>
      <div className="max-w-md mx-auto flex flex-col items-center">
        <a
          href="/"
          onClick={handleClick}
          className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-300 text-xs sm:text-sm font-medium cursor-pointer ${
            dark 
              ? 'bg-slate-900/80 hover:bg-slate-800 border border-indigo-500/30 text-slate-300 hover:text-white' 
              : 'bg-white/80 hover:bg-white border border-rose-200/70 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Made with <span className={`font-bold ${dark ? 'text-indigo-400' : 'text-rose-600'}`}>Wishly</span> • Create yours free</span>
        </a>

        <p className={`text-[11px] mt-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          Made with care for real moments
        </p>
      </div>
    </footer>
  );
}
