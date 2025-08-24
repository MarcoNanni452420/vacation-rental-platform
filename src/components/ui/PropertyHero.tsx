"use client"

import Image from 'next/image';
import { MobileBottomSheet } from './MobileBottomSheet';
// import { useTranslations } from 'next-intl'; // Currently unused

interface PropertyHeroProps {
  imageSrc: string;
  title: string;
  location: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function PropertyHero({
  imageSrc,
  title,
  location,
  description,
  ctaText,
  onCtaClick,
  className = ""
}: PropertyHeroProps) {
  // const t = useTranslations('property'); // Currently unused

  return (
    <section className={`relative h-[90vh] md:h-screen ${className}`}>
      {/* Main Image - Clean on Mobile */}
      <div className="absolute inset-0">
        <Image 
          src={imageSrc}
          alt={`${title} Interior`}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover image-bright"
        />
        {/* Mobile: Minimal overlay, Desktop: Enhanced readability overlay */}
        <div className="absolute inset-0 bg-black/10 md:bg-black/25" />
      </div>

      {/* Desktop Property Info */}
      <div className="absolute bottom-0 left-0 right-0 hidden md:block bg-gradient-to-t from-black/60 to-transparent p-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 max-w-4xl">
              <h1 
                className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg"
                style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)' }}
              >
                {title}
              </h1>
              
              <div className="flex items-center text-lg text-white/95 mb-6 drop-shadow-md">
                <span>{location}</span>
              </div>

              <p className="text-xl text-white/95 max-w-2xl drop-shadow-md">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {ctaText && onCtaClick && (
        <MobileBottomSheet
          title={title}
          description={description}
          ctaText={ctaText}
          onCtaClick={onCtaClick}
        />
      )}
    </section>
  );
}