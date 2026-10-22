import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Calendar, MapPin } from 'lucide-react';
import { soundEffects } from './SoundEffects';

// Curated aesthetic fallback photography
const DEFAULT_POLAROIDS = [
  {
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    caption: 'That unforgettable sunset where we laughed for hours',
    date: 'Summer Evening',
    location: 'Our Favorite Spot',
  },
  {
    url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80',
    caption: 'Little moments that mean everything to me ☕',
    date: 'Lazy Sunday',
    location: 'Corner Cafe',
  },
  {
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    caption: 'Holding hands and making promises we always keep',
    date: 'Golden Hour',
    location: 'By the Shore',
  },
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    caption: 'Pure joy, zero worries. Just you and me 🌸',
    date: 'Weekend Getaway',
    location: 'Botanical Park',
  },
];

export default function PolaroidGallery({
  photos = [],
  title = "Our Favorite Moments Captured",
  subtitle = "Click any photo to step into the memory",
  tapeStyle = "gold", // 'gold', 'pink', 'blue', 'none'
  rotations = [-2.5, 2, -1.5, 3, -2, 1.5],
  dark = false,
  titleClassName = '',
  subtitleClassName = '',
}) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  // Normalize photos prop (handles string URLs or object { url, caption, date })
  const normalizedPhotos = (photos && photos.length > 0 ? photos : DEFAULT_POLAROIDS).map((p, idx) => {
    if (typeof p === 'string') {
      return {
        url: p,
        caption: `Cherished Memory #${idx + 1}`,
        date: 'Special Day',
        location: 'With You',
      };
    }
    return {
      url: p.url || p.src || DEFAULT_POLAROIDS[idx % DEFAULT_POLAROIDS.length].url,
      caption: p.caption || p.title || `Memory #${idx + 1}`,
      date: p.date || p.time || 'A sweet moment',
      location: p.location || '',
    };
  });

  const openLightbox = (index) => {
    soundEffects.playPop();
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    soundEffects.playPop();
    setActivePhotoIndex((prev) => (prev + 1) % normalizedPhotos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    soundEffects.playPop();
    setActivePhotoIndex((prev) => (prev - 1 + normalizedPhotos.length) % normalizedPhotos.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setActivePhotoIndex((prev) => (prev + 1) % normalizedPhotos.length);
      if (e.key === 'ArrowLeft') setActivePhotoIndex((prev) => (prev - 1 + normalizedPhotos.length) % normalizedPhotos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, normalizedPhotos.length]);

  const tapeClass = {
    gold: 'washi-tape',
    pink: 'washi-tape-pink',
    blue: 'washi-tape-blue',
    cyan: 'bg-cyan-400/80 shadow-[0_1px_4px_rgba(6,182,212,0.4)]',
    terracotta: 'bg-amber-600/70 shadow-[0_1px_3px_rgba(180,83,9,0.3)]',
    none: 'hidden',
  }[tapeStyle] || 'washi-tape';

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className={`text-2xl sm:text-3xl font-bold ${titleClassName || (dark ? 'text-white' : 'text-slate-900')}`}>
          {title}
        </h2>
        <p className={`text-xs sm:text-sm mt-1 max-w-md mx-auto ${subtitleClassName || (dark ? 'text-indigo-200/80' : 'text-slate-500')}`}>
          {subtitle}
        </p>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
        {normalizedPhotos.map((photo, index) => {
          const rotationAngle = rotations[index % rotations.length];
          return (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              style={{ transform: `rotate(${rotationAngle}deg)` }}
              className="group relative cursor-pointer select-none transition-transform duration-300 hover:z-20 hover:scale-105"
            >
              {/* Optional Washi Tape Sticker */}
              {tapeStyle !== 'none' && (
                <div 
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 z-10 ${tapeClass}`}
                  style={{ transform: `rotate(${rotationAngle * -0.6}deg)` }}
                />
              )}

              {/* Polaroid Card */}
              <div className="polaroid-frame bg-white rounded-xs">
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 rounded-2xs mb-3 shadow-inner">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-white/90 text-slate-800 shadow-md">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Handwritten Caption & Date */}
                <div className="text-center px-1">
                  <p className="font-handwriting text-lg sm:text-xl font-semibold text-slate-800 leading-tight">
                    {photo.caption}
                  </p>
                  {photo.date && (
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-medium font-mono">
                      {photo.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-50"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={prevPhoto}
            className="absolute left-3 sm:left-6 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer z-50"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextPhoto}
            className="absolute right-3 sm:right-6 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer z-50"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Frame */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col items-center max-h-[90vh]"
          >
            <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/5">
              <img
                src={normalizedPhotos[activePhotoIndex].url}
                alt={normalizedPhotos[activePhotoIndex].caption}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Lightbox Caption & Info */}
            <div className="w-full mt-4 text-center">
              <h4 className="font-handwriting text-2xl sm:text-3xl text-slate-800 font-semibold">
                {normalizedPhotos[activePhotoIndex].caption}
              </h4>
              <div className="flex items-center justify-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                {normalizedPhotos[activePhotoIndex].date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    {normalizedPhotos[activePhotoIndex].date}
                  </span>
                )}
                {normalizedPhotos[activePhotoIndex].location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {normalizedPhotos[activePhotoIndex].location}
                  </span>
                )}
                <span className="text-slate-400">
                  {activePhotoIndex + 1} / {normalizedPhotos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
