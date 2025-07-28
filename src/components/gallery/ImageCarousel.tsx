"use client"

import { useState, useEffect, useCallback } from 'react';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ImageCarouselProps {
  images: string[];
  propertyName: string;
  propertySlug: 'fienaroli' | 'moro';
  onImageClick: (index: number) => void;
  className?: string;
  autoAdvanceInterval?: number;
}

export function ImageCarousel({
  images,
  propertyName,
  propertySlug,
  onImageClick,
  className,
  autoAdvanceInterval = 5000
}: ImageCarouselProps) {
  const t = useTranslations('gallery');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      accent: 'bg-[hsl(20,65%,48%)]',
      hover: 'hover:bg-[hsl(20,65%,42%)]',
      border: 'border-[hsl(20,65%,48%)]'
    },
    moro: {
      accent: 'bg-[hsl(345,55%,42%)]',
      hover: 'hover:bg-[hsl(345,55%,37%)]',
      border: 'border-[hsl(345,55%,42%)]'
    }
  };

  const colors = themeColors[propertySlug];

  // Auto-advance functionality
  useEffect(() => {
    if (isHovered || images.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + 3 >= images.length ? 0 : prevIndex + 1
      );
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [images.length, autoAdvanceInterval, isHovered]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, images.length - 3) : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= images.length ? 0 : prevIndex + 1
    );
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className={cn(
        "relative w-full h-[400px] md:h-[500px] bg-gray-200 flex items-center justify-center rounded-2xl",
        className
      )}>
        <p className="text-gray-500">Nessuna immagine disponibile</p>
      </div>
    );
  }

  // Get visible images (3 at a time)
  const getVisibleImages = () => {
    const visibleImages = [];
    for (let i = 0; i < 3; i++) {
      const imageIndex = (currentIndex + i) % images.length;
      visibleImages.push({
        src: images[imageIndex],
        index: imageIndex
      });
    }
    return visibleImages;
  };

  const visibleImages = getVisibleImages();

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="relative p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleImages.map((image, displayIndex) => (
            <div 
              key={`${image.index}-${displayIndex}`} 
              className="relative aspect-[4/3] overflow-hidden rounded-2xl group/image cursor-pointer"
              onClick={() => onImageClick(image.index)}
            >
              <Image
                src={image.src}
                alt={`${propertyName} - Immagine ${image.index + 1}`}
                fill
                priority={displayIndex < 3}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover/image:scale-110 rounded-2xl"
              />
              
              {/* Zoom overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-700 flex items-center justify-center">
                <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Zoom
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Only show if more than 3 images */}
      {images.length > 3 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-all duration-300",
              "bg-black/30 backdrop-blur-sm hover:bg-black/50",
              "opacity-0 group-hover:opacity-100 hover:scale-110"
            )}
            aria-label={t('prevImages')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition-all duration-300",
              "bg-black/30 backdrop-blur-sm hover:bg-black/50",
              "opacity-0 group-hover:opacity-100 hover:scale-110"
            )}
            aria-label={t('nextImages')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Progress Indicators - Only show if more than 3 images */}
      {images.length > 3 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: Math.ceil(images.length / 3) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * 3)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                Math.floor(currentIndex / 3) === i
                  ? `${colors.accent} w-8` 
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={t('goToGroup', { number: i + 1 })}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-sm font-medium">
        {currentIndex + 1}-{Math.min(currentIndex + 3, images.length)} di {images.length}
      </div>
    </div>
  );
}