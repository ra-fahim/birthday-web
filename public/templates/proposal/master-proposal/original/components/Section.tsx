import React from 'react';
import { ScrollReveal } from './ScrollReveal';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`w-full relative overflow-x-hidden ${className}`}>
      <ScrollReveal width="100%" className="h-full flex flex-col justify-center items-center">
        {children}
      </ScrollReveal>
    </section>
  );
};