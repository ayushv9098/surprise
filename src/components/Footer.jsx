import React from 'react';
import { ShieldCheck, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-gradient-to-b from-[#FFFDFB] to-[#FDF8F5] py-8 sm:py-10 text-center px-4 transition-all">
      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* Trust & Security Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-700">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.2]" />
            <span>100% Trusted & Verified</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/70 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0 stroke-[2.2]" />
            <span>Data Safe & Encrypted</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/70 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
            <span>Private Keepsakes • Zero Ads</span>
          </div>
        </div>

        {/* Short, Reassuring Trust Statement */}
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Private & ad-free keepsakes. 100% confidential and safe.
        </p>

        {/* Copyright & Company Attribution */}
        <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-xs text-slate-500 font-medium">
          <span>© 2026 Built by AV Infratech</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="text-slate-400">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
