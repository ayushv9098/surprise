import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = 'D:\\avprojects\\surprise-builder';
const OUTPUT_SCREENSHOT = 'C:\\Users\\hp\\.gemini\\antigravity-cli\\brain\\e0e6b5bc-9361-4005-afae-ef68c72d0d8f\\qa-luxury-favicon-options.png';

// ==============================================================================
// CONCEPT A: Quiet Luxury Obsidian & Champagne Gold (The Architectural Keepsake Ribbon)
// ==============================================================================
export const CONCEPT_A_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Deep Obsidian Midnight Foundation -->
    <linearGradient id="obsidian-bg-a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14151C" />
      <stop offset="50%" stop-color="#0E0F14" />
      <stop offset="100%" stop-color="#07080B" />
    </linearGradient>

    <!-- Champagne Gold Perimeter Rim -->
    <linearGradient id="gold-rim-a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF4E8" stop-opacity="0.45" />
      <stop offset="45%" stop-color="#DDB97A" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#936F35" stop-opacity="0.10" />
    </linearGradient>

    <!-- Top-down subtle specular lighting (Apple-grade) -->
    <linearGradient id="specular-a" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08" />
      <stop offset="30%" stop-color="#FFFFFF" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Champagne Gold Metallic Gradients -->
    <linearGradient id="gold-ribbon-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="22%" stop-color="#F4DEB8" />
      <stop offset="60%" stop-color="#DCB879" />
      <stop offset="100%" stop-color="#A8803E" />
    </linearGradient>

    <linearGradient id="gold-facet-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32" />
      <stop offset="50%" stop-color="#F4DEB8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#DCB879" stop-opacity="0" />
    </linearGradient>

    <!-- Subtle ambient gold warmth -->
    <radialGradient id="center-gold-glow" cx="50%" cy="50%" r="48%">
      <stop offset="0%" stop-color="#DDB97A" stop-opacity="0.15" />
      <stop offset="60%" stop-color="#DDB97A" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#0E0F14" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Obsidian Squircle Foundation -->
  <rect width="512" height="512" rx="116" fill="url(#obsidian-bg-a)" />
  <rect width="512" height="512" rx="116" fill="url(#specular-a)" />
  <rect width="504" height="504" x="4" y="4" rx="112" fill="none" stroke="url(#gold-rim-a)" stroke-width="3" />

  <!-- Ambient Gold Atmosphere -->
  <circle cx="256" cy="256" r="170" fill="url(#center-gold-glow)" />

  <!-- Architectural Ribbon Monogram 'D' / Origami Keepsake Fold (Perfect 256x256 Centered) -->
  <g id="icon-concept-a">
    <!-- Left Pillar Stem -->
    <rect x="138" y="134" width="46" height="244" rx="23" fill="url(#gold-ribbon-primary)" />

    <!-- Continuous Ribbon Arch (Golden Ratio Curvature) -->
    <path
      d="M 161 157
         C 256 157, 350 197, 350 256
         C 350 315, 256 355, 161 355"
      fill="none"
      stroke="url(#gold-ribbon-primary)"
      stroke-width="46"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Origami Ribbon Fold Facet (Lustrous Architectural Bevel) -->
    <path
      d="M 184 157
         C 246 157, 304 195, 304 256
         L 230 256
         C 204 256, 184 236, 184 210 Z"
      fill="url(#gold-facet-shimmer)"
    />

    <!-- Crown Specular Catchlight -->
    <path
      d="M 198 157
         C 260 157, 314 184, 330 220"
      fill="none"
      stroke="#FFFDF9"
      stroke-width="6"
      stroke-linecap="round"
      opacity="0.85"
    />
  </g>
</svg>`;

// ==============================================================================
// CONCEPT B: Minimalist Apple-grade Keepsake Glyph (Brushed Titanium Envelope & Heart)
// ==============================================================================
export const CONCEPT_B_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Midnight Titanium Background -->
    <linearGradient id="bg-titanium" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#161821" />
      <stop offset="60%" stop-color="#0E0F14" />
      <stop offset="100%" stop-color="#08080C" />
    </linearGradient>

    <!-- 1px Precision Machined Titanium Rim -->
    <linearGradient id="rim-titanium" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32" />
      <stop offset="50%" stop-color="#94A3B8" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#334155" stop-opacity="0.06" />
    </linearGradient>

    <!-- Brushed Platinum / Titanium Metal Sheen -->
    <linearGradient id="titanium-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="45%" stop-color="#F1F5F9" />
      <stop offset="75%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#94A3B8" />
    </linearGradient>

    <!-- Top Specular Gloss -->
    <linearGradient id="specular-b" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.09" />
      <stop offset="25%" stop-color="#FFFFFF" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <radialGradient id="titanium-core-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.12" />
      <stop offset="50%" stop-color="#94A3B8" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Squircle Base -->
  <rect width="512" height="512" rx="116" fill="url(#bg-titanium)" />
  <rect width="512" height="512" rx="116" fill="url(#specular-b)" />
  <rect width="504" height="504" x="4" y="4" rx="112" fill="none" stroke="url(#rim-titanium)" stroke-width="2.5" />

  <!-- Ambient Glow -->
  <circle cx="256" cy="256" r="160" fill="url(#titanium-core-glow)" />

  <!-- Iconic Modern Keepsake Glyph: Precision Machined Envelope & Heart Apex -->
  <g id="icon-concept-b">
    <!-- Outer Envelope Perimeter -->
    <rect x="128" y="146" width="256" height="220" rx="32" fill="none" stroke="url(#titanium-sheen)" stroke-width="28" stroke-linejoin="round" />

    <!-- Top Diagonal Fold Flap converging to Heart Apex -->
    <path
      d="M 144 162
         L 242 254
         C 250 262, 262 262, 270 254
         L 368 162"
      fill="none"
      stroke="url(#titanium-sheen)"
      stroke-width="26"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Lower Fold Seams framing the Keepsake Apex -->
    <path
      d="M 144 350
         L 218 282
         M 368 350
         L 294 282"
      stroke="url(#titanium-sheen)"
      stroke-width="20"
      stroke-linecap="round"
      opacity="0.8"
    />

    <!-- Center Keepsake Heart Apex Seal -->
    <path
      d="M 256 264
         C 256 257, 245 248, 237 253
         C 229 258, 229 269, 238 277
         L 256 295
         L 274 277
         C 283 269, 283 258, 275 253
         C 267 248, 256 257, 256 264 Z"
      fill="url(#titanium-sheen)"
    />
  </g>
</svg>`;

// ==============================================================================
// CONCEPT C: Dark Luxury Ruby / Velvet Noir (Antique Rose-Gold Jewelry Ribbon)
// ==============================================================================
export const CONCEPT_C_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Velvet Noir Midnight Wine Background -->
    <linearGradient id="bg-velvet-noir" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A0C13" />
      <stop offset="50%" stop-color="#11070D" />
      <stop offset="100%" stop-color="#080407" />
    </linearGradient>

    <!-- Antique Rose Gold Rim -->
    <linearGradient id="rim-rose-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE7EB" stop-opacity="0.40" />
      <stop offset="45%" stop-color="#DDA0AC" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#9C5D6B" stop-opacity="0.08" />
    </linearGradient>

    <!-- Top Specular Gloss -->
    <linearGradient id="specular-c" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.07" />
      <stop offset="30%" stop-color="#FFFFFF" stop-opacity="0.015" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>

    <!-- Satin Rose Gold Gradients (Cartier / Bulgari High Jewelry) -->
    <linearGradient id="rose-gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF2F4" />
      <stop offset="25%" stop-color="#F5CFD6" />
      <stop offset="65%" stop-color="#E29DAA" />
      <stop offset="100%" stop-color="#B76979" />
    </linearGradient>

    <linearGradient id="rose-gold-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FCE8EC" />
      <stop offset="50%" stop-color="#DDA0AC" />
      <stop offset="100%" stop-color="#A85768" />
    </linearGradient>

    <!-- Soft Wine/Ruby Ambient Glow -->
    <radialGradient id="ruby-noir-glow" cx="50%" cy="50%" r="48%">
      <stop offset="0%" stop-color="#BE185D" stop-opacity="0.14" />
      <stop offset="60%" stop-color="#831843" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#11070D" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Velvet Noir Squircle -->
  <rect width="512" height="512" rx="116" fill="url(#bg-velvet-noir)" />
  <rect width="512" height="512" rx="116" fill="url(#specular-c)" />
  <rect width="504" height="504" x="4" y="4" rx="112" fill="none" stroke="url(#rim-rose-gold)" stroke-width="2.5" />

  <!-- Ambient Glow -->
  <circle cx="256" cy="256" r="175" fill="url(#ruby-noir-glow)" />

  <!-- Interlocking Architectural Rose-Gold Ribbon Knot (Dearly Monogram & Keepsake) -->
  <g id="icon-concept-c">
    <!-- Left Ribbon Loop sweeping up and creating the letter 'D' -->
    <path
      d="M 166 372
         L 166 170
         C 166 128, 206 112, 246 130
         C 286 148, 308 190, 308 240
         C 308 300, 252 352, 214 372"
      fill="none"
      stroke="url(#rose-gold-primary)"
      stroke-width="38"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <!-- Interlocking Right Loop completing the luxury ribbon fold -->
    <path
      d="M 214 372
         C 264 352, 348 298, 348 224
         C 348 162, 302 126, 256 126
         C 228 126, 202 140, 188 162"
      fill="none"
      stroke="url(#rose-gold-secondary)"
      stroke-width="32"
      stroke-linecap="round"
      stroke-linejoin="round"
      opacity="0.92"
    />
  </g>
</svg>`;

async function buildComparisonPreview() {
  console.log('Launching browser to render comparison preview...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 2000, deviceScaleFactor: 2 });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dearly — Luxury Favicon Design Collection</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      --bg: #0A0B0E;
      --card-bg: #121319;
      --border: rgba(255, 255, 255, 0.08);
      --gold: #E5C896;
      --titanium: #E2E8F0;
      --rose: #E5B2BA;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: var(--bg);
      color: #E2E8F0;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      padding: 48px;
    }

    svg {
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      display: block !important;
    }

    .header {
      margin-bottom: 40px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .title-wrap h1 {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .title-wrap p {
      font-size: 15px;
      color: #94A3B8;
      font-weight: 400;
    }

    .badge-pill {
      background: rgba(229, 200, 150, 0.12);
      border: 1px solid rgba(229, 200, 150, 0.3);
      color: var(--gold);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Comparison Grid */
    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 48px;
    }

    .concept-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .concept-card.featured {
      border-color: rgba(229, 200, 150, 0.45);
      box-shadow: 0 12px 36px rgba(229, 200, 150, 0.08);
    }

    .concept-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .concept-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .tag-a { color: var(--gold); }
    .tag-b { color: #94A3B8; }
    .tag-c { color: var(--rose); }

    .concept-name {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-top: 2px;
    }

    .concept-hero {
      padding: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #090A0E;
    }

    .concept-hero-box {
      width: 140px;
      height: 140px;
      filter: drop-shadow(0 16px 32px rgba(0,0,0,0.6));
    }

    .concept-meta {
      padding: 20px 24px;
      border-top: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.02);
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.6;
    }

    /* Multi-Scale Inspection Table */
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .scale-matrix {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 48px;
    }

    .matrix-row {
      display: grid;
      grid-template-columns: 220px 1fr 1fr 1fr;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .matrix-row:last-child { border-bottom: none; }

    .matrix-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #94A3B8;
      line-height: 1.4;
    }

    .matrix-cell {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .preview-box {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .bg-dark { background: #181920; border: 1px solid rgba(255,255,255,0.06); }
    .bg-light { background: #F1F5F9; border: 1px solid rgba(0,0,0,0.08); }

    /* Chrome Tab Bar Simulation */
    .tabbar-simulation {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 40px;
    }

    .tabbar-theme-label {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--border);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #94A3B8;
      font-weight: 600;
    }

    /* Dark Tab Bar */
    .chrome-dark-bar {
      background: #1E1F22;
      padding: 10px 16px 0 16px;
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    .chrome-tab-dark {
      background: #2B2D30;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 270px;
      color: #DFE1E5;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 -1px 3px rgba(0,0,0,0.2);
    }

    /* Light Tab Bar */
    .chrome-light-bar {
      background: #DEE1E6;
      padding: 10px 16px 0 16px;
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    .chrome-tab-light {
      background: #FFFFFF;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 270px;
      color: #1F2328;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 -1px 3px rgba(0,0,0,0.06);
    }

    .tab-close {
      margin-left: auto;
      font-size: 14px;
      opacity: 0.5;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="title-wrap">
      <h1>Dearly — Luxury Favicon Design Collection</h1>
      <p>Zero chapri / zero neon pink cartoon sparkle • High-end Cartier & Apple grade aesthetic</p>
    </div>
    <div class="badge-pill">dearly.vercel.app</div>
  </div>

  <!-- 3 Concepts Showcase -->
  <div class="concepts-grid">
    <!-- Concept A -->
    <div class="concept-card featured">
      <div class="concept-header">
        <div>
          <div class="concept-tag tag-a">Concept A • Recommended</div>
          <div class="concept-name">Obsidian & Champagne Gold</div>
        </div>
        <span style="font-size: 18px;">✨</span>
      </div>
      <div class="concept-hero">
        <div class="concept-hero-box">${CONCEPT_A_SVG}</div>
      </div>
      <div class="concept-meta">
        <strong>The Heritage Architectural Ribbon 'D':</strong> Deep midnight obsidian stone foundation with warm champagne gold continuous ribbon loop. Subtle 1px gold rim, restrained specular sheen. Timeless, editorial, pure quiet luxury.
      </div>
    </div>

    <!-- Concept B -->
    <div class="concept-card">
      <div class="concept-header">
        <div>
          <div class="concept-tag tag-b">Concept B</div>
          <div class="concept-name">Brushed Titanium Glyph</div>
        </div>
        <span style="font-size: 18px;"></span>
      </div>
      <div class="concept-hero">
        <div class="concept-hero-box">${CONCEPT_B_SVG}</div>
      </div>
      <div class="concept-meta">
        <strong>Apple-Grade Keepsake Envelope:</strong> Precision-machined geometric keepsake envelope facet with a subtle heart apex in brushed titanium white. High contrast, hyper-crisp, Silicon Valley product design.
      </div>
    </div>

    <!-- Concept C -->
    <div class="concept-card">
      <div class="concept-header">
        <div>
          <div class="concept-tag tag-c">Concept C</div>
          <div class="concept-name">Velvet Noir & Rose Gold</div>
        </div>
        <span style="font-size: 18px;">💎</span>
      </div>
      <div class="concept-hero">
        <div class="concept-hero-box">${CONCEPT_C_SVG}</div>
      </div>
      <div class="concept-meta">
        <strong>High Jewelry Ribbon Knot:</strong> Deepest midnight espresso wine with an antique matte rose-gold ribbon knot. Evokes Cartier / Bulgari bespoke romance. Intimate, warm, zero neon.
      </div>
    </div>
  </div>

  <!-- Multi-Scale Comparison Table -->
  <div class="section-title">
    <span>📐</span> Multi-Scale Legibility Matrix (16px, 32px, 64px, 128px)
  </div>
  <div class="scale-matrix">
    <div class="matrix-row" style="font-weight: 700; color: #FFFFFF; font-size: 14px;">
      <div>Viewport Target</div>
      <div>Concept A (Champagne Gold)</div>
      <div>Concept B (Titanium Glyph)</div>
      <div>Concept C (Velvet Rose Gold)</div>
    </div>

    <!-- 128px -->
    <div class="matrix-row">
      <div class="matrix-label">128 × 128 px<br><span style="font-size: 11px; opacity:0.6;">App Store / Bookmark</span></div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:144px; height:144px; padding:8px;">
          <div style="width:128px; height:128px;">${CONCEPT_A_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:144px; height:144px; padding:8px;">
          <div style="width:128px; height:128px;">${CONCEPT_B_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:144px; height:144px; padding:8px;">
          <div style="width:128px; height:128px;">${CONCEPT_C_SVG}</div>
        </div>
      </div>
    </div>

    <!-- 64px -->
    <div class="matrix-row">
      <div class="matrix-label">64 × 64 px<br><span style="font-size: 11px; opacity:0.6;">Dock / High-DPI</span></div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:80px; height:80px; padding:8px;">
          <div style="width:64px; height:64px;">${CONCEPT_A_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:80px; height:80px; padding:8px;">
          <div style="width:64px; height:64px;">${CONCEPT_A_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:80px; height:80px; padding:8px;">
          <div style="width:64px; height:64px;">${CONCEPT_B_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:80px; height:80px; padding:8px;">
          <div style="width:64px; height:64px;">${CONCEPT_B_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:80px; height:80px; padding:8px;">
          <div style="width:64px; height:64px;">${CONCEPT_C_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:80px; height:80px; padding:8px;">
          <div style="width:64px; height:64px;">${CONCEPT_C_SVG}</div>
        </div>
      </div>
    </div>

    <!-- 32px -->
    <div class="matrix-row">
      <div class="matrix-label">32 × 32 px<br><span style="font-size: 11px; opacity:0.6;">Standard Tab Bar (Retina)</span></div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:48px; height:48px; padding:8px;">
          <div style="width:32px; height:32px;">${CONCEPT_A_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:48px; height:48px; padding:8px;">
          <div style="width:32px; height:32px;">${CONCEPT_A_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:48px; height:48px; padding:8px;">
          <div style="width:32px; height:32px;">${CONCEPT_B_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:48px; height:48px; padding:8px;">
          <div style="width:32px; height:32px;">${CONCEPT_B_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:48px; height:48px; padding:8px;">
          <div style="width:32px; height:32px;">${CONCEPT_C_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:48px; height:48px; padding:8px;">
          <div style="width:32px; height:32px;">${CONCEPT_C_SVG}</div>
        </div>
      </div>
    </div>

    <!-- 16px -->
    <div class="matrix-row">
      <div class="matrix-label">16 × 16 px<br><span style="font-size: 11px; opacity:0.6;">Standard Favicon (1x)</span></div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:32px; height:32px; padding:8px;">
          <div style="width:16px; height:16px;">${CONCEPT_A_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:32px; height:32px; padding:8px;">
          <div style="width:16px; height:16px;">${CONCEPT_A_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:32px; height:32px; padding:8px;">
          <div style="width:16px; height:16px;">${CONCEPT_B_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:32px; height:32px; padding:8px;">
          <div style="width:16px; height:16px;">${CONCEPT_B_SVG}</div>
        </div>
      </div>
      <div class="matrix-cell">
        <div class="preview-box bg-dark" style="width:32px; height:32px; padding:8px;">
          <div style="width:16px; height:16px;">${CONCEPT_C_SVG}</div>
        </div>
        <div class="preview-box bg-light" style="width:32px; height:32px; padding:8px;">
          <div style="width:16px; height:16px;">${CONCEPT_C_SVG}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Browser Chrome Tab Simulation -->
  <div class="section-title">
    <span>🌐</span> Real Browser Tab Bar Simulation
  </div>
  <div class="tabbar-simulation">
    <!-- Dark Mode Tab Bar -->
    <div class="tabbar-theme-label">Dark Mode Browser Tab Bar (macOS / Windows Chrome)</div>
    <div class="chrome-dark-bar">
      <div class="chrome-tab-dark">
        <div style="width:16px; height:16px; flex-shrink:0;">${CONCEPT_A_SVG}</div>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Dearly — Create Aesthetic Keepsakes</span>
        <span class="tab-close">✕</span>
      </div>
      <div class="chrome-tab-dark" style="background: transparent; color:#9CA3AF; opacity:0.8;">
        <div style="width:16px; height:16px; flex-shrink:0;">${CONCEPT_B_SVG}</div>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Concept B (Titanium)</span>
        <span class="tab-close">✕</span>
      </div>
      <div class="chrome-tab-dark" style="background: transparent; color:#9CA3AF; opacity:0.8;">
        <div style="width:16px; height:16px; flex-shrink:0;">${CONCEPT_C_SVG}</div>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Concept C (Rose Gold)</span>
        <span class="tab-close">✕</span>
      </div>
    </div>

    <!-- Light Mode Tab Bar -->
    <div class="tabbar-theme-label" style="border-top: 1px solid var(--border);">Light Mode Browser Tab Bar (macOS / Windows Chrome)</div>
    <div class="chrome-light-bar">
      <div class="chrome-tab-light">
        <div style="width:16px; height:16px; flex-shrink:0;">${CONCEPT_A_SVG}</div>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Dearly — Create Aesthetic Keepsakes</span>
        <span class="tab-close">✕</span>
      </div>
      <div class="chrome-tab-light" style="background: transparent; color:#6B7280; opacity:0.85;">
        <div style="width:16px; height:16px; flex-shrink:0;">${CONCEPT_B_SVG}</div>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Concept B (Titanium)</span>
        <span class="tab-close">✕</span>
      </div>
      <div class="chrome-tab-light" style="background: transparent; color:#6B7280; opacity:0.85;">
        <div style="width:16px; height:16px; flex-shrink:0;">${CONCEPT_C_SVG}</div>
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Concept C (Rose Gold)</span>
        <span class="tab-close">✕</span>
      </div>
    </div>
  </div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT_SCREENSHOT);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Writing screenshot to ${OUTPUT_SCREENSHOT}...`);
  await page.screenshot({
    path: OUTPUT_SCREENSHOT,
    fullPage: true
  });

  await browser.close();
  console.log('Comparison preview generated successfully!');
}

buildComparisonPreview().catch(err => {
  console.error('Error in buildComparisonPreview:', err);
  process.exit(1);
});
