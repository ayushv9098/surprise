import React, { useId } from 'react';

/**
 * DearlyLogo - Radiant Keepsake Heart & Brilliance Star Vector Mark.
 *
 * Standalone jewelry-grade keepsake heart with multi-stop ruby gradient,
 * specular inner light rim, gloss highlight reflection, and signature
 * 4-point diamond sparkle star flare (✦).
 *
 * 100% vector, zero box clutter, razor-sharp across all resolutions (16px - 512px).
 * Perfectly matches public/favicon.svg and brand identity.
 */
export default function DearlyLogo({ size = 28, className = '', idPrefix }) {
  const reactId = useId().replace(/:/g, '');
  const id = idPrefix || `dearly-heart-${reactId}`;

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
        {/* Core Jewel Gradient */}
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3366" />
          <stop offset="38%" stopColor="#E11D48" />
          <stop offset="80%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Specular Inner Rim Light */}
        <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#FFA8BA" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#881337" stopOpacity="0.1" />
        </linearGradient>

        {/* Soft Ambient Depth Shadow */}
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#881337" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Full Keepsake Heart Silhouette */}
      <path
        filter={`url(#${id}-glow)`}
        d="M 16 5.8 C 13.8 2.2 8.6 1.2 4.6 4.8 C 0.8 8.2 0.8 14.2 4.4 18.4 L 16 29.5 L 27.6 18.4 C 31.2 14.2 31.2 8.2 27.4 4.8 C 23.4 1.2 18.2 2.2 16 5.8 Z"
        fill={`url(#${id}-grad)`}
      />

      {/* Inner Rim Light Stroke */}
      <path
        d="M 16 5.8 C 13.8 2.2 8.6 1.2 4.6 4.8 C 0.8 8.2 0.8 14.2 4.4 18.4 L 16 29.5 L 27.6 18.4 C 31.2 14.2 31.2 8.2 27.4 4.8 C 23.4 1.2 18.2 2.2 16 5.8 Z"
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.2"
      />

      {/* Specular Gloss Reflection Droplet on Left Lobe */}
      <ellipse
        cx="9"
        cy="9.5"
        rx="4.2"
        ry="2.4"
        transform="rotate(-35 9 9.5)"
        fill="#FFFFFF"
        fillOpacity="0.6"
      />

      {/* Signature 4-Point Diamond Sparkle Star (✦) inside the right lobe */}
      <path
        d="M 23 7.5 Q 23 11 19.5 11 Q 23 11 23 14.5 Q 23 11 26.5 11 Q 23 11 23 7.5 Z"
        fill="#FFFFFF"
      />
      <circle cx="23" cy="11" r="0.9" fill="#FFF1F3" />
    </svg>
  );
}
