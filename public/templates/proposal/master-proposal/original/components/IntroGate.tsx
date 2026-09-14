import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart } from 'lucide-react';

interface IntroGateProps {
  onComplete: () => void;
}

const SILLY_PROMPTS = [
  { title: "Will you be my Valentine?", subtitle: "...and for a lifetime?" },
  { title: "Wait, did you click the wrong button?", subtitle: "I think your finger slipped!" },
  { title: "Are you sure? I have snacks!", subtitle: "All your favorites, unlimited supply." },
  { title: "What if I promise to do the dishes?", subtitle: "For like... a whole week." },
  { title: "I'll give you a foot massage...", subtitle: "Anytime you want. Seriously." },
  { title: "Don't break my heart! 🥺", subtitle: "Look at this sad face." },
  { title: "I'm going to cry...", subtitle: "Tears are actually forming right now." },
  { title: "Okay, seriously, just click Yes.", subtitle: "The 'No' button is getting tired." },
  { title: "You're being stubborn!", subtitle: "But I still love you." },
  { title: "Please? Please? Please?", subtitle: "I'll be the best Valentine ever." },
  { title: "I'm not taking no for an answer!", subtitle: "Resistance is futile, darling." }
];

export const IntroGate: React.FC<IntroGateProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [rejectionCount, setRejectionCount] = useState(0);

  useEffect(() => {
    // Sequence timing: 
    // Step 0 (Start): "I made this..."
    // Step 1 (2.5s): "Before anything else..."
    // Step 2 (5.5s): Question
    
    const timer1 = setTimeout(() => setStep(1), 2500);
    const timer2 = setTimeout(() => setStep(2), 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleYes = () => {
    onComplete();
  };

  const handleNo = () => {
    setRejectionCount((prev) => Math.min(prev + 1, SILLY_PROMPTS.length - 1));
  };

  const currentPrompt = SILLY_PROMPTS[rejectionCount];
  
  // Calculate Yes button scale based on rejections (grow slightly each time)
  const yesButtonScale = 1 + (rejectionCount * 0.1);

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      filter: 'blur(5px)',
      transition: { duration: 1.0, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-love-bg dark:bg-love-dark-bg px-6 transition-colors duration-700"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2, ease: "easeInOut" } }}
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="intro-1"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center"
          >
            <div className="mb-8 inline-block p-4 rounded-full border border-love-accent/10 dark:border-love-dark-accent/10">
               <Heart className="w-8 h-8 text-love-accent/60 dark:text-love-dark-accent/60" strokeWidth={1} />
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-love-text dark:text-love-dark-text font-light italic tracking-wide">
              I made this just for you.
            </h2>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="intro-2"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center"
          >
            <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-love-accent/80 dark:text-love-dark-accent/80 mb-6">
              But first
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-love-text dark:text-love-dark-text font-light italic tracking-wide">
              Before anything else...
            </h2>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="intro-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl w-full"
          >
             <motion.div 
               className="mb-10 flex justify-center"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
             >
               <Heart className="w-20 h-20 text-love-accent dark:text-love-dark-accent fill-love-accent/5 dark:fill-love-dark-accent/5 animate-pulse" strokeWidth={0.5} />
             </motion.div>
            
            {/* Dynamic Question Text */}
            <div className="h-32 md:h-40 flex flex-col justify-end items-center mb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={rejectionCount}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-love-text dark:text-love-dark-text italic mb-4 leading-tight px-4">
                    {currentPrompt.title}
                  </h1>
                  <p className="text-lg md:text-xl text-love-text/60 dark:text-love-dark-text/60 font-light">
                    {currentPrompt.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
              <motion.button
                onClick={handleYes}
                className="group relative px-12 py-5 overflow-hidden rounded-full bg-transparent border border-love-accent/30 hover:border-love-accent/60 dark:border-love-dark-accent/30 dark:hover:border-love-dark-accent/60 transition-colors duration-700 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: yesButtonScale 
                }}
                transition={{ 
                  opacity: { delay: 2.5, duration: 1 },
                  y: { delay: 2.5, duration: 1 },
                  scale: { type: "spring", stiffness: 200, damping: 15 }
                }}
                whileHover={{ scale: yesButtonScale * 1.05 }}
                whileTap={{ scale: yesButtonScale * 0.95 }}
              >
                <span className="absolute inset-0 w-full h-full bg-love-accent/5 dark:bg-love-dark-accent/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                <span className="relative font-sans text-sm tracking-[0.25em] uppercase text-love-text group-hover:text-love-accent dark:text-love-dark-text dark:group-hover:text-love-dark-accent transition-colors duration-500 whitespace-nowrap">
                  Yes, Forever
                </span>
              </motion.button>

              <motion.button
                onClick={handleNo}
                className="px-8 py-4 rounded-full text-love-text/40 hover:text-love-text/80 dark:text-love-dark-text/40 dark:hover:text-love-dark-text/80 hover:bg-love-accent/5 dark:hover:bg-love-dark-accent/5 transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
              >
                {rejectionCount === 0 ? "No" : "Still No?"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};