import React from 'react';

/**
 * DearlyLogo - Official Brand Keepsake Envelope Icon
 *
 * Exact 1:1 vector replica of Dearly brand envelope with love letter keepsake card.
 * - Envelope body front: #F2E2DD
 * - Envelope interior pocket: #E8CFC9
 * - Protruding white keepsake letter card: #FFFFFF
 * - Soft crimson heart on the card: #C94F6D
 * - Precise envelope fold & outlines: #35292F
 * - 100% transparent background outside mark
 *
 * Razor-sharp micro-fidelity across all resolutions (16px favicon up to 512px app icon).
 */
export default function DearlyLogo({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 370 370"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      {/* 1. Keepsake Letter Card (Crisp White with Dark Border) */}
      <path
        d="M 83 157 L 83 34 C 83 26 89 20 97 20 L 272 20 C 280 20 286 26 286 34 L 286 157 Z"
        fill="#FFFFFF"
        stroke="#35292F"
        strokeWidth="8"
        strokeLinejoin="round"
      />

      {/* 2. Soft Crimson Heart on Card */}
      <path
        d="M 184.5 124.5
           C 177 118 151 97 151 76
           C 151 64 160 56.5 171 56.5
           C 178 56.5 182.5 60.5 184.5 64.5
           C 186.5 60.5 191 56.5 198 56.5
           C 209 56.5 218 64 218 76
           C 218 97 192 118 184.5 124.5 Z"
        fill="#C94F6D"
      />

      {/* 3. Envelope Interior Pocket Fill (#E8CFC9) */}
      <rect
        x="25"
        y="157"
        width="319"
        height="193"
        rx="20"
        fill="#E8CFC9"
      />

      {/* 4. Front Envelope Pocket Body Fill (#F2E2DD below V-cut) */}
      <path
        d="M 25 175
           L 25 330
           C 25 341 34 350 45 350
           L 324 350
           C 335 350 344 341 344 330
           L 344 175
           L 341 159.5
           L 184.5 263
           L 28 159.5
           Z"
        fill="#F2E2DD"
      />

      {/* 5. V-Fold Crease Line Stroke */}
      <path
        d="M 27 159.5 L 184.5 263 L 342 159.5"
        fill="none"
        stroke="#35292F"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 6. Outer Envelope Boundary Stroke */}
      <rect
        x="25"
        y="157"
        width="319"
        height="193"
        rx="20"
        fill="none"
        stroke="#35292F"
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
