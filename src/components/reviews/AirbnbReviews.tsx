"use client"

import { useState, useEffect } from 'react';
import { ExternalLink, Star, Users, Loader2 } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { getPropertyReviewStats } from '@/lib/airbnb-api';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ReviewData {
  id: string;
  comments: string;
  originalComments?: string;
  language: string;
  createdAt: string;
  localizedDate: string;
  rating: number;
  reviewer: {
    firstName: string;
    location: string;
    pictureUrl: string;
    isSuperhost: boolean;
  };
  response?: string | null;
  collectionTag?: string | null;
  needsTranslation?: boolean;
  disclaimer?: string;
}

interface ReviewsResponse {
  reviews: ReviewData[];
  totalCount: number;
  propertySlug: string;
  airbnbUrl: string;
  fetchedAt: string;
}

interface AirbnbReviewsProps {
  propertySlug: 'fienaroli' | 'moro';
  className?: string;
}

export function AirbnbReviews({ propertySlug, className }: AirbnbReviewsProps) {
  const t = useTranslations('reviews');
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airbnbUrl, setAirbnbUrl] = useState<string>('#');

  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      accent: 'text-[hsl(20,65%,48%)]',
      button: 'bg-[hsl(20,65%,48%)] hover:bg-[hsl(20,65%,42%)]',
      border: 'border-[hsl(20,65%,48%)]'
    },
    moro: {
      accent: 'text-[hsl(345,55%,42%)]',
      button: 'bg-[hsl(345,55%,42%)] hover:bg-[hsl(345,55%,37%)]',
      border: 'border-[hsl(345,55%,42%)]'
    }
  };

  const colors = themeColors[propertySlug];
  const stats = getPropertyReviewStats(propertySlug);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/airbnb-reviews/${propertySlug}?limit=6`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const data: ReviewsResponse = await response.json();
        setReviews(data.reviews || []);
        setAirbnbUrl(data.airbnbUrl || '#');
        
        console.log(`Loaded ${data.reviews?.length || 0} reviews for ${propertySlug}`);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : t('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertySlug]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-5 h-5",
          i < Math.floor(rating) 
            ? `fill-current ${colors.accent}` 
            : "text-gray-300"
        )}
      />
    ));
  };

  if (loading) {
    return (
      <div className={cn("py-16", className)}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className={cn("w-6 h-6 animate-spin", colors.accent)} />
            <h2 className="text-3xl font-bold">{t('loading')}</h2>
          </div>
          <p className="text-gray-600">{t('loadingDescription')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("py-16", className)}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-gray-600 mb-8">
            {t('unavailable')}
          </p>
          <a
            href={airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105",
              colors.button
            )}
          >
            <ExternalLink className="w-5 h-5" />
            {t('readOnAirbnb')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-16", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          
          {/* Stats */}
          {stats && (
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <span className="text-xl font-semibold">{stats.averageRating}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>{stats.totalReviews} {t('reviewsCount')}</span>
              </div>
            </div>
          )}
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('authentic')}
          </p>
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  {...review}
                  propertySlug={propertySlug}
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <a
                href={airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-lg",
                  "transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
                  colors.button
                )}
              >
                <ExternalLink className="w-5 h-5" />
                {t('readAll', { count: stats?.totalReviews || 0 })}
              </a>
              <p className="text-sm text-gray-500 mt-3">
                {t('verified')}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-8">
              {t('noRecent')}
            </p>
            <a
              href={airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105",
                colors.button
              )}
            >
              <ExternalLink className="w-5 h-5" />
              {t('viewOnAirbnb')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}