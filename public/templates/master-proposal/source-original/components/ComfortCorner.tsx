import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, Battery, Heart, Frown, Smile, Play, Pause, Volume2, Mic, Shrink } from 'lucide-react';

interface Mood {
  id: string;
  label: string;
  icon: React.ReactNode;
  response: string;
  color: string;
  audioSrc: string; // Path to the heartfelt voice message
}

const MOODS: Mood[] = [
  {
    id: 'tired',
    label: "I'm Tired",
    icon: <Battery className="w-5 h-5 rotate-90" />,
    response: "Baby, I know you've been running on fumes lately. I see how hard you're working, and I'm so incredibly proud of you—but please remember that you don't have to carry the world on your shoulders. It's okay to just stop. Close your eyes, take a deep breath, and let go for a moment. I've got you.",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300",
    audioSrc: "/comfort-audio/tired.aac"
  },
  {
    id: 'anxious',
    label: "I'm Anxious",
    icon: <Cloud className="w-5 h-5" />,
    response: "Hey... look at me. It's just a thought, it's not the truth. You are safe, you are so capable, and I am right here holding your hand through this. We'll take it one tiny step at a time. Just breathe with me. In... and out. You're going to be okay.",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300",
    audioSrc: "/comfort-audio/anxious.aac"
  },
  {
    id: 'sad',
    label: "I'm Sad",
    icon: <Frown className="w-5 h-5" />,
    response: "I'm so sorry you're feeling down, my love. I wish I could just wrap my arms around you and take it all away. It's okay to feel this way—let it out. You don't have to be strong all the time. I'm here, I'm listening, and I love you through every single emotion.",
    color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300",
    audioSrc: "/comfort-audio/sad.aac"
  },
  {
    id: 'miss',
    label: "I Miss You",
    icon: <Heart className="w-5 h-5" />,
    response: "I know... the distance feels extra heavy today, doesn't it? I miss you more than words can even describe. But remember, every second that passes is one second closer to us being together again. You are always in my heart, no matter how many miles are between us.",
    color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300",
    audioSrc: "/comfort-audio/miss-you.aac"
  },
  {
    id: 'happy',
    label: "I'm Happy",
    icon: <Sun className="w-5 h-5" />,
    response: "Oh, seeing you happy makes my entire world light up! seriously, your joy is infectious. Hold onto this feeling, soak it up. You deserve every bit of this sunshine and so much more. I love seeing you glow like this!",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300",
    audioSrc: "/comfort-audio/happy.aac"
  },
  {
    id: 'overwhelmed',
    label: "I'm Overwhelmed",
    icon: <Shrink className="w-5 h-5" />,
    response: "Shhh, it's okay. The world is being a lot right now. Let's pause everything. You don't need to figure it all out today. Just focus on the very next thing—even if that's just drinking a glass of water. I believe in you, but for now, just rest.",
    color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-300",
    audioSrc: "/comfort-audio/overwhelmed.aac"
  }
];

export const ComfortCorner: React.FC = () => {
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  // Stop audio when mood changes
  useEffect(() => {
    // Reset any playing audio if needed (handled by key prop in VoiceMessagePlayer)
  }, [activeMood]);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="mb-10">
        <h2 className="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text tracking-tight">
          Comfort Corner
        </h2>
        <p className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-love-accent dark:text-love-dark-accent/80 font-medium">
          A safe space for any emotions you may be feeling
        </p>
        <div className="w-16 h-[1px] bg-love-accent/30 dark:bg-love-dark-accent/30 mx-auto mt-6"></div>
      </div>

      {/* Mood Selector Buttons */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
        {MOODS.map((mood) => {
          const isActive = activeMood?.id === mood.id;
          return (
            <motion.button
              key={mood.id}
              onClick={() => setActiveMood(mood)}
              className={`
                flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border
                ${isActive
                  ? 'bg-love-text text-white border-love-text shadow-md transform scale-105'
                  : 'bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-love-accent/30 hover:bg-love-accent/5'}
              `}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {React.cloneElement(mood.icon as React.ReactElement, {
                className: `w-4 h-4 ${isActive ? 'text-white' : 'text-current'}`
              })}
              <span>{mood.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[350px] flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {activeMood ? (
            <motion.div
              key={activeMood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`
                w-full max-w-2xl bg-white dark:bg-zinc-800/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-zinc-700/50 relative overflow-hidden
                ring-1 ring-black/5 dark:ring-white/5
              `}
            >
              {/* Subtle ambient background glow based on mood color */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none transform translate-x-1/2 -translate-y-1/2 transition-colors duration-500`}
                style={{ backgroundColor: activeMood.color.includes('blue') ? '#3b82f6' : activeMood.color.includes('purple') ? '#a855f7' : '#f43f5e' }}
              />

              <div className="relative flex flex-col items-center">
                <div className={`p-4 rounded-full mb-6 ${activeMood.color} bg-opacity-10 dark:bg-opacity-20`}>
                  {React.cloneElement(activeMood.icon as React.ReactElement, { className: "w-8 h-8 opacity-90" })}
                </div>

                <p className="font-serif text-lg md:text-xl italic leading-relaxed text-gray-700 dark:text-gray-200 mb-10 max-w-lg">
                  "{activeMood.response}"
                </p>

                {/* Voice Message Player */}
                <VoiceMessagePlayer src={activeMood.audioSrc} label={`Audio: ${activeMood.label}`} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 text-love-accent/30 dark:text-love-dark-accent/30 pointer-events-none select-none"
            >
              <Heart className="w-16 h-16 stroke-[0.5]" />
              <p className="text-xs uppercase tracking-[0.3em] font-medium opacity-60">Select a feeling to minimize the distance</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// Voice Message Player Component with Soundwave Visualizer
// -----------------------------------------------------------------------------

const VoiceMessagePlayer: React.FC<{ src: string; label: string }> = ({ src, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    // Initialize AudioContext and Gain Node for Amplification
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Create generic gain node
      const gainNode = ctx.createGain();
      gainNode.gain.value = 2.5; // Amplify volume to 250%

      // Connect: Source -> Gain -> Destination
      if (!sourceRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          sourceRef.current = source;
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
        } catch (err) {
          console.error("Audio Context setup failed", err);
        }
      }
    }

    // Resume context if browser suspended it (common on Chrome autplay policies)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Audio play failed:", e);
      });
    }
  };


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset when src changes
    setIsPlaying(false);
    audio.pause();
    audio.currentTime = 0;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        crossOrigin="anonymous" // Important for AudioContext
      />

      <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-2 pr-5 flex items-center gap-4 border border-gray-100 dark:border-white/5 transition-all hover:border-love-accent/20 cursor-default group">
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm active:scale-95 ${isPlaying
            ? 'bg-love-text dark:bg-love-dark-text text-white'
            : 'bg-white dark:bg-zinc-800 text-love-text dark:text-love-dark-text border border-gray-200 dark:border-zinc-600 group-hover:border-love-accent/50'
            }`}
          aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
        </button>

        <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Voice Note
            </span>
            {isPlaying && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-love-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-love-accent"></span>
              </span>
            )}
          </div>

          {/* Audio Visualizer Bars */}
          <div className="h-6 flex items-center gap-[2px] opacity-80">
            {Array.from({ length: 40 }).map((_, i) => (
              <VisualizerBar key={i} index={i} isPlaying={isPlaying} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for performance
const VisualizerBar: React.FC<{ index: number; isPlaying: boolean }> = ({ index, isPlaying }) => {
  // Generate random heights for a natural waveform look
  const minHeight = 4;
  const randomHeight = Math.max(minHeight, Math.random() * 24);

  return (
    <motion.div
      className={`w-1 rounded-full ${isPlaying ? 'bg-love-accent dark:bg-love-dark-accent' : 'bg-gray-300 dark:bg-zinc-700'}`}
      initial={{ height: minHeight }}
      animate={{
        height: isPlaying ? [minHeight, randomHeight, minHeight] : minHeight,
        opacity: isPlaying ? 1 : 0.4
      }}
      transition={{
        repeat: Infinity,
        duration: 0.5 + Math.random() * 0.5, // Randomize duration for organic feel
        delay: index * 0.02,
        repeatType: "mirror",
        ease: "easeInOut"
      }}
    />
  );
};