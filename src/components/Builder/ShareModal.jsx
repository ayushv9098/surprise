import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
  X,
  Share2,
} from 'lucide-react';
import {
  getWhatsAppShareUrl,
  generateQRCodeDataUrl,
  copyToClipboard,
  triggerNativeShare,
} from '../../utils/share';
import AppleEmoji from '../common/AppleEmoji';

export default function ShareModal({ isOpen, onClose, shareResult, formData }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [igBannerVisible, setIgBannerVisible] = useState(false);
  const igTimerRef = useRef(null);

  // Performance-critical refs for confetti animation and cleanup
  const confettiCanvasRef = useRef(null);
  const confettiInstanceRef = useRef(null);
  const hasFiredRef = useRef(false);
  const confettiTimeoutRef = useRef(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIgBannerVisible(false);
      setShowQrModal(false);
      if (igTimerRef.current) clearTimeout(igTimerRef.current);
      return;
    }
    const timer = setTimeout(() => setCanDismiss(true), 400);
    return () => {
      clearTimeout(timer);
      setCanDismiss(false);
    };
  }, [isOpen]);

  const origin = typeof window !== 'undefined' ? window.location.origin.replace(/\/+$/, '') : '';
  const rawShareUrl = shareResult?.shareUrl || (
    shareResult?.slug
      ? `${origin}/s/${encodeURIComponent(shareResult.slug)}`
      : (typeof window !== 'undefined' ? window.location.href : '')
  );
  // Guarantee ultra-compact clean URL: strip any legacy ?d= parameter
  const shareUrl = rawShareUrl.includes('?d=') ? rawShareUrl.split('?d=')[0] : rawShareUrl;
  const recipientName = formData?.recipientName || 'Someone special';
  const senderName = formData?.senderName || 'Your friend';

  // Fire high-performance celebratory confetti strictly ONCE per modal open
  useEffect(() => {
    if (!isOpen) {
      hasFiredRef.current = false;
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
        confettiTimeoutRef.current = null;
      }
      if (confettiInstanceRef.current) {
        try {
          confettiInstanceRef.current.reset();
        } catch {}
        confettiInstanceRef.current = null;
      }
      try {
        confetti.reset();
      } catch {}
      return;
    }

    // Strict guard: fire only once per open session, never duplicate on re-renders or shareUrl updates
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;

    // Smooth single RAF delay to let the modal entrance settle cleanly before firing confetti
    const animFrame = requestAnimationFrame(() => {
      if (confettiCanvasRef.current && !confettiInstanceRef.current) {
        try {
          confettiInstanceRef.current = confetti.create(confettiCanvasRef.current, {
            resize: true,
            useWorker: false, // Prevents stomping on LivePhonePreview's worker instance
          });
        } catch {
          confettiInstanceRef.current = null;
        }
      }

      const fire = confettiInstanceRef.current || confetti;

      try {
        // High-performance celebratory burst: 45 particles, snappy 100 ticks, 0.92 decay, spread 60
        fire({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.62 },
          colors: ['#F43F5E', '#FB7185', '#F59E0B', '#EC4899', '#A855F7'],
          ticks: 100,
          decay: 0.92,
          scalar: 0.95,
          disableForReducedMotion: true,
        });
      } catch {
        // Confetti optional
      }
    });

    return () => {
      cancelAnimationFrame(animFrame);
      if (confettiInstanceRef.current) {
        try {
          confettiInstanceRef.current.reset();
        } catch {}
        confettiInstanceRef.current = null;
      }
      try {
        confetti.reset();
      } catch {}
    };
  }, [isOpen]);

  const ensureQrCode = useCallback((url) => {
    if (!url || qrCodeUrl || isGeneratingQr) return;
    setIsGeneratingQr(true);
    generateQRCodeDataUrl(url)
      .then((dataUrl) => {
        if (dataUrl) setQrCodeUrl(dataUrl);
      })
      .catch((err) => {
        console.warn('QR code generation notice:', err);
      })
      .finally(() => {
        setIsGeneratingQr(false);
      });
  }, [qrCodeUrl, isGeneratingQr]);

  // Defer QR code generation until well after celebratory confetti has finished (4s)
  // or until the user explicitly clicks the QR button, preventing main-thread CPU spikes
  useEffect(() => {
    if (!isOpen || !shareUrl || qrCodeUrl) return;

    const cancelTimer = setTimeout(() => {
      ensureQrCode(shareUrl);
    }, 4000);

    return () => {
      clearTimeout(cancelTimer);
    };
  }, [isOpen, shareUrl, qrCodeUrl, ensureQrCode]);

  const handleToggleQr = () => {
    const next = !showQrModal;
    setShowQrModal(next);
    if (next && !qrCodeUrl && shareUrl) {
      ensureQrCode(shareUrl);
    }
  };

  if (!isOpen) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const waUrl = getWhatsAppShareUrl(shareUrl, recipientName, senderName, formData?.occasion || formData?.category);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSnapchat = () => {
    const snapUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`;
    window.open(snapUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagram = async () => {
    try {
      await copyToClipboard(shareUrl);
    } catch (err) {
      console.warn('Clipboard copy notice:', err);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    setIgBannerVisible(true);

    if (igTimerRef.current) clearTimeout(igTimerRef.current);
    igTimerRef.current = setTimeout(() => {
      setIgBannerVisible(false);
    }, 8000);

    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
    if (isMobile) {
      setTimeout(() => {
        try {
          window.location.href = 'instagram://story-camera';
        } catch {
          window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
        }
      }, 350);
    }
  };

  const handleNativeShare = async () => {
    const occ = formData?.occasion || formData?.category || '';
    const occText = occ ? ` for ${occ}` : '';
    await triggerNativeShare({
      title: formData?.title || `Special Surprise for ${recipientName} 🎁`,
      text: `✨ Hey ${recipientName}! ${senderName} created a personalized surprise keepsake just for you${occText}. Open your surprise here:`,
      url: shareUrl,
    });
  };

  const handleOpenLive = () => {
    window.open(shareUrl, '_blank');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && canDismiss) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/65 animate-modal-backdrop"
      onClick={handleBackdropClick}
    >
      {/* Dedicated high-performance confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[60] w-full h-full transform-gpu"
      />

      {/* Modal Dialog Card - Clean Luxury Sheet */}
      <div
        className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-4 overscroll-contain transform-gpu will-change-[transform,opacity] animate-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Sleek Close Button */}
        <button
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sleek Compact Header */}
        <div className="text-center space-y-1 relative pt-1">
          <div className="w-12 h-12 mx-auto flex items-center justify-center mb-1">
            <AppleEmoji emoji="🎁" size={38} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
            <span>Surprise is Ready!</span> <AppleEmoji emoji="🎉" size={20} />
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Live keepsake link for <span className="font-semibold text-rose-600">{recipientName}</span>
          </p>
        </div>

        {/* Sleek Single-Line Copy Link Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-slate-50/80 shadow-xs">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full px-3 py-1 font-mono text-xs text-slate-700 bg-transparent border-none focus:outline-none truncate select-all font-medium"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-500 shadow-emerald-200'
                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Consistent 3-Column Social Share Cards */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Share Instantly
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. Official WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="p-3 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 shadow-xs transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800">WhatsApp</span>
            </button>

            {/* 2. Official Instagram Story */}
            <button
              type="button"
              onClick={handleInstagram}
              className="p-3 rounded-2xl bg-white hover:bg-rose-50/40 border border-slate-200/90 hover:border-rose-300 shadow-xs transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800">Instagram</span>
            </button>

            {/* 3. Official Snapchat (Real Ghost on Yellow Background) */}
            <button
              type="button"
              onClick={handleSnapchat}
              className="p-3 rounded-2xl bg-white hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 shadow-xs transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FFFC00] flex items-center justify-center shadow-xs border border-amber-300/80 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#FFFFFF"
                    stroke="#000000"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-800">Snapchat</span>
            </button>
          </div>
        </div>

        {/* Instagram Story Helper Banner */}
        {igBannerVisible && (
          <div
            data-testid="ig-story-banner"
            className="p-3 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-950 text-xs shadow-xs animate-fadeIn flex items-start gap-2.5 relative"
          >
            <span className="text-sm shrink-0 mt-0.5">🔗</span>
            <div className="space-y-0.5 pr-4">
              <p className="font-bold text-rose-900 text-xs">
                Link copied for Instagram Story!
              </p>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Open Instagram Story, tap Stickers <span className="font-bold text-rose-950">🔗 → Link → Paste URL</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIgBannerVisible(false)}
              className="absolute top-2.5 right-2.5 text-rose-400 hover:text-rose-700 p-0.5 rounded-full cursor-pointer transition-colors"
              aria-label="Dismiss guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Secondary Utilities Row (Clean, Balanced 2-Column Buttons) */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={handleOpenLive}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Open Preview</span>
          </button>

          <button
            type="button"
            onClick={handleToggleQr}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{showQrModal ? 'Hide QR' : 'QR Code'}</span>
          </button>
        </div>

        {/* Native Mobile Share Link (Discreet & Non-Intrusive) */}
        {canNativeShare && (
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={handleNativeShare}
              className="text-[11px] text-slate-400 hover:text-slate-700 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>More sharing options (AirDrop, DMs, Messages)</span>
            </button>
          </div>
        )}

        {/* Compact Inline QR Code Box */}
        {showQrModal && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 animate-fadeIn">
            {qrCodeUrl ? (
              <>
                <div className="inline-block p-2 rounded-xl bg-white shadow-xs border border-slate-200">
                  <img
                    src={qrCodeUrl}
                    alt="Surprise QR Code"
                    className="w-28 h-28 mx-auto rounded-lg shadow-sm border border-slate-200"
                  />
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                  Scan with camera to open keepsake
                </p>
              </>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin" />
                <span className="text-xs font-medium">Generating QR code...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
