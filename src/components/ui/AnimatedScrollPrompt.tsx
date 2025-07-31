"use client"

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { track } from '@vercel/analytics';
import { useEffect, useState } from 'react';

interface AnimatedScrollPromptProps {
  className?: string;
}

export function AnimatedScrollPrompt({ className = "" }: AnimatedScrollPromptProps) {
  const t = useTranslations('home');
  const [hasTracked, setHasTracked] = useState(false);

  // Track when component becomes visible (bounce rate improvement metric)
  useEffect(() => {
    if (!hasTracked) {
      track('Scroll Prompt Viewed', {
        location: 'homepage_hero',
        device: typeof window !== 'undefined' ? 
          (window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop') : 'unknown'
      });
      setHasTracked(true);
    }
  }, [hasTracked]);

  const handleClick = () => {
    // Track click engagement
    track('Scroll Prompt Clicked', {
      location: 'homepage_hero',
      device: typeof window !== 'undefined' ? 
        (window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop') : 'unknown'
    });

    // Smooth scroll to properties section - precisely at top of Casa Fienaroli
    const propertiesSection = document.querySelector('#properties-section');
    if (propertiesSection) {
      const navbarHeight = 80; // Account for fixed navbar
      const targetPosition = propertiesSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div
      className={`cursor-pointer group ${className}`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* High-Contrast Interactive Container */}
      <div className="bg-black rounded-full px-4 py-2 shadow-lg transition-all duration-300 group-hover:bg-gray-800 group-hover:shadow-xl group-hover:scale-[1.02]">
        <div className="flex items-center gap-2">
          {/* High-Contrast Typography */}
          <motion.p 
            className="text-white text-xs md:text-sm font-medium text-center transition-opacity duration-300"
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {t('scrollToDiscover')}
          </motion.p>

          {/* Prominent White Arrow */}
          <motion.div
            animate={{ 
              y: [0, 4, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronDown 
              className="w-4 h-4 md:w-5 md:h-5 text-white transition-all duration-300 group-hover:scale-110" 
            />
          </motion.div>
        </div>
      </div>

      {/* Minimal indicator line */}
      <motion.div 
        className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-gray-300 to-transparent mx-auto mt-1"
        animate={{ 
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Optimized mobile touch target */}
      <div className="absolute inset-0 min-h-[60px] md:min-h-[70px] -m-3" />
    </motion.div>
  );
}