import React, { useEffect, useState } from 'react';
import { Heart, Moon, Sun, Palette, Check } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Section } from './components/Section';
import { IntroGate } from './components/IntroGate';
import { InAppBrowserGuard } from './components/InAppBrowserGuard';
import { STORY_DATA as DEFAULT_STORY_DATA } from './data';
import { getSiteConfig } from './utils/siteConfig';
import { initEditorBridge } from './utils/editorBridge';

// Lazy load heavy components
const FinalLetter = React.lazy(() => import('./components/FinalLetter').then(module => ({ default: module.FinalLetter })));
const DatePlanner = React.lazy(() => import('./components/DatePlanner').then(module => ({ default: module.DatePlanner })));
const BucketList = React.lazy(() => import('./components/BucketList').then(module => ({ default: module.BucketList })));
const LoveNotes = React.lazy(() => import('./components/LoveNotes').then(module => ({ default: module.LoveNotes })));
const ComfortCorner = React.lazy(() => import('./components/ComfortCorner').then(module => ({ default: module.ComfortCorner })));
const BloomGarden = React.lazy(() => import('./components/BloomGarden').then(module => ({ default: module.BloomGarden })));
import { MuseumGallery } from './components/MuseumGallery';
const OurSoundtrack = React.lazy(() => import('./components/OurSoundtrack').then(module => ({ default: module.OurSoundtrack })));

// Loading Component - Height matches dynamic viewport height to prevent layout shifts on mobile
const SectionLoader = () => (
  <div className="w-full min-h-[100dvh] flex items-center justify-center text-love-accent/50 dark:text-love-dark-accent/50">
    <div className="animate-pulse flex flex-col items-center gap-2">
      <Heart className="w-6 h-6 animate-bounce" />
      <span className="text-xs tracking-widest uppercase">Loading Memory...</span>
    </div>
  </div>
);

// --- THEME DEFINITIONS ---
type ThemeType = 'blush' | 'lavender' | 'ocean' | 'midnight' | 'sunset' | 'forest' | 'mocha' | 'royal';

const THEMES: Record<ThemeType, any> = {
  blush: {
    name: "Classic Rose",
    color: "#C08081",
    colors: {
      '--love-bg': '#FAF9F6',
      '--love-text': '#5D4037',
      '--love-pink': '#E8D5D5',
      '--love-accent': '#C08081',
      '--love-card': '#FFFBFB',
      '--love-dark-bg': '#1F1717',
      '--love-dark-text': '#EAD4D4',
      '--love-dark-accent': '#E09F9F',
      '--love-dark-card': '#291D1D',
    }
  },
  lavender: {
    name: "Soft Lavender",
    color: "#9F88B0",
    colors: {
      '--love-bg': '#FDFBFD',
      '--love-text': '#4A3B52',
      '--love-pink': '#E6E1EA',
      '--love-accent': '#9F88B0',
      '--love-card': '#FCFAFD',
      '--love-dark-bg': '#1A1520',
      '--love-dark-text': '#E9E1F0',
      '--love-dark-accent': '#BFA8D1',
      '--love-dark-card': '#251F2E',
    }
  },
  ocean: {
    name: "Calm Breeze",
    color: "#7DA0A6",
    colors: {
      '--love-bg': '#F6FAFA',
      '--love-text': '#2C3E50',
      '--love-pink': '#D5E8E8',
      '--love-accent': '#7DA0A6',
      '--love-card': '#FBFFFF',
      '--love-dark-bg': '#0F171A',
      '--love-dark-text': '#DEEAEA',
      '--love-dark-accent': '#92BCC2',
      '--love-dark-card': '#162226',
    }
  },
  midnight: {
    name: "Midnight Serenade",
    color: "#6366F1",
    colors: {
      '--love-bg': '#EEF2FF',
      '--love-text': '#1E1B4B',
      '--love-pink': '#C7D2FE',
      '--love-accent': '#6366F1', // Indigo
      '--love-card': '#FFFFFF',
      '--love-dark-bg': '#020617', // Deepest Navy
      '--love-dark-text': '#E0E7FF',
      '--love-dark-accent': '#818CF8',
      '--love-dark-card': '#0F172A',
    }
  },
  sunset: {
    name: "Sunset Kiss",
    color: "#F472B6",
    colors: {
      '--love-bg': '#FFF1F2',
      '--love-text': '#881337',
      '--love-pink': '#FECDD3',
      '--love-accent': '#F43F5E', // Rose
      '--love-card': '#FFFFEF',
      '--love-dark-bg': '#4C0519',
      '--love-dark-text': '#FFE4E6',
      '--love-dark-accent': '#FB7185',
      '--love-dark-card': '#881337',
    }
  },
  forest: {
    name: "Forest Whisper",
    color: "#10B981",
    colors: {
      '--love-bg': '#F0FDF4',
      '--love-text': '#064E3B',
      '--love-pink': '#A7F3D0',
      '--love-accent': '#10B981', // Emerald
      '--love-card': '#FFFFFF',
      '--love-dark-bg': '#022C22',
      '--love-dark-text': '#D1FAE5',
      '--love-dark-accent': '#34D399',
      '--love-dark-card': '#065F46',
    }
  },
  mocha: {
    name: "Velvet Mocha",
    color: "#A68B7C",
    colors: {
      '--love-bg': '#FDFCF8',
      '--love-text': '#5D4037',
      '--love-pink': '#D7CCC8',
      '--love-accent': '#8D6E63', // Warm Brown
      '--love-card': '#FAF9F6',
      '--love-dark-bg': '#281E1C',
      '--love-dark-text': '#EFEBE9',
      '--love-dark-accent': '#BCAAA4',
      '--love-dark-card': '#3E2723',
    }
  },
  royal: {
    name: "Royal Amethyst",
    color: "#9333EA",
    colors: {
      '--love-bg': '#FAF5FF',
      '--love-text': '#581C87',
      '--love-pink': '#E9D5FF',
      '--love-accent': '#9333EA', // Purple
      '--love-card': '#FFFFFF',
      '--love-dark-bg': '#3B0764',
      '--love-dark-text': '#F3E8FF',
      '--love-dark-accent': '#C084FC',
      '--love-dark-card': '#581C87',
    }
  }
};

const BackgroundPattern = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-love-bg dark:bg-love-dark-bg">
    {/* Gradient Base - Optimized for GPU */}
    {/* We use will-change-transform to inform the browser to promote this to a layer */}
    <motion.div
      initial={{ x: '-25%', y: '-25%' }}
      animate={{
        x: ['-25%', '0%', '-25%'],
        y: ['-25%', '0%', '-25%'],
      }}
      transition={{
        duration: 30,
        ease: "linear",
        repeat: Infinity
      }}
      style={{ willChange: 'transform' }}
      className="absolute inset-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-love-bg via-love-pink/20 to-love-bg dark:from-love-dark-bg dark:via-love-dark-accent/10 dark:to-love-dark-bg"
    />

    {/* Optimized Orbs - Using Radial Gradients instead of expensive CSS Blur */}
    {/* Top-Left Orb */}
    <div
      className="absolute top-0 left-0 w-[80vw] h-[80vw] opacity-40 dark:opacity-20 pointer-events-none"
      style={{
        background: 'radial-gradient(circle at 20% 20%, var(--love-accent), transparent 70%)',
        transform: 'translate(-30%, -30%)',
      }}
    />

    {/* Bottom-Right Orb */}
    <div
      className="absolute bottom-0 right-0 w-[80vw] h-[80vw] opacity-30 dark:opacity-20 pointer-events-none"
      style={{
        background: 'radial-gradient(circle at 80% 80%, var(--love-pink), transparent 70%)',
        transform: 'translate(30%, 30%)',
      }}
    />

    {/* Grain Texture - Replaced SVG filter with simple CSS pattern for performance */}
    <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.3]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px' // Tiling reduces GPU load compared to full-screen generation
      }}
    />
  </div>
);

const App: React.FC = () => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('blush');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const siteConfig = getSiteConfig();
  const heroTitle = siteConfig.heroTitle?.trim() || 'To My Dearest';
  const heroSubtitle = siteConfig.heroSubtitle?.trim() || 'Scroll slowly';
  const STORY_DATA = siteConfig.story?.length ? siteConfig.story : DEFAULT_STORY_DATA;

  useEffect(() => { initEditorBridge(); }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Theme Change
  useEffect(() => {
    const root = document.documentElement;
    const themeColors = THEMES[currentTheme].colors;

    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [currentTheme]);

  // Lock body scroll during intro
  useEffect(() => {
    if (!isIntroComplete) {
      // Lock scrolling on BOTH html and body for better mobile support
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100vh'; // Prevent rubber-banding
      document.documentElement.style.height = '100vh'; // Prevent rubber-banding
      window.scrollTo(0, 0);
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, [isIntroComplete]);

  return (
    <div className="min-h-screen font-sans selection:bg-love-accent selection:text-white transition-colors duration-700 relative">

      {/* Premium Background Layer */}
      <BackgroundPattern />

      {/* Controls Container */}
      <div className="fixed top-6 right-6 z-[60] flex flex-col items-end gap-3">

        {/* Theme Toggle */}
        <div className="relative">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="p-2 md:p-2.5 rounded-full bg-love-accent/15 hover:bg-love-accent/25 dark:bg-love-dark-accent/15 dark:hover:bg-love-dark-accent/25 text-love-accent dark:text-love-dark-accent backdrop-blur-md shadow-sm border border-love-accent/20 dark:border-love-dark-accent/20"
          >
            <Palette className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          </motion.button>

          <AnimatePresence>
            {showThemePicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-full right-0 mt-2 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl border border-love-accent/10 shadow-2xl min-w-[220px]"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs uppercase tracking-widest text-love-accent/80 dark:text-love-dark-accent/80 font-bold">Select Theme</span>
                  <button onClick={() => setShowThemePicker(false)} className="text-xs text-love-text/50 hover:text-love-text">Close</button>
                </div>

                <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {(Object.keys(THEMES) as ThemeType[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        setCurrentTheme(theme);
                      }}
                      className={`
                        w-full px-3 py-2.5 text-sm text-left rounded-lg transition-all flex items-center gap-3
                        ${currentTheme === theme
                          ? 'bg-love-accent/10 dark:bg-love-dark-accent/20 text-love-text dark:text-love-dark-text font-medium'
                          : 'text-love-text/70 dark:text-love-dark-text/70 hover:bg-love-bg dark:hover:bg-white/5'}
                      `}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                        style={{ backgroundColor: THEMES[theme].color }}
                      />
                      <span className="flex-1">{THEMES[theme].name}</span>
                      {currentTheme === theme && <Check className="w-3 h-3 text-love-accent dark:text-love-dark-accent" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 md:p-2.5 rounded-full bg-love-accent/15 hover:bg-love-accent/25 dark:bg-love-dark-accent/15 dark:hover:bg-love-dark-accent/25 text-love-accent dark:text-love-dark-accent transition-all duration-300 backdrop-blur-md shadow-sm active:scale-95 touch-manipulation border border-love-accent/20 dark:border-love-dark-accent/20"
        >
          <AnimatePresence mode="wait">
            {isDarkMode ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {!isIntroComplete && (
          <IntroGate onComplete={() => setIsIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-love-accent dark:bg-love-dark-accent origin-left z-50 opacity-50"
        style={{ scaleX }}
      />

      {/* Intro / Hero */}
      <Section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isIntroComplete ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="mb-8"
        >
          <div className="p-4 rounded-full border border-love-accent/20 dark:border-love-dark-accent/20 inline-block bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-lg">
            <Heart className="w-8 h-8 text-love-accent dark:text-love-dark-accent fill-love-accent/10 dark:fill-love-dark-accent/10" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light italic mb-6 text-love-text dark:text-love-dark-text tracking-tight drop-shadow-sm"
          data-bb-key="heroTitle" data-bb-label="Hero title"
        >
          {heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isIntroComplete ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 1.3 }}
          className="text-sm md:text-base uppercase tracking-[0.3em] text-love-accent/80 dark:text-love-dark-accent/80 mt-4 font-medium"
          data-bb-key="heroSubtitle" data-bb-label="Hero subtitle"
        >
          {heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isIntroComplete ? { opacity: 1, y: [0, 10, 0] } : { opacity: 0 }}
          transition={{ delay: 2.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12"
        >
          <div className="w-[1px] h-16 bg-love-accent/30 dark:bg-love-dark-accent/30 mx-auto"></div>
        </motion.div>
      </Section>

      {/* Story Sections */}
      {STORY_DATA.map((item, index) => (
        <Section key={index} className="min-h-screen flex flex-col justify-center items-center px-6 md:px-20 py-20 z-10">
          <div className="max-w-3xl text-center flex flex-col items-center">
            {/* Number with Blur Reveal */}
            <motion.span
              initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="block font-serif text-3xl md:text-4xl text-love-accent/50 dark:text-love-dark-accent/50 mb-6"
            >
              {item.number || String(index + 1)}
            </motion.span>

            {/* Title with Slide Up & Blur */}
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 text-love-text dark:text-love-dark-text"
              data-bb-key="story" data-bb-index={index} data-bb-label={`Story chapter ${index + 1} title`}
            >
              {item.title}
            </motion.h2>

            {/* Body with Gentle Fade In */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl leading-relaxed text-love-text/80 dark:text-love-dark-text/80 font-light max-w-xl mx-auto"
              data-bb-key="story" data-bb-index={index} data-bb-label={`Story chapter ${index + 1} text`}
            >
              {item.body}
            </motion.p>
          </div>
        </Section>
      ))}

      {/* Museum of Our Love — uses raw section to avoid double scroll-reveal opacity gate on mobile */}
      <section className="w-full relative flex flex-col items-center px-4 py-20 z-10">
        <div className="bg-love-card/80 dark:bg-love-dark-card/60 backdrop-blur-xl w-full py-10 rounded-3xl border border-love-accent/10 shadow-xl">
          <MuseumGallery />
        </div>
      </section>

      {/* Our Soundtrack */}
      <Section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10">
        <React.Suspense fallback={<SectionLoader />}>
          <OurSoundtrack isIntroComplete={isIntroComplete} />
        </React.Suspense>
      </Section>

      {/* Comfort Corner */}
      <Section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10">
        <React.Suspense fallback={<SectionLoader />}>
          <ComfortCorner />
        </React.Suspense>
      </Section>

      {/* Date Planner Section */}
      <Section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10">
        <React.Suspense fallback={<SectionLoader />}>
          <DatePlanner />
        </React.Suspense>
      </Section>

      {/* Bloom Garden */}
      <Section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10">
        <React.Suspense fallback={<SectionLoader />}>
          <BloomGarden />
        </React.Suspense>
      </Section>

      {/* Love Note Jar */}
      <Section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10">
        <React.Suspense fallback={<SectionLoader />}>
          <LoveNotes />
        </React.Suspense>
      </Section>

      {/* Future Bucket List Section */}
      <Section className="min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10">
        <React.Suspense fallback={<SectionLoader />}>
          <BucketList />
        </React.Suspense>
      </Section>

      {/* Final Letter */}
      <Section className="min-h-screen flex justify-center items-center px-4 py-20 z-10">
        <React.Suspense fallback={<SectionLoader />}>
          <FinalLetter />
        </React.Suspense>
      </Section>

      <footer className="py-8 text-center text-love-text/30 dark:text-love-dark-text/30 text-xs tracking-widest uppercase relative z-10 font-medium">
        Made with love, for you.
      </footer>

      {/* In-App Browser Detection */}
      <InAppBrowserGuard />
    </div>
  );
};

export default App;