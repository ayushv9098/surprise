import React, { useState } from 'react';

// Unicode Regex for matching emoji sequences (including compound emojis, ZWJ sequences, skin tones, flags, etc.)
const EMOJI_REGEX = /(?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*)/u;
const EMOJI_SPLIT_REGEX = /((?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*))/u;
const IS_SINGLE_EMOJI_REGEX = /^(?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*)$/u;

/**
 * AppleEmoji component
 * Renders authentic Apple iOS emoji via emojicdn.elk.sh with fallback to native span emoji.
 */
export function AppleEmoji({ emoji, size = 20, className = '', style = {} }) {
  const [hasError, setHasError] = useState(false);

  if (!emoji) return null;

  if (hasError) {
    return (
      <span
        className={`inline-block select-none ${className}`}
        style={{
          fontSize: `${size}px`,
          lineHeight: 1,
          verticalAlign: '-0.15em',
          ...style,
        }}
      >
        {emoji}
      </span>
    );
  }

  const encodedEmoji = encodeURIComponent(emoji);
  const src = `https://emojicdn.elk.sh/${encodedEmoji}?style=apple`;

  return (
    <img
      src={src}
      alt={emoji}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setHasError(true)}
      draggable={false}
      className={`inline-block select-none pointer-events-none object-contain ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        verticalAlign: '-0.15em',
        ...style,
      }}
    />
  );
}

/**
 * Helper function to parse any string containing emojis and replace them with AppleEmoji components.
 */
export function renderAppleText(text, size = 18, className = '') {
  if (!text || typeof text !== 'string') return text;
  if (!EMOJI_REGEX.test(text)) return text;

  const parts = text.split(EMOJI_SPLIT_REGEX);
  return parts.map((part, index) => {
    if (!part) return null;
    if (IS_SINGLE_EMOJI_REGEX.test(part)) {
      return (
        <AppleEmoji
          key={index}
          emoji={part}
          size={size}
          className={className}
        />
      );
    }
    return part;
  });
}

export default AppleEmoji;
