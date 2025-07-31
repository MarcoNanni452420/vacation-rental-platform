"use client"

import { useState } from 'react';
import { CalendarModal } from './CalendarModal';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { it, enUS, fr, de, es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { track } from '@vercel/analytics';

interface BookingCalendarProps {
  propertySlug: 'fienaroli' | 'moro';
  onDateChange: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;
  className?: string;
  selectedRange?: { from: Date | undefined; to: Date | undefined };
  preloadedAvailability?: import('@/types/octorate').OctorateCalendarResponse | null;
}

export function BookingCalendar({ propertySlug, onDateChange, className, selectedRange, preloadedAvailability }: BookingCalendarProps) {
  const t = useTranslations('property');
  const tBooking = useTranslations('booking');
  const locale = useLocale();
  
  // Dynamic date-fns locale mapping
  const localeMap = {
    'it': it,
    'en': enUS,
    'fr': fr,
    'de': de,
    'es': es
  };
  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDateConfirm = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    // Track date selection
    if (range?.from && range?.to) {
      track('Dates Selected', {
        property: propertySlug,
        nights: differenceInDays(range.to, range.from),
        checkin_date: format(range.from, 'yyyy-MM-dd'),
        checkout_date: format(range.to, 'yyyy-MM-dd')
      });
    }
    onDateChange(range);
  };

  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      border: 'hover:border-[hsl(20,65%,48%)]',
      focus: 'focus:border-[hsl(20,65%,48%)] focus:ring-[hsl(20,65%,48%)]',
      icon: 'text-[hsl(20,65%,48%)]',
      bg: 'hover:bg-[hsl(20,65%,98%)]'
    },
    moro: {
      border: 'hover:border-[hsl(345,55%,42%)]',
      focus: 'focus:border-[hsl(345,55%,42%)] focus:ring-[hsl(345,55%,42%)]',
      icon: 'text-[hsl(345,55%,42%)]',
      bg: 'hover:bg-[hsl(345,55%,98%)]'
    }
  };

  const colors = themeColors[propertySlug];
  const hasSelection = selectedRange?.from && selectedRange?.to;
  const nights = hasSelection ? differenceInDays(selectedRange.to!, selectedRange.from!) : 0;

  // Intelligent date formatting
  const formatDateRange = (from: Date, to: Date) => {
    const fromMonth = from.getMonth();
    const toMonth = to.getMonth();
    const fromYear = from.getFullYear();
    const toYear = to.getFullYear();
    
    if (fromMonth === toMonth && fromYear === toYear) {
      // Same month and year: "5-7 Aug 2025"
      return `${format(from, 'd', { locale: dateLocale })}-${format(to, 'd MMM yyyy', { locale: dateLocale })}`;
    } else {
      // Different months/years: "30 Jul - 5 Aug 2025"
      return `${format(from, 'd MMM', { locale: dateLocale })} - ${format(to, 'd MMM yyyy', { locale: dateLocale })}`;
    }
  };

  return (
    <>
      <button
        onClick={() => {
          // Track calendar opening
          track('Calendar Opened', {
            property: propertySlug,
            has_existing_selection: !!(selectedRange?.from && selectedRange?.to)
          });
          setIsModalOpen(true);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-full p-4 text-left rounded-xl transition-all duration-300",
          "bg-white border-2 border-gray-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50",
          colors.border,
          colors.focus,
          colors.bg,
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedRange?.from ? (
              selectedRange.to ? (
                <div className="space-y-2">
                  {/* Titoli */}
                  <div className="text-sm text-gray-500">
                    {t('checkIn')} → {t('checkOut')}
                  </div>
                  
                  {/* Date intelligenti */}
                  <div className="font-semibold text-gray-900 text-lg">
                    {formatDateRange(selectedRange.from, selectedRange.to)}
                  </div>
                  
                  {/* Chip Notti */}
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "text-sm font-medium px-3 py-1 rounded-full inline-flex",
                      propertySlug === 'fienaroli' 
                        ? "bg-[hsl(20,65%,95%)] text-[hsl(20,65%,48%)]" 
                        : "bg-[hsl(345,55%,95%)] text-[hsl(345,55%,42%)]"
                    )}>
                      {nights} {nights === 1 ? t('night') : t('nights')}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {format(selectedRange.from, 'd MMMM yyyy', { locale: dateLocale })}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {tBooking('selectCheckout')}
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="font-semibold text-gray-700 text-lg">
                  {tBooking('whenStay')}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {tBooking('selectCheckin')}
                </div>
              </div>
            )}
          </div>
          <div className={cn(
            "ml-4 p-2 rounded-xl transition-all duration-300",
            isHovered && propertySlug === 'fienaroli' && "bg-[hsl(20,65%,95%)]",
            isHovered && propertySlug === 'moro' && "bg-[hsl(345,55%,95%)]"
          )}>
            <CalendarIcon className={cn(
              "w-5 h-5 transition-colors duration-300",
              isHovered ? colors.icon : "text-gray-400"
            )} />
          </div>
        </div>
      </button>

      <CalendarModal
        propertySlug={propertySlug}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDateConfirm={handleDateConfirm}
        initialRange={selectedRange}
        preloadedAvailability={preloadedAvailability}
      />
    </>
  );
}