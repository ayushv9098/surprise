import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/**
 * High-performance LottieFiles .lottie player with:
 * - Rust/WASM powered ThorVG rendering via @lottiefiles/dotlottie-react
 * - Zero Cumulative Layout Shift (CLS) container
 * - Full accessibility compliance (prefers-reduced-motion)
 * - Safe fallback handling
 */
export default function LottieAnimation({
  src,
  autoplay = true,
  loop = true,
  className = 'w-24 h-24',
  style = {},
  ariaLabel = 'Animation',
  hoverTrigger = false,
  fallback = null,
}) {
  const [dotLottie, setDotLottie] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldAutoplay = autoplay && !hoverTrigger && !prefersReducedMotion;

  if (hasError) {
    return fallback;
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={style}
      role="img"
      aria-label={ariaLabel}
      onMouseEnter={() => {
        if (hoverTrigger && dotLottie && !prefersReducedMotion) {
          dotLottie.play();
        }
      }}
      onMouseLeave={() => {
        if (hoverTrigger && dotLottie && !prefersReducedMotion) {
          dotLottie.stop();
        }
      }}
    >
      <DotLottieReact
        src={src}
        loop={loop && !prefersReducedMotion}
        autoplay={shouldAutoplay}
        dotLottieRefCallback={(instance) => setDotLottie(instance)}
        onError={() => setHasError(true)}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
