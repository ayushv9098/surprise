import React, { useState } from 'react';
import {
  Music,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { getTemplateById } from '../../data/templates';
import { getSongById } from '../../data/songs';

export default function LivePhonePreview({ formData }) {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [isScratchRevealed, setIsScratchRevealed] = useState(false);
  const [isGiftUnboxed, setIsGiftUnboxed] = useState(false);
  const [runawayOffset, setRunawayOffset] = useState({ x: 0, y: 0 });
  const [forgiveCount, setForgiveCount] = useState(0);

  const template = getTemplateById(formData.templateId || 'blush-romance');
  const song = getSongById(formData.songId || template.recommendedSongId);

  const recipientName = formData.recipientName || 'Aditi';
  const senderName = formData.senderName || 'Rahul';
  const occasion = formData.occasion || template.defaultOccasion;
  const subtitle = formData.subtitle || template.headline;
  const photos = formData.photos && formData.photos.length > 0 ? formData.photos : [];
  const letter = formData.letter || {};
  const quiz = formData.quiz || {};
  const scratchCard = formData.scratchCard || {};

  const handleRunawayHover = () => {
    // Generate playful offset for "No" button
    const randomX = (Math.random() - 0.5) * 120;
    const randomY = (Math.random() - 0.5) * 80;
    setRunawayOffset({ x: randomX, y: randomY });
  };

  const handleResetInteractive = () => {
    setIsLetterOpen(false);
    setSelectedQuizOption(null);
    setIsScratchRevealed(false);
    setIsGiftUnboxed(false);
    setRunawayOffset({ x: 0, y: 0 });
    setForgiveCount(0);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Top Controls Bar for Live Preview */}
      <div className="w-full flex items-center justify-between pb-3 px-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60 shadow-2xs">
          <Eye className="w-3.5 h-3.5" />
          <span>Real-time Recipient View</span>
        </span>
        <button
          type="button"
          onClick={handleResetInteractive}
          title="Reset interactions to initial state"
          className="flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer text-[11px]"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset screen</span>
        </button>
      </div>

      {/* Realistic iPhone Bezel */}
      <div className="relative w-[310px] sm:w-[340px] h-[670px] bg-slate-900 rounded-[50px] p-3 shadow-2xl ring-1 ring-slate-800/80 shadow-rose-950/15">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Volume & Power buttons styling on frame */}
        <div className="absolute -left-1 top-24 w-1 h-10 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-1 top-38 w-1 h-10 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-1 top-28 w-1 h-14 bg-slate-700 rounded-r-md" />

        {/* Phone Screen Canvas */}
        <div className="relative w-full h-full bg-gradient-to-b from-rose-50/70 via-pink-50/40 to-white rounded-[38px] overflow-hidden flex flex-col border border-white/40">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 select-none z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-5 h-2.5 rounded-xs border border-slate-700 p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-800 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Scrollable Recipient Experience */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 scroll-smooth custom-scrollbar">
            {/* Music Floating Pill */}
            {song.title && song.id !== 'silent-mode' && (
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-rose-200/70 shadow-xs text-[10px] text-slate-700 font-medium">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <Music className="w-3 h-3 text-rose-500" />
                  <span className="truncate max-w-[130px]">{song.title}</span>
                  <span className="text-rose-400">♫</span>
                </div>
              </div>
            )}

            {/* Hero Cover Card */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 shadow-2xs border border-rose-100 text-[11px] font-bold text-rose-600">
                <span>{template.emoji}</span>
                <span>{occasion}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                For {recipientName}
              </h1>

              <p className="text-xs text-slate-600 font-sans leading-relaxed px-2 italic">
                "{subtitle}"
              </p>

              <div className="text-[10px] uppercase font-bold tracking-widest text-rose-400">
                Crafted with love by {senderName}
              </div>
            </div>

            {/* GOLDEN BIRTHDAY SPECIAL: UNBOXABLE GIFT */}
            {template.id === 'golden-birthday' && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center space-y-3">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Tap to Unbox Your Birthday Surprise
                </h4>
                <div
                  onClick={() => setIsGiftUnboxed(!isGiftUnboxed)}
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-3xl shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                >
                  {isGiftUnboxed ? '🎉' : '🎁'}
                </div>
                {isGiftUnboxed && (
                  <div className="p-2.5 rounded-xl bg-white shadow-xs border border-amber-200 text-xs text-amber-900 font-medium animate-scaleIn">
                    🎈 "Happy Birthday {recipientName}! Wishing you the sweetest celebrations!" 🍰✨
                  </div>
                )}
              </div>
            )}

            {/* HEARTFELT APOLOGY SPECIAL: RUNAWAY FORGIVE ME BUTTON */}
            {template.id === 'heartfelt-apology' && (
              <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-200/80 text-center space-y-3">
                <h4 className="text-xs font-bold text-violet-800 uppercase tracking-wider">
                  Will You Forgive Me, {recipientName}? 🥺
                </h4>
                <div className="flex items-center justify-center gap-3 relative py-2">
                  <button
                    type="button"
                    onClick={() => setForgiveCount((c) => c + 1)}
                    className="px-4 py-1.5 rounded-full bg-violet-600 text-white font-bold text-xs shadow-md hover:bg-violet-700 active:scale-95 cursor-pointer"
                  >
                    YES, Forgiven! 🫂
                  </button>
                  <button
                    type="button"
                    onMouseEnter={handleRunawayHover}
                    onClick={handleRunawayHover}
                    style={{
                      transform: `translate(${runawayOffset.x}px, ${runawayOffset.y}px)`,
                      transition: 'transform 0.15s ease-out',
                    }}
                    className="px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer select-none"
                  >
                    No 😤
                  </button>
                </div>
                {forgiveCount > 0 && (
                  <p className="text-[11px] text-violet-700 font-semibold animate-scaleIn">
                    Yay! Warmest bear hug incoming from {senderName}! 💜
                  </p>
                )}
              </div>
            )}

            {/* Photo Gallery Stream */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Our Memories
                  </span>
                  <span className="text-[10px] text-slate-400">{photos.length} photos</span>
                </div>

                <div className="space-y-3">
                  {photos.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className={
                        template.id === 'polaroid-scrapbook'
                          ? 'polaroid-frame bg-white'
                          : 'p-2 rounded-2xl bg-white border border-rose-100 shadow-xs'
                      }
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={p.url}
                          alt={p.caption || 'Memory'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="pt-2 px-1">
                        {p.tag && (
                          <span className="inline-block px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[9px] font-bold uppercase tracking-wider mb-1">
                            {p.tag}
                          </span>
                        )}
                        {p.caption && (
                          <p
                            className={`text-xs text-slate-700 leading-snug ${
                              template.id === 'polaroid-scrapbook'
                                ? 'font-handwriting text-sm font-semibold'
                                : ''
                            }`}
                          >
                            {p.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WAX SEALED SECRET LETTER */}
            {letter.content && (
              <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs text-center space-y-3">
                <span className="inline-block text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                  Secret Letter
                </span>
                <h4 className="font-serif font-bold text-sm text-slate-800">
                  {letter.title || 'A note sealed for you'}
                </h4>

                {!isLetterOpen ? (
                  <div
                    onClick={() => setIsLetterOpen(true)}
                    className="p-4 rounded-xl bg-gradient-to-b from-rose-50 to-pink-50/50 border border-dashed border-rose-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-rose-100/50 transition-colors group"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg shadow-md group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: letter.waxColor || '#E11D48' }}
                    >
                      {letter.sealEmoji || '💌'}
                    </div>
                    <span className="text-[11px] font-bold text-rose-600 tracking-wide">
                      Tap Wax Seal to Break & Read
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 text-left space-y-2 animate-scaleIn">
                    <p className="text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-line">
                      {letter.content}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsLetterOpen(false)}
                      className="text-[10px] text-rose-600 font-bold hover:underline block pt-1"
                    >
                      Reseal letter ↩
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CUTE LOVE QUIZ */}
            {quiz.enabled && quiz.question && (
              <div className="p-4 rounded-2xl bg-white border border-pink-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 text-pink-600 font-bold text-xs uppercase tracking-wide">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>The Love Quiz</span>
                </div>

                <p className="font-serif font-bold text-xs sm:text-sm text-slate-800">
                  {quiz.question}
                </p>

                <div className="space-y-1.5">
                  {quiz.options?.map((opt, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isWinning = quiz.correctIndex === idx;

                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedQuizOption(idx)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? isWinning
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-rose-400 bg-rose-50 text-rose-900'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedQuizOption !== null && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 text-xs space-y-1 animate-scaleIn">
                    <div className="font-bold text-pink-700 flex items-center gap-1">
                      <span>✨</span>
                      <span>{quiz.rewardTitle || 'Reward Unlocked!'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {quiz.rewardMessage}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MYSTERY SCRATCH CARD */}
            {scratchCard.enabled && scratchCard.hiddenSecret && (
              <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs text-center space-y-2">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-xs uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{scratchCard.title || 'Mystery Scratch Card'}</span>
                </div>

                {!isScratchRevealed ? (
                  <div
                    onClick={() => setIsScratchRevealed(true)}
                    className="p-5 rounded-xl bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 border border-amber-300 text-amber-900 font-bold text-xs cursor-pointer hover:brightness-105 active:scale-95 transition-all shadow-inner select-none flex flex-col items-center gap-1.5"
                  >
                    <span>✨ TAP OR RUB TO SCRATCH ✨</span>
                    <span className="text-[10px] font-normal text-amber-800">
                      (Secret promise hidden below)
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold leading-relaxed animate-scaleIn">
                    "{scratchCard.hiddenSecret}"
                  </div>
                )}
              </div>
            )}

            {/* Footer Watermark in phone */}
            <div className="pt-4 pb-6 text-center space-y-1">
              <span className="text-[10px] font-serif font-bold text-rose-500">
                WishCraft ✨ Keepsake
              </span>
              <p className="text-[9px] text-slate-400">
                Created with love in 2 mins
              </p>
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-6 flex items-center justify-center z-20">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
