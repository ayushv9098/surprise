import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
  X,
} from 'lucide-react';
import {
  getWhatsAppShareUrl,
  generateQRCodeDataUrl,
  copyToClipboard,
} from '../../utils/share';
import AppleEmoji from '../common/AppleEmoji';

export default function ShareModal({ isOpen, onClose, shareResult, formData }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setCanDismiss(true), 400);
    return () => {
      clearTimeout(timer);
      setCanDismiss(false);
    };
  }, [isOpen]);

  const shareUrl = shareResult?.shareUrl || (
    shareResult?.slug
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${encodeURIComponent(shareResult.slug)}`
      : (typeof window !== 'undefined' ? window.location.href : '')
  );
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
    const waUrl = getWhatsAppShareUrl(shareUrl, recipientName, senderName);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
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
      {/* Modal Dialog Card - 100% Non-scrollable, solid clean luxury sheet (no gradients) */}
      <div
        className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-3.5 sm:space-y-4 overflow-hidden"
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
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-md shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
          >
            <svg className="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Share on WhatsApp</span>
          </button>

          {/* Secondary Quick Action Row (2 columns) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenLive}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Live Page</span>
            </button>

            <button
              onClick={() => setShowQrModal(!showQrModal)}
              className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-700" />
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
