import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AppleEmoji from '../common/AppleEmoji';

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
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Letters & Surprises
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Write a secret sealed letter, and add interactive surprises.
        </p>
      </div>

      {/* Surprises Sub-navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('letter')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-all cursor-pointer ${
            activeTab === 'letter'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Sealed Letter
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'quiz'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Fun Quiz</span>
          {quiz.enabled && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scratch')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'scratch'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Scratch Card</span>
          {scratchCard.enabled && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          )}
        </button>
      </div>

      {/* TAB 1: WAX SEALED LETTER */}
      {activeTab === 'letter' && (
        <div className="space-y-5">
          {/* Letter Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Envelope Header
            </label>
            <input
              type="text"
              value={letter.title}
              onChange={(e) => updateLetter({ title: e.target.value })}
              placeholder="e.g. A note sealed with my entire heart..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          {/* Letter Wax Seal Stamp Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
              Wax Seal Stamp
            </label>
            <div className="flex flex-wrap gap-2">
              {WAX_SEALS.map((seal, idx) => {
                const isSelected = letter.sealEmoji === seal.emoji;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => updateLetter({ sealEmoji: seal.emoji, waxColor: seal.color })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <AppleEmoji emoji={seal.emoji} size={16} />
                    <span>{seal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Body Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-700">
                Letter Message
              </label>
              <span className="text-xs text-gray-400">
                They tap the wax seal to open
              </span>
            </div>
            <textarea
              rows={8}
              value={letter.content}
              onChange={(e) => updateLetter({ content: e.target.value })}
              placeholder="Write your heartfelt note here... Pour your feelings, inside jokes, or sweet promises into this letter."
              className="w-full p-4 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-sans resize-none"
            />
          </div>
        </div>
      )}

      {/* TAB 2: CUTE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-5">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/50">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Include Sweet Quiz</h4>
              <p className="text-xs text-gray-500">
                A playful question they answer to unlock a treat.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quiz.enabled}
                onChange={(e) => updateQuiz({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
            </label>
          </div>

          {quiz.enabled && (
            <div className="space-y-4 pt-1">
              {/* Question */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Question
                </label>
                <input
                  type="text"
                  value={quiz.question}
                  onChange={(e) => updateQuiz({ question: e.target.value })}
                  placeholder="e.g. What is my favorite thing about you?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Choices (Click checkmark to pick winning answer)
                </label>
                <div className="space-y-2">
                  {quiz.options.map((opt, idx) => {
                    const isWinning = quiz.correctIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          isWinning
                            ? 'border-emerald-400 bg-emerald-50/40'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuiz({ correctIndex: idx })}
                          title={isWinning ? 'Winning answer' : 'Set as winning answer'}
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            isWinning
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateQuizOption(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          className="w-full text-xs text-gray-800 bg-transparent focus:outline-hidden"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reward */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/30 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Reward Title</label>
                  <input
                    type="text"
                    value={quiz.rewardTitle}
                    onChange={(e) => updateQuiz({ rewardTitle: e.target.value })}
                    placeholder="e.g. Cadbury Dairy Milk Silk Unlocked! 🍫"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-900 focus:outline-hidden focus:border-rose-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Reward Claim Message
                  </label>
                  <textarea
                    rows={2}
                    value={quiz.rewardMessage}
                    onChange={(e) => updateQuiz({ rewardMessage: e.target.value })}
                    placeholder="e.g. Show this screen to Rahul to claim your treat!"
                    className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-900 focus:outline-hidden focus:border-rose-400 resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SCRATCH CARD */}
      {activeTab === 'scratch' && (
        <div className="space-y-5">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/50">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Include Mystery Scratch Card</h4>
              <p className="text-xs text-gray-500">
                A card they scratch on screen to reveal a secret coupon or promise.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={scratchCard.enabled}
                onChange={(e) => updateScratch({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
            </label>
          </div>

          {scratchCard.enabled && (
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Card Cover Title
                </label>
                <input
                  type="text"
                  value={scratchCard.title}
                  onChange={(e) => updateScratch({ title: e.target.value })}
                  placeholder="e.g. Scratch to reveal my secret promise ✨"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Hidden Secret Message
                </label>
                <textarea
                  rows={3}
                  value={scratchCard.hiddenSecret}
                  onChange={(e) => updateScratch({ hiddenSecret: e.target.value })}
                  placeholder="e.g. Coupon for 1 spontaneous midnight ice-cream drive!"
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
