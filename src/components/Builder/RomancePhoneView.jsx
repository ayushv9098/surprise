import React from 'react';
import BlushRomanceView from '../Templates/BlushRomanceView';
import '../Templates/common/blush-romance.css';

export default function RomancePhoneView({
  formData = {},
  theme = {},
  triggerConfetti,
  activeTab,
  onTabChange,
  openEnvelope,
  onReset: _onReset,
  resetNonce: _resetNonce,
}) {
  const templateId = formData.templateId || theme.id || 'velvet-romance';

  // Consolidate dynamic formData fields into siteData so photos, captions, letter, and names flow dynamically
  const siteData = {
    ...formData,
    templateId,
    themeId: templateId,
    recipientName: formData.recipientName || '',
    senderName: formData.senderName || '',
    photos: formData.photos,
    heroPhoto: formData.heroPhoto,
    photoCaption: formData.photoCaption,
    letter: formData.letter,
    letterBody: formData.letterBody,
    quizQuestion: formData.quizQuestion,
    quizYesText: formData.quizYesText,
    quizTreat: formData.quizTreat,
    quizVictoryNote: formData.quizVictoryNote,
    quiz: formData.quiz,
    songId: formData.songId,
    songUrl: formData.songUrl,
    customSongUrl: formData.customSongUrl,
    songTitle: formData.songTitle,
    customSongTitle: formData.customSongTitle,
  };

  return (
    <div className="flex-1 w-full min-h-0 flex flex-col overflow-hidden relative select-none">
      <BlushRomanceView
        siteData={siteData}
        isSimulator={true}
        controlledTab={activeTab === 'quiz' ? 'game' : activeTab}
        onTabChange={(t) => onTabChange && onTabChange(t === 'game' ? 'quiz' : t)}
        controlledOpenEnvelope={openEnvelope}
        triggerConfetti={triggerConfetti}
      />
    </div>
  );
}
