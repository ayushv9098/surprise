import React from 'react';
import { User, Heart, Sparkles, Tag, PenLine, Lightbulb } from 'lucide-react';

const POPULAR_OCCASIONS = [
  'Happy Birthday 🎂',
  'Anniversary 🌸',
  'Valentine’s Day 💖',
  'I am Sorry 🥺',
  'Just Because ✨',
  'Best Friends Forever 📸',
  'Proposal / Date Night 💍',
  'Long Distance Hug 💌',
];

const SUGGESTED_SUBTITLES = [
  '730 days of falling in love with your smile, over and over again.',
  'May this special year bring you boundless joy, laughter, and golden memories!',
  'To the one who makes ordinary moments feel like poetry.',
  'You mean the world to me — here is a little token of how much I care.',
];

export default function StepDetails({ formData, onChange }) {
  const handleOccasionClick = (occasion) => {
    onChange({ occasion });
  };

  const handleSuggestionClick = (subtitle) => {
    onChange({ subtitle });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-rose-100/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: The Heart & Soul</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-800">
          Who is this special surprise for?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Personalize the names and occasion. This will appear boldly on their personalized surprise cover.
        </p>
      </div>

      <div className="space-y-5">
        {/* Recipient & Sender Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recipient Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recipient’s Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                <Heart className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.recipientName || ''}
                onChange={(e) => onChange({ recipientName: e.target.value })}
                placeholder="e.g. Aditi, Rahul, Kavya"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-200/80 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              The star of this surprise. Their name will headline the page.
            </p>
          </div>

          {/* Sender Name / Signature */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Your Name or Nickname <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.senderName || ''}
                onChange={(e) => onChange({ senderName: e.target.value })}
                placeholder="e.g. Rahul, Your Bestie, Arjun"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              How they know you (or signed as a secret admirer!).
            </p>
          </div>
        </div>

        {/* Occasion Heading with Quick Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Occasion or Title
            </label>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-rose-400" /> Click a quick chip below
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.occasion || ''}
              onChange={(e) => onChange({ occasion: e.target.value })}
              placeholder="e.g. Happy 2nd Anniversary My Love! 🌸"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all shadow-2xs"
            />
          </div>

          {/* Occasion Quick Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {POPULAR_OCCASIONS.map((occ, idx) => {
              const isSelected = formData.occasion === occ;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleOccasionClick(occ)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-xs scale-105'
                      : 'bg-rose-50/70 hover:bg-rose-100 text-slate-700 border border-rose-200/50'
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sweet Subtitle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sweet Subtitle / Tagline
            </label>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <PenLine className="w-3 h-3 text-slate-400" /> Max 140 chars
            </span>
          </div>

          <textarea
            rows={2}
            value={formData.subtitle || ''}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="A short, tender sentence that greets them as soon as they open the link..."
            maxLength={180}
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all shadow-2xs resize-none"
          />

          {/* Subtitle Suggestions */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Need inspiration? Click to use one:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_SUBTITLES.map((text, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSuggestionClick(text)}
                  className="text-left p-2 rounded-lg text-xs text-slate-600 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/40 transition-colors line-clamp-2"
                >
                  "{text}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
