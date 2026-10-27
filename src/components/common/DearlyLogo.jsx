import React, { useId } from 'react';

/**
 * DearlyLogo - Modern Luxury Keepsake Envelope & Brilliance Star Vector Mark.
 *
 * 100% Heart-Free modern digital keepsake envelope design.
 * Features:
 * - Architectural origami folded envelope pocket in rich multi-stop ruby/crimson gradients
 * - Protruding white/ivory keepsake parchment card with champagne gold header & micro sentiment lines
 * - Precision left & right facet wing folds with directional lighting
 * - Sculpted front V-pocket with specular hairline rim light
 * - Signature 4-point diamond sparkle star (✦) at the seal apex (NO HEART)
 *
 * Razor-sharp micro-fidelity across all resolutions (16px - 512px).
 * Matches public/favicon.svg and modern 2026 tech brand aesthetic.
 */
export default function DearlyLogo({ size = 28, className = '', idPrefix }) {
  const reactId = useId().replace(/:/g, '');
  const id = idPrefix || `dearly-env-${reactId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        {/* Rich Cardinal-to-Velvet Ruby Body Gradient */}
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3366" />
          <stop offset="35%" stopColor="#E11D48" />
          <stop offset="75%" stopColor="#9F1239" />
          <stop offset="100%" stopColor="#580820" />
        </linearGradient>

        {/* Deep Interior Velvet Pocket */}
        <linearGradient id={`${id}-interior`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A0313" />
          <stop offset="100%" stopColor="#140106" />
        </linearGradient>

        {/* Keepsake Parchment Card (Crisp White/Ivory Contrast) */}
        <linearGradient id={`${id}-card`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FFF5F7" />
          <stop offset="100%" stopColor="#FCE7EB" />
        </linearGradient>

        {/* Champagne Gold Accent Header Bar */}
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Front Pocket V-Cut Gradient */}
        <linearGradient id={`${id}-front`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FF386C" />
          <stop offset="45%" stopColor="#D91642" />
          <stop offset="100%" stopColor="#7C0827" />
        </linearGradient>

        {/* Left Wing Origami Facet */}
        <linearGradient id={`${id}-wing-l`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Right Wing Origami Facet */}
        <linearGradient id={`${id}-wing-r`} x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#9F1239" />
          <stop offset="100%" stopColor="#670622" />
        </linearGradient>

        {/* Specular Hairline Rim Light */}
        <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FFA8BA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4C0519" stopOpacity="0.1" />
        </linearGradient>

        {/* Card Ambient Drop Shadow */}
        <filter id={`${id}-card-shadow`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="1.0" floodColor="#2D020F" floodOpacity="0.55" />
        </filter>
      </defs>

      {/* Envelope Back Sleeve */}
      <rect x="2.5" y="9.5" width="27" height="18" rx="3.5" fill={`url(#${id}-interior)`} />

      {/* The Keepsake Parchment Card (Peeking out elegantly from top) */}
      <g filter={`url(#${id}-card-shadow)`}>
        <rect x="5.5" y="3.2" width="21" height="16.5" rx="2.2" fill={`url(#${id}-card)`} />
        {/* Champagne Gold Header Accent Bar */}
        <rect x="8.5" y="5.8" width="7" height="1.6" rx="0.8" fill={`url(#${id}-gold)`} />
        {/* Micro Sentiment Line 1 */}
        <rect x="8.5" y="9" width="15" height="1.1" rx="0.55" fill="#E2E8F0" />
        {/* Micro Sentiment Line 2 */}
        <rect x="8.5" y="11.5" width="10" height="1.1" rx="0.55" fill="#CBD5E1" />
        {/* Micro Crimson Brilliance Sparkle in top right corner of card */}
        <path d="M 22.5 5 Q 22.5 6.6 21 6.6 Q 22.5 6.6 22.5 8.2 Q 22.5 6.6 24 6.6 Q 22.5 6.6 22.5 5 Z" fill="#E11D48" />
      </g>

      {/* Left Side Facet Wing Fold */}
      <path d="M 2.5 10.5 L 14 18 L 2.5 25.5 Z" fill={`url(#${id}-wing-l)`} />

      {/* Right Side Facet Wing Fold */}
      <path d="M 29.5 10.5 L 18 18 L 29.5 25.5 Z" fill={`url(#${id}-wing-r)`} />

      {/* Front Pocket with Sculpted V-Cut Neck (Architectural Fold) */}
      <path
        d="M 2.5 12.8 L 16 20.8 L 29.5 12.8 L 29.5 24 C 29.5 25.9 28 27.5 26 27.5 L 6 27.5 C 4.1 27.5 2.5 25.9 2.5 24 Z"
        fill={`url(#${id}-front)`}
      />

      {/* Specular V-Cut Edge Highlight */}
      <path d="M 2.5 12.8 L 16 20.8 L 29.5 12.8" stroke={`url(#${id}-rim)`} strokeWidth="0.85" fill="none" />

      {/* Outer Boundary Specular Hairline */}
      <path
        d="M 2.5 13 L 2.5 24 C 2.5 25.9 4.1 27.5 6 27.5 L 26 27.5 C 28 27.5 29.5 25.9 29.5 24 L 29.5 13"
        stroke={`url(#${id}-rim)`}
        strokeWidth="0.75"
        fill="none"
      />

      {/* Signature 4-Point Brilliance Diamond Seal (✦) at the V-Apex - ABSOLUTELY NO HEART */}
      <path
        d="M 16 18.2 Q 16 20.8 13.4 20.8 Q 16 20.8 16 23.4 Q 16 20.8 18.6 20.8 Q 16 20.8 16 18.2 Z"
        fill="#FFFFFF"
      />
      <circle cx="16" cy="20.8" r="0.8" fill="#FDE68A" />
    </svg>
  );
}
