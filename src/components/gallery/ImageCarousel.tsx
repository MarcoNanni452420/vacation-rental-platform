"use client"

import { useState, useCallback, useEffect } from 'react';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { track } from '@vercel/analytics';

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
  const [indicatorBottomPosition, setIndicatorBottomPosition] = useState(() => 16);

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

  // Responsive image count with ultra-wide support
  const getImagesPerView = (width?: number) => {
    const w = width || (typeof window !== 'undefined' ? window.innerWidth : 1024);
    if (w < 768) return 1; // Mobile
    if (w < 1024) return 2; // Tablet
    if (w < 1920) return 3; // Desktop
    return 4; // Ultra-wide (3xl)
  };

  const [imagesPerView, setImagesPerView] = useState(() => getImagesPerView());

  // Calculate dynamic bottom position for indicators
  const calculateIndicatorPosition = useCallback((width?: number) => {
    const screenWidth = width || (typeof window !== 'undefined' ? window.innerWidth : 1024);
    const containerPadding = screenWidth >= 1920 ? 24 : 16; // 3xl:p-6 vs p-4
    
    // Get container height based on breakpoints
    let containerHeight;
    if (screenWidth < 640) {
      containerHeight = 320; // h-[320px]
    } else if (screenWidth < 1920) {
      containerHeight = 400; // sm:h-[400px]
    } else {
      containerHeight = 550; // 3xl:h-[550px]
    }
    
    // Calculate available height for images (container - padding)
    const availableHeight = containerHeight - (containerPadding * 2);
    
    // Calculate image height based on aspect ratio [4/3] and available width
    const availableWidth = screenWidth >= 1920 ? 1800 - (containerPadding * 2) : 
                          screenWidth >= 1024 ? 1400 - (containerPadding * 2) : 
                          screenWidth - (containerPadding * 2);
    
    const imageWidth = availableWidth / imagesPerView;
    const imageHeight = (imageWidth * 3) / 4; // aspect-[4/3]
    
    // Calculate bottom position: container padding + remaining space + fixed 16px gap
    const remainingSpace = availableHeight - imageHeight;
    const bottomPosition = containerPadding + (remainingSpace / 2) + 16;
    
    return Math.max(16, bottomPosition); // Minimum 16px
  }, [imagesPerView]);

  // Update images per view and indicator position on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setImagesPerView(getImagesPerView(width));
      setIndicatorBottomPosition(calculateIndicatorPosition(width));
    };
    
    // Initial calculation after mount
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateIndicatorPosition]);

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
      {/* Carousel Container with ultra-wide support */}
      <div className="relative p-4 3xl:p-6 h-[320px] sm:h-[400px] 3xl:h-[550px] max-w-[1400px] 3xl:max-w-[1800px] mx-auto">
        <div className={cn(
          "grid gap-4 3xl:gap-6",
          imagesPerView === 1 && "grid-cols-1",
          imagesPerView === 2 && "grid-cols-2",
          imagesPerView === 3 && "grid-cols-3",
          imagesPerView === 4 && "grid-cols-4"
        )}>
          {visibleImages.map((image, displayIndex) => (
            <div 
              key={`${image.index}-${displayIndex}`} 
              className="relative aspect-[4/3] overflow-hidden rounded-2xl group/image cursor-pointer transform transition-all duration-300 hover:z-10"
              onClick={() => {
                // Track gallery image click
                track('Gallery Image Clicked', {
                  property: propertySlug,
                  image_index: image.index,
                  image_name: image.src.split('/').pop()?.replace('.jpg', '').replace('.jpeg', '').replace('.png', '').replace('.webp', '') || 'unknown'
                });
                onImageClick(image.index);
              }}
            >
              <Image
                src={image.src}
                alt={`${propertyName} - Immagine ${image.index + 1}`}
                fill
                priority={image.index < 3} // Priority for first 3 visible images
                sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1024px) calc(50vw - 24px), (max-width: 1920px) 456px, 438px"
                className="object-cover transition-transform duration-700 group-hover/image:scale-110 rounded-2xl"
                loading={image.index < imagesPerView ? "eager" : "lazy"}
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
        {/* Navigation Arrows - Inside container for better positioning */}
        {images.length > imagesPerView && (
          <>
            <button
              onClick={goToPrevious}
              className={cn(
                "absolute left-4 3xl:left-8 p-3 3xl:p-4 rounded-full text-white transition-all duration-300 z-10",
                "top-[160px] sm:top-1/2 sm:-translate-y-1/2", // Fixed position on mobile, centered on desktop
                "bg-black/30 backdrop-blur-sm hover:bg-black/50",
                "opacity-0 group-hover:opacity-100 hover:scale-110"
              )}
              aria-label={t('prevImages')}
            >
              <ChevronLeft className="w-6 h-6 3xl:w-8 3xl:h-8" />
            </button>
            
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-4 3xl:right-8 p-3 3xl:p-4 rounded-full text-white transition-all duration-300 z-10",
                "top-[160px] sm:top-1/2 sm:-translate-y-1/2", // Fixed position on mobile, centered on desktop
                "bg-black/30 backdrop-blur-sm hover:bg-black/50",
                "opacity-0 group-hover:opacity-100 hover:scale-110"
              )}
              aria-label={t('nextImages')}
            >
              <ChevronRight className="w-6 h-6 3xl:w-8 3xl:h-8" />
            </button>
          </>
        )}
        
        {/* Progress Indicators - Inside container for alignment */}
        {images.length > imagesPerView && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 px-4 hidden sm:flex"
            style={{ bottom: `${indicatorBottomPosition}px` }}
          >
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
      
      {/* Image Counter - Inside container for proper alignment */}
      <div className="absolute top-4 right-4 3xl:right-6 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-sm font-medium">
        {imagesPerView === 1 
          ? `${currentIndex + 1} ${t('of')} ${images.length}`
          : `${currentIndex + 1}-${Math.min(currentIndex + imagesPerView, images.length)} ${t('of')} ${images.length}`
        }
      </div>
      </div>
    </div>
  );
}