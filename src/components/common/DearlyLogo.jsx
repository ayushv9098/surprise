import React, { useId } from 'react';

/**
 * DearlyLogo - Imperial Jewel Squircle & Keepsake Heart Mark.
 * Apple-style luxury squircle with ruby jewel gradient, upper glass sheen,
 * embossed white keepsake heart with specular reflection, and signature diamond sparkle flare (✦).
 *
 * 100% vector, crystal-sharp across all resolutions (16px, 24px, 28px, 32px, 64px, 512px).
 * High-contrast & beautiful on both light & dark backgrounds.
 */
export default function DearlyLogo({ size = 28, className = '', idPrefix }) {
  const reactId = useId().replace(/:/g, '');
  const id = idPrefix || `dearly-logo-${reactId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3366" />
          <stop offset="38%" stopColor="#E11D48" />
          <stop offset="80%" stopColor="#9F1239" />
          <stop offset="100%" stopColor="#6B0A26" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`${id}-heart`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFE4E8" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.9" floodColor="#4C0519" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Squircle Base */}
      <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="8.5" fill={`url(#${id}-bg)`} />
      <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="8.5" stroke={`url(#${id}-rim)`} strokeWidth="1.2" />

      {/* Upper Glass Sheen Arc */}
      <path
        d="M 2.5 9.5 C 2.5 5.5 5.5 2.5 9.5 2.5 L 22.5 2.5 C 26.5 2.5 29.5 5.5 29.5 9.5 C 22 13.5 10 13.5 2.5 9.5 Z"
        fill="#FFFFFF"
        fillOpacity="0.18"
      />

      {/* Center Keepsake Heart */}
      <path
        filter={`url(#${id}-shadow)`}
        d="M 16 11.2 C 14.6 9.4 12.2 8.5 10 9 C 7.6 9.6 6 11.8 6 14.5 C 6 18.2 10.4 22 16 25 C 21.6 22 26 18.2 26 14.5 C 26 11.8 24.4 9.6 22 9 C 19.8 8.5 17.4 9.4 16 11.2 Z"
        fill={`url(#${id}-heart)`}
      />

      {/* Specular Gloss Reflection on Left Lobe */}
      <ellipse cx="11" cy="12.5" rx="2" ry="1.2" transform="rotate(-30 11 12.5)" fill="#FFFFFF" fillOpacity="0.75" />

      {/* Signature 4-Point Diamond Sparkle Star (✦) */}
      <path d="M 24.5 4 Q 24.5 7 21.5 7 Q 24.5 7 24.5 10 Q 24.5 7 27.5 7 Q 24.5 7 24.5 4 Z" fill="#FFF1F3" />
      <circle cx="24.5" cy="7" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}
