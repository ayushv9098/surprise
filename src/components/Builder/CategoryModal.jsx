import React, { useEffect } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import AppleEmoji from '../common/AppleEmoji';
import { CATEGORIES } from '../../data/categories';

export default function CategoryModal({
  isOpen,
  categories = CATEGORIES,
  onSelectCategory,
  onComingSoon,
  onClose,
}) {
  // Close on Escape key and manage body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCardClick = (cat) => {
    if (cat.comingSoon) {
      onComingSoon?.(cat);
      return;
    }
    onSelectCategory?.(cat);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Category Pill / Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] sm:text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Choose an Occasion</span>
        </div>

        {/* Modal Header */}
        <h3
          id="category-modal-title"
          className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight"
        >
          What are you celebrating?
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-relaxed">
          Pick an occasion to get started.
        </p>

        {/* 2x2 Categories Grid (Compact & Fits on Mobile with ZERO Scroll) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 mt-3.5 sm:mt-5">
          {categories.map((cat) => {
            const isComingSoon = Boolean(cat.comingSoon);
            const isRomance = cat.id === 'romance';

            // Simple, normal, clear subtitles
            const simpleDesc =
              cat.id === 'birthday'
                ? 'Wishes, cake & celebrations'
                : cat.id === 'romance'
                ? 'Romantic letters & keepsakes'
                : cat.id === 'scrapbook'
                ? 'Photos & favorite memories'
                : cat.id === 'apology'
                ? 'Sweet apologies & peace notes'
                : cat.description;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCardClick(cat)}
                className={`group relative p-2.5 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer min-h-[118px] sm:min-h-[134px] ${
                  isComingSoon
                    ? 'border-gray-200/80 bg-gray-50/60 hover:bg-gray-100/70 hover:border-gray-300'
                    : isRomance
                    ? 'border-slate-200 hover:border-pink-400 bg-white hover:bg-gradient-to-br hover:from-pink-50/50 hover:to-rose-50/30 shadow-xs hover:shadow-sm'
                    : 'border-slate-200 hover:border-rose-400 bg-white hover:bg-gradient-to-br hover:from-rose-50/50 hover:to-pink-50/30 shadow-xs hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top row: Emoji & Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                        isComingSoon
                          ? 'bg-gray-100/90 border-gray-200/60'
                          : isRomance
                          ? 'bg-pink-50 border-pink-100 group-hover:scale-105'
                          : 'bg-rose-50 border-rose-100 group-hover:scale-105'
                      }`}
                    >
                      <AppleEmoji emoji={cat.emoji} size={20} />
                    </div>

                    {isComingSoon ? (
                      <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
                        Soon
                      </span>
                    ) : cat.tag ? (
                      <span
                        className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isRomance
                            ? 'bg-pink-50 text-pink-600 border-pink-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}
                      >
                        {cat.tag}
                      </span>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h4
                    className={`font-bold text-xs sm:text-sm leading-snug transition-colors line-clamp-1 ${
                      isComingSoon
                        ? 'text-gray-700'
                        : isRomance
                        ? 'text-gray-900 group-hover:text-pink-600'
                        : 'text-gray-900 group-hover:text-rose-600'
                    }`}
                  >
                    {cat.name}
                  </h4>

                  {/* Normal Short Subtitle */}
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 leading-tight line-clamp-1">
                    {simpleDesc}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold">
                  <span
                    className={
                      isComingSoon
                        ? 'text-gray-400'
                        : isRomance
                        ? 'text-pink-600 group-hover:text-pink-700'
                        : 'text-rose-600 group-hover:text-rose-700'
                    }
                  >
                    {isComingSoon ? 'Coming Soon' : 'Select'}
                  </span>
                  {!isComingSoon && (
                    <ArrowRight
                      className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
                        isRomance ? 'text-pink-600' : 'text-rose-600'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
