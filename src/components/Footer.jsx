import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-gradient-to-b from-[#FFFDFB] to-[#FDF8F5] py-7 sm:py-8 text-center px-4 transition-all">
      <div className="max-w-4xl mx-auto space-y-3">
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
