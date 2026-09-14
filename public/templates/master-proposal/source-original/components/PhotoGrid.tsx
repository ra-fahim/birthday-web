import React from 'react';
import { motion } from 'framer-motion';
import { PHOTO_DATA } from '../data';

export const PhotoGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
      {PHOTO_DATA.map((photo, index) => (
        <motion.div
          key={index}
          className={`relative group overflow-hidden rounded-sm shadow-xl ${photo.gridClass || ''}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
        >
          <div className="w-full h-full bg-love-accent/10 dark:bg-love-dark-accent/10 absolute inset-0 z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          <img 
            src={photo.url} 
            alt={photo.caption} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <p className="text-white font-serif italic text-sm tracking-wider text-center drop-shadow-md">{photo.caption}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};