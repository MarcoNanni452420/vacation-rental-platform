"use client"

import { cn } from '@/lib/utils';
import { PricingCalculation } from '@/types/pricing';
import { useTranslations } from 'next-intl';

interface PriceBreakdownProps {
  pricing: PricingCalculation;
  propertySlug: 'fienaroli' | 'moro';
  className?: string;
}

export function PriceBreakdown({ pricing, propertySlug, className }: PriceBreakdownProps) {
  const t = useTranslations('pricing');
  
  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      accent: 'text-[hsl(20,65%,48%)]',
      border: 'border-[hsl(20,65%,48%)]',
      bg: 'bg-[hsl(20,65%,98%)]'
    },
    moro: {
      accent: 'text-[hsl(345,65%,48%)]',
      border: 'border-[hsl(345,65%,48%)]',
      bg: 'bg-[hsl(345,65%,98%)]'
    }
  };

  const colors = themeColors[propertySlug];

  // Format price for display
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: pricing.currency
    }).format(amount);
  };

  // Get the accommodation title with nights info
  const getAccommodationTitle = (): string => {
    const nightsText = pricing.nights === 1 ? t('night') : t('nights');
    return `${pricing.nights} ${nightsText} ${t('at')} ${formatPrice(pricing.accommodationPerNight)}`;
  };

  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 space-y-4", className)}>
      {/* Price breakdown items */}
      <div className="space-y-3">
        {/* Accommodation cost */}
        <div className="flex justify-between items-center py-2">
          <span className="font-medium">{getAccommodationTitle()}</span>
          <span className="font-semibold">{formatPrice(pricing.accommodationTotal)}</span>
        </div>

        {/* Show cleaning fee and taxes always */}
        {pricing.cleaningFee > 0 && (
          <div className="flex justify-between items-center py-2">
            <span>{t('cleaningFee')}</span>
            <span>{formatPrice(pricing.cleaningFee)}</span>
          </div>
        )}

        {pricing.taxes > 0 && (
          <div className="flex justify-between items-center py-2">
            <span>{t('taxes')}</span>
            <span>{formatPrice(pricing.taxes)}</span>
          </div>
        )}

        {pricing.serviceFeesTotal > 0 && (
          <div className="flex justify-between items-center py-2">
            <span>{t('serviceFees')}</span>
            <span>{formatPrice(pricing.serviceFeesTotal)}</span>
          </div>
        )}

        {pricing.discounts < 0 && (
          <div className="flex justify-between items-center py-2 text-green-600">
            <span>{t('earlyBirdDiscount')}</span>
            <span className="font-semibold">{formatPrice(pricing.discounts)}</span>
          </div>
        )}

        {/* Total line - more prominent */}
        <div className={cn(
          "flex justify-between items-center py-4 border-t mt-4",
          colors.border
        )}>
          <span className="text-xl font-semibold">{t('total')}</span>
          <span className="text-2xl font-bold">{formatPrice(pricing.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}