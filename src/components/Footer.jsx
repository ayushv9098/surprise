import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="mt-20 border-t border-rose-100/70 bg-white/50 backdrop-blur-xs py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-slate-700 text-sm">WishCraft</span>
          <span>•</span>
          <span>Crafted with sweet care for real moments</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline animate-pulse" />
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('builder')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            Create Free Website
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            Explore Templates
          </button>
          <button 
            onClick={() => onNavigate('admin')}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Admin Control
          </button>
        </div>
      </div>
    </footer>
  );
}
