import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Wand2, CheckCircle2 } from 'lucide-react';
import { soundEffects } from './SoundEffects';
import AppleEmoji, { renderAppleText } from '../../common/AppleEmoji';

export default function ScratchCard({
  scratchCard = null,
  scratchData = null,
  hiddenMessage = "",
  defaultSecret = "",
  subtitle = "",
  title = "",
  defaultTitle = "",
  theme = "rose", // 'rose', 'gold', 'lavender', 'celestial'
  voucherCode = "",
  dark = false
}) {
  const cardData = scratchCard || scratchData;
  const resolvedTitle = title || defaultTitle || cardData?.title || "Mystery Keepsake Scratch Card";
  const resolvedMessage = hiddenMessage || defaultSecret || cardData?.hiddenSecret || cardData?.hiddenMessage || "Valid for: 1x Late-Night Drive + Favorite Dessert on Me! 🍨🚗";
  const resolvedSubtitle = subtitle || cardData?.subtitle || "Redeemable anytime with zero expiration date ❤️";
  const resolvedCode = voucherCode || cardData?.code || cardData?.voucherCode || "LOVE-FOREVER-2026";

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const isDrawing = useRef(false);
  const lastCheckTime = useRef(0);

  // Initialize Canvas Foil
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth || containerRef.current?.offsetWidth || 400;
    const height = canvas.offsetHeight || containerRef.current?.offsetHeight || 192;
    canvas.width = width;
    canvas.height = height;

    // Premium Foil Gradient
    let grad;
    if (theme === 'gold') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#fef3c7');
      grad.addColorStop(0.3, '#f59e0b');
      grad.addColorStop(0.7, '#d97706');
      grad.addColorStop(1, '#fbbf24');
    } else if (theme === 'celestial' || theme === 'indigo') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#e0e7ff');
      grad.addColorStop(0.3, '#818cf8');
      grad.addColorStop(0.7, '#4338ca');
      grad.addColorStop(1, '#312e81');
    } else if (theme === 'lavender') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f3e8ff');
      grad.addColorStop(0.3, '#c084fc');
      grad.addColorStop(0.7, '#9333ea');
      grad.addColorStop(1, '#e9d5ff');
    } else if (theme === 'neon' || theme === 'cyan') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#cffafe');
      grad.addColorStop(0.3, '#06b6d4');
      grad.addColorStop(0.7, '#0891b2');
      grad.addColorStop(1, '#67e8f9');
    } else if (theme === 'cozy' || theme === 'copper') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#ffedd5');
      grad.addColorStop(0.3, '#f97316');
      grad.addColorStop(0.7, '#c2410c');
      grad.addColorStop(1, '#fdba74');
    } else if (theme === 'olive' || theme === 'emerald') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#dcfce7');
      grad.addColorStop(0.3, '#22c55e');
      grad.addColorStop(0.7, '#15803d');
      grad.addColorStop(1, '#86efac');
    } else {
      // Rose gold default
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#ffe4e6');
      grad.addColorStop(0.3, '#fb7185');
      grad.addColorStop(0.7, '#e11d48');
      grad.addColorStop(1, '#fbcfe8');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Foil base styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(10, 10, width - 20, height - 20);
  }, [theme]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!isRevealed) {
        initCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isRevealed]);

  const revealEntireCard = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);
    setScratchProgress(100);
    soundEffects.playCelebration();

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FB7185', '#FBBF24', '#C084FC']
      });
    } catch {}
  }, [isRevealed]);

  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let clearPixels = 0;
      const totalPixels = data.length / 4;

      // Sample every 4th pixel for speed
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) {
          clearPixels += 4;
        }
      }

      const percent = Math.min(100, Math.round((clearPixels / totalPixels) * 100));
      setScratchProgress(percent);

      if (percent > 40) {
        revealEntireCard();
      }
    } catch {}
  }, [isRevealed, revealEntireCard]);

  // Scratch Action
  const scratch = useCallback((clientX, clientY) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2, false);
    ctx.fill();

    soundEffects.playScratch();

    // Check scratch completion throttle (every 180ms)
    const now = Date.now();
    if (now - lastCheckTime.current > 180) {
      lastCheckTime.current = now;
      checkScratchPercentage();
    }
  }, [isRevealed, checkScratchPercentage]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    isDrawing.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDrawing.current) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    isDrawing.current = false;
  };

  return (
    <div className="w-full max-w-lg mx-auto my-10 px-4">
      {/* Outer Card Wrapper */}
      <div className={`relative rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden text-center ${
        dark 
          ? 'bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 shadow-indigo-950/60' 
          : 'glass-card border border-white/80'
      }`}>
        
        {/* Header */}
        <div className="mb-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
            dark 
              ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-300' 
              : (theme === 'gold' 
                  ? 'bg-amber-50 border border-amber-200/80 text-amber-700' 
                  : 'bg-rose-50 border border-rose-200/80 text-rose-700')
          }`}>
            <AppleEmoji emoji="🎁" size={14} />
            <span>Scratch to Reveal</span>
          </div>
          <h3 className={`font-semibold text-xl sm:text-2xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
            {renderAppleText(resolvedTitle)}
          </h3>
          <p className={`text-xs mt-1 ${dark ? 'text-indigo-200/80' : 'text-slate-500'}`}>
            Scratch the foil layer below to unlock your special voucher
          </p>
        </div>

        {/* Scratch Area Container */}
        <div 
          ref={containerRef}
          className={`relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed shadow-md flex items-center justify-center select-none ${
            dark 
              ? 'border-indigo-500/40 bg-slate-950' 
              : 'border-rose-200/90 bg-white'
          }`}
        >
          {/* Secret Hidden Layer (Underneath) */}
          <div className={`absolute inset-0 p-5 flex flex-col items-center justify-center text-center z-0 ${
            dark 
              ? 'bg-gradient-to-tr from-slate-950 via-indigo-950/90 to-slate-900' 
              : 'bg-gradient-to-tr from-rose-50 via-pink-50 to-amber-50'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-xs ${
              dark ? 'bg-indigo-900/60' : 'bg-rose-100'
            }`}>
              <AppleEmoji emoji="🎁" size={24} className="animate-bounce" />
            </div>
            
            <p className={`font-handwriting text-2xl sm:text-3xl font-bold leading-tight ${
              dark ? 'text-indigo-300' : 'text-rose-600'
            }`}>
              {renderAppleText(resolvedMessage)}
            </p>

            <p className={`text-xs mt-2 font-medium ${
              dark ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {renderAppleText(resolvedSubtitle)}
            </p>

            <div className={`mt-3 inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-mono shadow-xs ${
              dark 
                ? 'bg-slate-800/90 border border-indigo-500/40 text-indigo-200' 
                : 'bg-white/90 border border-rose-200 text-slate-600'
            }`}>
              <span className={`font-bold ${dark ? 'text-indigo-400' : 'text-rose-500'}`}>VOUCHER:</span> {resolvedCode}
            </div>
          </div>

          {/* Interactive HTML5 Canvas Foil (Top Layer) */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none transition-opacity duration-500"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          )}

          {/* Sparkle instruction overlay on top of foil */}
          {!isRevealed && scratchProgress === 0 && (
            <div className="absolute inset-0 pointer-events-none z-15 flex flex-col items-center justify-center select-none text-white drop-shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-white/95">
                <AppleEmoji emoji="✨" size={16} />
                <span>Scratch with finger or mouse</span>
                <AppleEmoji emoji="✨" size={16} />
              </div>
              <span className="text-xs text-white/80 mt-1">Secret Keepsake Inside</span>
            </div>
          )}

          {/* Shimmer sweep effect over foil before scratching */}
          {!isRevealed && scratchProgress === 0 && (
            <div className="absolute inset-0 pointer-events-none animate-scratch-shimmer z-20 opacity-40" />
          )}
        </div>

        {/* Progress & Quick Reveal fallback */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            {isRevealed ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Unlocked!
              </span>
            ) : (
              `Scratched: ${scratchProgress}%`
            )}
          </span>

          {!isRevealed && (
            <button
              onClick={revealEntireCard}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium underline underline-offset-2 cursor-pointer"
            >
              <Wand2 className="w-3 h-3" />
              <span>Tap to Reveal All</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
