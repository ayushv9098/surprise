import React, { useId } from 'react';

/**
 * DearlyLogo - High-Definition Luxury Vector Mark for Dearly.
 * Represents an architectural keepsake letter with an inner glowing ruby heart seal,
 * dual specular glass highlights, and a signature diamond sparkle flare.
 *
 * 100% vector, zero pixelation, crystal-sharp at any size (16px to 512px).
 * Fully background-agnostic (transparent backing) for light & dark themes.
 */
export default function DearlyLogo({ size = 28, className = '', idPrefix }) {
  const reactId = useId().replace(/:/g, '');
  const id = idPrefix || `dearly-logo-${reactId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Luxury Jewel Gradient: Top-Left Radiant Rose -> Royal Crimson -> Velvet Wine */}
        <linearGradient id={`${id}-envelope`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4372" />
          <stop offset="35%" stopColor="#F43F5E" />
          <stop offset="70%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#880E4F" />
        </linearGradient>

        {/* Inner Ruby Gemstone Gradient */}
        <linearGradient id={`${id}-ruby`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF386B" />
          <stop offset="45%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        {/* Specular Glass Sheen Gradient */}
        <linearGradient id={`${id}-specular`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>

        {/* Ambient Ruby Luminescence Filter */}
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.8" floodColor="#E11D48" floodOpacity="0.36" />
        </filter>
      </defs>

      <g filter={`url(#${id}-glow)`}>
        {/* Outer Keepsake Envelope Silhouette */}
        <rect
          x="7"
          y="11"
          width="50"
          height="42"
          rx="9"
          stroke={`url(#${id}-envelope)`}
          strokeWidth="4.2"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Top Rim Light (Glass Specular Reflection on Upper Border) */}
        <path
          d="M 18 11 H 46"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />

        {/* Keepsake Envelope Flap V-Fold Line */}
        <path
          d="M 8.5 16.5 L 26.5 32 C 29.8 34.6 34.2 34.6 37.5 32 L 55.5 16.5"
          stroke={`url(#${id}-envelope)`}
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Radiant Center Ruby Wax Seal Heart */}
        <path
          d="M 32 25.5 C 30.2 22.2 26.8 20.5 23.5 20.5 C 19.8 20.5 17 23.5 17 27.5 C 17 32.8 22.8 38 32 44.5 C 41.2 38 47 32.8 47 27.5 C 47 23.5 44.2 20.5 40.5 20.5 C 37.2 20.5 33.8 22.2 32 25.5 Z"
          fill={`url(#${id}-ruby)`}
        />

        {/* Heart Top Bevel / Lobe Rim Glow */}
        <path
          d="M 23.5 22 C 26 22 28.5 23 32 25.5 C 35.5 23 38 22 40.5 22 C 43.5 22 45.2 23.8 45.5 26.5 C 44.5 24.8 42.8 23.5 40.5 23.5 C 37.8 23.5 35 24.8 32 27.2 C 29 24.8 26.2 23.5 23.5 23.5 C 21.2 23.5 19.5 24.8 18.5 26.5 C 18.8 23.8 20.5 22 23.5 22 Z"
          fill={`url(#${id}-specular)`}
          opacity="0.75"
        />

        {/* Specular Gloss Droplet (Left Lobe Reflection) */}
        <ellipse
          cx="24.8"
          cy="25"
          rx="3.6"
          ry="2"
          transform="rotate(-32 24.8 25)"
          fill="#FFFFFF"
          fillOpacity="0.92"
        />

        {/* Specular Gloss Accent Dot (Right Lobe Reflection) */}
        <circle
          cx="39.8"
          cy="24.5"
          r="1.4"
          fill="#FFFFFF"
          fillOpacity="0.8"
        />

        {/* Signature 4-Point Specular Star Flare (Diamond Sparkle) */}
        <path
          d="M 52.5 5 Q 52.5 9 48.5 9 Q 52.5 9 52.5 13 Q 52.5 9 56.5 9 Q 52.5 9 52.5 5 Z"
          fill="#FFF1F3"
        />
        <circle cx="52.5" cy="9" r="1.2" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
