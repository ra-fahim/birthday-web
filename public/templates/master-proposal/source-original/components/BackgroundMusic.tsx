import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useEditorMode, bb } from '../utils/siteConfig';

interface BackgroundMusicProps {
  start: boolean;
  src?: string;
}

const TARGET_VOLUME = 0.4;

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ start, src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const url = (src || '').trim();
  const editor = useEditorMode();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    if (!start || editor) {
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
  }, [start, url, editor]);

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

  const editChip = editor ? (
    <div
      className="fixed bottom-6 left-6 z-[60] cursor-pointer rounded-full border border-dashed border-love-accent/70 bg-white/90 px-4 py-2 text-xs uppercase tracking-widest text-love-accent shadow-md"
      {...bb('bgMusicUrl', 'Background music')}
    >
      🎵 {url ? 'Background music' : 'Add background music'}
    </div>
  ) : null;

  if (!url) return editChip;

  return (
    <>
      {editChip}
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
