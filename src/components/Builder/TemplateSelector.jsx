import React from 'react';
import { Check, Sparkles, Wand2 } from 'lucide-react';
import { TEMPLATES } from '../../data/templates';

export default function TemplateSelector({ selectedId, onSelect, onApplyPreset }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-800">
            Choose Your Surprise Aesthetic
          </h2>
          <p className="text-sm text-slate-500">
            Select a handcrafted theme designed to give butterflies.
          </p>
        </div>
        {onApplyPreset && (
          <button
            type="button"
            onClick={onApplyPreset}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100/80 border border-rose-200 transition-all cursor-pointer shadow-2xs"
          >
            <Wand2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Load Aesthetic Demo Data</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelect(tmpl.id)}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer text-left ${
                isSelected
                  ? 'border-rose-500 bg-white shadow-lg shadow-rose-500/10 scale-[1.01]'
                  : 'border-slate-200/80 bg-white/70 hover:border-rose-300 hover:shadow-md hover:bg-white'
              }`}
            >
              {/* Image Preview Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={tmpl.previewImage}
                  alt={tmpl.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent`} />

                {/* Badge Top Left */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  {tmpl.badges?.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md text-slate-800 shadow-xs border border-white/60"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Selected Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-scaleIn">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Tag & Emoji on Image bottom */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold tracking-wide drop-shadow-md">
                    {tmpl.tag}
                  </span>
                  <span className="text-xl filter drop-shadow">{tmpl.emoji}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-800 group-hover:text-rose-600 transition-colors">
                    {tmpl.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tmpl.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                        isSelected
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/70 font-semibold'
                          : 'bg-slate-100/80 text-slate-600 border border-slate-200/50'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
