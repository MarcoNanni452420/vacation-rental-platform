"use client"

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AnimatedScrollPromptProps {
  className?: string;
}

export function AnimatedScrollPrompt({ className = "" }: AnimatedScrollPromptProps) {
  const t = useTranslations('home');

  const handleClick = () => {
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
    <div
      className={`cursor-pointer group animate-fade-in ${className}`}
      onClick={handleClick}
    >
      {/* High-Contrast Interactive Container */}
      <div className="bg-black rounded-full px-4 py-2 shadow-lg transition-all duration-300 group-hover:bg-gray-800 group-hover:shadow-xl group-hover:scale-[1.02]">
        <div className="flex items-center gap-2">
          {/* High-Contrast Typography with CSS animation */}
          <p className="text-white text-xs md:text-sm font-medium text-center animate-pulse-gentle">
            {t('scrollToDiscover')}
          </p>

          {/* Prominent White Arrow with CSS animation */}
          <div className="animate-bounce-gentle">
            <ChevronDown 
              className="w-4 h-4 md:w-5 md:h-5 text-white transition-all duration-300 group-hover:scale-110" 
            />
          </div>
        </div>
      </div>

      {/* Minimal indicator line with CSS animation */}
      <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-gray-300 to-transparent mx-auto mt-1 animate-pulse-gentle" />

      {/* Optimized mobile touch target */}
      <div className="absolute inset-0 min-h-[60px] md:min-h-[70px] -m-3" />
    </div>
  );
}