import React from 'react';
import { TEMPLATES } from '../../data/templates';

export default function TemplateSelector({ selectedId, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {TEMPLATES.map((tmpl) => {
        const isSelected = selectedId === tmpl.id;
        return (
          <div
            key={tmpl.id}
            onClick={() => onSelect(tmpl.id)}
            className={`group rounded-2xl overflow-hidden bg-white cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'ring-2 ring-rose-500 shadow-md'
                : 'border border-gray-100 shadow-sm hover:shadow-md'
            }`}
          >
            {/* Image Preview */}
            <div className="relative h-40 w-full overflow-hidden bg-gray-50">
              <img
                src={tmpl.previewImage}
                alt={tmpl.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Name + Emoji */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">
                {tmpl.emoji} {tmpl.name}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
