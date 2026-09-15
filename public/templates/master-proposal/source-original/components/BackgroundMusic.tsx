import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  /** Becomes true once the intro gate is finished (the "Yes, forever" moment). */
  start: boolean;
  /** Audio file URL coming from the platform config. Empty = no music at all. */
  src?: string;
}

const TARGET_VOLUME = 0.4;

/**
 * One single looping background track for the whole experience.
 * It never renders a playlist — the site owner uploads exactly one file
 * in Wishly Studio (Music tab) and it starts right after the intro gate.
 */
export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ start, src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const url = (src || '').trim();

  // Start (or stop) playback with the intro gate.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    if (!start) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.volume = TARGET_VOLUME;

    const tryPlay = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    tryPlay();

    // If the browser still blocks autoplay, retry on the next interaction.
    const retry = () => {
      if (audio.paused && !isMuted) tryPlay();
    };
    window.addEventListener('pointerdown', retry);
    window.addEventListener('keydown', retry);

    return () => {
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('keydown', retry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, url]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = TARGET_VOLUME;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      setIsMuted(false);
    } else {
      audio.pause();
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  if (!url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="auto" playsInline />

      <AnimatePresence>
        {start && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.8 }}
            onClick={toggle}
            aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
            className="fixed bottom-6 left-6 z-[60] p-2.5 md:p-3 rounded-full bg-love-accent/15 hover:bg-love-accent/25 dark:bg-love-dark-accent/15 dark:hover:bg-love-dark-accent/25 text-love-accent dark:text-love-dark-accent backdrop-blur-md shadow-sm border border-love-accent/20 dark:border-love-dark-accent/20 transition-all active:scale-95 touch-manipulation"
          >
            {isPlaying
              ? <Volume2 className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
              : <VolumeX className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackgroundMusic;
