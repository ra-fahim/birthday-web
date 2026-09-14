import React from 'react';
import { Heart } from 'lucide-react';
import { useProposalContent } from '../ProposalContext';
import { motion } from 'framer-motion';

export const FinalLetter: React.FC = () => {
  const content = useProposalContent();
  const title = content?.proposalMasterFinalTitle || "{title}";
  const paragraphs = content?.proposalMasterFinalParagraphs?.length ? content.proposalMasterFinalParagraphs : [
    '{paragraphs[0]}',
    '{paragraphs[1]}',
    '{paragraphs[2]}'
  ];
  const signoff = content?.proposalMasterFinalSignoff || 'Forever yours';
  const sender = content?.proposalMasterSender || content?.profile?.displayName || '';
  return (
    <div className="relative max-w-2xl w-full bg-love-card dark:bg-love-dark-card p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-love-pink/30 dark:border-love-dark-accent/20 text-center transition-colors duration-700">
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-love-accent/30 dark:border-love-dark-accent/30" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-love-accent/30 dark:border-love-dark-accent/30" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-love-accent/30 dark:border-love-dark-accent/30" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-love-accent/30 dark:border-love-dark-accent/30" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Heart className="w-6 h-6 mx-auto text-love-accent dark:text-love-dark-accent mb-8" fill="currentColor" />
        
        <h3 className="font-serif text-3xl md:text-4xl italic text-love-text dark:text-love-dark-text mb-8">
          Happy Valentine's Day
        </h3>
        
        <div className="space-y-6 font-light text-love-text/90 dark:text-love-dark-text/90 leading-loose">
          <p>
            {paragraphs[0]}
          </p>
          <p>
            {paragraphs[1]}
          </p>
          <p>
            {paragraphs[2]}
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-love-accent/10 dark:border-love-dark-accent/10">
          <p className="font-serif italic text-xl text-love-text dark:text-love-dark-text">{signoff}</p>{sender && <p className="mt-2 font-serif text-sm text-love-text/60 dark:text-love-dark-text/60">{sender}</p>}
        </div>
      </motion.div>
    </div>
  );
};