import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

const MODAL_CONFIG = {
  privacy: {
    title: 'Privacy & Trust',
    subtitle: 'Your memories are strictly private and personal',
    icon: Lock,
    badgeColor: 'bg-rose-50 text-rose-600 border-rose-200/60',
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Simple, fair usage rules for everyone',
    icon: FileText,
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
  },
  security: {
    title: 'Security Overview',
    subtitle: 'Verified safe by AV Infra Tech',
    icon: ShieldCheck,
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  },
};

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  // Close on Escape key and manage body scroll
  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  const activeTabInfo = activeModal ? MODAL_CONFIG[activeModal] || MODAL_CONFIG.privacy : null;
  const TabIcon = activeTabInfo?.icon;

  return (
    <>
      <footer className="border-t border-slate-200/60 bg-gradient-to-b from-[#FFFDFB] to-[#FAF6F3] py-8 text-center px-4 transition-all">
        <div className="max-w-3xl mx-auto space-y-3.5">
          {/* Subtle Reassuring Trust Statement */}
          <p className="text-xs text-slate-400 tracking-wide font-normal">
            Private & ad-free keepsakes • 100% confidential and safe
          </p>

          {/* Consistent Legal & Security Links */}
          <div className="flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setActiveModal('security')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Security Overview
            </button>
          </div>

          {/* Clean Unified Attribution */}
          <div className="pt-2 text-[11px] text-slate-400 font-normal flex items-center justify-center gap-1.5">
            <span>© 2026 Dearly</span>
            <span>•</span>
            <span>
              Built by{' '}
              <a
                href="https://avinfra.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-rose-600 font-medium underline underline-offset-2 transition-colors"
              >
                AV Infra Tech
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* Trust & Legal Modal */}
      {activeModal && activeTabInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 sm:p-6 max-h-[85vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in-95 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Row: Icon + Title + Close Button */}
            <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${activeTabInfo.badgeColor}`}>
                  <TabIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                    {activeTabInfo.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                    {activeTabInfo.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-2 -mr-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pill Navigation Bar */}
            <div className="my-3.5 flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeModal === 'privacy'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeModal === 'terms'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('security')}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  activeModal === 'security'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Security Overview</span>
              </button>
            </div>

            {/* Modal Tab Content */}
            {activeModal === 'privacy' && (
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">100% Private & Ad-Free</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Dearly does not run advertisements, does not sell your data, and does not share your keepsake cards with third parties.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">No Sensitive Financial Credentials</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Dearly never asks for passwords, payment card details, bank logins, or sensitive personal IDs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Confidential Link Sharing</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Your crafted surprise cards are accessible only via the direct shareable URL you send to your recipient.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Built & Maintained by AV Infra Tech</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      All data storage and application infrastructure are secured by{' '}
                      <a
                        href="https://avinfra.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 hover:underline font-semibold break-words"
                      >
                        AV Infra Tech — Digital Engineering Studio
                      </a>{' '}
                      adhering to modern enterprise cloud security standards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Free Personal Use</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Dearly is completely free to create and share heartfelt surprise websites for personal occasions like birthdays, anniversaries, and notes of appreciation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Respectful Content Standards</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Users agree not to publish hateful, harassing, deceptive, or harmful material. AV Infra Tech reserves the right to remove non-compliant content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Reliable Service</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      We strive to ensure continuous availability so your recipients can open their keepsakes whenever they choose.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'security' && (
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Enterprise Transport Encryption</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Every connection to Dearly uses modern TLS/HTTPS encryption to protect transmitted messages and photos from eavesdropping.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Strict HTTP Security Headers</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Configured with nosniff, sameorigin framing, referrer policies, and disabled device permissions (camera, microphone, geolocation).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">No Adware, Phishing, or Malware</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Dearly is a clean, benign application without third-party ad scripts, crypto miners, or telemetry trackers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/80 break-words">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <strong className="text-slate-900 block mb-0.5 text-xs sm:text-sm font-semibold">Responsible Vulnerability Disclosure</strong>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                      Security questions or disclosures may be reported to{' '}
                      <span className="font-mono text-emerald-700 font-semibold break-all">security@avinfratech.com</span> in accordance with RFC 9116.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Bottom Close */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
