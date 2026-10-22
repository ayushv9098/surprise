import React, { useState } from 'react';

const PARTICLE_PRESETS = {
  hearts: ['💖', '💕', '🌸', '💗', '✨', '🤍', '🌷'],
  stars: ['✨', '⭐', '🌟', '💫', '🥂', '🎉'],
  petals: ['🌸', '🌺', '🍃', '🌷', '🩰', '✨'],
  lavender: ['💜', '🪻', '🫧', '✨', '🕊️', '🌸'],
  olive: ['🕊️', '🌿', '🍃', '💚', '✨', '🤍', '💫', '🌱'],
  sunrise: ['🌤️', '☀️', '🌻', '💛', '✨', '🌈', '💫', '🌱'],
  confetti: ['🎊', '🎉', '🎈', '⭐', '🧁', '✨'],
  sparks: ['⚡', '✨', '🔥', '💫', '💥', '⭐'],
  leaves: ['🍂', '🍁', '🍃', '🌻', '☕', '✨'],
};

export default function AmbientParticles({ type = 'hearts', count = 22, items = null }) {
  const [particles] = useState(() => {
    const symbols = items && items.length > 0 ? items : (PARTICLE_PRESETS[type] || PARTICLE_PRESETS.hearts);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      char: symbols[i % symbols.length],
      left: Math.random() * 100, // percentage
      size: Math.random() * 14 + 14, // 14px to 28px
      duration: Math.random() * 8 + 10, // 10s to 18s
      delay: Math.random() * 8, // 0 to 8s
      drift: (Math.random() - 0.5) * 60, // horizontal drift px
      opacity: Math.random() * 0.4 + 0.35,
      rotation: Math.random() * 360,
    }));
  });

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(105vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--p-opacity, 0.6);
          }
          90% {
            opacity: var(--p-opacity, 0.6);
          }
          100% {
            transform: translateY(-15vh) translateX(var(--p-drift, 20px)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none will-change-transform"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            bottom: '-20px',
            '--p-drift': `${p.drift}px`,
            '--p-opacity': p.opacity,
            animation: `floatUpward ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
