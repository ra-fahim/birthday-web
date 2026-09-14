import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Music, Pause, Play, Heart, Volume2, AlertCircle, ChevronDown, ChevronUp, SkipBack, SkipForward } from 'lucide-react';
import { Toast } from './Toast';
import { getYouTubeId, loadYouTubeIframeAPI, fetchYouTubeOEmbed } from '../utils/youtube';

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  note: string;
  audioUrl: string; // local mp3 path, a direct hosted link (Cloudinary etc.), OR a YouTube link
}

// -----------------------------------------------------------------------------
// ASSET FOLDERS: public/our-soundtrack/audio/ (mp3) and public/our-soundtrack/images/ (png/jpg)
// Add your files there; filenames below must match. Fallback: album art uses external URL if local missing.
//
// audioUrl also accepts a direct Cloudinary/hosted mp3 URL, or a YouTube link
// (e.g. 'https://www.youtube.com/watch?v=XXXXXXXXXXX' or 'https://youtu.be/XXXXXXXXXXX') —
// YouTube links play through a hidden player behind the same vinyl controls below.
//
// For a YouTube link, you can leave title / artist / albumArt as '' (empty string) —
// they're auto-filled from the video itself (title, channel name, thumbnail) on load.
// Keep them filled in if you want to override what YouTube reports.
// -----------------------------------------------------------------------------

const SONGS: Song[] = [
  {
    id: '1',
    title: "I Knew I Loved You",
    artist: "Savage Garden",
    albumArt: "/our-soundtrack/images/i-knew-i-loved-you.jpg",
    note: "For the moment I realized you were the one.",
    audioUrl: "/our-soundtrack/audio/i-knew-i-loved-you.mp3"
  },
  {
    id: '2',
    title: "Packing It Up",
    artist: "Gracie Abrams",
    albumArt: "/our-soundtrack/images/packing-it-up.png",
    note: "Just hearing her voice reminds me of us.",
    audioUrl: "/our-soundtrack/audio/packing-it-up.mp3"
  },
  {
    id: '3',
    title: "The Joker And The Queen",
    artist: "Ed Sheeran",
    albumArt: "/our-soundtrack/images/the-joker-and-the-queen.png",
    note: "Because we balance each other out perfectly.",
    audioUrl: "/our-soundtrack/audio/the-joker-and-the-queen.mp3"
  },
  {
    id: '4',
    title: "You'll Be In My Heart",
    artist: "Phil Collins",
    albumArt: "/our-soundtrack/images/youll-be-in-my-heart.png",
    note: "No matter where we are, you are always with me.",
    audioUrl: "/our-soundtrack/audio/youll-be-in-my-heart.mp3"
  },
  {
    id: '5',
    title: "The Alchemy",
    artist: "Taylor Swift",
    albumArt: "/our-soundtrack/images/the-alchemy.png",
    note: "There is magic in the way we found each other.",
    audioUrl: "/our-soundtrack/audio/the-alchemy.mp3"
  },
  {
    id: '6',
    title: "Daylight",
    artist: "Taylor Swift",
    albumArt: "/our-soundtrack/images/daylight.png",
    note: "I only see daylight when I'm with you.",
    audioUrl: "/our-soundtrack/audio/daylight.mp3"
  },
  {
    id: '7',
    title: "Give Me Your Forever",
    artist: "Zack Tabudlo",
    albumArt: "/our-soundtrack/images/give-me-your-forever.png",
    note: "All I want is your forever.",
    audioUrl: "/our-soundtrack/audio/give-me-your-forever.mp3"
  },
  {
    id: '8',
    title: "I'll Be",
    artist: "Edwin McCain",
    albumArt: "/our-soundtrack/images/ill-be.png",
    note: "I'll be your crying shoulder and your greatest fan.",
    audioUrl: "/our-soundtrack/audio/ill-be.mp3"
  },
  {
    id: '9',
    title: "Home",
    artist: "Bruno Major",
    albumArt: "/our-soundtrack/images/home.png",
    note: "You are my home, wherever we are.",
    audioUrl: "/our-soundtrack/audio/home.mp3"
  },
  {
    id: '10',
    title: "Through The Years",
    artist: "Kenny Rogers",
    albumArt: "/our-soundtrack/images/through-the-years.png",
    note: "Through all the years, you've never let me down.",
    audioUrl: "/our-soundtrack/audio/through-the-years.mp3"
  }
];

interface OurSoundtrackProps {
  isIntroComplete?: boolean;
}

export const OurSoundtrack: React.FC<OurSoundtrackProps> = ({ isIntroComplete = true }) => {
  const [currentSong, setCurrentSong] = useState<Song>(SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const playlistListRef = useRef<HTMLDivElement>(null);
  const currentSongRowRef = useRef<HTMLButtonElement>(null);
  const isSectionInView = useInView(sectionRef, { amount: 0.2 });

  // --- YouTube-as-audio-source support (hidden player driving the same UI) ---
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const loadedYtIdRef = useRef<string | null>(null);

  const handleYouTubeStateChange = (event: any) => {
    if (event.data === 1) {
      // playing
      setIsPlaying(true);
      setError(false);
    } else if (event.data === 2) {
      // paused
      setIsPlaying(false);
    } else if (event.data === 0) {
      // ended -> advance to next song, same as the <audio onEnded> handler
      setCurrentSong((prev) => {
        const idx = SONGS.findIndex((s) => s.id === prev.id);
        return idx < SONGS.length - 1 ? SONGS[idx + 1] : SONGS[0];
      });
      setIsPlaying(true);
    }
  };

  const getOrCreateYouTubePlayer = async (videoId: string): Promise<any> => {
    await loadYouTubeIframeAPI();
    if (ytPlayerRef.current) {
      if (loadedYtIdRef.current !== videoId) {
        ytPlayerRef.current.cueVideoById(videoId);
        loadedYtIdRef.current = videoId;
      }
      return ytPlayerRef.current;
    }
    return new Promise((resolve) => {
      const player = new (window as any).YT.Player(ytContainerRef.current, {
        height: '0',
        width: '0',
        videoId,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1 },
        events: {
          onReady: () => {
            ytPlayerRef.current = player;
            loadedYtIdRef.current = videoId;
            resolve(player);
          },
          onStateChange: handleYouTubeStateChange,
        },
      });
    });
  };

  const currentIndex = SONGS.findIndex((s) => s.id === currentSong.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < SONGS.length - 1 && currentIndex >= 0;

  // --- Auto-fill title/artist/albumArt from a YouTube link when left blank ---
  const [metaOverrides, setMetaOverrides] = useState<Record<string, Partial<Song>>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        SONGS.filter((song) => getYouTubeId(song.audioUrl) && (!song.title || !song.artist || !song.albumArt))
          .map(async (song) => {
            const info = await fetchYouTubeOEmbed(song.audioUrl);
            if (!info) return null;
            return [song.id, {
              title: song.title || info.title,
              artist: song.artist || info.author_name,
              albumArt: song.albumArt || info.thumbnail_url,
            }] as const;
          })
      );
      if (cancelled) return;
      const updates: Record<string, Partial<Song>> = {};
      entries.forEach((entry) => { if (entry) updates[entry[0]] = entry[1]; });
      if (Object.keys(updates).length) setMetaOverrides((prev) => ({ ...prev, ...updates }));
    })();
    return () => { cancelled = true; };
  }, []);

  const resolveSong = (song: Song): Song => ({ ...song, ...metaOverrides[song.id] });
  const displayCurrentSong = resolveSong(currentSong);

  const goToPrevious = () => {
    if (currentIndex <= 0) {
      setCurrentSong(SONGS[SONGS.length - 1]);
    } else {
      setCurrentSong(SONGS[currentIndex - 1]);
    }
    setIsPlaying(true);
    setError(false);
  };

  const goToNext = () => {
    if (currentIndex >= SONGS.length - 1) {
      setCurrentSong(SONGS[0]);
    } else {
      setCurrentSong(SONGS[currentIndex + 1]);
    }
    setIsPlaying(true);
    setError(false);
  };

  // Sync dropdown: scroll current song into view when playlist opens
  useEffect(() => {
    if (playlistOpen && currentSongRowRef.current && playlistListRef.current) {
      const t = requestAnimationFrame(() => {
        currentSongRowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      return () => cancelAnimationFrame(t);
    }
  }, [playlistOpen, currentSong.id]);

  // Handle Play/Pause Toggle
  const togglePlay = async () => {
    const ytId = getYouTubeId(currentSong.audioUrl);
    if (ytId) {
      const player = await getOrCreateYouTubePlayer(ytId);
      if (isPlaying) {
        player.pauseVideo();
      } else {
        setError(false);
        player.playVideo();
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setError(false);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((e) => {
            console.error("Playback failed:", e.message); // Log message only to avoid circular errors
            setIsPlaying(false);
            setError(true);
          });
      }
    }
  };

  // Handle Selection from List
  const selectSong = (song: Song) => {
    setError(false);
    if (currentSong.id === song.id) {
      togglePlay();
    } else {
      // Change song
      setCurrentSong(song);
      setIsPlaying(true);
      // The useEffect below handles the actual play trigger after state update
    }
  };

  // Effect to handle source change and auto-play
  useEffect(() => {
    const ytId = getYouTubeId(currentSong.audioUrl);

    if (ytId) {
      audioRef.current?.pause();
      (async () => {
        const player = await getOrCreateYouTubePlayer(ytId);
        if (isPlaying) {
          setError(false);
          player.playVideo();
        }
      })();
      return;
    }

    // Not a YouTube link: stop any YouTube playback, use the normal <audio> element
    ytPlayerRef.current?.pauseVideo?.();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load(); // Reload audio element with new source

      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error("Auto-play failed:", e.message); // Log message only
            setIsPlaying(false);
            setError(true);
          });
        }
      }
    }
  }, [currentSong]);

  // Effect to show "Now Playing" toast when song changes
  useEffect(() => {
    if (isPlaying && currentSong) {
      setShowToast(true);
    }
  }, [currentSong, isPlaying]);

  return (
    <>
      <div ref={sectionRef} className="w-full max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text">
            Our Soundtrack
          </h2>
          <p className="text-love-accent dark:text-love-dark-accent/80 text-sm tracking-wide uppercase">
            Songs that tell our story
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Hidden YouTube player target — used only when a song's audioUrl is a YouTube link */}
          <div ref={ytContainerRef} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />

          {/* Hidden Audio Element — inactive (no src) when the current song plays via YouTube */}
          <audio
            ref={audioRef}
            preload="none"
            src={getYouTubeId(currentSong.audioUrl) ? undefined : currentSong.audioUrl}
            onEnded={() => {
              if (currentIndex < SONGS.length - 1) {
                setCurrentSong(SONGS[currentIndex + 1]);
                setIsPlaying(true);
              } else {
                setCurrentSong(SONGS[0]);
                setIsPlaying(true);
              }
            }}
            onError={() => {
              // Do not pass the event object 'e' to console.error as it contains circular references to DOM nodes
              console.error("Audio playback error occurred");
              setIsPlaying(false);
              setError(true);
            }}
          />

          {/* Vinyl Player Visualization */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 shadow-2xl rounded-full bg-black border-4 border-gray-800 flex items-center justify-center overflow-hidden">
              {/* Vinyl Texture */}
              <div className="absolute inset-0 rounded-full opacity-20"
                style={{ background: 'repeating-radial-gradient(#111 0, #111 2px, #222 3px, #222 4px)' }} />

              {/* Spinning Animation Wrapper */}
              <motion.div
                className="w-full h-full flex items-center justify-center p-20 md:p-24"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                {/* Album Art Label */}
                <div className="w-full h-full rounded-full overflow-hidden shadow-inner border-2 border-gray-800 relative z-10">
                  <img
                    src={displayCurrentSong.albumArt}
                    alt={displayCurrentSong.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if local image missing
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150/000000/FFFFFF/?text=Music';
                    }}
                  />
                  {/* Center hole */}
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-gray-600" />
                </div>
              </motion.div>

              {/* Reflection Shine */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20" />
            </div>

            {/* Player Controls */}
            <div className="mt-10 flex flex-col items-center text-center">
              <h3 className="font-serif text-2xl text-love-text dark:text-love-dark-text italic px-4 font-bold">
                {displayCurrentSong.title}
              </h3>
              <p className="text-sm uppercase tracking-widest text-love-accent dark:text-love-dark-accent mb-6 font-semibold">
                {displayCurrentSong.artist}
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="w-12 h-12 rounded-full bg-love-accent/20 dark:bg-love-dark-accent/20 text-love-text dark:text-love-dark-text flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Previous song"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-love-text dark:bg-love-dark-text text-white dark:text-love-dark-bg flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="w-12 h-12 rounded-full bg-love-accent/20 dark:bg-love-dark-accent/20 text-love-text dark:text-love-dark-text flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Next song"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-4">

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full text-xs"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>File missing or link broken — add an mp3 to public/our-soundtrack/audio/, or set audioUrl to a Cloudinary/YouTube link</span>
                  </motion.div>
                )}
              </div>

              {isPlaying && (
                <div className="mt-4 flex items-center gap-2 text-love-accent animate-pulse">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">Playing</span>
                </div>
              )}
            </div>
          </div>

          {/* Playlist & Notes */}
          <div className="flex-1 w-full max-w-md min-w-0">
            {/* Playlist Container — when closed: header + "Why this song?" visible; when open: + list */}
            <div
              className={`bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl border border-love-accent/20 flex flex-col overflow-hidden transition-[max-height] duration-300 ease-in-out ${playlistOpen ? 'max-h-[min(500px,85vh)]' : 'max-h-[min(16rem,50vh)]'
                }`}
            >
              <button
                type="button"
                onClick={() => setPlaylistOpen((o) => !o)}
                className="flex items-center justify-between gap-2 mb-4 border-b border-love-accent/10 pb-4 shrink-0 w-full text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-love-accent" />
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200">
                    Our Playlist
                  </span>
                </div>
                {playlistOpen ? <ChevronUp className="w-5 h-5 text-love-accent" /> : <ChevronDown className="w-5 h-5 text-love-accent" />}
              </button>

              {/* Dropdown: Scrollable Song List (scrollbar hidden) */}
              <AnimatePresence initial={false}>
                {playlistOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden flex-1 min-h-0 flex flex-col"
                  >
                    <div ref={playlistListRef} className="space-y-3 mb-6 overflow-y-auto flex-1 pr-2 no-scrollbar min-h-0">
                      {SONGS.map((song) => {
                        const isActive = currentSong.id === song.id;
                        const displaySong = resolveSong(song);
                        return (
                          <button
                            ref={isActive ? currentSongRowRef : undefined}
                            key={song.id}
                            onClick={() => selectSong(song)}
                            className={`
                      w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-300 text-left group border
                      ${isActive
                                ? 'bg-love-accent/10 dark:bg-love-dark-accent/10 border-love-accent/50 dark:border-love-dark-accent/50 shadow-sm'
                                : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}
                    `}
                          >
                            <div className="w-10 h-10 rounded overflow-hidden flex items-center justify-center shrink-0 relative bg-gray-200 shadow-sm">
                              <img src={displaySong.albumArt} alt="art" className="w-full h-full object-cover" />

                              {isActive && isPlaying && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="flex gap-0.5 items-end h-3">
                                    <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: [12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-white rounded-full" />
                                    <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold truncate text-sm mb-0.5 ${isActive
                                ? 'text-love-accent dark:text-love-dark-accent'
                                : 'text-gray-900 dark:text-gray-100'
                                }`}>
                                {displaySong.title}
                              </p>
                              <p className={`text-xs truncate uppercase tracking-wider font-medium ${isActive
                                ? 'text-love-accent/80 dark:text-love-dark-accent/80'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {displaySong.artist}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* "Why this song?" — always visible (dropdown open or closed), responsive */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSong.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-love-bg dark:bg-zinc-950 p-3 sm:p-4 rounded-lg border-l-4 border-love-accent relative shrink-0 shadow-sm mt-2"
                >
                  <div className="absolute -top-2 -right-1 transform rotate-12">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-love-pink fill-love-pink" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-love-accent mb-1">Why this song?</p>
                  <p className="font-serif italic text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium pr-5">
                    "{currentSong.note}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Spotify-like mini player when section is out of view - Rendered via Portal */}
      {isIntroComplete && createPortal(
        <AnimatePresence>
          {!isSectionInView && (
            <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full bg-black border-t border-white/10 shadow-2xl pointer-events-auto"
                style={{ backgroundColor: '#000000', opacity: 1 }}
              >
                <div className="flex items-center gap-4 px-4 py-3 bg-black" style={{ backgroundColor: '#000000' }}>
                  <div className="flex-1 flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-lg bg-zinc-800">
                      <img
                        src={displayCurrentSong.albumArt}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150/000000/FFFFFF/?text=♪';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate text-sm">{displayCurrentSong.title}</p>
                      <p className="text-xs text-white/70 truncate">{displayCurrentSong.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                      className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-transform cursor-pointer pointer-events-auto"
                      aria-label="Previous song"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer pointer-events-auto"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                      className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-transform cursor-pointer pointer-events-auto"
                      aria-label="Next song"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Now Playing Toast */}
      <Toast
        message={`Now Playing: "${displayCurrentSong.title}" by ${displayCurrentSong.artist}`}
        type="info"
        duration={3000}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};