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
      {/* Modal Dialog Card - Clean luxury sheet with smooth scrolling if needed */}
      <div
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-3.5 sm:space-y-4 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Sleek Close Button */}
        <button
          onClick={onClose}
          aria-label="Close share dialog"
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sleek Compact Header */}
        <div className="text-center space-y-1 relative">
          <div className="w-12 h-12 mx-auto flex items-center justify-center mb-1 animate-bounce">
            <AppleEmoji emoji="🎁" size={38} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
            <span>Surprise is Ready!</span> <AppleEmoji emoji="🎉" size={20} />
          </h3>
          <p className="text-xs text-slate-500">
            Live surprise link for <span className="font-semibold text-rose-600">{recipientName}</span>
          </p>
        </div>

        {/* Sleek Single-Line Copy Link Bar - Solid Slate Tint */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full px-3 py-1.5 font-mono text-xs text-slate-700 bg-transparent border-none focus:outline-none truncate select-all"
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

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Primary WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
          >
            <svg className="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Share on WhatsApp</span>
          </button>

          {/* Gen-Z Social Sharing (Snapchat & Instagram Story) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Snapchat Share Button */}
            <button
              type="button"
              onClick={handleSnapchat}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#FFFC00]/90 text-slate-900 hover:bg-[#FFFC00] border border-amber-300/80 shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.166 2.001c-3.774 0-6.19 2.768-6.19 5.864 0 1.25.437 2.457 1.096 3.425.105.155.08.358-.04.498-.314.364-.813.593-1.428.846-.358.147-.643.344-.643.722 0 .428.36.757.854.854.675.133 1.344.023 1.94-.233.25-.107.54-.002.668.237.288.536.852 1.325 1.558 1.83.214.153.297.432.202.671-.165.419-.516 1.139-1.579 1.488-.415.136-.632.484-.538.868.106.436.568.694 1.144.694 1.272 0 2.222-.61 3.018-1.47.16-.173.415-.224.629-.124.63.294 1.314.444 2.01.444.698 0 1.383-.15 2.012-.444.215-.1.47-.049.63.124.796.86 1.746 1.47 3.018 1.47.576 0 1.038-.258 1.144-.694.094-.384-.123-.732-.538-.868-1.063-.349-1.414-1.069-1.579-1.488-.095-.239-.012-.518.202-.671.706-.505 1.27-1.294 1.558-1.83.128-.239.418-.344.668-.237.596.256 1.265.366 1.94.233.494-.097.854-.426.854-.854 0-.378-.285-.575-.643-.722-.615-.253-1.114-.482-1.428-.846-.12-.14-.145-.343-.04-.498.659-.968 1.096-2.175 1.096-3.425 0-3.096-2.416-5.864-6.19-5.864z"/>
              </svg>
              <span>Snapchat</span>
            </button>

            {/* Instagram Story Helper Button */}
            <button
              type="button"
              onClick={handleInstagram}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none"
            >
              <svg className="w-4 h-4 fill-current shrink-0 text-rose-600" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram Story</span>
            </button>
          </div>

          {/* Instagram Story Helper Banner / Tooltip */}
          {igBannerVisible && (
            <div
              data-testid="ig-story-banner"
              className="p-3 rounded-2xl bg-gradient-to-r from-rose-50/95 via-pink-50/90 to-amber-50/90 border border-rose-200/80 text-rose-950 text-xs shadow-xs animate-fadeIn flex items-start gap-2.5 relative"
            >
              <span className="text-base leading-none shrink-0 mt-0.5">🔗</span>
              <div className="space-y-0.5 pr-5">
                <p className="font-semibold text-rose-900 text-[11px] sm:text-xs">
                  Link copied!
                </p>
                <p className="text-[11px] text-rose-800/90 leading-relaxed">
                  In Instagram Story, tap Stickers <span className="font-semibold text-rose-950">🔗 → Link → Paste URL</span>
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

          {/* Native Mobile Share Sheet (iOS / Android / macOS Safari) */}
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] select-none"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>More Sharing Options (AirDrop, DMs, System)</span>
            </button>
          )}

          {/* Secondary Quick Action Row (2 columns) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleOpenLive}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>Open Live Page</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrModal(!showQrModal)}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span>{showQrModal ? 'Hide QR' : 'View QR Code'}</span>
            </button>
          </div>
        </div>

        {/* Compact Inline QR Code Box - Solid Slate */}
        {showQrModal && qrCodeUrl && (
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5 animate-fadeIn">
            <div className="inline-block p-1.5 rounded-xl bg-white shadow-xs border border-slate-200">
              <img
                src={qrCodeUrl}
                alt="Surprise QR Code"
                className="w-28 h-28 mx-auto rounded-lg shadow-sm border border-slate-200"
              />
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Scan with camera to open
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
