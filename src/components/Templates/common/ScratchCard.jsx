import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Wand2, CheckCircle2 } from 'lucide-react';
import { soundEffects } from './SoundEffects';

export default function ScratchCard({
  scratchCard = null,
  hiddenMessage = "",
  subtitle = "",
  title = "",
  theme = "rose", // 'rose', 'gold', 'lavender'
  voucherCode = ""
}) {
  const resolvedTitle = title || scratchCard?.title || "Mystery Keepsake Scratch Card";
  const resolvedMessage = hiddenMessage || scratchCard?.hiddenSecret || scratchCard?.hiddenMessage || "Valid for: 1x Late-Night Drive + Favorite Dessert on Me! 🍨🚗";
  const resolvedSubtitle = subtitle || scratchCard?.subtitle || "Redeemable anytime with zero expiration date ❤️";
  const resolvedCode = voucherCode || scratchCard?.code || scratchCard?.voucherCode || "LOVE-FOREVER-2026";

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

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
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
    } else if (theme === 'lavender') {
      grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f3e8ff');
      grad.addColorStop(0.3, '#c084fc');
      grad.addColorStop(0.7, '#9333ea');
      grad.addColorStop(1, '#e9d5ff');
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

    // Decorative Sparkle text on foil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch with finger or mouse ✨', width / 2, height / 2 - 8);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Secret Keepsake Inside', width / 2, height / 2 + 14);
  }, [theme]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

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
    const x = clientX - rect.left;
    const y = clientY - rect.top;

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
      <div className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-xl border border-white/80 overflow-hidden text-center">
        
        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-700 mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>Scratch to Reveal</span>
          </div>
          <h3 className="font-semibold text-xl sm:text-2xl font-bold text-slate-800">
            {resolvedTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Scratch the foil layer below to unlock your special voucher
          </p>
        </div>

        {/* Scratch Area Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-dashed border-rose-200/90 shadow-md bg-white flex items-center justify-center select-none"
        >
          {/* Secret Hidden Layer (Underneath) */}
          <div className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center bg-gradient-to-tr from-rose-50 via-pink-50 to-amber-50 z-0">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2 shadow-xs">
              <Gift className="w-5 h-5 animate-bounce" />
            </div>
            
            <p className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-600 leading-tight">
              {resolvedMessage}
            </p>

            <p className="text-xs text-slate-500 mt-2 font-medium">
              {resolvedSubtitle}
            </p>

            <div className="mt-3 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/90 border border-rose-200 text-[11px] font-mono text-slate-600 shadow-xs">
              <span className="text-rose-500 font-bold">VOUCHER:</span> {resolvedCode}
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
