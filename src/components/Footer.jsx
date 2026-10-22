import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

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
            <span>© 2026 Wishly</span>
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
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-7 max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeModal === 'privacy'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeModal === 'terms'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('security')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 ${
                  activeModal === 'security'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Security Overview</span>
              </button>
            </div>

            {/* Modal Tab Content */}
            {activeModal === 'privacy' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Privacy Policy</h3>
                    <p className="text-xs text-slate-400">Your memories are strictly private and personal</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">100% Private & Ad-Free</strong>
                      Wishly does not run advertisements, does not sell your data, and does not share your keepsake cards with third parties.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">No Sensitive Financial Credentials</strong>
                      Wishly never asks for passwords, payment card details, bank logins, or sensitive personal IDs.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Confidential Link Sharing</strong>
                      Your crafted surprise cards are accessible only via the direct shareable URL you send to your recipient.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Built & Maintained by AV Infra Tech</strong>
                      All data storage and application infrastructure are secured by{' '}
                      <a
                        href="https://avinfra.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 hover:underline font-semibold"
                      >
                        AV Infra Tech — Digital Engineering Studio
                      </a>{' '}
                      adhering to modern enterprise cloud security standards.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Terms of Service</h3>
                    <p className="text-xs text-slate-400">Simple, fair usage rules for everyone</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Free Personal Use</strong>
                      Wishly is completely free to create and share heartfelt surprise websites for personal occasions like birthdays, anniversaries, and notes of appreciation.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Respectful Content Standards</strong>
                      Users agree not to publish hateful, harassing, deceptive, or harmful material. AV Infra Tech reserves the right to remove non-compliant content.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Reliable Service</strong>
                      We strive to ensure continuous availability so your recipients can open their keepsakes whenever they choose.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'security' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Security & Verification</h3>
                    <p className="text-xs text-slate-400">Verified safe by AV Infra Tech</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Enterprise Transport Encryption</strong>
                      Every connection to Wishly uses modern TLS/HTTPS encryption to protect transmitted messages and photos from eavesdropping.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Strict HTTP Security Headers</strong>
                      Configured with nosniff, sameorigin framing, referrer policies, and disabled device permissions (camera, microphone, geolocation).
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">No Adware, Phishing, or Malware</strong>
                      Wishly is a clean, benign application without third-party ad scripts, crypto miners, or telemetry trackers.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block mb-0.5">Responsible Vulnerability Disclosure</strong>
                      Security questions or disclosures may be reported to{' '}
                      <span className="font-mono text-emerald-700 font-semibold">security@avinfratech.com</span> in accordance with RFC 9116.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Bottom Close */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
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
