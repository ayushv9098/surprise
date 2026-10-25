import React, { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import AppleEmoji from '../common/AppleEmoji';

export default function RecipientModal({
  isOpen,
  category,
  onSelect,
  onClose,
  onBack,
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

  if (!isOpen || !category) return null;

  const isRomance = category.id === 'romance';

  const handleChoose = (gender) => {
    let defaultTemplateId;
    if (isRomance) {
      defaultTemplateId = gender === 'boy' ? 'velvet-romance' : 'sunset-romance';
    } else if (category.defaultTemplates?.[gender]) {
      defaultTemplateId = category.defaultTemplates[gender];
    } else {
      defaultTemplateId = gender === 'boy' ? 'royal-sapphire' : 'blush-rose';
    }
    onSelect?.(gender, defaultTemplateId);
  };

  const girlTitle = isRomance ? 'For Her' : 'For a Girl';
  const girlDesc = isRomance
    ? 'Soft roses, warm starlight & romantic letters'
    : 'Blush rose, sparkles & chimes';
  const girlAction = isRomance ? 'Select for her' : 'Select girl style';

  const boyTitle = isRomance ? 'For Him' : 'For a Boy';
  const boyDesc = isRomance
    ? 'Velvet crimson, timeless memories & promises'
    : 'Royal sapphire & golden spark';
  const boyAction = isRomance ? 'Select for him' : 'Select boy style';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipient-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-7 transform transition-all animate-in fade-in zoom-in-95 duration-200"
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

        {/* Occasion Category Pill */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100/90 text-gray-700 text-xs font-medium">
            <AppleEmoji emoji={category.emoji} size={15} />
            <span>{category.name}</span>
          </div>
        </div>

        {/* Modal Header */}
        <h3
          id="recipient-modal-title"
          className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight"
        >
          {isRomance ? 'Who is this love surprise for?' : 'Who are you celebrating?'}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
          {isRomance
            ? 'Choose who this love surprise is crafted for to personalize romantic music, letters, and keepsake scenes.'
            : 'Choose who this surprise is crafted for to personalize music, colors, and keepsake scenes.'}
        </p>

        {/* Two Large Toggle Selection Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mt-4 sm:mt-6">
          {/* For a Girl / Her Card */}
          <button
            type="button"
            onClick={() => handleChoose('girl')}
            className="group relative p-3 sm:p-5 rounded-2xl border-2 border-slate-200/90 hover:border-rose-400 bg-white hover:bg-gradient-to-br hover:from-rose-50/70 hover:to-pink-50/40 text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-rose-100/80 border border-rose-200/60 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                <AppleEmoji emoji="🌸" size={22} />
              </div>

              <div className="font-bold text-xs sm:text-base text-gray-900 group-hover:text-rose-600 flex items-center gap-1 transition-colors leading-tight">
                <span>{girlTitle}</span>
                <AppleEmoji emoji="🌸" size={13} />
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                {girlDesc}
              </p>
            </div>

            <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] sm:text-xs font-bold">
              <span className="text-rose-600">
                <span className="sm:hidden">Select</span>
                <span className="hidden sm:inline">{girlAction}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* For a Boy / Him Card */}
          <button
            type="button"
            onClick={() => handleChoose('boy')}
            className="group relative p-3 sm:p-5 rounded-2xl border-2 border-slate-200/90 hover:border-blue-500 bg-white hover:bg-gradient-to-br hover:from-blue-50/70 hover:to-indigo-50/40 text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-blue-100/80 border border-blue-200/60 flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                <AppleEmoji emoji="👑" size={22} />
              </div>

              <div className="font-bold text-xs sm:text-base text-gray-900 group-hover:text-blue-600 flex items-center gap-1 transition-colors leading-tight">
                <span>{boyTitle}</span>
                <AppleEmoji emoji="👑" size={13} />
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                {boyDesc}
              </p>
            </div>

            <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] sm:text-xs font-bold">
              <span className="text-blue-600">
                <span className="sm:hidden">Select</span>
                <span className="hidden sm:inline">{boyAction}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
