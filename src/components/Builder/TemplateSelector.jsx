import React from 'react';
import { Check } from 'lucide-react';
import { TEMPLATES, getTemplatesByGender } from '../../data/templates';
import AppleEmoji, { renderAppleText } from '../common/AppleEmoji';

export default function TemplateSelector({
  selectedId,
  selectedGender = 'boy',
  onSelectGender,
  onSelectTemplate,
}) {
  const matchingTemplates = getTemplatesByGender(selectedGender);

  const handleGenderToggle = (newGender) => {
    if (onSelectGender) {
      onSelectGender(newGender);
    }
    // If current template doesn't belong to the newly selected gender, select the top match
    const currentTmpl = TEMPLATES.find((t) => t.id === selectedId);
    if (!currentTmpl || currentTmpl.gender !== newGender) {
      const topMatch = newGender === 'girl' ? 'blush-rose' : 'royal-sapphire';
      if (onSelectTemplate) {
        onSelectTemplate(topMatch);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1) ULTRA-CLEAN MINIMAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Choose a Style
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pick the aesthetic for your surprise website
          </p>
        </div>

        {/* Subtle, small text pill: For a Boy 👑 • Switch to Girl 🌸 (or vice versa) */}
        <button
          type="button"
          onClick={() => handleGenderToggle(selectedGender === 'boy' ? 'girl' : 'boy')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-xs text-slate-700 transition-all cursor-pointer shadow-xs hover:border-slate-300 group select-none self-start sm:self-auto"
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
      </div>

      {/* 2) REDESIGNED RECOMMENDED STYLE CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {matchingTemplates.map((tmpl) => {
          const isSelected = selectedId === tmpl.id;
          const cleanTitle = tmpl.name.replace(/\p{Extended_Pictographic}/gu, '').trim();

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate && onSelectTemplate(tmpl.id)}
              className={`group relative rounded-2xl sm:rounded-3xl cursor-pointer transition-all duration-300 flex flex-col overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-rose-500 border border-rose-500/50 shadow-lg shadow-rose-500/10 bg-gradient-to-b from-rose-50/20 to-white'
                  : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {/* Image Container */}
              <div className="p-2 sm:p-3.5 pb-0">
                <div className={`relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-gradient-to-br ${tmpl.gradientBg || 'from-slate-100 to-slate-200'}`}>
                  <img
                    src={tmpl.previewImage}
                    alt={cleanTitle}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                    loading="lazy"
                    draggable={false}
                  />

                  {/* Floating Glassmorphism Top Badge */}
                  {tmpl.tag && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md text-[9px] sm:text-[11px] font-semibold text-slate-800 shadow-sm border border-slate-200/80 flex items-center gap-1 sm:gap-1.5 select-none max-w-[calc(100%-2.25rem)]">
                      <span className="shrink-0 flex items-center">
                        <AppleEmoji emoji={tmpl.emoji} size={11} />
                      </span>
                      <span className="truncate">{tmpl.tag}</span>
                    </div>
                  )}

                  {/* Floating Selected Glowing Checkmark */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-rose-500 text-white rounded-full p-1 sm:p-1.5 shadow-md shadow-rose-500/30 flex items-center justify-center animate-scaleIn">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="font-bold text-xs sm:text-base text-slate-900 flex items-center gap-1.5 sm:gap-2 leading-tight">
                    <AppleEmoji emoji={tmpl.emoji} size={14} />
                    <span className="truncate">{cleanTitle}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-snug sm:leading-relaxed mt-1 line-clamp-2 min-h-[28px]">
                    {renderAppleText(tmpl.description, 11)}
                  </p>

                  {/* Features List / Pills (hidden on mobile for 100% height symmetry) */}
                  {tmpl.features && tmpl.features.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1.5 mt-3.5">
                      {tmpl.features.slice(0, 2).map((feat, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2.5 py-1 rounded-full truncate max-w-full"
                        >
                          {renderAppleText(feat, 11)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Row */}
                <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-slate-100 flex items-center justify-between h-7 sm:h-9">
                  {isSelected ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-rose-600">
                      <span>Selected</span>
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold text-slate-400 group-hover:text-slate-800 transition-colors">
                      <span>Select</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </div>
                  )}

                  {isSelected && (
                    <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
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
