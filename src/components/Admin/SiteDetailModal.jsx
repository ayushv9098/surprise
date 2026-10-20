import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Eye,
  User,
  Heart,
  Music,
  Sparkles,
  HelpCircle,
  FileJson,
  Trash2,
  Gift
} from 'lucide-react';

const TEMPLATE_CONFIG = {
  'royal-sapphire': {
    name: 'Royal Sapphire 👑',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    accent: 'text-sky-600',
    tag: 'Royal & Elegant'
  },
  'blush-rose': {
    name: 'Blush Rose 🌸',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: 'text-rose-600',
    tag: 'Dreamy & Floral'
  },
  'blush-romance': {
    name: 'Blush Romance 🌸',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: 'text-rose-600',
    tag: 'Romantic & Soft'
  },
  'golden-birthday': {
    name: 'Golden Birthday 🎂',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    accent: 'text-amber-600',
    tag: 'Celebration & Joy'
  },
  'polaroid-scrapbook': {
    name: 'Retro Polaroid 📸',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: 'text-rose-600',
    tag: 'Vintage Crimson & Memories'
  },
  'lavender-dream': {
    name: 'Lavender Dream 💜',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: 'text-purple-600',
    tag: 'Calming & Poetic'
  },
  'heartfelt-apology': {
    name: 'Heartfelt Hug 🥺',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: 'text-purple-600',
    tag: 'Sweet Apology & Love'
  },
  'princess-peach': {
    name: 'Princess Peach ✨',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    accent: 'text-orange-600',
    tag: 'Sparkling & Joy'
  }
};

export default function SiteDetailModal({ site, onClose, onDelete, onToast }) {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!site) return null;

  const templateKey = site.template || site.templateId || 'blush-romance';
  const tpl = TEMPLATE_CONFIG[templateKey] || {
    name: templateKey,
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    accent: 'text-slate-600',
    tag: 'Custom'
  };

  const shareUrl = `${window.location.origin}/?v=${encodeURIComponent(site.slug)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (onToast) {
      onToast({ type: 'success', message: 'Surprise link copied to clipboard!' });
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = site.createdAt
    ? new Date(site.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown Date';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50/80 via-white to-rose-50/30">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${tpl.color}`}>
                {tpl.name}
              </span>
              {site.occasion && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {site.occasion}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Eye className="w-3 h-3" />
                {site.viewCount || 0} views
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold font-bold text-slate-800 truncate">
              {site.title || `Surprise for ${site.recipientName}`}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Slug: <code className="text-rose-600 font-mono font-medium">/{site.slug}</code> • Created {formattedDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Share Link Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex-1 min-w-0">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Live Public URL
              </span>
              <div className="text-xs font-mono text-slate-700 truncate select-all bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                {shareUrl}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
              >
                <span>Open View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Recipient & Sender Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-wider mb-1">
                <Heart className="w-3.5 h-3.5" />
                <span>Recipient (Who It's For)</span>
              </div>
              <p className="text-base font-bold text-slate-800">
                {site.recipientName || 'Not specified'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                <User className="w-3.5 h-3.5" />
                <span>Sender (Created By)</span>
              </div>
              <p className="text-base font-bold text-slate-800">
                {site.senderName || 'Anonymous Creator'}
              </p>
            </div>
          </div>

          {/* Heartfelt Letter Content */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-rose-50/30 border border-amber-100/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Secret Letter & Message</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {site.letter ? `${site.letter.length} characters` : 'Empty'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/90 border border-amber-100/50 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-semibold italic selection:bg-rose-100">
              {site.letter || 'No letter text recorded.'}
            </div>
          </div>

          {/* Photo Gallery Thumbnails */}
          {Array.isArray(site.photos) && site.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span>Memories & Photos</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {site.photos.length}
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {site.photos.map((photo, idx) => {
                  const url = typeof photo === 'string' ? photo : photo.url;
                  const caption = typeof photo === 'object' ? photo.caption : '';
                  return (
                    <div
                      key={idx}
                      className="group relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs transition-transform hover:scale-[1.02]"
                    >
                      <img
                        src={url}
                        alt={caption || `Memory photo ${idx + 1}`}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      {caption && (
                        <div className="p-2 bg-white text-[11px] font-medium text-slate-600 truncate">
                          {caption}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Love Quiz / Interactive Questions */}
          {Array.isArray(site.quiz) && site.quiz.length > 0 && (
            <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/80">
              <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>Custom Interactive Quiz ({site.quiz.length})</span>
              </h3>
              <div className="space-y-3">
                {site.quiz.map((q, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-purple-100/60 shadow-xs text-xs">
                    <p className="font-semibold text-slate-800 mb-1.5">
                      Q{idx + 1}: {q.question}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {q.options?.map((opt, oIdx) => {
                        const isCorrect =
                          opt === q.correctAnswer || opt === q.answer;
                        return (
                          <span
                            key={oIdx}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                              isCorrect
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {opt} {isCorrect && '✓'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scratch Card / Secret Reveal Message */}
          {site.scratchSecret && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                  Hidden Scratch Card Secret
                </span>
                <p className="text-sm font-semibold text-amber-900 mt-0.5">
                  "{site.scratchSecret}"
                </p>
              </div>
            </div>
          )}

          {/* Music Track info if available */}
          {site.musicTrack && (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/70">
              <Music className="w-4 h-4 text-rose-500" />
              <span>Background Track ID: <strong className="font-mono text-slate-800">{site.musicTrack}</strong></span>
            </div>
          )}

          {/* Raw JSON inspection toggle */}
          <div>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>{showRawJson ? 'Hide Raw JSON' : 'Inspect Raw JSON Payload'}</span>
            </button>
            {showRawJson && (
              <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-60">
                {JSON.stringify(site, null, 2)}
              </pre>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete this surprise site for "${site.recipientName}"?`)) {
                onDelete(site.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Surprise</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
