import React from 'react';

// Unicode Regex for matching emoji sequences (including compound emojis, ZWJ sequences, skin tones, flags, etc.)
const EMOJI_REGEX = /(?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*)/u;
const EMOJI_SPLIT_REGEX = /((?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*))/u;
const IS_SINGLE_EMOJI_REGEX = /^(?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*)$/u;

const EMOJI_FONT_STACK = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

/**
 * AppleEmoji component
 * High-performance, zero-latency native emoji rendering using system emoji font stacks.
 * Eliminates slow external CDN network fetches (emojicdn.elk.sh) for instant 0ms rendering,
 * zero network overhead, and smooth 60fps hardware acceleration.
 */
export const AppleEmoji = React.memo(function AppleEmoji({ emoji, size = 20, className = '', style = {}, ...props }) {
  if (!emoji) return null;

  const fontSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <span
      role="img"
      aria-label={typeof emoji === 'string' ? emoji : 'emoji'}
      className={`inline-block select-none ${className}`.trim()}
      style={{
        fontFamily: EMOJI_FONT_STACK,
        fontSize,
        lineHeight: 1,
        verticalAlign: '-0.15em',
        fontStyle: 'normal',
        fontWeight: 'normal',
        ...style,
      }}
      {...props}
    >
      {emoji}
    </span>
  );
});

/**
 * Helper function to parse any string containing emojis and replace them with AppleEmoji components.
 * Pure synchronous parsing without external network requests or DOM image bottlenecks.
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
