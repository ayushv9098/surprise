import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Eye,
  Trash2,
  Maximize2,
  Calendar,
  Sparkles,
  Inbox,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const BADGE_STYLES = {
  'royal-sapphire': {
    label: 'Royal Sapphire 👑',
    classes: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  'blush-rose': {
    label: 'Blush Rose 🌸',
    classes: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  'blush-romance': {
    label: 'Blush Romance 🌸',
    classes: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  'golden-birthday': {
    label: 'Golden Birthday 🎂',
    classes: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  'polaroid-scrapbook': {
    label: 'Polaroid Scrapbook 📸',
    classes: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  },
  'lavender-dream': {
    label: 'Lavender Dream 💜',
    classes: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  'heartfelt-apology': {
    label: 'Heartfelt Hug 🥺',
    classes: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  'princess-peach': {
    label: 'Princess Peach ✨',
    classes: 'bg-orange-50 text-orange-700 border-orange-200'
  }
};

export default function SitesTable({
  sites = [],
  loading = false,
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

  const handleCopy = (slug) => {
    const url = `${window.location.origin}/?v=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    if (onToast) {
      onToast({ type: 'success', message: `Copied link for /?v=${slug}` });
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
      <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">Loading surprise sites...</p>
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No Surprise Websites Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
          No websites match your current search query or filter. Try clearing filters or create a new surprise!
        </p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-rose-500 text-white shadow-md shadow-rose-200 hover:bg-rose-600 transition-all cursor-pointer"
          >
            <span>Create New Surprise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">Surprise / Title</th>
              <th className="py-3.5 px-4">Recipient</th>
              <th className="py-3.5 px-4">Template</th>
              <th className="py-3.5 px-4 text-center">Live Views</th>
              <th className="py-3.5 px-4">Created Date</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedSites.map((site) => {
              const templateKey = site.template || site.templateId || 'blush-romance';
              const isCopied = copiedSlug === site.slug;
              const directViewUrl = `${window.location.origin}/?v=${encodeURIComponent(site.slug)}`;

              return (
                <tr
                  key={site.id || site.slug}
                  className="hover:bg-rose-50/20 transition-colors group"
                >
                  {/* Title & Slug */}
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {site.title || `Surprise for ${site.recipientName || 'Friend'}`}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[11px] text-slate-400">
                        /{site.slug}
                      </span>
                      {site.scratchSecret && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 font-medium">
                          Secret Reveal
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Recipient & Sender */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-800">
                      {site.recipientName || 'Anonymous'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      From: {site.senderName || 'Anonymous'}
                    </div>
                  </td>

                  {/* Template Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getTemplateBadge(templateKey)}
                  </td>

                  {/* Views Count Pill */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 group-hover:bg-rose-100/70 group-hover:text-rose-800 transition-colors">
                      <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600" />
                      <span>{site.viewCount || 0}</span>
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(site.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
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
            <span>WishCraft Cloud Data</span>
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
