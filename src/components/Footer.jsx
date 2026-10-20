import React from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  KeyRound,
  Zap,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-200/80 bg-gradient-to-b from-[#FAFAF8] via-[#F8F6F2] to-[#F1ECE6] pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-slate-700 overflow-hidden">
      {/* Subtle ambient background glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-emerald-100/40 blur-3xl rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto space-y-8">
        {/* AV Infratech Security Guarantee Box */}
        <section
          aria-label="Trust and Security Guarantee"
          className="relative rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-6 md:p-8 overflow-hidden"
        >
          {/* Subtle top security hairline bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500"
            aria-hidden="true"
          />

          {/* Top Header with Shield & Verification */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AV Infratech Trust &amp; Security Seal
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] sm:text-[11px] font-semibold border border-emerald-200/80">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Safe Platform
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Enterprise-Grade Privacy &amp; Data Protection
                </h2>
              </div>
            </div>

            {/* Live Trust Metrics Stamp */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-medium self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 Strict HTTPS • Zero Ads</span>
            </div>
          </div>

          {/* 3 Solid Trust Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 my-6">
            {/* Pillar 1: 256-Bit End-to-End Encryption */}
            <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-b from-slate-50/80 to-white border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center">
                    <Lock className="w-4 h-4 stroke-[2.3]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    256-Bit SSL
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  256-Bit End-to-End Encryption
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  All photos, letters, and custom links are encrypted with bank-grade SSL/TLS. Only the person with the link can view it.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Private link-only access</span>
              </div>
            </div>

            {/* Pillar 2: 100% Private & Ad-Free */}
            <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-b from-slate-50/80 to-white border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 stroke-[2.3]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
                    Strict Privacy
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  100% Private &amp; Ad-Free
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  No third-party trackers, zero data selling, and zero spam. Your memories remain confidential and never public.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-sky-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Zero third-party trackers</span>
              </div>
            </div>

            {/* Pillar 3: Certified AV Infratech Infrastructure */}
            <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-b from-slate-50/80 to-white border border-slate-200/80 hover:border-amber-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center">
                    <Zap className="w-4 h-4 stroke-[2.3]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    Enterprise Cloud
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  Certified AV Infratech Infrastructure
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Enterprise cloud hosting with 99.9% uptime, instant CDN link delivery, and permanent keepsake preservation.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>99.9% uptime &amp; CDN delivery</span>
              </div>
            </div>
          </div>

          {/* Trust Metrics / Seal Bar */}
          <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl px-4 py-3 flex flex-wrap items-center justify-center sm:justify-around gap-y-2 gap-x-4 sm:gap-x-6 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Encrypted SSL</span>
            </div>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Zero Tracking</span>
            </div>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">•</span>
            <div className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>100% Confidential</span>
            </div>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Instant Delivery</span>
            </div>
          </div>
        </section>

        {/* Corporate Signature & Mission Statement */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            WishCraft is committed to protecting your private memories and celebrating real connections.
          </p>

          <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-slate-500 font-medium">
            <span>© 2026 Built &amp; Secured by AV Infratech</span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">•</span>
            <span className="text-slate-400">All rights reserved</span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Crafted with care
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
