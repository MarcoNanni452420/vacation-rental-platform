"use client"

import { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ReviewCardProps {
  id: string;
  comments: string;
  originalComments?: string;
  language: string;
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
  propertySlug: 'fienaroli' | 'moro';
  className?: string;
}

export function ReviewCard({
  comments,
  localizedDate,
  rating,
  reviewer,
  response,
  collectionTag,
  disclaimer,
  propertySlug,
  className
}: ReviewCardProps) {
  const t = useTranslations('reviews');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Reactive mobile detection with resize listener
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Fixed truncation logic - only truncate if text is long on mobile
  const shouldTruncate = isMobile && comments.length > 180;
  const displayComments = shouldTruncate && !isExpanded 
    ? comments.slice(0, 180) + '...'
    : comments;
  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      border: 'border-[hsl(20,65%,90%)]',
      bg: 'bg-[hsl(20,65%,98%)]',
      accent: 'text-[hsl(20,65%,35%)]', // Darkened from 48% to 35% for better contrast
      tagBg: 'bg-[hsl(20,65%,95%)]',
      tagText: 'text-[hsl(20,65%,35%)]' // Darkened from 48% to 35% for WCAG AA compliance
    },
    moro: {
      border: 'border-[hsl(345,55%,90%)]',
      bg: 'bg-[hsl(345,55%,98%)]',
      accent: 'text-[hsl(345,55%,35%)]', // Darkened from 42% to 35% for better contrast
      tagBg: 'bg-[hsl(345,55%,95%)]',
      tagText: 'text-[hsl(345,55%,35%)]' // Darkened from 42% to 35% for WCAG AA compliance
    }
  };

  const colors = themeColors[propertySlug];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating 
            ? `fill-current ${colors.accent}` 
            : "text-gray-300"
        )}
      />
    ));
  };


  return (
    <div className={cn(
      "p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg",
      "flex flex-col", // Simple flex column
      colors.border,
      colors.bg,
      className
    )}>
      <div className="flex flex-col">
        {/* Header with reviewer info and rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={reviewer.pictureUrl}
                alt={`${reviewer.firstName}&apos;s profile`}
                width={48}
                height={48}
                loading="lazy" // Lazy load reviewer avatars for better performance
                className="rounded-full object-cover w-full h-full"
                onError={(e) => {
                  // Fallback to default avatar if image fails
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewer.firstName)}&background=f3f4f6&color=6b7280`;
                }}
              />
              {reviewer.isSuperhost && (
                <div className={cn(
                  "absolute -bottom-1 -right-1 rounded-full px-1 py-0.5 text-xs font-medium",
                  colors.tagBg,
                  colors.tagText
                )}>
                  ⭐
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{reviewer.firstName}</h4>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
            <p className="text-sm text-gray-500">{localizedDate}</p>
          </div>
        </div>

        {/* Collection tag if present */}
        {collectionTag && (
          <div className="mb-3">
            <span className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
              colors.tagBg,
              colors.tagText
            )}>
              {collectionTag}
            </span>
          </div>
        )}

        {/* Review content - simplified */}
        <div className="flex flex-col">
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: displayComments }}
          />
        
          {/* Read more/less button for mobile - always visible when needed */}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "flex items-center gap-1 mt-2 text-sm font-medium transition-colors duration-300 md:hidden",
                colors.accent
              )}
            >
              {isExpanded ? (
                <>
                  {t('showLess')}
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t('readMore')}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
          
          {/* Translation disclaimer for auto-translated content */}
          {disclaimer && (
            <p className="text-xs text-gray-500 mt-2 italic">
              {disclaimer}
            </p>
          )}

          {/* Host response if present - show only when expanded on mobile */}
          {response && (!isMobile || isExpanded) && (
            <div className={cn(
              "mt-4 p-4 rounded-lg border-l-4",
              colors.border.replace('border-', 'border-l-'),
              "bg-gray-50"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">H</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{t('hostResponse') || 'Risposta dell\'host'}</span>
              </div>
              <p className="text-sm text-gray-700">{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}