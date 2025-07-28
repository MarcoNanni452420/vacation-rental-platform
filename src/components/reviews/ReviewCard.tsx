"use client"

import { Star } from 'lucide-react';
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
      colors.border,
      colors.bg,
      className
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
            <p className="text-sm text-gray-600">{reviewer.location}</p>
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

      {/* Review content - already translated if in English */}
      <div className="mb-4">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: comments }}
        />
        
        {/* Translation disclaimer for auto-translated content */}
        {disclaimer && (
          <p className="text-xs text-gray-500 mt-2 italic">
            {disclaimer}
          </p>
        )}
      </div>

      {/* Host response if present */}
      {response && (
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
  );
}