import React from 'react';
import AppleEmoji from '../common/AppleEmoji';

export default function StepDetails({ formData, onChange, onFocusField }) {
  const isBoy = formData.gender === 'boy';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-100 pb-2.5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>1. Names & Greeting</span>
          <AppleEmoji emoji={isBoy ? '👑' : '🌸'} size={18} />
        </h2>
      </div>

      <div className="space-y-4">
        {/* Row 1: Recipient & Sender Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recipient Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>Birthday Person’s Name</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.recipientName || ''}
              onFocus={() => onFocusField?.('recipientName')}
              onChange={(e) => onChange({ recipientName: e.target.value })}
              placeholder={isBoy ? 'Rohan' : 'Sarah'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
          </div>

          {/* Sender Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>Your Name (Sender)</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.senderName || ''}
              onFocus={() => onFocusField?.('senderName')}
              onChange={(e) => onChange({ senderName: e.target.value })}
              placeholder={isBoy ? 'Alex' : 'Elena'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Row 2: Celebration Headline & Opening Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Celebration Greeting / Wish */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>Celebration Greeting / Wish (Optional)</span>
              <AppleEmoji emoji="🎉" size={13} />
            </label>
            <input
              type="text"
              value={formData.occasion || ''}
              onFocus={() => onFocusField?.('occasion')}
              onChange={(e) => onChange({ occasion: e.target.value })}
              placeholder="e.g. Happy Birthday or Happy 21st Birthday"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">Wish text only (the name will be styled beautifully on line 2)</p>
          </div>

          {/* Subtitle / Opening Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>Opening Surprise Note (Optional)</span>
              <AppleEmoji emoji="💭" size={13} />
            </label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onFocus={() => onFocusField?.('subtitle')}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="e.g. I have a small surprise for you... 🎁"
              maxLength={140}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
