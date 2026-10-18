import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  HelpCircle,
  Gift,
  CheckCircle2,
  Stamp,
} from 'lucide-react';

const WAX_SEALS = [
  { emoji: '💌', color: '#E11D48', label: 'Ruby Heart' },
  { emoji: '🌹', color: '#BE123C', label: 'Rose Wine' },
  { emoji: '✨', color: '#D97706', label: 'Golden Sparkle' },
  { emoji: '🕊️', color: '#7C3AED', label: 'Lavender Peace' },
  { emoji: '🎂', color: '#B45309', label: 'Birthday Gold' },
  { emoji: '💖', color: '#DB2777', label: 'Soft Berry' },
];

export default function StepSurprises({ formData, onChange }) {
  const [activeTab, setActiveTab] = useState('letter'); // 'letter' | 'quiz' | 'scratch'

  const letter = formData.letter || {
    title: 'A note sealed with my entire heart...',
    content: '',
    sealEmoji: '💌',
    waxColor: '#E11D48',
  };

  const quiz = formData.quiz || {
    enabled: true,
    question: 'What is my absolute favorite thing about you?',
    options: [
      'The way your eyes crinkle when you laugh',
      'How passionately you talk about your dreams',
      'How you steal all the French fries',
      'All of the above & everything you are ❤️',
    ],
    correctIndex: 3,
    rewardTitle: 'Cadbury Dairy Milk Silk Unlocked! 🍫✨',
    rewardMessage: 'Show this secret screen to me to claim your giant chocolate bar + warm bear hug tonight!',
  };

  const scratchCard = formData.scratchCard || {
    enabled: true,
    title: 'Scratch to reveal my secret promise ✨',
    hiddenSecret: 'Coupon for 1 spontaneous midnight ice-cream drive + unlimited forehead kisses whenever you want! Valid forever.',
  };

  const updateLetter = (patch) => {
    onChange({ letter: { ...letter, ...patch } });
  };

  const updateQuiz = (patch) => {
    onChange({ quiz: { ...quiz, ...patch } });
  };

  const updateQuizOption = (index, value) => {
    const newOptions = [...quiz.options];
    newOptions[index] = value;
    onChange({ quiz: { ...quiz, options: newOptions } });
  };

  const updateScratch = (patch) => {
    onChange({ scratchCard: { ...scratchCard, ...patch } });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-rose-100/80 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 3: Interactive Surprises</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-800">
          The Unboxing & Interactive Magic
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Add secret surprises that your recipient can tap, scratch, and unlock!
        </p>
      </div>

      {/* Surprises Sub-navigation Tabs */}
      <div className="flex rounded-xl bg-rose-50/50 p-1 border border-rose-100">
        <button
          type="button"
          onClick={() => setActiveTab('letter')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'letter'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4 text-rose-500" />
          <span>Wax-Sealed Letter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-pink-500" />
          <span>Cute Love Quiz</span>
          {quiz.enabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scratch')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'scratch'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Scratch Card</span>
          {scratchCard.enabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          )}
        </button>
      </div>

      {/* TAB 1: WAX SEALED LETTER */}
      {activeTab === 'letter' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Letter Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Letter Title
            </label>
            <input
              type="text"
              value={letter.title}
              onChange={(e) => updateLetter({ title: e.target.value })}
              placeholder="e.g. A note sealed with my entire heart..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all shadow-2xs"
            />
          </div>

          {/* Letter Wax Seal Stamp Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Stamp className="w-4 h-4 text-rose-500" />
              <span>Choose Wax Seal Stamp & Hue</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {WAX_SEALS.map((seal, idx) => {
                const isSelected = letter.sealEmoji === seal.emoji;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => updateLetter({ sealEmoji: seal.emoji, waxColor: seal.color })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 shadow-xs scale-105'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-xs"
                      style={{ backgroundColor: seal.color }}
                    >
                      {seal.emoji}
                    </div>
                    <span className="text-xs font-medium text-slate-700">{seal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Body Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Heartfelt Words
              </label>
              <span className="text-[11px] text-slate-400">
                They must tap the wax seal on screen to break it open!
              </span>
            </div>
            <textarea
              rows={8}
              value={letter.content}
              onChange={(e) => updateLetter({ content: e.target.value })}
              placeholder="Write your heartfelt note here... Pour your feelings, shared memories, or sweet promises into this letter."
              className="w-full p-4 rounded-xl border border-rose-200 bg-rose-50/20 text-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all font-sans"
            />
          </div>
        </div>
      )}

      {/* TAB 2: CUTE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-rose-100 bg-rose-50/30">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Include Cute Love Quiz</h4>
              <p className="text-xs text-slate-500">
                A playful question they must answer to unlock a sweet surprise reward!
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quiz.enabled}
                onChange={(e) => updateQuiz({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
            </label>
          </div>

          {quiz.enabled && (
            <div className="space-y-4 pt-1">
              {/* Question */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  The Question
                </label>
                <input
                  type="text"
                  value={quiz.question}
                  onChange={(e) => updateQuiz({ question: e.target.value })}
                  placeholder="e.g. What is my favorite thing about you?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/30 focus:border-rose-400 transition-all shadow-2xs"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Choices (Click checkmark to pick the winning answer)
                </label>
                <div className="space-y-2">
                  {quiz.options.map((opt, idx) => {
                    const isWinning = quiz.correctIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          isWinning
                            ? 'border-emerald-400 bg-emerald-50/50'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuiz({ correctIndex: idx })}
                          title={isWinning ? 'Winning answer' : 'Set as winning answer'}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            isWinning
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateQuizOption(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="w-full text-xs text-slate-700 bg-transparent border-none focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reward Popup Editor */}
              <div className="p-4 rounded-xl border border-pink-200/80 bg-pink-50/30 space-y-3">
                <h5 className="text-xs font-bold text-pink-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-pink-500" />
                  <span>Winning Reward Screen</span>
                </h5>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">Reward Title</label>
                  <input
                    type="text"
                    value={quiz.rewardTitle}
                    onChange={(e) => updateQuiz({ rewardTitle: e.target.value })}
                    placeholder="e.g. Cadbury Dairy Milk Silk Unlocked! 🍫"
                    className="w-full px-3 py-2 rounded-lg border border-pink-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Reward Message / Claim Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={quiz.rewardMessage}
                    onChange={(e) => updateQuiz({ rewardMessage: e.target.value })}
                    placeholder="e.g. Show this screen to Rahul to claim your giant chocolate bar + warm bear hug tonight!"
                    className="w-full p-2.5 rounded-lg border border-pink-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400 resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SCRATCH CARD */}
      {activeTab === 'scratch' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-100 bg-amber-50/30">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Include Mystery Scratch Card</h4>
              <p className="text-xs text-slate-500">
                A golden or sparkling card they can rub with their finger to reveal a secret promise!
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={scratchCard.enabled}
                onChange={(e) => updateScratch({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {scratchCard.enabled && (
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Card Cover Title
                </label>
                <input
                  type="text"
                  value={scratchCard.title}
                  onChange={(e) => updateScratch({ title: e.target.value })}
                  placeholder="e.g. Scratch to reveal my secret promise ✨"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Hidden Secret Message / Coupon
                  </label>
                  <span className="text-[11px] text-amber-600 font-medium">
                    Hidden behind the scratch layer
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={scratchCard.hiddenSecret}
                  onChange={(e) => updateScratch({ hiddenSecret: e.target.value })}
                  placeholder="e.g. Coupon for 1 spontaneous midnight ice-cream drive + unlimited forehead kisses whenever you want! Valid forever."
                  className="w-full p-4 rounded-xl border border-amber-200 bg-amber-50/20 text-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
