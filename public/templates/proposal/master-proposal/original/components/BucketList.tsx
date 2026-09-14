import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Plane, GraduationCap, Dog, Home, Camera } from 'lucide-react';

interface BucketItem {
  id: string;
  text: string;
  icon: React.ReactNode;
}

const BUCKET_ITEMS: BucketItem[] = [
  { id: '1', text: "Graduate Together", icon: <GraduationCap className="w-5 h-5" /> },
  { id: '2', text: "Late Night Road Trip", icon: <Camera className="w-5 h-5" /> },
  { id: '3', text: "Travel to Japan", icon: <Plane className="w-5 h-5" /> },
  { id: '4', text: "Adopt a Puppy", icon: <Dog className="w-5 h-5" /> },
  { id: '5', text: "Cook a Fancy Meal (Without Burning It)", icon: <Star className="w-5 h-5" /> },
  { id: '6', text: "Our First Apartment", icon: <Home className="w-5 h-5" /> },
];

export const BucketList: React.FC = () => {
  // We use state to track checked items (persists only for session, which is fine for this gesture)
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text">
          Our Bucket List
        </h2>
        <p className="text-love-accent dark:text-love-dark-accent/80 text-sm md:text-base tracking-wide uppercase">
          Dreams for Someday
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BUCKET_ITEMS.map((item, index) => {
          const isChecked = checkedItems.includes(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleItem(item.id)}
              className={`
                cursor-pointer group relative overflow-hidden
                p-5 rounded-xl border transition-all duration-500
                flex items-center gap-4
                ${isChecked 
                  ? 'bg-love-accent/10 border-love-accent dark:bg-love-dark-accent/10 dark:border-love-dark-accent' 
                  : 'bg-white/50 border-love-accent/10 hover:border-love-accent/30 dark:bg-white/5 dark:border-love-dark-accent/10'}
              `}
            >
              {/* Checkbox Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isChecked 
                  ? 'bg-love-accent text-white dark:bg-love-dark-accent dark:text-love-dark-bg scale-110' 
                  : 'bg-love-bg dark:bg-love-dark-bg text-love-accent/40 dark:text-love-dark-accent/40 group-hover:text-love-accent dark:group-hover:text-love-dark-accent'}
              `}>
                {isChecked ? <Check className="w-5 h-5" /> : item.icon}
              </div>

              {/* Text */}
              <span className={`
                font-sans text-sm md:text-base transition-all duration-300
                ${isChecked 
                  ? 'text-love-text dark:text-love-dark-text line-through opacity-60 decoration-love-accent' 
                  : 'text-love-text dark:text-love-dark-text'}
              `}>
                {item.text}
              </span>

              {/* Subtle background fill animation */}
              <div className={`absolute inset-0 bg-love-accent/5 dark:bg-love-dark-accent/5 transform origin-left transition-transform duration-500 ${isChecked ? 'scale-x-100' : 'scale-x-0'}`} />
            </motion.div>
          );
        })}
      </div>
      
      <p className="mt-12 text-center text-xs text-love-text/40 dark:text-love-dark-text/40 italic font-serif">
        Checking these off, one by one, with you.
      </p>
    </div>
  );
};