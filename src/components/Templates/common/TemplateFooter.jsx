import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function TemplateFooter({ onCreateClick }) {
  const handleClick = (e) => {
    if (onCreateClick) {
      e.preventDefault();
      onCreateClick();
    }
  };

  return (
    <footer className="w-full py-12 px-4 text-center mt-16 border-t border-rose-100/50 relative z-20">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <a
          href="/"
          onClick={handleClick}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-rose-200/70 shadow-xs hover:shadow-md transition-all duration-300 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          <span>Made with <span className="font-serif font-bold text-rose-600">WishCraft</span> ✨ Create one for someone special for free</span>
        </a>

        <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1 font-medium">
          Crafted with love <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" /> & forever kept alive
        </p>
      </div>
    </footer>
  );
}
