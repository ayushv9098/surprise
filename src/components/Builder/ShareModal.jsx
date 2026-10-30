import React, { useState, useEffect, useRef } from 'react';
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
  const [canDismiss, setCanDismiss] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [igBannerVisible, setIgBannerVisible] = useState(false);
  const igTimerRef = useRef(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIgBannerVisible(false);
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

  // Fire celebratory confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F43F5E', '#FB7185', '#F59E0B', '#EC4899', '#A855F7'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#F43F5E', '#FBBF24', '#FB7185'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#EC4899', '#8B5CF6', '#F43F5E'],
          });
        }, 250);
      } catch {
        // Confetti optional
      }

      // Generate QR Code
      if (shareUrl) {
        generateQRCodeDataUrl(shareUrl).then((url) => {
          if (url) setQrCodeUrl(url);
        });
      }
    }
  }, [isOpen, shareUrl]);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Modal Dialog Card - Clean Luxury Sheet */}
      <div
        className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-4 overscroll-contain"
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
                  <path fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" d="M12 2.75c-3.1 0-5.18 2.22-5.18 5 0 1.25.43 2.34 1.05 3.12.1.13.08.3-.04.42-.3.3-.8.6-1.42.8-.33.12-.53.3-.53.6 0 .38.33.64.75.72.6.1 1.2 0 1.77-.2.23-.08.47 0 .58.2.26.48.77 1.18 1.43 1.68.18.14.23.38.15.58-.16.38-.47 1.08-1.47 1.38-.37.11-.57.41-.48.76.1.4.52.64 1.05.64 1.15 0 2.05-.58 2.75-1.35.15-.17.38-.22.58-.12.58.28 1.22.42 1.89.42.66 0 1.3-.14 1.88-.42.2-.1.44-.05.58.12.7.77 1.6 1.35 2.75 1.35.53 0 .95-.24 1.05-.64.09-.35-.11-.65-.48-.76-1-.3-1.31-1-1.47-1.38-.08-.2-.03-.44.15-.58.66-.5 1.17-1.2 1.43-1.68.11-.2.35-.28.58-.2.57.2 1.17.3 1.77.2.42-.08.75-.34.75-.72 0-.3-.2-.48-.53-.6-.62-.2-1.12-.5-1.42-.8-.12-.12-.14-.29-.04-.42.62-.78 1.05-1.87 1.05-3.12 0-2.78-2.08-5-5.18-5z"/>
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
            onClick={() => setShowQrModal(!showQrModal)}
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
        {showQrModal && qrCodeUrl && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 animate-fadeIn">
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
          </div>
        )}
      </div>
    </div>
  );
}
