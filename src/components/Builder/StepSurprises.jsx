import React from 'react';
import AppleEmoji from '../common/AppleEmoji';

const WAX_SEALS = [
  { emoji: '❤️', color: '#E11D48', label: 'Velvet Rose' },
  { emoji: '👑', color: '#1D4ED8', label: 'Royal Sapphire' },
  { emoji: '🌸', color: '#E11D48', label: 'Blush Blossom' },
  { emoji: '⭐', color: '#D97706', label: 'Golden Spark' },
  { emoji: '🕊️', color: '#15803D', label: 'Gentle Peace' },
  { emoji: '⚡', color: '#78350F', label: 'Retro Polaroid' },
  { emoji: '✨', color: '#EA580C', label: 'Princess Peach' },
  { emoji: '💜', color: '#7C3AED', label: 'Lavender Dream' },
];

export default function StepSurprises({ formData, onChange, onFocusField }) {
  const isBoy = formData.gender === 'boy';

  const occasionCategory = formData.category || 'birthday';
  const isRomance =
    occasionCategory === 'romance' ||
    ['velvet-romance', 'sunset-romance', 'celestial-love', 'blush-romance'].includes(formData.templateId) ||
    Boolean(
      formData.templateId && (
        formData.templateId.includes('romance') ||
        formData.templateId.includes('velvet') ||
        formData.templateId.includes('sunset') ||
        formData.templateId.includes('celestial')
      )
    );

  const isScrapbook = !isRomance && (formData.category === 'scrapbook' || ['vintage-kodak', 'neon-nostalgia', 'cozy-memories'].includes(formData.templateId));
  const isApology = !isRomance && !isScrapbook && (formData.category === 'apology' || ['gentle-peace', 'sweet-forgive', 'fresh-start'].includes(formData.templateId));

  const reasonsHeading = isScrapbook
    ? '1. Three Favorite Memories'
    : isApology
    ? '1. Three Sincere Promises'
    : '1. Three "Why You\'re Special" Reasons';

  const reasonsHeadingEmoji = isScrapbook ? '📸' : isApology ? '🕊️' : '💫';

  // Default 3 reasons adapted to occasion
  const defaultSpecialReasons = isScrapbook
    ? [
        { icon: '📸', title: 'Unfiltered Memories', desc: 'From candid road trips to hilarious mistakes, every memory with you is pure gold.' },
        { icon: '⚡', title: 'Always in Focus', desc: 'No matter how much time passes, our bond picks right back up without missing a beat.' },
        { icon: '✨', title: 'Legendary Tales', desc: 'We have built a lifetime of stories that we will still be laughing about fifty years from now!' },
      ]
    : isApology
    ? [
        { icon: '🕊️', title: 'Honest Heart', desc: 'I acknowledge my mistake completely, without excuses, because you deserve honesty.' },
        { icon: '🤍', title: 'Cherished Bond', desc: 'Our bond is too precious to ever let misunderstanding or ego stand in the way.' },
        { icon: '🌿', title: 'Promise of Care', desc: 'I promise to listen more attentively and protect your peace and trust with all my heart.' },
      ]
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

  const specialReasons = formData.specialReasons && formData.specialReasons.length === 3
    ? formData.specialReasons
    : defaultSpecialReasons;

  const defaultLetterContent = isRomance
    ? `My dearest ${formData.recipientName || 'Love'},\n\nFrom the moment you entered my life, ordinary days became unforgettable adventures. Your smile brightens even my cloudiest days, and your laugh is honestly my favorite sound.\n\nThank you for choosing me, for holding my hand through everything, and for filling my heart with pure romance and peace. Here is to our forever.\n\n— With all my love, always ${formData.senderName || 'Liam'} ❤️`
    : isScrapbook
    ? `Dear ${formData.recipientName || 'Alex'},\n\nFlipping through these snapshots and memories reminds me how lucky I am to have you in my life. Through every wild adventure, late-night conversation, and spontaneous trip, you have been my favorite company.\n\nThank you for all the shared laughs and unforgettable chapters. Here is to making a thousand more memories together!\n\n— Besties forever,\n${formData.senderName || 'Sam'} 📸`
    : isApology
    ? `Dear ${formData.recipientName || 'Maya'},\n\nI want to apologize from the bottom of my heart. I made a mistake, and knowing that I caused you hurt or disappointment weighs heavily on me.\n\nYour happiness and our bond mean far more to me than being right. I truly value everything we have built, and I hope you can find it in your heart to forgive me. Whenever you are ready, I would love to talk and make things right.\n\n— Truly sorry,\n${formData.senderName || 'Liam'} 🕊️`
    : isBoy
    ? `Happy Birthday Rohan!\n\nYou bring so much energy, strength, and genuine happiness into the lives of everyone around you. Thank you for being someone I can always look up to and trust unconditionally.\n\nMay this year bring you all the grand achievements, good health, and joyful moments you deserve. Keep shining like a king! 👑✨`
    : `My dearest Sarah,\n\nFrom the moment you entered my life, ordinary days became unforgettable adventures. Your kindness fills every room, and your laugh is honestly my favorite sound.\n\nThank you for holding my hand when things get chaotic and for always knowing how to make me smile with just one look. Happy Birthday my sweet friend — here is to a million more sunsets together. 🌸✨`;

  const defaultSignOff = isRomance
    ? `Forever yours, ${formData.senderName || 'Liam'} ❤️`
    : isScrapbook
    ? `Besties forever, ${formData.senderName || 'Alex'} 📸`
    : isApology
    ? `With sincere remorse, ${formData.senderName || 'Liam'} 🕊️`
    : isBoy
    ? `With all my love & respect, ${formData.senderName || 'Alex'} 👑`
    : `Forever & always, ${formData.senderName || 'Elena'} 🌸`;

  const defaultSealEmoji = isRomance ? '❤️' : isScrapbook ? '📸' : isApology ? '🕊️' : (isBoy ? '👑' : '🌸');
  const defaultWaxColor = isRomance ? '#E11D48' : isScrapbook ? '#78350F' : isApology ? '#15803D' : (isBoy ? '#1D4ED8' : '#E11D48');

  const rawSignOff = formData.letter?.signOff !== undefined
    ? formData.letter.signOff
    : (formData.letterSignOff || defaultSignOff);

  const cleanSignOff = typeof rawSignOff === 'string'
    ? rawSignOff.replace(/ayushlwayushys|lwayushys/gi, 'always').replace(/ayushyush/gi, 'Ayush').replace(/,\s*\n\s*/g, ', ').replace(/\n+/g, ' ')
    : rawSignOff;

  const rawContent = formData.letter?.content !== undefined
    ? formData.letter.content
    : (formData.letter && typeof formData.letter === 'string' ? formData.letter : (formData.letterBody || defaultLetterContent));

  const cleanContent = typeof rawContent === 'string'
    ? rawContent.replace(/ayushlwayushys|lwayushys/gi, 'always').replace(/ayushyush/gi, 'Ayush')
    : rawContent;

  const letter = {
    title: formData.letter?.title !== undefined
      ? formData.letter.title
      : (formData.letterTitle || (isRomance ? 'To My Favorite Person 🌸' : isScrapbook ? 'A Keepsake Note' : isApology ? 'A Sincere Note' : 'A Little Note For You')),
    content: cleanContent,
    signOff: cleanSignOff,
    sealEmoji: formData.letter?.sealEmoji || defaultSealEmoji,
    waxColor: formData.letter?.waxColor || defaultWaxColor,
  };

  // Dynamic Quiz Values for Romance
  const quizQuestion = formData.quizQuestion ?? formData.quiz?.question ?? 'Do you like spending time with me?';
  const quizYesText = formData.quizYesText ?? formData.quiz?.yesText ?? 'YES, VERY MUCH!';
  const quizTreat = formData.quizTreat ?? formData.quiz?.treat ?? 'Dairy Milk Silk';
  const quizVictoryNote = formData.quizVictoryNote ?? formData.quiz?.victoryNote ?? 'That means one chocolate / sweet treat is officially pending from my side anytime you want! 🍫😋';

  const updateReason = (index, field, value) => {
    onFocusField?.('reasons');
    const updated = specialReasons.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    onChange({ specialReasons: updated });
  };

  const updateLetter = (patch) => {
    onFocusField?.('letter');
    const updated = { ...letter, ...patch };
    onChange({
      letter: updated,
      letterBody: updated.content,
      letterSignOff: updated.signOff,
      letterTitle: updated.title,
    });
  };

  const updateQuizField = (fieldName, value) => {
    onFocusField?.(fieldName);
    const updatedQuiz = {
      question: quizQuestion,
      yesText: quizYesText,
      treat: quizTreat,
      victoryNote: quizVictoryNote,
      ...(formData.quiz || {}),
      [fieldName === 'quizQuestion' ? 'question' : fieldName === 'quizYesText' ? 'yesText' : fieldName === 'quizTreat' ? 'treat' : 'victoryNote']: value,
    };
    onChange({
      [fieldName]: value,
      quiz: updatedQuiz,
    });
  };

  const selectedSeal = WAX_SEALS.find((s) => s.emoji === letter.sealEmoji) || {
    emoji: letter.sealEmoji || defaultSealEmoji,
    color: letter.waxColor || defaultWaxColor,
    label: 'Wax Seal',
  };

  const basePalette = isScrapbook
    ? ['📸', '⚡', '✨', '🌟', '🎞️']
    : isApology
    ? ['🕊️', '🤍', '🌿', '🥺', '💜']
    : isBoy
    ? ['💪', '⭐', '👑', '⚡', '🔥']
    : ['🌸', '✨', '💖', '⭐', '🧸'];

  const reasonTitlePlaceholder = isScrapbook
    ? 'Memory Title (e.g. Unfiltered Memories)'
    : isApology
    ? 'Promise Title (e.g. Honest Heart)'
    : (isBoy ? 'Reason Title (e.g. Lucky to Have You)' : 'Reason Title (e.g. Pure Sunshine)');

  const reasonDescPlaceholder = isScrapbook
    ? 'e.g. From candid road trips to hilarious mistakes...'
    : isApology
    ? 'e.g. I promise to listen more attentively and protect your peace...'
    : (isBoy ? 'e.g. Always standing by my side with endless laughs...' : 'e.g. Always bringing energy and joy...');

  const signOffPlaceholder = isRomance
    ? `Forever yours, ${formData.senderName || 'Liam'} ❤️`
    : isScrapbook
    ? `Besties forever, ${formData.senderName || 'Alex'} 📸`
    : isApology
    ? `With sincere remorse, ${formData.senderName || 'Liam'} 🕊️`
    : (isBoy ? `With all my love & respect, ${formData.senderName || 'Alex'} 👑` : `Forever & always, ${formData.senderName || 'Elena'} 🌸`);

  // =========================================================================
  // ROMANCE VIEW: 1. Secret Envelope Letter + 2. Interactive Quiz & Treat Game
  // =========================================================================
  if (isRomance) {
    return (
      <div className="space-y-7">
        {/* 1. SECRET ENVELOPE LETTER */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <span>1. Secret Envelope Letter</span>
              <AppleEmoji emoji="💌" size={16} />
            </h2>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Wax Sealed Khat 🌸
            </span>
          </div>

          <div className="space-y-4">
            {/* Letter Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Letter Title</span>
                <AppleEmoji emoji="🏷️" size={13} />
              </label>
              <input
                type="text"
                value={letter.title || ''}
                onFocus={() => onFocusField?.('letter')}
                onChange={(e) => updateLetter({ title: e.target.value })}
                placeholder="e.g. To My Favorite Person 🌸 or To My Special Someone 💖"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-sans shadow-2xs"
              />
              <p className="text-[11px] text-slate-400 px-1">
                Headline displayed on top of the opened letter
              </p>
            </div>

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
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 max-w-md">
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
                  <span>Heartfelt Romantic Note</span>
                  <AppleEmoji emoji="💌" size={14} />
                </label>
                <span className="text-[10px] sm:text-[11px] font-medium text-rose-600 bg-rose-50/90 px-2 py-0.5 rounded-full border border-rose-200/60 shrink-0">
                  Revealed on wax break
                </span>
              </div>
              <textarea
                rows={6}
                value={letter.content || ''}
                onFocus={() => onFocusField?.('letterContent')}
                onChange={(e) => updateLetter({ content: e.target.value })}
                placeholder="Write your heartfelt romantic note here... Pour your feelings, inside jokes, or sweet memories."
                className="w-full min-h-[145px] sm:min-h-[160px] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all resize-none shadow-2xs"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
                <span>Pours memories, sweet promises & affection</span>
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
                placeholder={signOffPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-sans shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE QUIZ & TREAT GAME */}
        <div className="space-y-4 pt-5 border-t border-slate-100">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
              <span>2. Interactive Quiz & Treat Game</span>
              <AppleEmoji emoji="🙈" size={16} />
              <AppleEmoji emoji="🍫" size={16} />
            </h2>
            <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Runaway "No" Button
            </span>
          </div>

          <div className="space-y-4">
            {/* Quiz Question */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Quiz Question</span>
                <AppleEmoji emoji="❓" size={13} />
              </label>
              <input
                type="text"
                value={quizQuestion}
                onFocus={() => onFocusField?.('quizQuestion')}
                onChange={(e) => updateQuizField('quizQuestion', e.target.value)}
                placeholder="e.g. Do you like spending time with me? or Will you be my Valentine?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-sans shadow-2xs"
              />
            </div>

            {/* Winning Option ("Yes") Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Winning Option ("Yes") Text</span>
                <AppleEmoji emoji="🥰" size={13} />
              </label>
              <input
                type="text"
                value={quizYesText}
                onFocus={() => onFocusField?.('quizYesText')}
                onChange={(e) => updateQuizField('quizYesText', e.target.value)}
                placeholder="e.g. YES, VERY MUCH! or YES OF COURSE!"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-sans shadow-2xs"
              />
            </div>

            {/* Treat / Voucher Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Treat / Voucher Reward Name</span>
                <AppleEmoji emoji="🍫" size={13} />
              </label>
              <input
                type="text"
                value={quizTreat}
                onFocus={() => onFocusField?.('quizTreat')}
                onChange={(e) => updateQuizField('quizTreat', e.target.value)}
                placeholder="e.g. Dairy Milk Silk, Ice Cream Date, Starbucks Coffee"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-sans shadow-2xs"
              />
            </div>

            {/* Victory Message / Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <span>Victory Message / Note</span>
                <AppleEmoji emoji="🎉" size={13} />
              </label>
              <textarea
                rows={3}
                value={quizVictoryNote}
                onFocus={() => onFocusField?.('quizVictoryNote')}
                onChange={(e) => updateQuizField('quizVictoryNote', e.target.value)}
                placeholder="e.g. That means one chocolate / sweet treat is officially pending from my side anytime you want! 🍫😋"
                className="w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all resize-none shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // DEFAULT / BIRTHDAY / SCRAPBOOK / APOLOGY VIEW
  // =========================================================================
  return (
    <div className="space-y-7">
      {/* 1) OCCASION-SPECIFIC REASONS / MEMORIES / PROMISES CARDS */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>{reasonsHeading}</span>
            <AppleEmoji emoji={reasonsHeadingEmoji} size={16} />
          </h2>
        </div>

        <div className="space-y-3">
          {specialReasons.map((card, idx) => {
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
                  placeholder={reasonTitlePlaceholder}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />

                {/* Row 3 (Description Textarea) */}
                <textarea
                  rows={2}
                  value={card.desc || ''}
                  onFocus={() => onFocusField?.('reasons')}
                  onChange={(e) => updateReason(idx, 'desc', e.target.value)}
                  placeholder={reasonDescPlaceholder}
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
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 max-w-md">
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
              placeholder={signOffPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all font-sans shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
