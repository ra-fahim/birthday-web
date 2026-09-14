import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower, Flower2, Heart } from 'lucide-react';

interface PlantedFlower {
  id: number;
  x: number;
  y: number;
  type: number;
  color: string;
  rotation: number;
}

const COLORS = [
  "text-pink-400 dark:text-pink-300",
  "text-rose-400 dark:text-rose-300",
  "text-purple-400 dark:text-purple-300",
  "text-red-400 dark:text-red-300",
  "text-orange-400 dark:text-orange-300",
];

export const BloomGarden: React.FC = () => {
  const [flowers, setFlowers] = useState<PlantedFlower[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const handlePlant = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newFlower: PlantedFlower = {
      id: Date.now(),
      x,
      y,
      type: Math.floor(Math.random() * 3), // 0: Flower, 1: Flower2, 2: Heart
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 60 - 30, // Random rotation between -30 and 30 deg
    };

    setFlowers(prev => [...prev, newFlower]);
    setClickCount(prev => prev + 1);
  };

  const clearGarden = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlowers([]);
    setClickCount(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 relative">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text">
          The Digital Garden
        </h2>
        <p className="text-love-accent dark:text-love-dark-accent/80 text-sm md:text-base tracking-wide uppercase">
          I can't bring you flowers every hour, so I built you a garden that never dies.
        </p>
        <p className="text-xs text-love-text/50 dark:text-love-dark-text/50 mt-2">
          (Tap anywhere in the box below to plant a flower)
        </p>
      </div>

      <div 
        className="relative w-full h-[400px] bg-white/40 dark:bg-black/20 rounded-xl border border-love-accent/20 dark:border-love-dark-accent/10 shadow-inner overflow-hidden cursor-crosshair touch-none"
        onClick={handlePlant}
      >
        {/* Grass/Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-green-100/30 to-transparent dark:from-green-900/10 pointer-events-none" />

        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: flower.rotation }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${flower.color} pointer-events-none`}
              style={{ left: flower.x, top: flower.y }}
            >
               {flower.type === 0 && <Flower className="w-8 h-8 md:w-12 md:h-12 drop-shadow-sm" fill="currentColor" fillOpacity={0.2} />}
               {flower.type === 1 && <Flower2 className="w-8 h-8 md:w-12 md:h-12 drop-shadow-sm" fill="currentColor" fillOpacity={0.2} />}
               {flower.type === 2 && <Heart className="w-6 h-6 md:w-8 md:h-8 drop-shadow-sm" fill="currentColor" />}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {flowers.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className="text-love-text/10 dark:text-love-dark-text/10 font-serif text-4xl italic">
               Plant me...
             </span>
           </div>
        )}

        {flowers.length > 5 && (
          <button 
            onClick={clearGarden}
            className="absolute bottom-4 right-4 z-10 text-[10px] uppercase tracking-widest text-love-text/40 hover:text-love-accent transition-colors bg-white/50 px-2 py-1 rounded"
          >
            Clear Garden
          </button>
        )}
      </div>

      <div className="text-center mt-6">
         <span className="font-serif italic text-love-accent dark:text-love-dark-accent text-lg">
           {clickCount > 0 ? `${clickCount} flowers planted for you` : "Waiting for your touch..."}
         </span>
      </div>
    </div>
  );
};