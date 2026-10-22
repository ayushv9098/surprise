import React from 'react';
import AppleEmoji from '../common/AppleEmoji';

const WAX_SEALS = [
  { emoji: '👑', color: '#1D4ED8', label: 'Royal Sapphire' },
  { emoji: '🌸', color: '#E11D48', label: 'Blush Blossom' },
  { emoji: '⭐', color: '#D97706', label: 'Golden Spark' },
  { emoji: '⚡', color: '#78350F', label: 'Retro Polaroid' },
  { emoji: '✨', color: '#EA580C', label: 'Princess Peach' },
  { emoji: '💜', color: '#7C3AED', label: 'Lavender Dream' },
];

export default function StepSurprises({ formData, onChange, onFocusField }) {
  const isBoy = formData.gender === 'boy';

  // Default 3 reasons
  const specialReasons = formData.specialReasons && formData.specialReasons.length === 3
    ? formData.specialReasons
    : isBoy
    ? [
        { icon: '💪', title: 'Lucky to Have You', desc: 'So grateful to have a brother like you in my corner every day!' },
        { icon: '⭐', title: 'Always There', desc: 'Always standing by my side with endless laughs and genuine support!' },
        { icon: '👑', title: 'Irreplaceable', desc: 'No one can ever match your incredible spirit and heart. A true champion!' },
      ]
    : [
        { icon: '🌸', title: 'Pure Sunshine', desc: 'The effortless way you turn every ordinary moment into joy!' },
        { icon: '✨', title: 'Gentle Soul', desc: 'The quiet kindness and sparkling positivity you share with everyone!' },
        { icon: '💖', title: 'Irreplaceable Friend', desc: 'A truly irreplaceable friend whose presence makes everything brighter!' },
      ];

  const letter = {
    title: formData.letter?.title !== undefined ? formData.letter.title : 'A Little Note For You',
    content: formData.letter?.content !== undefined
      ? formData.letter.content
      : (formData.letter && typeof formData.letter === 'string' ? formData.letter : (
        isBoy
          ? `Happy Birthday Rohan!\n\nYou bring so much energy, strength, and genuine happiness into the lives of everyone around you. Thank you for being someone I can always look up to and trust unconditionally.\n\nMay this year bring you all the grand achievements, good health, and joyful moments you deserve. Keep shining like a king! 👑✨`
          : `My dearest Sarah,\n\nFrom the moment you entered my life, ordinary days became unforgettable adventures. Your kindness fills every room, and your laugh is honestly my favorite sound.\n\nThank you for holding my hand when things get chaotic and for always knowing how to make me smile with just one look. Happy Birthday my sweet friend — here is to a million more sunsets together. 🌸✨`
      )),
    signOff: formData.letter?.signOff !== undefined
      ? formData.letter.signOff
      : (isBoy
        ? `With all my love & respect,\n${formData.senderName || 'Alex'} 👑`
        : `Forever & always,\n${formData.senderName || 'Elena'} 🌸`),
    sealEmoji: formData.letter?.sealEmoji || (isBoy ? '👑' : '🌸'),
    waxColor: formData.letter?.waxColor || (isBoy ? '#1D4ED8' : '#E11D48'),
  };

  const updateReason = (index, field, value) => {
    onFocusField?.('reasons');
    const updated = specialReasons.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    onChange({ specialReasons: updated });
  };

  const updateLetter = (patch) => {
    onFocusField?.('letter');
    onChange({ letter: { ...letter, ...patch } });
  };

  const selectedSeal = WAX_SEALS.find((s) => s.emoji === letter.sealEmoji) || WAX_SEALS[0];

  return (
    <div className="space-y-7">
      {/* 1) "WHY YOU'RE SPECIAL" 3 CARDS */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>1. Three "Why You're Special" Reasons</span>
            <AppleEmoji emoji="💫" size={16} />
          </h2>
        </div>

        <div className="space-y-3">
          {specialReasons.map((card, idx) => {
            const basePalette = isBoy
              ? ['💪', '⭐', '👑', '⚡', '🔥']
              : ['🌸', '✨', '💖', '⭐', '🧸'];
            const palette = basePalette.includes(card.icon)
              ? basePalette
              : [card.icon, ...basePalette.slice(0, 4)];

            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
              >
                {/* Row 1 (Icon selector) */}
                <div className="flex items-center justify-between gap-2 pb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">Icon:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {palette.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          onFocusField?.('reasons');
                          updateReason(idx, 'icon', em);
                        }}
                        title={`Use ${em}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          card.icon === em
                            ? 'bg-rose-100 ring-2 ring-rose-400 scale-105 shadow-2xs'
                            : 'bg-white hover:bg-slate-100 border border-slate-200/70'
                        }`}
                      >
                        <AppleEmoji emoji={em} size={14} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2 (Reason Title Input) */}
                <input
                  type="text"
                  value={card.title || ''}
                  onFocus={() => onFocusField?.('reasons')}
                  onChange={(e) => updateReason(idx, 'title', e.target.value)}
                  placeholder="Reason Title (e.g. Lucky to Have You)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />

                {/* Row 3 (Description Textarea) */}
                <textarea
                  rows={2}
                  value={card.desc || ''}
                  onFocus={() => onFocusField?.('reasons')}
                  onChange={(e) => updateReason(idx, 'desc', e.target.value)}
                  placeholder="e.g. Always bringing energy and joy..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2) SECRET ENVELOPE LETTER */}
      <div className="space-y-4 pt-5 border-t border-slate-100">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>2. Secret Envelope Letter</span>
            <AppleEmoji emoji="💌" size={16} />
          </h2>
        </div>

        <div className="space-y-4">
          {/* Wax Seal Stamp Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-semibold text-slate-700">
                Wax Seal Stamp Style
              </label>
              {selectedSeal && (
                <span className="text-[11px] sm:text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <span>{selectedSeal.label}</span>
                  <AppleEmoji emoji={selectedSeal.emoji} size={12} />
                </span>
              )}
            </div>
            <div className="grid grid-cols-6 gap-2 sm:gap-3 max-w-sm">
              {WAX_SEALS.map((seal, sIdx) => {
                const isSelected = letter.sealEmoji === seal.emoji;
                return (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => {
                      onFocusField?.('waxSeal');
                      updateLetter({ sealEmoji: seal.emoji, waxColor: seal.color });
                    }}
                    title={seal.label}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? 'ring-3 ring-rose-500 scale-105 shadow-md'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: seal.color }}
                  >
                    <AppleEmoji emoji={seal.emoji} size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Message Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Heartfelt Letter Message</span>
                <AppleEmoji emoji="💌" size={14} />
              </label>
              <span className="text-[10px] sm:text-[11px] font-medium text-rose-600 bg-rose-50/90 px-2 py-0.5 rounded-full border border-rose-200/60 shrink-0">
                Revealed on seal break
              </span>
            </div>
            <textarea
              rows={6}
              value={letter.content || ''}
              onFocus={() => onFocusField?.('letterContent')}
              onChange={(e) => updateLetter({ content: e.target.value })}
              placeholder="Write your heartfelt note here... Pour your feelings, inside jokes, or sweet memories."
              className="w-full min-h-[145px] sm:min-h-[160px] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all resize-none shadow-2xs"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
              <span>Pour memories, sweet wishes & feelings</span>
              <span className="font-mono text-[10px] text-slate-400">{letter.content?.length || 0} chars</span>
            </div>
          </div>

          {/* Sign-Off Signature */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span>Letter Sign-Off Signature</span>
              <AppleEmoji emoji="✍️" size={13} />
            </label>
            <input
              type="text"
              value={letter.signOff || ''}
              onFocus={() => onFocusField?.('letterSignOff')}
              onChange={(e) => updateLetter({ signOff: e.target.value })}
              placeholder={isBoy ? `With all my love & respect, ${formData.senderName || 'Alex'} 👑` : `Forever & always, ${formData.senderName || 'Elena'} 🌸`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-sans shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
