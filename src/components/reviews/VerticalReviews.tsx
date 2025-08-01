"use client"

import { useState, useEffect } from 'react';
import { ExternalLink, Star, Loader2 } from 'lucide-react';
import { track } from '@vercel/analytics';
import { ReviewCard } from './ReviewCard';
import { getPropertyReviewStats } from '@/lib/reviews-api';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { ReviewData, ReviewsResponse } from '@/types/reviews';
import { HorizontalReviewsCarousel } from './HorizontalReviewsCarousel';


interface VerticalReviewsProps {
  propertySlug: 'fienaroli' | 'moro';
  className?: string;
  preloadedReviews?: ReviewsResponse | null;
  isPreloadingReviews?: boolean;
}

export function VerticalReviews({ propertySlug, className, preloadedReviews, isPreloadingReviews = false }: VerticalReviewsProps) {
  const t = useTranslations('reviews');
  const locale = useLocale();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airbnbUrl, setAirbnbUrl] = useState<string>('#');
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      accent: 'text-[hsl(20,65%,35%)]', // Darkened for better contrast
      button: 'bg-[hsl(20,65%,35%)] hover:bg-[hsl(20,65%,30%)]', // Darkened button colors
      border: 'border-[hsl(20,65%,35%)]',
      expandButton: 'text-[hsl(20,65%,35%)] hover:bg-[hsl(20,65%,95%)]' // Darkened expand button
    },
    moro: {
      accent: 'text-[hsl(345,55%,35%)]', // Darkened for better contrast
      button: 'bg-[hsl(345,55%,35%)] hover:bg-[hsl(345,55%,30%)]', // Darkened button colors
      border: 'border-[hsl(345,55%,35%)]',
      expandButton: 'text-[hsl(345,55%,35%)] hover:bg-[hsl(345,55%,95%)]' // Darkened expand button
    }
  };

  const colors = themeColors[propertySlug];
  const stats = getPropertyReviewStats(propertySlug);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // If we're still preloading, show loading state
    if (isPreloadingReviews) {
      setLoading(true);
      setReviews([]); // Clear old reviews while loading
      return;
    }

    // Use preloaded data if available
    if (preloadedReviews) {
      const sortedReviews = (preloadedReviews.reviews || []).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReviews(sortedReviews);
      setAirbnbUrl(preloadedReviews.airbnbUrl || '#');
      setLoading(false);
      setError(null);
    } else if (!isPreloadingReviews) {
      // If preloading is complete but no data, show error
      setError(t('error'));
      setLoading(false);
    }
  }, [propertySlug, preloadedReviews, isPreloadingReviews, locale, t]);

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


  if (loading) {
    return (
      <div className={cn("p-6", className)}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className={cn("w-5 h-5 animate-spin", colors.accent)} />
            <h3 className="text-xl font-bold">{t('loading')}</h3>
          </div>
          <p className="text-gray-600 text-sm">{t('loadingDescription')}</p>
        </div>
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <div className={cn("p-6", className)}>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Recensioni</h3>
          <p className="text-gray-600 text-sm mb-4">
            {error ? 'Errore nel caricamento' : 'Nessuna recensione disponibile'}
          </p>
          <a
            href={airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // Track external reviews link clicks - error state
              track('Reviews Read All Clicked', {
                property: propertySlug,
                total_reviews: 0,
                context: 'error'
              });
            }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:scale-105",
              colors.button
            )}
          >
            <ExternalLink className="w-4 h-4" />
            {t('viewOnAirbnb')}
          </a>
        </div>
      </div>
    );
  }

  // Use horizontal carousel on mobile, vertical list on desktop
  if (isMobile) {
    return (
      <HorizontalReviewsCarousel
        reviews={reviews}
        propertySlug={propertySlug}
        airbnbUrl={airbnbUrl}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">
          {t('title')}
        </h3>
        
        {/* Stats */}
        {stats && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(Math.round(stats.averageRating))}
            </div>
            <span className="font-semibold">{stats.averageRating}</span>
          </div>
        )}
      </div>

      {/* Reviews List - Fixed 3 + Show More */}
      <div className="space-y-4">
        {(showAll ? reviews : reviews.slice(0, 3)).map((review) => (
          <ReviewCard
            key={review.id}
            {...review}
            propertySlug={propertySlug}
            className="text-sm" // Smaller cards for compact layout
          />
        ))}
        
        {/* Show More Button */}
        {reviews.length > 3 && !showAll && (
          <div className="text-center py-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                onClick={() => {
                  // Track show more engagement
                  track('Reviews Show More', {
                    property: propertySlug,
                    total_reviews: reviews.length,
                    shown_before: 3
                  });
                  setShowAll(true);
                }}
                className={cn(
                  "px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md",
                  colors.expandButton,
                  "border-current"
                )}
              >
                {t('showMore')}
              </button>
              <a
                href={airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Track external reviews link clicks - potential conversion
                  track('Reviews Read All Clicked', {
                    property: propertySlug,
                    total_reviews: reviews.length
                  });
                }}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.01] shadow-md hover:shadow-lg",
                  colors.button
                )}
              >
                <ExternalLink className="w-4 h-4" />
                {t('readAll', { count: '' })}
              </a>
            </div>
          </div>
        )}
        
        {/* Show Less Button - when all reviews are shown */}
        {showAll && reviews.length > 3 && (
          <div className="text-center py-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <button
                onClick={() => setShowAll(false)}
                className={cn(
                  "px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md",
                  colors.expandButton,
                  "border-current"
                )}
              >
                {t('showLess')}
              </button>
              <a
                href={airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Track external reviews link clicks - showAll state
                  track('Reviews Read All Clicked', {
                    property: propertySlug,
                    total_reviews: reviews.length,
                    context: 'showAll'
                  });
                }}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.01] shadow-md hover:shadow-lg",
                  colors.button
                )}
              >
                <ExternalLink className="w-4 h-4" />
                {t('readAll', { count: '' })}
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}