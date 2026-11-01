import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { APPLE_EMOJI_MAP, appleEmojiMap, getAppleEmojiUrl } from '../../data/appleEmojiMap.js';

// Unicode Regex for matching emoji sequences (including compound emojis, ZWJ sequences, skin tones, flags, keycaps, etc.)
const EMOJI_REGEX = /(?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*)/u;
const EMOJI_SPLIT_REGEX = /((?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*))/u;
const IS_SINGLE_EMOJI_REGEX = /^(?:(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3)(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|[\u{1F3FB}-\u{1F3FF}])?|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3))*)$/u;

const EMOJI_FONT_STACK = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

// Cache of failed image sources to prevent repeated broken network requests
const failedSources = new Set();

/**
 * Converts any emoji sequence into its lowercase hex unified code
 * e.g., '🎂' -> '1f382', '❤️' -> '2764-fe0f', '1️⃣' -> '0031-fe0f-20e3'
 */
export function emojiToUnified(emoji) {
  if (!emoji || typeof emoji !== 'string') return '';
  return Array.from(emoji)
    .map((c) => {
      let hex = c.codePointAt(0).toString(16).toLowerCase();
      return hex.length < 4 ? hex.padStart(4, '0') : hex;
    })
    .join('-');
}

/**
 * Resolves the primary and CDN fallback image URLs for an emoji.
 */
function resolveEmojiSources(emoji) {
  if (!emoji || typeof emoji !== 'string') return { localSrc: null, cdnSrc: null };

  // 1. Check local apple emoji map
  let localSrc = null;
  if (typeof getAppleEmojiUrl === 'function') {
    localSrc = getAppleEmojiUrl(emoji);
  } else if (appleEmojiMap && appleEmojiMap[emoji]) {
    localSrc = appleEmojiMap[emoji];
  } else if (APPLE_EMOJI_MAP && APPLE_EMOJI_MAP[emoji]) {
    localSrc = APPLE_EMOJI_MAP[emoji];
  }

  // 2. Prepare CDN fallback
  const unified = emojiToUnified(emoji);
  const cdnSrc = unified
    ? `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${unified}.png`
    : null;

  return { localSrc, cdnSrc };
}

/**
 * AppleEmoji component
 * High-performance, zero-latency authentic Apple iOS emoji rendering.
 * Uses local static 64x64 PNGs bundled in /emojis/apple/ for 0ms render.
 * Falls back to jsDelivr CDN and ultimately native font stack if needed.
 */
export const AppleEmoji = React.memo(function AppleEmoji({
  emoji,
  size = 20,
  className = '',
  style = {},
  ...props
}) {
  if (!emoji) return null;

  const emojiStr = typeof emoji === 'string' ? emoji : String(emoji);
  const { localSrc, cdnSrc } = useMemo(() => resolveEmojiSources(emojiStr), [emojiStr]);

  // Determine starting source: local if available, else CDN
  const preferredSrc = localSrc || cdnSrc;
  const [currentSrc, setCurrentSrc] = useState(preferredSrc);
  const [useFallbackSpan, setUseFallbackSpan] = useState(
    () => !preferredSrc || failedSources.has(preferredSrc)
  );

  // Sync if emoji prop changes
  useEffect(() => {
    const nextPreferred = localSrc || cdnSrc;
    if (!nextPreferred || failedSources.has(nextPreferred)) {
      setUseFallbackSpan(true);
      setCurrentSrc(null);
    } else {
      setUseFallbackSpan(false);
      setCurrentSrc(nextPreferred);
    }
  }, [localSrc, cdnSrc]);

  const handleError = useCallback(() => {
    if (currentSrc) {
      failedSources.add(currentSrc);
    }
    // If local static image failed, attempt CDN fallback
    if (currentSrc === localSrc && cdnSrc && !failedSources.has(cdnSrc)) {
      setCurrentSrc(cdnSrc);
    } else {
      // CDN also failed or not available: fallback to native font span
      setUseFallbackSpan(true);
    }
  }, [currentSrc, localSrc, cdnSrc]);

  if (useFallbackSpan || !currentSrc) {
    return (
      <span
        role="img"
        aria-label={emojiStr}
        className={`inline-block select-none ${className}`.trim()}
        style={{
          fontFamily: EMOJI_FONT_STACK,
          fontSize: size,
          lineHeight: 1,
          verticalAlign: '-0.15em',
          fontStyle: 'normal',
          fontWeight: 'normal',
          display: 'inline-block',
          ...style,
        }}
        {...props}
      >
        {emojiStr}
      </span>
    );
  }

  const dimension = typeof size === 'number' ? size : undefined;

  return (
    <img
      src={currentSrc}
      alt={emojiStr}
      aria-label={emojiStr}
      width={dimension}
      height={dimension}
      loading="eager"
      decoding="async"
      draggable={false}
      onError={handleError}
      className={`inline-block select-none ${className}`.trim()}
      style={{
        width: size,
        height: size,
        verticalAlign: '-0.15em',
        display: 'inline-block',
        objectFit: 'contain',
        ...style,
      }}
      {...props}
    />
  );
});

// High-speed token cache to achieve 0ms latency during live typing and rerenders
const tokenCache = new Map();
const MAX_CACHE_SIZE = 1000;

function tokenizeEmojiText(text) {
  if (tokenCache.has(text)) {
    return tokenCache.get(text);
  }
  if (tokenCache.size >= MAX_CACHE_SIZE) {
    tokenCache.clear();
  }
  const parts = text.split(EMOJI_SPLIT_REGEX);
  tokenCache.set(text, parts);
  return parts;
}

/**
 * Helper function to parse any string containing emojis and replace them with AppleEmoji components.
 * Pure synchronous parsing with token caching for instant 0ms render with 0 typing lag.
 */
export function renderAppleText(text, size = 18, className = '', style = {}) {
  if (!text || typeof text !== 'string') return text;
  if (!EMOJI_REGEX.test(text)) return text;

  const parts = tokenizeEmojiText(text);
  return parts.map((part, index) => {
    if (!part) return null;
    if (IS_SINGLE_EMOJI_REGEX.test(part)) {
      return (
        <AppleEmoji
          key={`ae-${index}`}
          emoji={part}
          size={size}
          className={className}
          style={style}
        />
      );
    }
    return part;
  });
}

export default AppleEmoji;
