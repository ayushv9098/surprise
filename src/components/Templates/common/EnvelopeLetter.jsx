import React, { useState } from 'react';
import { Mail, Heart } from 'lucide-react';
import { soundEffects } from './SoundEffects';
import { renderAppleText } from '../../common/AppleEmoji';

export default function EnvelopeLetter({
  to = "My Sweetest",
  from = "Yours Always",
  date = "Today & Always",
  letterBody = "You are the sweetest part of my everyday life. Thank you for filling my world with so much warmth, laughter, and comfort. Every moment with you is a memory I treasure deeply.",
  sealType = "rose", // 'rose', 'gold', 'lavender'
  fontFamily = "handwriting", // 'handwriting' or 'serif'
  initials = "W",
  subtitle = "A personal letter sealed just for you"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpening(true);
    soundEffects.playSealBreak();

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 450);
  };

  const handleCloseEnvelope = (e) => {
    e.stopPropagation();
    soundEffects.playPop();
    setIsOpen(false);
  };

  // Seal styling map
  const sealClasses = {
    rose: 'wax-seal border-2 border-rose-300/40 text-rose-100',
    gold: 'wax-seal-gold border-2 border-amber-200/50 text-amber-100',
    lavender: 'wax-seal-lavender border-2 border-purple-200/50 text-purple-100',
  }[sealType] || 'wax-seal border-2 border-rose-300/40 text-rose-100';

  const fontClass = fontFamily === 'handwriting' 
    ? 'font-handwriting text-2xl sm:text-3xl leading-relaxed text-slate-800' 
    : 'font-semibold text-lg sm:text-xl leading-relaxed text-slate-800 italic';

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      {/* Outer Card Container */}
      <div className="relative flex flex-col items-center">
        
        {/* Envelope Closed State */}
        {!isOpen ? (
          <div 
            onClick={handleOpenEnvelope}
            className={`group relative w-full max-w-lg cursor-pointer select-none transition-all duration-500 transform hover:-translate-y-1.5 ${
              isOpening ? 'scale-95 opacity-80' : ''
            }`}
          >
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-200/40 via-amber-100/40 to-pink-200/40 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Envelope Base Body */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] p-7 sm:p-9 shadow-xl border border-amber-200/60 overflow-hidden">
              
              {/* Envelope flap folded look */}
              <div 
                className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#F2E5D5] to-[#EADBCA] shadow-sm border-b border-amber-300/40"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                }}
              />

              {/* Envelope side folds effect */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-stone-400 via-transparent to-stone-400"
                style={{
                  clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
                }}
              />

              {/* Envelope Content Preview */}
              <div className="relative pt-20 sm:pt-24 pb-4 flex flex-col items-center text-center">
                <span className="text-xs font-medium text-amber-800/60 mb-1">
                  Sealed for you
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                  For: {to}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {subtitle}
                </p>

                {/* Wax Seal Stamp (The Click Target) */}
                <div className="relative mt-5 mb-2 flex items-center justify-center">
                  <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105 shadow-md ${sealClasses}`}>
                    <Heart className="w-5 h-5 fill-current opacity-90" />
                    <span className="text-[10px] font-bold mt-0.5 opacity-90 flex items-center justify-center">
                      {renderAppleText(initials, 14)}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-white/90 border border-amber-200/60 text-xs font-medium text-amber-900 shadow-xs">
                  <span>Tap seal to open</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Envelope Opened & Letter Parchment Unfolded */
          <div className="relative w-full transition-all duration-700 ease-out transform animate-in fade-in zoom-in-95">
            {/* Letter Parchment Paper */}
            <div className="relative paper-parchment rounded-2xl p-6 sm:p-10 sm:py-12 shadow-lg border border-amber-200/80 overflow-hidden">
              
              {/* Vintage postage stamp / decorative corner */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-end">
                <div className="w-12 h-14 sm:w-14 sm:h-16 rounded border border-dashed border-amber-700/40 p-1 flex flex-col items-center justify-center text-amber-800/80 rotate-2 bg-amber-50/60">
                  <Heart className="w-4 h-4 fill-amber-700/50 text-amber-700" />
                  <span className="text-[8px] font-bold mt-0.5">AIR MAIL</span>
                  <span className="text-[8px]">{date}</span>
                </div>
              </div>

              {/* Letter Header */}
              <div className="mb-6 border-b border-amber-900/10 pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Dearest {renderAppleText(to)},
                </h3>
              </div>

              {/* Letter Body (Handwritten or Serif) */}
              <div className={`${fontClass} whitespace-pre-line my-6 text-slate-800/90 font-normal`}>
                {renderAppleText(letterBody)}
              </div>

              {/* Letter Sign-off */}
              <div className="mt-8 pt-6 border-t border-amber-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-amber-800/60 font-medium">With all my love,</p>
                  <p className="font-handwriting text-3xl font-bold text-rose-600 mt-0.5">
                    {from}
                  </p>
                </div>

                {/* Re-fold Button */}
                <button
                  onClick={handleCloseEnvelope}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-amber-200/80 shadow-xs transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fold back into envelope</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
