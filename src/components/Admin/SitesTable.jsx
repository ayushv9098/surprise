import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Maximize2,
  Calendar,
  Sparkles,
  Inbox,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye
} from 'lucide-react';

export const BADGE_STYLES = {
  // Birthday Templates (Boy)
  'royal-sapphire': {
    label: 'Royal Sapphire 👑',
    classes: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'golden-birthday': {
    label: 'Golden Spark 🎂✨',
    classes: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  'polaroid-scrapbook': {
    label: 'Retro Polaroid 📸⚡',
    classes: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  'midnight-onyx': {
    label: 'Midnight Onyx 🖤👑',
    classes: 'bg-stone-900 text-stone-100 border-stone-800'
  },

  // Birthday Templates (Girl)
  'blush-rose': {
    label: 'Blush Blossom 🌸',
    classes: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  'blush-romance': {
    label: 'Blush Romance 🌸',
    classes: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  'princess-peach': {
    label: 'Princess Peach ✨',
    classes: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  'lavender-dream': {
    label: 'Lavender Dream 💜',
    classes: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  'cinderella-sky': {
    label: 'Cinderella Sky 🩵✨',
    classes: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  'emerald-luxe': {
    label: 'Emerald Luxe 🌿',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },

  // Romance & Anniversary Templates
  'velvet-romance': {
    label: 'Velvet Rose ❤️',
    classes: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  'sunset-romance': {
    label: 'Sunset Glow 🌅',
    classes: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  'celestial-love': {
    label: 'Celestial Indigo 🌌',
    classes: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  'amethyst-romance': {
    label: 'Amethyst Dream 💜✨',
    classes: 'bg-purple-50 text-purple-700 border-purple-200'
  },

  // Memory Scrapbook Templates
  'vintage-kodak': {
    label: 'Vintage Kodak 📸',
    classes: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  'neon-nostalgia': {
    label: 'Electric Vibes ⚡',
    classes: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  'cozy-memories': {
    label: 'Cozy Sunset ☕',
    classes: 'bg-orange-50 text-orange-800 border-orange-200'
  },

  // Heartfelt Apology Templates
  'gentle-peace': {
    label: 'Olive Peace 🕊️',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'heartfelt-apology': {
    label: 'Heartfelt Hug 🥺',
    classes: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  'sweet-forgive': {
    label: 'Sweet Hugs 🥺',
    classes: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  'fresh-start': {
    label: 'Sunrise Renewal 🌤️',
    classes: 'bg-amber-50 text-amber-800 border-amber-200'
  },

  // Backward compatibility aliases
  'royal': { label: 'Royal Sapphire 👑', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  'gold': { label: 'Golden Spark 🎂✨', classes: 'bg-amber-50 text-amber-800 border-amber-200' },
  'polaroid': { label: 'Retro Polaroid 📸', classes: 'bg-rose-50 text-rose-700 border-rose-200' },
  'midnight': { label: 'Midnight Onyx 🖤👑', classes: 'bg-stone-900 text-stone-100 border-stone-800' },
  'onyx': { label: 'Midnight Onyx 🖤👑', classes: 'bg-stone-900 text-stone-100 border-stone-800' },
  'blush': { label: 'Blush Blossom 🌸', classes: 'bg-rose-50 text-rose-700 border-rose-200' },
  'peach': { label: 'Princess Peach ✨', classes: 'bg-orange-50 text-orange-700 border-orange-200' },
  'lavender': { label: 'Lavender Dream 💜', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  'cinderella': { label: 'Cinderella Sky 🩵', classes: 'bg-sky-50 text-sky-700 border-sky-200' },
  'sky': { label: 'Cinderella Sky 🩵', classes: 'bg-sky-50 text-sky-700 border-sky-200' },
  'velvet': { label: 'Velvet Rose ❤️', classes: 'bg-rose-50 text-rose-700 border-rose-200' },
  'sunset': { label: 'Sunset Glow 🌅', classes: 'bg-amber-50 text-amber-800 border-amber-200' },
  'celestial': { label: 'Celestial Indigo 🌌', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'amethyst': { label: 'Amethyst Dream 💜', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  'vintage': { label: 'Vintage Kodak 📸', classes: 'bg-amber-50 text-amber-800 border-amber-200' },
  'neon': { label: 'Electric Vibes ⚡', classes: 'bg-teal-50 text-teal-700 border-teal-200' },
  'cozy': { label: 'Cozy Sunset ☕', classes: 'bg-orange-50 text-orange-800 border-orange-200' },
  'peace': { label: 'Olive Peace 🕊️', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'forgive': { label: 'Sweet Hugs 🥺', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  'sunrise': { label: 'Sunrise Renewal 🌤️', classes: 'bg-amber-50 text-amber-800 border-amber-200' }
};

/**
 * Format timestamp into clean relative time (e.g. "Just now", "5m ago", "2h ago", "Oct 28")
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = Date.now();
    const diffMs = now - date.getTime();
    if (diffMs < 0 || isNaN(diffMs)) return 'Just now';
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Get occasion badge & emoji based on occasion or template type
 */
export const getOccasionInfo = (site) => {
  const rawOccasion = (site.occasion || '').trim();
  const text = ((site.occasion || '') + ' ' + (site.template || site.templateId || '')).toLowerCase();

  if (
    text.includes('anniversary') ||
    text.includes('love') ||
    text.includes('romance') ||
    text.includes('velvet') ||
    text.includes('celestial') ||
    text.includes('amethyst')
  ) {
    return {
      emoji: '💖',
      badge: rawOccasion || 'Partner / Love 💖',
      badgeClasses: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  }
  if (
    text.includes('sorry') ||
    text.includes('apolog') ||
    text.includes('forgive') ||
    text.includes('peace')
  ) {
    return {
      emoji: '🥺',
      badge: rawOccasion || 'Heartfelt Apology 🥺',
      badgeClasses: 'bg-purple-50 text-purple-700 border-purple-200'
    };
  }
  if (
    text.includes('kodak') ||
    text.includes('scrapbook') ||
    text.includes('memories') ||
    text.includes('neon') ||
    text.includes('cozy') ||
    text.includes('vintage')
  ) {
    return {
      emoji: '📸',
      badge: rawOccasion || 'Scrapbook / Memory 📸',
      badgeClasses: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  }
  if (text.includes('birthday') || !rawOccasion || rawOccasion.toLowerCase() === 'birthday') {
    return {
      emoji: '🎂',
      badge: 'Birthday Star 🎂',
      badgeClasses: 'bg-pink-50 text-pink-700 border-pink-200'
    };
  }
  return {
    emoji: '🎁',
    badge: `${rawOccasion} 🎁`,
    badgeClasses: 'bg-sky-50 text-sky-700 border-sky-200'
  };
};

export default function SitesTable({
  sites = [],
  loading = false,
  totalSites = 0,
  searchQuery = '',
  selectedTemplate = 'all',
  statusFilter = 'all',
  onInspect,
  onDelete,
  onToast,
  onCreateNew
}) {
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset to first page when sites list length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sites.length]);

  const totalPages = Math.max(1, Math.ceil(sites.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sites.length);
  const paginatedSites = sites.slice(startIndex, endIndex);

  // Canonical share links support both /s/:slug and /?v=:slug
  const handleCopy = (slug) => {
    const url = `${window.location.origin}/s/${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    if (onToast) {
      onToast({ type: 'success', message: `Copied link for /s/${slug}` });
    }
    setTimeout(() => {
      setCopiedSlug(null);
    }, 2000);
  };

  const getTemplateBadge = (templateId) => {
    const info = BADGE_STYLES[templateId] || {
      label: templateId || 'Default',
      classes: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${info.classes}`}
      >
        {info.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-3xl border border-stone-200/80 p-12 text-center shadow-xs">
        <div className="inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Loading keepsake data...</p>
      </div>
    );
  }

  if (sites.length === 0) {
    const isFiltered = Boolean(
      searchQuery.trim() ||
      (selectedTemplate && selectedTemplate !== 'all') ||
      (statusFilter && statusFilter !== 'all')
    );

    return (
      <div className="w-full bg-white rounded-3xl border border-stone-200/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
          <Inbox className="w-7 h-7" />
        </div>
        
        {isFiltered ? (
          <>
            <h3 className="text-base font-bold text-slate-800 mb-1">No Matching Keepsakes</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              No keepsake matched your search or status filter. Try adjusting your search query or filter tabs.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-base font-bold text-slate-800 mb-1">0 Active Keepsakes</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              Clean database ready. Waiting for real user creations — all dummy data has been wiped. Newly created keepsakes will appear here automatically.
            </p>
          </>
        )}

        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-all cursor-pointer"
          >
            <span>Create First Keepsake</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[980px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {/* Column 1: Birthday Person / Recipient */}
              <th className="py-3.5 px-5">Birthday Person / Recipient</th>
              {/* Column 2: Created By (Sender) */}
              <th className="py-3.5 px-4">Created By (Sender)</th>
              {/* Column 3: Seen Status (Open Karke Dekhi?) */}
              <th className="py-3.5 px-4">Seen Status (Open Karke Dekhi?)</th>
              {/* Column 4: Template */}
              <th className="py-3.5 px-4">Template</th>
              {/* Column 5: Created Date */}
              <th className="py-3.5 px-4">Created Date</th>
              {/* Column 6: Actions */}
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedSites.map((site) => {
              const templateKey = site.template || site.templateId || 'blush-romance';
              const isCopied = copiedSlug === site.slug;
              // Canonical URL support for /s/${slug} and /?v=${slug}
              const directViewUrl = `${window.location.origin}/s/${encodeURIComponent(site.slug)}`;
              const viewCount = Number(site.viewCount) || 0;
              const hasBeenOpened = viewCount > 0;
              const occasionInfo = getOccasionInfo(site);

              return (
                <tr
                  key={site.id || site.slug}
                  className="hover:bg-rose-50/20 transition-colors group"
                >
                  {/* Column 1: Birthday Person / Recipient */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="text-base select-none leading-none" role="img" aria-label="occasion emoji">
                        {occasionInfo.emoji}
                      </span>
                      <span className="font-bold text-slate-900 text-sm truncate max-w-[170px]" title={site.recipientName || 'Recipient'}>
                        {site.recipientName || 'Anonymous Recipient'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${occasionInfo.badgeClasses}`}>
                        {occasionInfo.badge}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-xs text-slate-600 truncate max-w-[200px]" title={site.title}>
                        {site.title || `Surprise for ${site.recipientName || 'Friend'}`}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        /{site.slug}
                      </span>
                      {site.scratchSecret && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                          Secret
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Created By (Sender) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm select-none leading-none">✍️</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm truncate max-w-[140px]" title={site.senderName || 'Anonymous'}>
                        {site.senderName || 'Anonymous'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
                        Sender / Creator
                      </span>
                      {site.relationship && (
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]" title={site.relationship}>
                          ({site.relationship})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Column 3: Seen Status (Open Karke Dekhi?) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {hasBeenOpened ? (
                      <div className="flex flex-col items-start">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Opened / Seen</span>
                        </span>
                        <span className="text-[10px] text-emerald-700/80 font-semibold mt-1">
                          {viewCount} {viewCount === 1 ? 'view' : 'views'} • {formatRelativeTime(site.lastViewedAt)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Not Opened Yet</span>
                        </span>
                        <span className="text-[10px] text-amber-700/80 font-medium mt-1">
                          0 views • Waiting for recipient
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Column 4: Template */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getTemplateBadge(templateKey)}
                  </td>

                  {/* Column 5: Created Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(site.createdAt)}</span>
                    </div>
                  </td>

                  {/* Column 6: Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {/* Direct View */}
                      <a
                        href={directViewUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open live website in new tab"
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Copy Share Link */}
                      <button
                        onClick={() => handleCopy(site.slug)}
                        title="Copy share link"
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Inspect Modal */}
                      <button
                        onClick={() => onInspect(site)}
                        title="Inspect full details"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete surprise for "${site.recipientName || site.slug}" permanently?`
                            )
                          ) {
                            onDelete(site.id || site.slug);
                          }
                        }}
                        title="Delete site"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count Summary & Pagination Controls */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span>
            Showing {sites.length === 0 ? 0 : startIndex + 1}–{endIndex} of {sites.length} surprise {sites.length === 1 ? 'website' : 'websites'}
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dearly Cloud Data</span>
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 text-slate-600 font-semibold text-xs">
              Page {safePage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
