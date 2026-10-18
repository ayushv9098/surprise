import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  X,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  getWhatsAppShareUrl,
  generateQRCodeDataUrl,
  copyToClipboard,
  triggerNativeShare,
} from '../../utils/share';

export default function ShareModal({ isOpen, onClose, shareResult, formData }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const shareUrl = shareResult?.shareUrl || window.location.href;
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
      } catch (e) {
        // Confetti optional
      }

      // Generate QR Code
      generateQRCodeDataUrl(shareUrl).then((url) => {
        if (url) setQrCodeUrl(url);
      });
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

  const handleNativeShare = () => {
    triggerNativeShare({
      title: `Surprise for ${recipientName} ✨`,
      text: `${senderName} created a personalized surprise keepsake just for you!`,
      url: shareUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-rose-100 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Soft Background Radial Glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-lg shadow-rose-200 animate-float">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-semibold text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Your Surprise is Live! 🎉
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
            Ready to give <strong className="text-rose-600">{recipientName}</strong> butterflies?
            Send this secret link or share directly!
          </p>
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-inner">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3 py-1.5 text-xs text-slate-700 bg-transparent border-none focus:outline-none truncate select-all font-mono"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-500 text-white shadow-emerald-200'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 hover:scale-102 active:scale-98'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Reliable (Standalone link included)
            </span>
            <span>Click to copy & paste anywhere</span>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* QR Code Button */}
          <button
            onClick={() => setShowQrModal(!showQrModal)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-rose-500" />
            <span>Show QR</span>
          </button>

          {/* Test Live Preview In New Tab */}
          <button
            onClick={handleOpenLive}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-rose-50/70 hover:bg-rose-100 text-rose-700 border border-rose-200/60 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-rose-500" />
            <span>Open Page</span>
          </button>
        </div>

        {/* QR Code Reveal Drawer */}
        {showQrModal && qrCodeUrl && (
          <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 text-center space-y-3 animate-scaleIn">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Scan with Phone Camera
            </h4>
            <div className="inline-block p-3 rounded-2xl bg-white shadow-md border border-rose-100">
              <img
                src={qrCodeUrl}
                alt="Surprise QR Code"
                className="w-48 h-48 mx-auto rounded-lg"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Print this or display it on a card for a delightful physical surprise!
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 text-center text-xs text-slate-400">
          Saved securely in your browser history. You can reopen or edit anytime!
        </div>
      </div>
    </div>
  );
}
