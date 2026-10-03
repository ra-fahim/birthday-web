import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { getYouTubeId, youtubeThumbnail } from '../utils/youtube';
import { useSiteConfig, useEditorMode, bb, t } from '../utils/siteConfig';

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
const DEFAULT_MUSEUM_ITEMS: MuseumItem[] = [
  {
    id: '1',
    type: 'image',
    url: '/museum-gallery/1.jpg',
    title: 'The First Glance',
    date: 'Chapter I',
    description: 'A quiet beginning, preserved like a favorite page in our story.',
  },
  {
    id: '2',
    type: 'image',
    url: '/museum-gallery/4.jpg',
    title: 'Golden Little Moments',
    date: 'Chapter II',
    description: 'The ordinary moments that somehow became the ones I wanted to keep forever.',
  },
  {
    id: '3',
    type: 'video',
    url: '/museum-gallery/2.mp4',
    thumbnail: '/museum-gallery/2-thumb.png',
    title: 'A Memory in Motion',
    date: 'Chapter III',
    description: 'Press play and let one of our favorite memories move again.',
  },
];

export const MuseumGallery: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MuseumItem | null>(null);
  const siteConfig = useSiteConfig();
  const editor = useEditorMode();
  const MUSEUM_ITEMS = siteConfig.museum?.length ? siteConfig.museum : DEFAULT_MUSEUM_ITEMS;

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
        <h2 className="font-serif text-4xl md:text-6xl mb-4 text-love-text dark:text-love-dark-text tracking-tight" {...bb('texts.museumTitle', 'Museum title')}>
          {t(siteConfig, 'museumTitle')}
        </h2>
        <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-love-accent dark:text-love-dark-text font-bold opacity-90" {...bb('texts.museumSubtitle', 'Museum subtitle')}>
          {t(siteConfig, 'museumSubtitle')}
        </p>
        <div className="w-16 h-[1px] bg-love-accent/30 dark:bg-love-dark-accent/30 mx-auto mt-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {MUSEUM_ITEMS.map((item, index) => (
          <MuseumFrame
            key={item.id || index}
            item={item}
            index={index}
            onOpenFullView={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {editor && (
        <div className="mt-12 flex justify-center">
          <div className="cursor-pointer rounded-full border border-dashed border-love-accent/60 px-6 py-3 text-xs uppercase tracking-widest text-love-accent" {...bb('museum', 'Add a new memory', MUSEUM_ITEMS.length)}>＋ Add a photo / video memory</div>
        </div>
      )}

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
  const isInView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.985 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.12 }}
      className="group relative flex flex-col"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Premium editorial memory card — replaces the old literal gold photo frame. */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/55 bg-white/65 p-2 shadow-[0_24px_70px_rgba(55,30,42,0.14)] backdrop-blur-xl transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-[0_30px_90px_rgba(55,30,42,0.20)] dark:border-white/10 dark:bg-white/[0.07]">
        <div className="relative overflow-hidden rounded-[22px] border border-black/5 bg-[#161214] dark:border-white/10">
          <div className="relative w-full aspect-[4/5]" {...bb('museum', `Memory ${index + 1} — photo / video`, index)}>
            <button
              type="button"
              onClick={onOpenFullView}
              className="absolute inset-0 h-full w-full overflow-hidden bg-black text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-love-accent"
              aria-label={`View full size: ${item.title}`}
            >
              {item.type === 'video' ? (
                <VideoPlayer url={item.url} thumbnail={item.thumbnail} />
              ) : (
                <OptimizedImage
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
                  priority={index === 0}
                  style={{ transform: 'translate3d(0,0,0)' }}
                />
              )}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_32%,rgba(0,0,0,0.42))]" />
              <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)] opacity-70" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                0{index + 1}
              </div>

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/15 text-white shadow-[0_18px_45px_rgba(0,0,0,0.30)] backdrop-blur-xl transition-transform duration-500 group-hover:scale-110 sm:h-[72px] sm:w-[72px]">
                    <Play className="ml-1 h-6 w-6 fill-white" />
                  </div>
                </div>
              )}

              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">{item.date || 'Memory'}</p>
                  <p className="mt-1 truncate font-serif text-xl italic drop-shadow-lg sm:text-2xl">{item.title}</p>
                </div>
                <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">Open</span>
              </div>
            </button>
          </div>
        </div>

        {/* Fine highlight edge */}
        <div className="pointer-events-none absolute inset-[2px] rounded-[26px] border border-white/25 dark:border-white/10" />
      </div>

      <figcaption className="px-2 pt-5">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-love-accent/15 dark:bg-love-dark-accent/15" />
          <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.28em] text-love-accent/70 dark:text-love-dark-accent/70">Museum Love</span>
          <span className="h-px flex-1 bg-love-accent/15 dark:bg-love-dark-accent/15" />
        </div>
        <div className="mt-3 text-center">
          <h3 className="font-serif text-xl font-medium italic text-love-text dark:text-love-dark-text" {...bb('museum', `Memory ${index + 1} — title`, index)}>
            {item.title}
          </h3>
          {item.date && (
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-love-accent/70 dark:text-love-dark-accent/70" {...bb('museum', `Memory ${index + 1} — date`, index)}>
              {item.date}
            </p>
          )}
          <p className="mx-auto mt-3 max-w-sm font-serif text-sm leading-6 text-love-text/65 dark:text-love-dark-text/65" {...bb('museum', `Memory ${index + 1} — description`, index)}>
            {item.description}
          </p>
        </div>
      </figcaption>
    </motion.figure>
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
