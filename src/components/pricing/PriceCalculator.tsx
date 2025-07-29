"use client"

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { PriceBreakdown } from './PriceBreakdown';
import { PricingCalculation } from '@/types/pricing';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface PriceCalculatorProps {
  propertySlug: 'fienaroli' | 'moro';
  checkinDate?: Date;
  checkoutDate?: Date;
  guests: number;
  className?: string;
}

export function PriceCalculator({
  propertySlug,
  checkinDate,
  checkoutDate,
  guests,
  className
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pricing');
        setPricing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, [propertySlug, checkinDate, checkoutDate, guests]);

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
            <div className="font-medium">Errore nel calcolo del prezzo</div>
            <div className="text-sm text-muted-foreground mt-1">
              Prezzi disponibili su Airbnb dopo la prenotazione
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