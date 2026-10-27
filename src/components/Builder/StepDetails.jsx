import React from 'react';
import AppleEmoji from '../common/AppleEmoji';

export default function StepDetails({ formData, onChange, onFocusField }) {
  const isBoy = formData.gender === 'boy';

  const isRomance = formData.category === 'romance' || ['velvet-romance', 'sunset-romance', 'celestial-love', 'blush-romance'].includes(formData.templateId);
  const isScrapbook = formData.category === 'scrapbook' || ['vintage-kodak', 'neon-nostalgia', 'cozy-memories'].includes(formData.templateId);
  const isApology = formData.category === 'apology' || ['gentle-peace', 'sweet-forgive', 'fresh-start'].includes(formData.templateId);
  const _isBirthday = !isRomance && !isScrapbook && !isApology;

  const headerTitle = isRomance
    ? '1. Names & Romantic Greeting'
    : isScrapbook
    ? '1. Names & Keepsake Title'
    : isApology
    ? '1. Names & Message'
    : '1. Names & Greeting';

  const headerEmoji = isRomance
    ? '❤️'
    : isScrapbook
    ? '📸'
    : isApology
    ? '🕊️'
    : (isBoy ? '👑' : '🌸');

  const recipientLabel = isRomance
    ? 'Partner / Special Person’s Name'
    : isScrapbook
    ? 'Recipient / Friend’s Name'
    : isApology
    ? 'Recipient’s Name'
    : 'Birthday Person’s Name';

  const recipientPlaceholder = isRomance
    ? 'e.g. Maya'
    : isScrapbook
    ? 'e.g. Alex'
    : isApology
    ? 'e.g. Maya'
    : (isBoy ? 'Rohan' : 'Sarah');

  const senderPlaceholder = isRomance
    ? 'e.g. Liam'
    : (isBoy ? 'Alex' : 'Elena');

  const occasionLabel = isRomance
    ? 'Occasion / Romantic Heading (Optional)'
    : isScrapbook
    ? 'Memory Album Title (Optional)'
    : isApology
    ? 'Heartfelt Headline (Optional)'
    : 'Celebration Greeting / Wish (Optional)';

  const occasionEmoji = isRomance
    ? '🌹'
    : isScrapbook
    ? '⚡'
    : isApology
    ? '🥺'
    : '🎉';

  const occasionPlaceholder = isRomance
    ? "e.g. Happy Anniversary, My Love! or Happy Valentine's Day"
    : isScrapbook
    ? 'e.g. The Scrapbook of Us • Vol. 1'
    : isApology
    ? 'e.g. I Am Really Sorry...'
    : 'e.g. Happy Birthday or Happy Birthday mere bhai';

  const occasionHelper = isRomance
    ? 'Heading text only (name will be styled beautifully on line 2)'
    : isScrapbook
    ? 'Heading text only (name will be styled beautifully on line 2)'
    : isApology
    ? 'Heading text only (name will be styled beautifully on line 2)'
    : 'Custom greeting (e.g. "Happy Birthday mere bhai" - recipient name will be styled on line 2)';

  const subtitleLabel = isRomance
    ? 'Romantic Subtitle / Opening Note (Optional)'
    : isScrapbook
    ? 'Opening Note (Optional)'
    : isApology
    ? 'Opening Note (Optional)'
    : 'Opening Surprise Note (Optional)';

  const subtitleEmoji = '💭';

  const subtitlePlaceholder = isRomance
    ? 'e.g. A little corner made just to bring a smile to your face ✨'
    : isScrapbook
    ? "e.g. Look at all the crazy memories we've made so far! 📸"
    : isApology
    ? 'e.g. Please give me 2 minutes to make it up to you... 🕊️'
    : 'e.g. I have a small surprise for you... 🎁';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-slate-100 pb-2.5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>{headerTitle}</span>
          <AppleEmoji emoji={headerEmoji} size={18} />
        </h2>
      </div>

      <div className="space-y-4">
        {/* Row 1: Recipient & Sender Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recipient Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>{recipientLabel}</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.recipientName || ''}
              onFocus={() => onFocusField?.('recipientName')}
              onChange={(e) => onChange({ recipientName: e.target.value })}
              placeholder={recipientPlaceholder}
              maxLength={25}
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
              placeholder={senderPlaceholder}
              maxLength={25}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Row 2: Celebration Headline & Opening Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Celebration Greeting / Wish */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>{occasionLabel}</span>
                <AppleEmoji emoji={occasionEmoji} size={13} />
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {(formData.occasion || '').length}/35
              </span>
            </div>
            <input
              type="text"
              value={formData.occasion || ''}
              onFocus={() => onFocusField?.('occasion')}
              onChange={(e) => onChange({ occasion: e.target.value })}
              placeholder={occasionPlaceholder}
              maxLength={35}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">{occasionHelper}</p>
          </div>

          {/* Subtitle / Opening Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>{subtitleLabel}</span>
              <AppleEmoji emoji={subtitleEmoji} size={13} />
            </label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onFocus={() => onFocusField?.('subtitle')}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder={subtitlePlaceholder}
              maxLength={140}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
