"use client"

import { useState, useCallback, useEffect } from 'react';
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
}

export function ImageCarousel({
  images,
  propertyName,
  propertySlug,
  onImageClick,
  className
}: ImageCarouselProps) {
  const t = useTranslations('gallery');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      accent: 'bg-[hsl(20,65%,35%)]', // Updated for accessibility
      hover: 'hover:bg-[hsl(20,65%,30%)]', // Updated for accessibility
      border: 'border-[hsl(20,65%,35%)]'
    },
    moro: {
      accent: 'bg-[hsl(345,55%,35%)]', // Updated for accessibility
      hover: 'hover:bg-[hsl(345,55%,30%)]', // Updated for accessibility
      border: 'border-[hsl(345,55%,35%)]'
    }
  };

  const colors = themeColors[propertySlug];

  // Responsive image count
  const getImagesPerView = () => {
    if (typeof window === 'undefined') return 3; // SSR default
    if (window.innerWidth < 768) return 1; // Mobile
    if (window.innerWidth < 1024) return 2; // Tablet
    return 3; // Desktop
  };

  const [imagesPerView, setImagesPerView] = useState(3);

  // Update images per view on resize
  useEffect(() => {
    const handleResize = () => {
      setImagesPerView(getImagesPerView());
    };
    
    if (typeof window !== 'undefined') {
      setImagesPerView(getImagesPerView());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, images.length - imagesPerView) : prevIndex - 1
    );
  }, [images.length, imagesPerView]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex + imagesPerView >= images.length ? 0 : prevIndex + 1
    );
  }, [images.length, imagesPerView]);

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

  // Get visible images based on screen size
  const getVisibleImages = () => {
    const visibleImages = [];
    for (let i = 0; i < imagesPerView; i++) {
      const imageIndex = (currentIndex + i) % images.length;
      if (imageIndex < images.length) {
        visibleImages.push({
          src: images[imageIndex],
          index: imageIndex
        });
      }
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
    >
      {/* Carousel Container */}
      <div className="relative p-4 h-[320px] sm:h-[400px]">
        <div className={cn(
          "grid gap-4",
          imagesPerView === 1 && "grid-cols-1",
          imagesPerView === 2 && "grid-cols-2",
          imagesPerView === 3 && "grid-cols-3"
        )}>
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
                priority={displayIndex === 0}
                loading={imagesPerView === 1 && displayIndex > 0 ? "lazy" : undefined} // Desktop: all eager, Mobile: first eager + rest lazy
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

      {/* Navigation Arrows - Only show if more images than can be displayed */}
      {images.length > imagesPerView && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-4 p-3 rounded-full text-white transition-all duration-300 z-10",
              "top-[160px] sm:top-1/2 sm:-translate-y-1/2", // Fixed position on mobile, centered on desktop
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
              "absolute right-4 p-3 rounded-full text-white transition-all duration-300 z-10",
              "top-[160px] sm:top-1/2 sm:-translate-y-1/2", // Fixed position on mobile, centered on desktop
              "bg-black/30 backdrop-blur-sm hover:bg-black/50",
              "opacity-0 group-hover:opacity-100 hover:scale-110"
            )}
            aria-label={t('nextImages')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Progress Indicators - Only show if more images than can be displayed and not on mobile */}
      {images.length > imagesPerView && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 px-4 hidden sm:flex">
          {Array.from({ length: Math.floor(images.length / imagesPerView) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i * imagesPerView)}
              className="w-11 h-11 flex items-center justify-center transition-all duration-300" // 44x44px invisible touch target
              aria-label={t('goToGroup', { number: i + 1 })}
            >
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                Math.floor(currentIndex / imagesPerView) === i
                  ? `${colors.accent} w-8` // Elegant line expansion when active
                  : "bg-white/50 hover:bg-white/75"
              )} />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-sm font-medium">
        {imagesPerView === 1 
          ? `${currentIndex + 1} ${t('of')} ${images.length}`
          : `${currentIndex + 1}-${Math.min(currentIndex + imagesPerView, images.length)} ${t('of')} ${images.length}`
        }
      </div>
    </div>
  );
}