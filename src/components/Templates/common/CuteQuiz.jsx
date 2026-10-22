import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';
import { soundEffects } from './SoundEffects';
import AppleEmoji, { renderAppleText } from '../../common/AppleEmoji';

export default function CuteQuiz({
  quiz = null,
  fallbackQuestion = "What is the single best thing about us?",
  fallbackOptions = [
    "Our uncontrollable midnight laughing fits",
    "How we always find each other's favorite snacks",
    "That we can be 100% our weirdest, truest selves",
    "All of the above, plus a million more reasons ❤️"
  ],
  correctIndex = 3,
  rewardText = "You've unlocked 1x Big Warm Hug + Unlimited sweet treats on demand! 🍫🍦",
  quizTitle = "A Quick Cute Quiz Just for You",
  dark = false,
  theme = "rose"
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

  return (
    <div className="w-full max-w-xl mx-auto my-10 px-4">
      {/* Quiz Container Box */}
      <div className={`relative rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden ${
        dark 
          ? 'bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 shadow-indigo-950/60' 
          : 'glass-card border border-white/80'
      }`}>
        
        {/* Decorative corner icon */}
        <div className="text-center mb-6">
          <div className={`text-xs font-medium mb-2 flex items-center justify-center gap-1.5 ${
            dark ? 'text-indigo-400' : (theme === 'gold' ? 'text-amber-600' : 'text-rose-600')
          }`}>
            <span>Interactive Quiz</span>
            <AppleEmoji emoji="✨" size={14} />
          </div>
          <h3 className={`text-xl sm:text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            {renderAppleText(quizTitle)}
          </h3>
          <p className={`text-sm font-medium mt-2 max-w-md mx-auto ${dark ? 'text-indigo-200' : 'text-slate-600'}`}>
            {renderAppleText(question)}
          </p>
        </div>

        {/* Victory Celebration State */}
        {isAnswered && isCorrect ? (
          <div className={`relative flex flex-col items-center text-center p-6 rounded-2xl shadow-sm animate-in zoom-in-95 duration-400 ${
            dark 
              ? 'bg-slate-800/90 border border-indigo-500/40 text-white' 
              : 'bg-white border border-rose-100'
          }`}>
            <div className="text-3xl mb-2 flex items-center justify-center">
              <AppleEmoji emoji="🍫" size={40} />
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-semibold mb-2 ${
              dark ? 'bg-indigo-600' : (theme === 'gold' ? 'bg-amber-500' : 'bg-rose-500')
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Treat Unlocked</span>
            </div>

            <h4 className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>
              Correct!
            </h4>

            <p className={`font-handwriting text-2xl max-w-sm mt-2 leading-relaxed ${
              dark ? 'text-indigo-300' : (theme === 'gold' ? 'text-amber-600' : 'text-rose-600')
            }`}>
              "{renderAppleText(reward)}"
            </p>

            <button
              onClick={handleReset}
              className={`mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                dark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600' 
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800'
              }`}
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
                      ? (dark ? 'border-rose-500 bg-rose-950/50 text-rose-300 animate-shake' : 'border-rose-400 bg-rose-50/80 text-rose-700 animate-shake')
                      : isSelected && !isCorrect
                      ? (dark ? 'border-rose-400/80 bg-rose-950/30 text-slate-200' : 'border-rose-300 bg-rose-50/50 text-slate-700')
                      : dark 
                      ? 'border-indigo-900/60 bg-slate-800/80 hover:bg-slate-750 hover:border-indigo-400 hover:shadow-lg text-slate-100'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white hover:border-rose-300 hover:shadow-md text-slate-700'
                  }`}
                  style={isShaking ? { animation: 'shake 0.4s ease-in-out' } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      dark 
                        ? 'bg-slate-700 text-indigo-200 group-hover:bg-indigo-600 group-hover:text-white' 
                        : 'bg-slate-100 group-hover:bg-rose-100 group-hover:text-rose-600 text-slate-600'
                    }`}>
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
