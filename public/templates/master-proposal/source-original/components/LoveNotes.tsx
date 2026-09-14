import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RefreshCw, X } from 'lucide-react';

const NOTES = [
  "I love how hard you work for your dreams.",
  "Your smile is literally the best part of my day.",
  "You make even boring things fun just by being there.",
  "I'm so proud of everything you've accomplished.",
  "You give the best hugs in the world.",
  "I love listening to you talk about things you're passionate about.",
  "You are beautiful, inside and out.",
  "Thank you for being my peace in a chaotic world.",
  "I admire your strength and resilience.",
  "Just thinking about you makes me smile.",
  "I love that I can be myself around you.",
  "You are my favorite person to do nothing with.",
  "I love the way your eyes light up when you're happy.",
  "You're stuck with me now (and I love it).",
  "I appreciate how caring you are.",
  "Every moment with you is a memory I cherish."
];

export const LoveNotes: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const pullNote = () => {
    if (currentNote) return; // Don't pull if one is already open
    
    setIsShaking(true);
    
    // Shake animation duration
    setTimeout(() => {
      setIsShaking(false);
      const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
      setCurrentNote(randomNote);
    }, 1000);
  };

  const closeNote = () => {
    setCurrentNote(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 text-center">
      <div className="mb-12">
        <h2 className="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text">
          The Love Jar
        </h2>
        <p className="text-love-accent dark:text-love-dark-accent/80 text-sm md:text-base tracking-wide uppercase">
          Pull a note whenever you need a reminder
        </p>
      </div>

      <div className="relative h-[400px] flex items-center justify-center">
        
        {/* The Jar Container */}
        <motion.div
          className="relative cursor-pointer group"
          animate={isShaking ? { 
            rotate: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 0.5 }}
          onClick={pullNote}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Jar Body Visualization */}
          <div className="w-48 h-64 border-4 border-love-accent/30 dark:border-love-dark-accent/30 rounded-[2rem] bg-white/20 dark:bg-white/5 backdrop-blur-sm relative overflow-hidden flex items-center justify-center shadow-xl">
             {/* Lid */}
             <div className="absolute -top-4 left-0 right-0 h-8 bg-love-accent/50 dark:bg-love-dark-accent/50 rounded-t-lg mx-4" />
             
             {/* Paper Notes inside */}
             {!currentNote && (
               <>
                 <div className="absolute bottom-4 left-6 w-12 h-8 bg-love-pink/50 dark:bg-love-dark-accent/20 rotate-12 rounded shadow-sm" />
                 <div className="absolute bottom-8 right-8 w-12 h-8 bg-love-accent/40 dark:bg-love-dark-accent/30 -rotate-6 rounded shadow-sm" />
                 <div className="absolute bottom-12 left-12 w-12 h-8 bg-white/60 dark:bg-love-dark-text/20 rotate-45 rounded shadow-sm" />
                 <div className="absolute bottom-6 right-16 w-12 h-8 bg-love-pink/60 dark:bg-love-dark-accent/40 -rotate-12 rounded shadow-sm" />
               </>
             )}
             
             {/* Label */}
             <div className="bg-love-card dark:bg-love-dark-card px-4 py-2 rounded shadow border border-love-accent/20">
               <span className="font-serif italic text-love-text dark:text-love-dark-text">For You</span>
             </div>
          </div>
          
          <div className="mt-8">
             <button className="px-6 py-2 rounded-full bg-love-accent/10 dark:bg-love-dark-accent/10 text-love-accent dark:text-love-dark-accent text-sm font-medium uppercase tracking-widest hover:bg-love-accent hover:text-white dark:hover:bg-love-dark-accent dark:hover:text-love-dark-bg transition-colors duration-300">
               {isShaking ? "Shaking..." : "Pull a Note"}
             </button>
          </div>
        </motion.div>

        {/* The Note Overlay */}
        <AnimatePresence>
          {currentNote && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 50, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              className="absolute z-20 w-72 h-72 md:w-80 md:h-80 bg-love-card dark:bg-love-dark-card shadow-2xl rounded-sm p-8 flex flex-col items-center justify-center transform rotate-2 border border-love-accent/10 dark:border-love-dark-accent/10"
            >
              {/* Tape Effect */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-love-accent/20 dark:bg-love-dark-accent/20 opacity-50 rotate-1" />

              <Heart className="w-8 h-8 text-love-accent dark:text-love-dark-accent mb-6 opacity-80" fill="currentColor" />
              
              <p className="font-serif text-xl md:text-2xl text-love-text dark:text-love-dark-text italic leading-relaxed">
                "{currentNote}"
              </p>

              <div className="absolute bottom-4 right-4 flex gap-2">
                 <button 
                   onClick={pullNote} 
                   className="p-2 rounded-full hover:bg-love-accent/10 dark:hover:bg-love-dark-accent/10 text-love-text/50 dark:text-love-dark-text/50 transition-colors"
                   aria-label="Another note"
                 >
                   <RefreshCw className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={closeNote} 
                   className="p-2 rounded-full hover:bg-love-accent/10 dark:hover:bg-love-dark-accent/10 text-love-text/50 dark:text-love-dark-text/50 transition-colors"
                   aria-label="Close note"
                 >
                   <X className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Backdrop for note */}
        <AnimatePresence>
           {currentNote && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm z-10 rounded-xl"
               onClick={closeNote}
             />
           )}
        </AnimatePresence>
      </div>
    </div>
  );
};