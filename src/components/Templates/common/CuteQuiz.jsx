import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';
import { soundEffects } from './SoundEffects';
import AppleEmoji, { renderAppleText } from '../../common/AppleEmoji';

export default function CuteQuiz({
  quiz = null,
  theme = "rose", // 'rose', 'gold', 'lavender'
  fallbackQuestion = "What is the single best thing about us?",
  fallbackOptions = [
    "Our uncontrollable midnight laughing fits",
    "How we always find each other's favorite snacks",
    "That we can be 100% our weirdest, truest selves",
    "All of the above, plus a million more reasons ❤️"
  ],
  correctIndex = 3,
  rewardText = "You've unlocked 1x Big Warm Hug + Unlimited sweet treats on demand! 🍫🍦",
  quizTitle = "A Quick Cute Quiz Just for You"
}) {
  const question = quiz?.question || fallbackQuestion;
  const options = quiz?.options || fallbackOptions;
  const targetIndex = quiz?.correctIndex !== undefined 
    ? quiz.correctIndex 
    : (quiz?.correctAnswerIndex !== undefined ? quiz.correctAnswerIndex : correctIndex);
  const reward = quiz?.rewardMessage || quiz?.rewardText || quiz?.rewardTitle || quiz?.successMessage || rewardText;

  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeIdx, setShakeIdx] = useState(null);

  const handleSelectOption = (idx) => {
    setSelectedIdx(idx);

    if (idx === targetIndex) {
      setIsCorrect(true);
      setIsAnswered(true);
      soundEffects.playCelebration();

      // Confetti burst
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#F43F5E', '#FB7185', '#FBBF24', '#F472B6', '#A855F7']
        });
      } catch {}
    } else {
      setIsCorrect(false);
      setShakeIdx(idx);
      soundEffects.playPop();
      setTimeout(() => {
        setShakeIdx(null);
      }, 600);
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsAnswered(false);
    setIsCorrect(false);
    soundEffects.playPop();
  };

  const themeStyles = {
    rose: {
      badge: 'bg-rose-50 border-rose-200/80 text-rose-600',
      activeBorder: 'border-rose-400 bg-rose-50/60 text-rose-900',
      rewardGlow: 'from-rose-400 via-pink-400 to-amber-300',
      btn: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
    },
    gold: {
      badge: 'bg-amber-50 border-amber-200/80 text-amber-700',
      activeBorder: 'border-amber-400 bg-amber-50/60 text-amber-900',
      rewardGlow: 'from-amber-400 via-yellow-300 to-orange-400',
      btn: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    },
    lavender: {
      badge: 'bg-purple-50 border-purple-200/80 text-purple-600',
      activeBorder: 'border-purple-400 bg-purple-50/60 text-purple-900',
      rewardGlow: 'from-purple-400 via-pink-300 to-indigo-400',
      btn: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    },
  }[theme] || {
    badge: 'bg-rose-50 border-rose-200/80 text-rose-600',
    activeBorder: 'border-rose-400 bg-rose-50/60 text-rose-900',
    rewardGlow: 'from-rose-400 via-pink-400 to-amber-300',
    btn: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
  };

  return (
    <div className="w-full max-w-xl mx-auto my-10 px-4">
      {/* Quiz Container Box */}
      <div className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 overflow-hidden">
        
        {/* Decorative corner icon */}
        <div className="text-center mb-6">
          <div className="text-xs font-medium text-rose-600 mb-2 flex items-center justify-center gap-1.5">
            <span>Interactive Quiz</span>
            <AppleEmoji emoji="✨" size={14} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {renderAppleText(quizTitle)}
          </h3>
          <p className="text-sm font-medium text-slate-600 mt-2 max-w-md mx-auto">
            {renderAppleText(question)}
          </p>
        </div>

        {/* Victory Celebration State */}
        {isAnswered && isCorrect ? (
          <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-rose-100 shadow-sm animate-in zoom-in-95 duration-400">
            <div className="text-3xl mb-2 flex items-center justify-center">
              <AppleEmoji emoji="🍫" size={40} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Treat Unlocked</span>
            </div>

            <h4 className="text-lg font-bold text-slate-900 mb-1">
              Correct!
            </h4>

            <p className="font-handwriting text-2xl text-rose-600 max-w-sm mt-2 leading-relaxed">
              "{renderAppleText(reward)}"
            </p>

            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        ) : (
          /* Question Options list */
          <div className="space-y-3">
            {options.map((opt, idx) => {
              const isShaking = shakeIdx === idx;
              const isSelected = selectedIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isShaking
                      ? 'border-rose-400 bg-rose-50/80 text-rose-700 animate-shake'
                      : isSelected && !isCorrect
                      ? 'border-rose-300 bg-rose-50/50 text-slate-700'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white hover:border-rose-300 hover:shadow-md text-slate-700'
                  }`}
                  style={isShaking ? { animation: 'shake 0.4s ease-in-out' } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-rose-100 group-hover:text-rose-600 flex items-center justify-center text-xs font-semibold text-slate-600 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base font-medium">
                      {renderAppleText(opt)}
                    </span>
                  </div>

                  {isShaking ? (
                    <span className="text-xs font-semibold text-rose-500 ml-2 whitespace-nowrap animate-pulse flex items-center gap-1">
                      <span>Try again!</span>
                      <AppleEmoji emoji="🥺" size={14} />
                    </span>
                  ) : (
                    <AppleEmoji emoji="💖" size={16} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
