import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
  info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
};

const progressColors = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-sky-500',
};

function ToastCard({ toast, onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const duration = typeof toast.duration === 'number' ? toast.duration : 3500;
  const remainingTimeRef = useRef(duration);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep onClose callback ref fresh
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const triggerDismiss = useCallback(() => {
    setIsExiting((alreadyExiting) => {
      if (alreadyExiting) return true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      exitTimerRef.current = setTimeout(() => {
        onCloseRef.current?.();
      }, 250);
      return true;
    });
  }, []);

  // Auto-dismiss countdown timer
  useEffect(() => {
    if (duration <= 0) return;

    remainingTimeRef.current = duration;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      triggerDismiss();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [duration, triggerDismiss]);

  const handleMouseEnter = () => {
    if (isExiting) return;
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    if (isExiting) return;
    setIsPaused(false);
    if (remainingTimeRef.current <= 0) {
      triggerDismiss();
      return;
    }
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      triggerDismiss();
    }, remainingTimeRef.current);
  };

  const handleCloseClick = (e) => {
    e?.stopPropagation?.();
    triggerDismiss();
  };

  const type = toast.type || 'info';

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-250 ease-out ${
        isExiting
          ? 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          : 'animate-toast-enter opacity-100 translate-y-0 scale-100'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg shadow-slate-200/50 text-xs sm:text-sm font-medium text-slate-800 overflow-hidden">
        {icons[type] || icons.info}
        <span className="leading-snug">{toast.message}</span>
        <button
          type="button"
          onClick={handleCloseClick}
          className="ml-2 -mr-1 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 active:scale-90 transition-all cursor-pointer"
          aria-label="Dismiss notification"
          disabled={isExiting}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Subtle timer progress line */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100/80 overflow-hidden">
            <div
              className={`h-full w-full origin-left ${progressColors[type] || progressColors.info}`}
              style={{
                animation: `toastProgress ${duration}ms linear forwards`,
                animationPlayState: isPaused ? 'paused' : 'running',
                transformOrigin: 'left',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const toastKey = toast.id || (typeof toast === 'string' ? toast : `${toast.type || 'info'}-${toast.message}`);

  return (
    <ToastCard
      key={toastKey}
      toast={toast}
      onClose={onClose}
    />
  );
}
