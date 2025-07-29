"use client"

import { VerticalReviews } from './VerticalReviews';
import { MapPin, MapPinIcon, Train, Car, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewsResponse } from '@/types/reviews';
import { useTranslations } from 'next-intl';

interface ReviewsMapSectionProps {
  propertySlug: 'fienaroli' | 'moro';
  propertyName: string;
  location: string;
  className?: string;
  preloadedReviews?: ReviewsResponse | null;
  isPreloadingReviews?: boolean;
}

export function ReviewsMapSection({ 
  propertySlug, 
  propertyName, 
  location, 
  className,
  preloadedReviews,
  isPreloadingReviews = false
}: ReviewsMapSectionProps) {
  const t = useTranslations('location');
  
  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      accent: 'text-[hsl(20,65%,35%)]', // Darkened for better contrast
      border: 'border-[hsl(20,65%,35%)]'
    },
    moro: {
      accent: 'text-[hsl(345,55%,35%)]', // Darkened for better contrast
      border: 'border-[hsl(345,55%,35%)]'
    }
  };

  const colors = themeColors[propertySlug];

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8", className)}>
      {/* Reviews Section - 2/3 width */}
      <div className="lg:col-span-2">
        <VerticalReviews 
          propertySlug={propertySlug} 
          preloadedReviews={preloadedReviews}
          isPreloadingReviews={isPreloadingReviews}
        />
      </div>

      {/* Map Section - 1/3 width */}
      <div className="space-y-6">
        {/* Location Header */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">{t('title')}</h3>
          <div className="flex items-center gap-2 text-lg text-gray-600">
            <MapPin className={cn("w-5 h-5", colors.accent)} />
            <span>{location}</span>
          </div>
          <p className="text-gray-600 text-sm">
            {t('description')}
          </p>
        </div>

        {/* Map */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={propertySlug === 'fienaroli' 
              ? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.8267848567495!2d12.467863515520!3d41.89139527922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6069db49b0d5%3A0xa7e3b79c6ee8e6e8!2sVia%20dei%20Fienaroli%2C%2011%2C%20Roma%20RM%2C%20Italy!5e0!3m2!1sen!2sus!4v1642000000000!5m2!1sen!2sus"
              : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.8267848567495!2d12.467863515520!3d41.89139527922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6069db49b0d5%3A0xa7e3b79c6ee8e6e8!2sVia%20del%20Moro%2C%206%2C%20Roma%20RM%2C%20Italy!5e0!3m2!1sen!2sus!4v1642000000000!5m2!1sen!2sus"
            }
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('mapTitle', { propertyName })}
            className="w-full h-full"
          />
        </div>

        {/* Additional Location Info */}
        <div className={cn(
          "rounded-2xl p-6 border-2 shadow-sm transition-all duration-300 hover:shadow-md",
          propertySlug === 'fienaroli' 
            ? "bg-[hsl(20,65%,98%)] border-[hsl(20,65%,90%)]" 
            : "bg-[hsl(345,55%,98%)] border-[hsl(345,55%,90%)]"
        )}>
          <h4 className={cn(
            "font-bold text-lg mb-4 flex items-center gap-2",
            colors.accent
          )}>
            <MapPinIcon className="w-5 h-5" />
            {t('nearby')}
          </h4>
          <div className="space-y-3">
            {[
              { nameKey: "Trastevere", time: `2 min ${t('walkingTime')}`, icon: Coffee },
              { nameKey: "Ponte Sisto", time: `5 min ${t('walkingTime')}`, icon: MapPinIcon },
              { nameKey: "Isola Tiberina", time: `8 min ${t('walkingTime')}`, icon: MapPinIcon },
              { nameKey: "Campo de' Fiori", time: `10 min ${t('walkingTime')}`, icon: Coffee },
              { nameKey: "Pantheon", time: `15 min ${t('walkingTime')}`, icon: MapPinIcon }
            ].map((place, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className="flex items-center gap-3">
                  <place.icon className={cn("w-4 h-4", colors.accent)} />
                  <span className="font-medium text-gray-900">{t(`places.${place.nameKey}`)}</span>
                </div>
                <span className="text-sm text-gray-600">{place.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Info */}
        <div className={cn(
          "rounded-2xl p-6 border-2 shadow-sm transition-all duration-300 hover:shadow-md",
          propertySlug === 'fienaroli' 
            ? "bg-[hsl(20,65%,98%)] border-[hsl(20,65%,90%)]" 
            : "bg-[hsl(345,55%,98%)] border-[hsl(345,55%,90%)]"
        )}>
          <h4 className={cn(
            "font-bold text-lg mb-4 flex items-center gap-2",
            colors.accent
          )}>
            <Train className="w-5 h-5" />
            {t('transport')}
          </h4>
          <div className="space-y-3">
            {[
              { nameKey: "Stazione Trastevere", time: `10 min ${t('walkingTime')}`, icon: Train },
              { nameKey: "Metro Piramide", time: `15 min ${t('byTram')}`, icon: Train },
              { nameKey: "Aeroporto Fiumicino", time: `35 min ${t('byTrain')}`, icon: Car }
            ].map((transport, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 transition-colors">
                <div className="flex items-center gap-3">
                  <transport.icon className={cn("w-4 h-4", colors.accent)} />
                  <span className="font-medium text-gray-900">{t(`places.${transport.nameKey}`)}</span>
                </div>
                <span className="text-sm text-gray-600">{transport.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}