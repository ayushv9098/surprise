import React from 'react';
import { Check } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { TEMPLATES, getTemplatesByCategory } from '../../data/templates';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';

export default function TemplateSelector({
  selectedId,
  selectedCategory = 'birthday',
  selectedGender = 'boy',
  onSelectCategory: _onSelectCategory,
  onSelectGender,
  onSelectTemplate,
}) {
  // Fetch templates for selected category
  const categoryTemplates = typeof getTemplatesByCategory === 'function'
    ? getTemplatesByCategory(selectedCategory)
    : TEMPLATES.filter((t) => t.category === selectedCategory);

  // If birthday, filter by gender; for other categories, render their dedicated Top 3 Pro Templates
  const matchingTemplates = selectedCategory === 'birthday'
    ? categoryTemplates.filter((tmpl) => tmpl.gender === selectedGender)
    : categoryTemplates;

  // Resolve current active category details
  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || {
    id: selectedCategory,
    name:
      selectedCategory === 'birthday'
        ? 'Birthday'
        : selectedCategory === 'romance'
        ? 'Special Someone & Connection'
        : selectedCategory === 'scrapbook'
        ? 'Scrapbook'
        : selectedCategory === 'apology'
        ? 'Heartfelt Apology'
        : 'Surprise',
    emoji:
      selectedCategory === 'birthday'
        ? '🎂'
        : selectedCategory === 'romance'
        ? '🌸'
        : selectedCategory === 'scrapbook'
        ? '📸'
        : selectedCategory === 'apology'
        ? '🥺'
        : '✨',
  };

  const handleGenderToggle = (newGender) => {
    if (onSelectGender) {
      onSelectGender(newGender);
    }
    const birthdayTmpls = typeof getTemplatesByCategory === 'function'
      ? getTemplatesByCategory('birthday')
      : TEMPLATES.filter((t) => t.category === 'birthday');
    const genderTmpls = birthdayTmpls.filter((t) => t.gender === newGender);
    const topMatch = genderTmpls[0]?.id || (newGender === 'girl' ? 'blush-rose' : 'royal-sapphire');
    if (onSelectTemplate) {
      onSelectTemplate(topMatch);
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* 1) HEADER & OCCASION BADGE (Category chosen from Home page) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2.5 sm:pb-3 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 mb-1.5 shadow-2xs select-none">
            <AppleEmoji emoji={currentCategoryObj.emoji} size={13} />
            <span>{currentCategoryObj.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
            Choose a Style
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pick the aesthetic for your {currentCategoryObj.name.toLowerCase()} surprise website
          </p>
        </div>

        {/* Small, sleek pill toggle for Birthday */}
        {selectedCategory === 'birthday' && (
          <button
            type="button"
            onClick={() => handleGenderToggle(selectedGender === 'boy' ? 'girl' : 'boy')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-xs text-slate-700 transition-all cursor-pointer shadow-xs hover:border-slate-300 group select-none self-start sm:self-auto"
            title={selectedGender === 'boy' ? 'Switch to Girl styles' : 'Switch to Boy styles'}
          >
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              {selectedGender === 'boy' ? (
                <>
                  <span>For a Boy</span>
                  <AppleEmoji emoji="👑" size={14} />
                </>
              ) : (
                <>
                  <span>For a Girl</span>
                  <AppleEmoji emoji="🌸" size={14} />
                </>
              )}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600 font-semibold group-hover:text-rose-700 group-hover:underline flex items-center gap-1">
              {selectedGender === 'boy' ? (
                <>
                  <span>Switch to Girl</span>
                  <AppleEmoji emoji="🌸" size={14} />
                </>
              ) : (
                <>
                  <span>Switch to Boy</span>
                  <AppleEmoji emoji="👑" size={14} />
                </>
              )}
            </span>
          </button>
        )}
      </div>

      {/* 2) RECOMMENDED PRO STYLE CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        {matchingTemplates.map((tmpl) => {
          const isSelected = selectedId === tmpl.id;
          const cleanTitle = (tmpl.name || '').replace(/\p{Extended_Pictographic}/gu, '').trim();

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate && onSelectTemplate(tmpl.id)}
              className={`group relative rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 flex flex-col overflow-hidden active:scale-[0.98] ${
                isSelected
                  ? 'ring-2 ring-rose-500 border border-rose-500/50 shadow-md shadow-rose-500/10 bg-gradient-to-b from-rose-50/20 to-white'
                  : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {/* Image Container - clean preview without overlay badge clashing with SVG typography */}
              <div className="p-2 sm:p-2.5 pb-0">
                <div
                  className={`relative aspect-[4/3] w-full rounded-lg sm:rounded-xl overflow-hidden border border-slate-200/80 shadow-2xs bg-gradient-to-br ${
                    tmpl.gradientBg || 'from-slate-100 to-slate-200'
                  }`}
                >
                  <img
                    src={tmpl.previewImage}
                    alt={cleanTitle}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                    loading="lazy"
                    draggable={false}
                  />

                  {/* Floating Selected Glowing Checkmark */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-rose-500 text-white rounded-full p-1 sm:p-1.5 shadow-md shadow-rose-500/30 flex items-center justify-center animate-scaleIn">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5 leading-tight">
                    <AppleEmoji emoji={tmpl.emoji} size={14} />
                    <span className="truncate">{cleanTitle}</span>
                  </h3>

                  {/* Description / Headline */}
                  <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug mt-1 line-clamp-2 min-h-[26px]">
                    {renderAppleText(tmpl.description || tmpl.headline || '', 11)}
                  </p>

                  {/* Feature Highlight Pill - cleanly proportioned to prevent clipping or multi-row distortion */}
                  {tmpl.features && tmpl.features.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
                      <span
                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full truncate max-w-full border border-slate-200/60"
                        title={tmpl.features[0]}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span className="truncate">{renderAppleText(tmpl.features[0], 10)}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Row */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                  {isSelected ? (
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-rose-600">
                      <span>Selected</span>
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-slate-400 group-hover:text-slate-800 transition-colors">
                      <span>Select</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </div>
                  )}

                  {isSelected && (
                    <span className="inline-block text-[9px] uppercase font-bold tracking-wider text-rose-500 bg-rose-50 border border-rose-200/60 px-1.5 py-0.5 rounded-md">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
