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
  Gift,
  Clock
} from 'lucide-react';

export const TEMPLATE_CONFIG = {
  // Birthday Templates (Boy)
  'royal-sapphire': {
    name: 'Royal Sapphire 👑',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    accent: 'text-blue-600',
    tag: 'Royal & Elegant'
  },
  'golden-birthday': {
    name: 'Golden Spark 🎂✨',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    accent: 'text-amber-600',
    tag: 'Celebration & Joy'
  },
  'polaroid-scrapbook': {
    name: 'Retro Polaroid 📸⚡',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: 'text-rose-600',
    tag: 'Vintage Crimson & Memories'
  },
  'midnight-onyx': {
    name: 'Midnight Onyx 🖤👑',
    color: 'bg-stone-900 text-stone-100 border-stone-800',
    accent: 'text-amber-500',
    tag: 'Bold & Regal'
  },

  // Birthday Templates (Girl)
  'blush-rose': {
    name: 'Blush Blossom 🌸',
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
  'princess-peach': {
    name: 'Princess Peach ✨',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    accent: 'text-orange-600',
    tag: 'Sparkling & Joy'
  },
  'lavender-dream': {
    name: 'Lavender Dream 💜',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: 'text-purple-600',
    tag: 'Calming & Poetic'
  },
  'cinderella-sky': {
    name: 'Cinderella Sky 🩵✨',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    accent: 'text-sky-600',
    tag: 'Fairytale & Dreamy'
  },
  'emerald-luxe': {
    name: 'Emerald Luxe 🌿',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accent: 'text-emerald-600',
    tag: 'Opulent & Rich'
  },

  // Romance & Anniversary Templates
  'velvet-romance': {
    name: 'Velvet Rose ❤️',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: 'text-rose-600',
    tag: 'Deep Romance & Velvet'
  },
  'sunset-romance': {
    name: 'Sunset Glow 🌅',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    accent: 'text-amber-600',
    tag: 'Warm Golden Hour'
  },
  'celestial-love': {
    name: 'Celestial Indigo 🌌',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accent: 'text-indigo-600',
    tag: 'Starlit & Cosmic'
  },
  'amethyst-romance': {
    name: 'Amethyst Dream 💜✨',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: 'text-purple-600',
    tag: 'Lavender Whispers'
  },

  // Memory Scrapbook Templates
  'vintage-kodak': {
    name: 'Vintage Kodak 📸',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    accent: 'text-amber-600',
    tag: 'Warm Nostalgia'
  },
  'neon-nostalgia': {
    name: 'Electric Vibes ⚡',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    accent: 'text-teal-600',
    tag: 'Neon Glow & Fun'
  },
  'cozy-memories': {
    name: 'Cozy Sunset ☕',
    color: 'bg-orange-50 text-orange-800 border-orange-200',
    accent: 'text-orange-600',
    tag: 'Sweet Moments'
  },

  // Heartfelt Apology Templates
  'gentle-peace': {
    name: 'Olive Peace 🕊️',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accent: 'text-emerald-600',
    tag: 'Gentle & Healing'
  },
  'heartfelt-apology': {
    name: 'Heartfelt Hug 🥺',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: 'text-purple-600',
    tag: 'Sweet Apology & Love'
  },
  'sweet-forgive': {
    name: 'Sweet Hugs 🥺',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: 'text-purple-600',
    tag: 'Warm Forgiveness'
  },
  'fresh-start': {
    name: 'Sunrise Renewal 🌤️',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    accent: 'text-amber-600',
    tag: 'Fresh Beginnings'
  }
};

/**
 * Format timestamp into detailed readable date-time (e.g. "Oct 29, 2026, 6:30 PM")
 */
export function formatDateTime(dateString) {
  if (!dateString) return 'Recently';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return dateString;
  }
}

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

  // Support canonical /s/:slug URL
  const shareUrl = `${window.location.origin}/s/${encodeURIComponent(site.slug)}`;
  const viewCount = Number(site.viewCount) || 0;
  const hasBeenOpened = viewCount > 0;

  const letterObj = typeof site.letter === 'object' && site.letter !== null ? site.letter : null;
  const letterText = letterObj ? (letterObj.content || letterObj.message || '') : (typeof site.letter === 'string' ? site.letter : '');
  const letterTitle = letterObj?.title;
  const letterSignOff = letterObj?.signOff;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (onToast) {
      onToast({ type: 'success', message: 'Surprise link copied to clipboard!' });
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedCreatedDate = site.createdAt
    ? formatDateTime(site.createdAt)
    : 'Unknown Date';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50/80 via-white to-rose-50/30">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tpl.color}`}>
                {tpl.name}
              </span>
              {site.occasion && (
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {site.occasion}
                </span>
              )}
              {hasBeenOpened ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Opened ({viewCount} {viewCount === 1 ? 'view' : 'views'})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Not Opened Yet</span>
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
              {site.title || `Surprise for ${site.recipientName || 'Friend'}`}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Slug: <code className="text-rose-600 font-mono font-medium">/{site.slug}</code> • Created {formattedCreatedDate}
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Requirement 1: Prominent Seen Status Banner at Top */}
          {hasBeenOpened ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200/80 flex items-center justify-center shrink-0 text-emerald-700 text-lg">
                🟢
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-emerald-950">
                    Recipient Opened This Surprise!
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800">
                    Viewed {viewCount} {viewCount === 1 ? 'time' : 'times'}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  Last viewed: {formatDateTime(site.lastViewedAt)}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200/80 flex items-center justify-center shrink-0 text-amber-700 text-lg">
                ⏳
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-amber-950">
                  Not Opened Yet — Recipient has not opened this surprise link yet.
                </h4>
                <p className="text-xs text-amber-700 font-medium mt-0.5">
                  (0 views recorded)
                </p>
              </div>
            </div>
          )}

          {/* Requirement 2: Two Distinct, Side-by-Side Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Birthday Person / Recipient */}
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-rose-50/80 to-pink-50/40 border border-rose-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                  <span className="text-sm">🎂</span>
                  <span>Birthday Person / Recipient</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200 shadow-2xs">
                  {site.occasion || 'Birthday'}
                </span>
              </div>
              <p className="text-lg font-extrabold text-slate-800 truncate" title={site.recipientName || 'Not specified'}>
                {site.recipientName || 'Not specified'}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-rose-600/90 font-semibold">
                  Role: Celebration Star / Recipient
                </span>
              </div>
            </div>

            {/* Card 2: Created By (Sender) */}
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/30 border border-indigo-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  <span className="text-sm">✍️</span>
                  <span>Created By (Sender)</span>
                </div>
                {site.relationship && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
                    {site.relationship}
                  </span>
                )}
              </div>
              <p className="text-lg font-extrabold text-slate-800 truncate" title={site.senderName || 'Anonymous'}>
                {site.senderName || 'Anonymous'}
              </p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-indigo-600/90 font-semibold">
                  Role: Surprise Creator / Sender
                </span>
                {site.senderNickname && (
                  <span className="text-xs text-slate-500 font-medium">
                    • Nickname: "{site.senderNickname}"
                  </span>
                )}
              </div>
            </div>
          </div>

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

          {/* Heartfelt Letter Content */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-rose-50/30 border border-amber-100/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{letterTitle || 'Secret Letter & Message'}</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {letterText ? `${letterText.length} characters` : 'Empty'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/90 border border-amber-100/50 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium italic selection:bg-rose-100">
              {letterText || 'No letter text recorded.'}
            </div>
            {letterSignOff && (
              <div className="mt-3 text-right text-xs font-semibold text-slate-500 italic whitespace-pre-wrap">
                {letterSignOff}
              </div>
            )}
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
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete this surprise site for "${site.recipientName || site.slug}"?`)) {
                onDelete(site.id || site.slug);
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
