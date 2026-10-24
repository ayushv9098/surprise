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
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-7 transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Category Pill / Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-2 sm:mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Choose an Occasion</span>
        </div>

        {/* Modal Header */}
        <h3
          id="category-modal-title"
          className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight"
        >
          What are you celebrating?
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
          Pick an occasion to customize your personalized keepsake surprises.
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-5">
          {categories.map((cat) => {
            const isComingSoon = Boolean(cat.comingSoon);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCardClick(cat)}
                className={`group relative p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between ${
                  isComingSoon
                    ? 'border-gray-200/70 bg-gray-50/70 cursor-pointer hover:border-gray-300'
                    : 'border-slate-200/90 hover:border-rose-400 bg-white hover:bg-gradient-to-br hover:from-rose-50/50 hover:to-pink-50/30 cursor-pointer shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top row: Emoji & Tag / Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs border ${
                        isComingSoon
                          ? 'bg-gray-100 border-gray-200/60'
                          : 'bg-rose-50/70 border-rose-100 group-hover:scale-105 group-hover:bg-rose-100/70 transition-all duration-200'
                      }`}
                    >
                      <AppleEmoji emoji={cat.emoji} size={24} />
                    </div>

                    {isComingSoon ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        <span>Coming Soon 🚀</span>
                      </span>
                    ) : cat.tag ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        <span>{cat.tag}</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Title */}
                  <h4
                    className={`font-bold text-sm sm:text-base leading-snug transition-colors ${
                      isComingSoon
                        ? 'text-gray-700'
                        : 'text-gray-900 group-hover:text-rose-600'
                    }`}
                  >
                    {cat.name}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                  <span
                    className={
                      isComingSoon
                        ? 'text-gray-400'
                        : 'text-rose-600 group-hover:text-rose-700'
                    }
                  >
                    {isComingSoon ? 'Coming Soon' : 'Select'}
                  </span>
                  {!isComingSoon && (
                    <ArrowRight className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-1 transition-transform" />
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
