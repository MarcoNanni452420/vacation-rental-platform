"use client"

import { useState } from 'react';
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
  id,
  comments,
  localizedDate,
  rating,
  reviewer,
  response,
  collectionTag,
  needsTranslation,
  disclaimer,
  propertySlug,
  className
}: ReviewCardProps) {
  const t = useTranslations('reviews');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mobile truncation - show first 120 characters
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldTruncate = isMobile && (comments.length > 120 || response);
  const displayComments = shouldTruncate && !isExpanded 
    ? comments.slice(0, 120) + '...'
    : comments;
  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      border: 'border-[hsl(20,65%,90%)]',
      bg: 'bg-[hsl(20,65%,98%)]',
      accent: 'text-[hsl(20,65%,48%)]',
      tagBg: 'bg-[hsl(20,65%,95%)]',
      tagText: 'text-[hsl(20,65%,48%)]'
    },
    moro: {
      border: 'border-[hsl(345,55%,90%)]',
      bg: 'bg-[hsl(345,55%,98%)]',
      accent: 'text-[hsl(345,55%,42%)]',
      tagBg: 'bg-[hsl(345,55%,95%)]',
      tagText: 'text-[hsl(345,55%,42%)]'
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
      "md:min-h-auto md:max-h-none flex flex-col", // Responsive height
      // Mobile height and overflow management
      isMobile ? (isExpanded ? "min-h-[280px]" : "min-h-[280px] max-h-[320px]") : "",
      colors.border,
      colors.bg,
      className
    )}>
      <div className={cn(
        "flex-1 flex flex-col",
        // Dynamic overflow based on expanded state on mobile
        isMobile ? (isExpanded ? "overflow-visible" : "overflow-hidden") : "md:overflow-visible overflow-hidden"
      )}>
        {/* Header with reviewer info and rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={reviewer.pictureUrl}
                alt={`${reviewer.firstName}&apos;s profile`}
                width={48}
                height={48}
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

        {/* Review content - with mobile truncation */}
        <div className={cn(
          "md:flex-none",
          // Dynamic flex and overflow based on expanded state
          isMobile ? (isExpanded ? "flex-none" : "flex-1") : "flex-1",
          isMobile ? (isExpanded ? "overflow-visible" : "overflow-hidden") : "md:overflow-visible overflow-hidden"
        )}>
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: displayComments }}
        />
        
        {/* Read more/less button for mobile */}
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
                Mostra meno
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Leggi di più
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