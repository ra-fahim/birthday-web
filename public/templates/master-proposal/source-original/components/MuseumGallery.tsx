import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { getYouTubeId, youtubeThumbnail } from '../utils/youtube';

// Types for our museum items
type MediaType = 'image' | 'video';

interface MuseumItem {
  id: string;
  type: MediaType;
  url: string; // Image URL, or video URL — any of: local file (/museum-gallery/x.mp4),
  // a direct hosted link (Cloudinary etc.), or a YouTube link (watch/shorts/youtu.be).
  thumbnail?: string; // Optional for videos — auto-filled from YouTube if url is a YouTube link.
  title: string;
  date?: string;
  description: string;
}

// -----------------------------------------------------------------------------
// Add your photos/videos here. `url` accepts:
//   - a local file placed in public/museum-gallery/ (e.g. '/museum-gallery/1.jpg')
//   - a direct Cloudinary/hosted file URL (e.g. 'https://res.cloudinary.com/.../1.jpg')
//   - for videos only, a YouTube link (e.g. 'https://youtu.be/XXXXXXXXXXX') — no need
//     to add a `thumbnail`, it's pulled from YouTube automatically.
// -----------------------------------------------------------------------------
const MUSEUM_ITEMS: MuseumItem[] = [
  {
    id: '1',
    type: 'image',
    url: '/museum-gallery/1.jpg',
    title: 'The First Glance',
    date: 'January 2025',
    description: 'The moment our paths crossed personally.',
  },
  {
    id: '2',
    type: 'video',
    url: '/museum-gallery/2.mp4',
    thumbnail: '/museum-gallery/2-thumb.png',
    title: 'Samgyeopsal and Moral Support',
    date: 'March 2025',
    description: 'We shared a meal and a laugh together. I love your laughs.',
  },
  {
    id: '3',
    type: 'video',
    url: '/museum-gallery/3.mp4',
    thumbnail: '/museum-gallery/3-thumb.png',
    title: 'Anniversary Dinner',
    date: 'January 2026',
    description: 'We dressed up, ate too much, and had a great time together.',
  },
  {
    id: '4',
    type: 'image',
    url: '/museum-gallery/4.jpg',
    title: 'My First Birthday with You!',
    date: 'November 2025',
    description: 'We Celebrated my first birthday with you!',
  },
  {
    id: '5',
    type: 'video',
    url: '/museum-gallery/5.mp4',
    thumbnail: '/museum-gallery/5-thumb.jpg',
    title: 'Home is where you are!',
    date: 'June 2025',
    description: 'Every time I see you, I feel like I\'m home.',
  },
  {
    id: '6',
    type: 'image',
    url: '/museum-gallery/6.jpg',
    title: 'Your First Birthday with Me!',
    date: 'October 2025',
    description: 'We Celebrated your first birthday with me! I love you so much!',
  }
];

export const MuseumGallery: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MuseumItem | null>(null);

  const closeLightbox = useCallback(() => setSelectedItem(null), []);

  useEffect(() => {
    if (selectedItem == null) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [selectedItem, closeLightbox]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-20">
        <h2 className="font-serif text-4xl md:text-6xl mb-4 text-love-text dark:text-love-dark-text tracking-tight">
          Museum of Our Love
        </h2>
        <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-love-accent dark:text-love-dark-text font-bold opacity-90">
          A Curated Collection of Us
        </p>
        <div className="w-16 h-[1px] bg-love-accent/30 dark:bg-love-dark-accent/30 mx-auto mt-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {MUSEUM_ITEMS.map((item, index) => (
          <MuseumFrame
            key={item.id}
            item={item}
            index={index}
            onOpenFullView={() => setSelectedItem(item)}
          />
        ))}
      </div>

      <Lightbox item={selectedItem} onClose={closeLightbox} />
    </div>
  );
};

import { createPortal } from 'react-dom';

const Lightbox: React.FC<{ item: MuseumItem | null; onClose: () => void }> = ({ item, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !item) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] w-full ${item.type === 'video' ? 'max-w-4xl' : 'max-w-3xl' // Broader for visual consistency on video
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Area - Specific handling for Image vs Video */}
          <div className="bg-black flex items-center justify-center relative w-full overflow-hidden shrink-0">
            {item.type === 'image' ? (
              <div className="relative w-full flex justify-center py-4 bg-black/50">
                <img
                  src={item.url}
                  alt={item.title}
                  className="max-h-[60vh] w-auto object-contain shadow-lg"
                  draggable={false}
                />
              </div>
            ) : getYouTubeId(item.url) ? (
              <div className="w-full aspect-video max-h-[60vh]">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full aspect-video max-h-[60vh]">
                <video
                  src={item.url}
                  poster={item.thumbnail}
                  className="w-full h-full object-contain bg-black"
                  controls
                  playsInline
                  loop
                  autoPlay
                />
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6 text-center overflow-y-auto bg-white dark:bg-zinc-900 flex-none">
            <h3 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            {item.date && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#bf953f] mb-4">
                {item.date}
              </p>
            )}
            <div className="w-12 h-[1px] bg-gray-200 dark:bg-gray-700 mb-6 mx-auto" />
            <p className="font-serif text-lg text-gray-600 dark:text-gray-300 italic leading-relaxed max-w-2xl mx-auto">
              {item.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// -----------------------------------------------------------------------------
// Frame Component 
// -----------------------------------------------------------------------------
import { useInView } from 'framer-motion';

const MuseumFrame: React.FC<{
  item: MuseumItem;
  index: number;
  onOpenFullView: () => void;
}> = ({ item, index, onOpenFullView }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: (index % 3) * 0.15
      }}
      style={{ 
        transform: 'translate3d(0,0,0)', // Force GPU acceleration
        willChange: 'opacity',
        contentVisibility: 'auto' // Browser hint for off-screen rendering optimization
      }}
      className="flex flex-col items-center"
    >
      {/* 
        THE GOLDEN CURVY FRAME 
        Created using CSS gradients for the gold effect and shadows for the molding depth.
      */}
      <div
        className="relative w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.01]"
        style={{
          // Realistic Metallic Gold Gradient
          background: 'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
          padding: '16px',
          borderRadius: '4px',
          boxShadow: `
            0px 10px 20px rgba(0,0,0,0.4), 
            inset 0px 0px 0px 2px rgba(139, 69, 19, 0.5), /* Inner dark line */
            inset 4px 4px 10px rgba(255, 255, 255, 0.5), /* Highlight */
            inset -4px -4px 10px rgba(0, 0, 0, 0.3) /* Shadow */
          `
        }}
      >
        {/* Decorative Baroque Pattern Overlay (CSS Pattern) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c10-10 20 0 20 0s-10 10-20 0zm0 0c-10 10-20 0-20 0s10-10 20 0z' fill='%236b4c1e' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />

        {/* Inner Molding (The dip before the picture) */}
        <div className="bg-[#2a2a2a] p-[2px] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] h-full w-full">
          {/* The Artwork/Video Container — click to open full view */}
          {/* 
            Using padding-bottom trick as universal fallback for aspect-ratio.
            aspect-ratio CSS is not supported on older mobile browsers (iOS <15, Android WebView <93).
            padding-bottom: 133.33% = 4/3 ratio (height = 133.33% of width)
          */}
          <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
            <button
              type="button"
              onClick={onOpenFullView}
              className="absolute inset-0 w-full h-full bg-black shadow-inner overflow-hidden cursor-pointer block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-love-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2a2a]"
              aria-label={`View full size: ${item.title}`}
            >
              {item.type === 'video' ? (
                <VideoPlayer url={item.url} thumbnail={item.thumbnail} />
              ) : (
                <OptimizedImage
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  priority={index === 0} // First image has priority
                  style={{ transform: 'translate3d(0,0,0)' }}
                />
              )}

              {/* Glass Reflection Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-20 pointer-events-none z-10" />
            </button>
          </div>
        </div>
      </div>

      {/* The Museum Label / Plaque */}
      <div className="mt-8 max-w-[85%] text-center">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-6 py-4 shadow-md relative">
          {/* Gold Screw heads */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#bf953f] shadow-sm" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#bf953f] shadow-sm" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#bf953f] shadow-sm" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#bf953f] shadow-sm" />

          <h3 className="font-serif text-xl text-gray-900 dark:text-gray-100 italic font-medium mb-1">
            {item.title}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">
            {item.date}
          </p>
          <p className="font-serif text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Grid video: thumbnail + play icon; click is handled by parent (opens lightbox)
const VideoPlayer: React.FC<{ url: string; thumbnail?: string }> = ({ url, thumbnail }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeId = getYouTubeId(url);
  const posterSrc = thumbnail || (youtubeId ? youtubeThumbnail(youtubeId) : undefined);

  useEffect(() => {
    if (youtubeId) return; // YouTube: just show the poster image, no <video> preload needed
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Start loading 100px before viewport
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [youtubeId]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translate3d(0,0,0)' }}>
      {youtubeId ? (
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <video
          ref={videoRef}
          src={shouldLoad ? url : undefined}
          poster={posterSrc}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          preload={shouldLoad ? 'metadata' : 'none'}
          style={{ transform: 'translate3d(0,0,0)' }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-1" />
        </div>
      </div>
    </div>
  );
};
