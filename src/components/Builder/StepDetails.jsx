import React from 'react';

const POPULAR_OCCASIONS = [
  'Happy Birthday 🎂',
  'Anniversary 🌸',
  'Valentine’s Day 💖',
  'I am Sorry 🥺',
  'Just Because ✨',
  'Best Friends Forever 📸',
];

export default function StepDetails({ formData, onChange }) {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Names & Occasion
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Who is this surprise for and what are you celebrating?
        </p>
      </div>

      <div className="space-y-5">
        {/* Recipient & Sender Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Recipient Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Recipient’s Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.recipientName || ''}
              onChange={(e) => onChange({ recipientName: e.target.value })}
              placeholder="e.g. Aditi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            <p className="text-xs text-gray-400">
              Their name will headline the surprise page.
            </p>
          </div>

          {/* Sender Name / Signature */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.senderName || ''}
              onChange={(e) => onChange({ senderName: e.target.value })}
              placeholder="e.g. Rahul"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            <p className="text-xs text-gray-400">
              How they know you.
            </p>
          </div>
        </div>

        {/* Occasion Heading with Quick Chips */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">
            Occasion
          </label>
          <input
            type="text"
            value={formData.occasion || ''}
            onChange={(e) => onChange({ occasion: e.target.value })}
            placeholder="e.g. Happy 2nd Anniversary My Love! 🌸"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />

          {/* Occasion Quick Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {POPULAR_OCCASIONS.map((occ, idx) => {
              const isSelected = formData.occasion === occ;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onChange({ occasion: occ })}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200/70 text-gray-700'
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sweet Subtitle */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">
            Subtitle / Opening Note
          </label>
          <textarea
            rows={2}
            value={formData.subtitle || ''}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            placeholder="A short, sweet line that greets them when they open the link..."
            maxLength={180}
            className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
