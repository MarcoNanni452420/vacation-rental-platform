"use client"

import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { getPropertyReviewStats } from '@/lib/reviews-api';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ReviewData } from '@/types/reviews';

interface HorizontalReviewsCarouselProps {
  reviews: ReviewData[];
  propertySlug: 'fienaroli' | 'moro';
  airbnbUrl: string;
  className?: string;
}

export function HorizontalReviewsCarousel({ 
  reviews, 
  propertySlug, 
  airbnbUrl,
  className 
}: HorizontalReviewsCarouselProps) {
  const t = useTranslations('reviews');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      accent: 'text-[hsl(20,65%,35%)]', // Updated for accessibility
      button: 'bg-[hsl(20,65%,35%)] hover:bg-[hsl(20,65%,30%)]', // Updated for accessibility
      border: 'border-[hsl(20,65%,35%)]',
      indicator: 'bg-[hsl(20,65%,35%)]' // Updated for accessibility
    },
    moro: {
      accent: 'text-[hsl(345,55%,35%)]', // Updated for accessibility
      button: 'bg-[hsl(345,55%,35%)] hover:bg-[hsl(345,55%,30%)]', // Updated for accessibility
      border: 'border-[hsl(345,55%,35%)]',
      indicator: 'bg-[hsl(345,55%,35%)]' // Updated for accessibility
    }
  };

  const colors = themeColors[propertySlug];
  const stats = getPropertyReviewStats(propertySlug);

  // Check scroll position and update states
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    
    // Calculate current index based on scroll position
    const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 300;
    const gap = 16; // 1rem gap
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const cardElement = scrollContainerRef.current.children[index] as HTMLElement;
    if (cardElement) {
      cardElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'start' 
      });
    }
  };

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(reviews.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < Math.floor(rating) 
            ? `fill-current ${colors.accent}` 
            : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">{t('title')}</h3>
        {stats && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <span className="font-semibold">{stats.averageRating}</span>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10",
              "p-2 rounded-full bg-white shadow-lg",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "-translate-x-1/2 md:translate-x-0"
            )}
            aria-label={t('previousReview')}
          >
            <ChevronLeft className={cn("w-5 h-5", colors.accent)} />
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10",
              "p-2 rounded-full bg-white shadow-lg",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "translate-x-1/2 md:translate-x-0"
            )}
            aria-label={t('nextReview')}
          >
            <ChevronRight className={cn("w-5 h-5", colors.accent)} />
          </button>
        )}

        {/* Reviews Scroll Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className={cn(
            "flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide",
            "scroll-smooth pb-4 -mx-4 px-4",
            "md:mx-0 md:px-0"
          )}
        >
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="flex-none w-80 snap-start"
            >
              <ReviewCard
                {...review}
                propertySlug={propertySlug}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-1 sm:gap-2 mt-6">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className="w-11 h-11 flex items-center justify-center transition-all duration-300" // 44x44px touch target
            aria-label={t('goToReview', { number: index + 1 })}
          >
            <div className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentIndex 
                ? `${colors.indicator} w-8` 
                : "bg-gray-300 w-1.5 hover:bg-gray-400"
            )} />
          </button>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold",
            "transition-all duration-300 hover:scale-[1.01] shadow-md hover:shadow-lg",
            colors.button
          )}
        >
          <ExternalLink className="w-4 h-4" />
          {t('readAll', { count: '' })}
        </a>
      </div>
    </div>
  );
}