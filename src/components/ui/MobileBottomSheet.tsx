"use client"

import { motion } from 'framer-motion';
import { ArrowRight, Users, Bed, Bath } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MobileBottomSheetProps {
  title: string;
  description: string;
  features?: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
  };
  ctaText: string;
  onCtaClick: () => void;
  className?: string;
}

export function MobileBottomSheet({
  title,
  description,
  features,
  ctaText,
  onCtaClick,
  className = ""
}: MobileBottomSheetProps) {
  const t = useTranslations('home');

  return (
    <motion.div
      className={`absolute bottom-0 left-0 right-0 md:hidden ${className}`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      
      {/* Content Container */}
      <div className="relative p-6 pb-8">
        {/* Property Info */}
        <div className="mb-4">
          <div 
            className="bg-black/50 rounded-lg p-3 mb-3"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
              {title}
            </h2>
            <p className="text-white/90 text-sm leading-relaxed">
              {description.split('.')[0] + (description.includes('.') ? '.' : '')}
            </p>
          </div>
        </div>

        {/* Features Row */}
        {features && (
          <div className="flex items-center gap-4 mb-4 text-white/80">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">{features.guests} {t('guests')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span className="text-xs font-medium">{features.bedrooms} {t('bedrooms')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span className="text-xs font-medium">{features.bathrooms} {t('bathrooms')}</span>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onCtaClick}
          className="w-full bg-white text-gray-900 py-3 px-4 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-gray-100 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
        >
          {ctaText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tap indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <div className="w-8 h-1 bg-white/30 rounded-full" />
      </div>
    </motion.div>
  );
}