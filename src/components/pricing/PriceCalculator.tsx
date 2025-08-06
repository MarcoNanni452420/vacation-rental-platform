"use client"

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { PriceBreakdown } from './PriceBreakdown';
import { PricingCalculation } from '@/types/pricing';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { track } from '@vercel/analytics';

interface PriceCalculatorProps {
  propertySlug: 'fienaroli' | 'moro';
  checkinDate?: Date;
  checkoutDate?: Date;
  guests: number;
  className?: string;
  onPriceCalculated?: (totalPrice: number | null) => void;
  onPricingError?: (hasError: boolean) => void;
}

export function PriceCalculator({
  propertySlug,
  checkinDate,
  checkoutDate,
  guests,
  className,
  onPriceCalculated,
  onPricingError
}: PriceCalculatorProps) {
  const t = useTranslations('pricing');
  const [pricing, setPricing] = useState<PricingCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch pricing if both dates are selected
    if (!checkinDate || !checkoutDate) {
      setPricing(null);
      setError(null);
      return;
    }

    const fetchPricing = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          checkinDate: format(checkinDate, 'yyyy-MM-dd'),
          checkoutDate: format(checkoutDate, 'yyyy-MM-dd'),
          guests: guests.toString()
        });

        const response = await fetch(`/api/booking-pricing/${propertySlug}?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch pricing');
        }

        const pricingData: PricingCalculation = await response.json();
        setPricing(pricingData);
        
        // Track successful price calculation with simplified format
        track('Price Calculated', {
          property: propertySlug,
          details: `${format(checkinDate, 'dd/MM/yyyy')}-${format(checkoutDate, 'dd/MM/yyyy')} (${pricingData.nights} ${pricingData.nights === 1 ? 'night' : 'nights'}) · ${guests} ${guests === 1 ? 'guest' : 'guests'}`,
          price: `${Math.round(pricingData.grandTotal)} ${pricingData.currency}`
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing');
        setPricing(null);
        
        // Track pricing error with simplified format
        track('Pricing Error', {
          property: propertySlug,
          details: `${format(checkinDate, 'dd/MM/yyyy')}-${format(checkoutDate, 'dd/MM/yyyy')} · ${guests} ${guests === 1 ? 'guest' : 'guests'}`,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [propertySlug, checkinDate, checkoutDate, guests]);

  // Notify parent component when price is calculated
  useEffect(() => {
    if (onPriceCalculated) {
      if (!checkinDate || !checkoutDate) {
        // Clear price when no dates selected
        onPriceCalculated(null);
      } else {
        // Set price when available
        onPriceCalculated(pricing?.grandTotal || null);
      }
    }
  }, [pricing, onPriceCalculated, checkinDate, checkoutDate]);

  // Notify parent about error state
  useEffect(() => {
    if (onPricingError) {
      onPricingError(!!error);
    }
  }, [error, onPricingError]);

  // Don't render anything if no dates selected
  if (!checkinDate || !checkoutDate) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">{t('calculating')}</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-card border border-border rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <div>
            <div className="font-medium">{t('pricingError')}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t('pricingErrorMessage')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state with pricing
  if (pricing) {
    return (
      <PriceBreakdown 
        pricing={pricing} 
        propertySlug={propertySlug}
        className={className}
      />
    );
  }

  return null;
}