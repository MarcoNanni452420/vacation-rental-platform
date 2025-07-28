"use client"

import { useState, useEffect } from 'react';
import { format, isBefore, startOfToday, differenceInDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { fetchAvailability } from '@/lib/octorate-api';
import { OctorateCalendarResponse } from '@/types/octorate';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface AirbnbCalendarProps {
  propertySlug: 'fienaroli' | 'moro';
  onDateChange: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;
  className?: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function AirbnbCalendar({ propertySlug, onDateChange, className }: AirbnbCalendarProps) {
  const t = useTranslations('property');
  const [availability, setAvailability] = useState<OctorateCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      const data = await fetchAvailability(propertySlug);
      setAvailability(data);
      setLoading(false);
    };
    
    loadAvailability();
  }, [propertySlug]);

  const isDateAvailable = (date: Date): boolean => {
    if (!availability) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = availability.calendar.find(day => day.date === dateStr);
    return dayData?.available ?? false;
  };

  const getMinimumStay = (date: Date): number => {
    if (!availability) return 2;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = availability.calendar.find(day => day.date === dateStr);
    return dayData?.minimumStay ?? 2;
  };

  const getValidCheckoutDates = (checkinDate: Date): Date[] => {
    if (!availability) return [];
    
    const validDates: Date[] = [];
    const minStay = getMinimumStay(checkinDate);
    
    for (let i = minStay; i <= 30; i++) {
      const checkoutDate = new Date(checkinDate.getTime() + i * 24 * 60 * 60 * 1000);
      
      let allNightsAvailable = true;
      for (let j = 0; j < i; j++) {
        const nightDate = new Date(checkinDate.getTime() + j * 24 * 60 * 60 * 1000);
        if (!isDateAvailable(nightDate)) {
          allNightsAvailable = false;
          break;
        }
      }
      
      if (allNightsAvailable) {
        validDates.push(checkoutDate);
      } else {
        break;
      }
    }
    
    return validDates;
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, startOfToday()) || !isDateAvailable(date)) return;

    if (!range?.from) {
      // First click: set check-in
      const newRange = { from: date, to: undefined };
      setRange(newRange);
      onDateChange(newRange);
      setError(null);
    } else if (range.from && !range.to) {
      // Second click: set check-out
      const validCheckouts = getValidCheckoutDates(range.from);
      const isValidCheckout = validCheckouts.some(validDate => 
        validDate.toDateString() === date.toDateString()
      );

      if (isValidCheckout) {
        const nights = differenceInDays(date, range.from);
        const minStay = getMinimumStay(range.from);
        
        if (nights >= minStay) {
          const newRange = { from: range.from, to: date };
          setRange(newRange);
          onDateChange(newRange);
          setError(null);
        } else {
          setError(t('minimumStay', { nights: minStay }));
        }
      } else {
        // Invalid checkout, reset to new check-in
        const newRange = { from: date, to: undefined };
        setRange(newRange);
        onDateChange(newRange);
        setError(null);
      }
    } else {
      // Both dates selected: reset to new check-in
      const newRange = { from: date, to: undefined };
      setRange(newRange);
      onDateChange(newRange);
      setError(null);
    }
  };

  const isDateInRange = (date: Date): boolean => {
    if (!range?.from || !range?.to) return false;
    return date >= range.from && date <= range.to;
  };

  const isDateCheckIn = (date: Date): boolean => {
    return range?.from?.toDateString() === date.toDateString();
  };

  const isDateCheckOut = (date: Date): boolean => {
    return range?.to?.toDateString() === date.toDateString();
  };

  const isDateDisabled = (date: Date): boolean => {
    if (isBefore(date, startOfToday())) return true;
    if (!isDateAvailable(date)) return true;
    
    if (range?.from && !range?.to) {
      const validCheckouts = getValidCheckoutDates(range.from);
      const isValidCheckout = validCheckouts.some(validDate => 
        validDate.toDateString() === date.toDateString()
      );
      return date.toDateString() !== range.from.toDateString() && !isValidCheckout;
    }
    
    return false;
  };

  const getDayClassName = (date: Date): string => {
    const base = "w-[68px] h-[68px] text-center cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-medium border-0";
    
    if (isDateDisabled(date)) {
      return cn(base, "text-gray-300 cursor-not-allowed bg-white");
    }
    
    if (isDateCheckIn(date)) {
      return cn(base, "bg-gray-900 text-white rounded-full");
    }
    
    if (isDateCheckOut(date)) {
      return cn(base, "bg-gray-900 text-white rounded-full");
    }
    
    if (isDateInRange(date)) {
      return cn(base, "bg-gray-100 text-gray-900");
    }
    
    const isWeekend = getDay(date) === 0 || getDay(date) === 6;
    if (isWeekend) {
      return cn(base, "text-gray-900 hover:bg-gray-50 font-semibold");
    }
    
    return cn(base, "text-gray-700 hover:bg-gray-50");
  };

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding days to align with weekdays
    const startDay = getDay(monthStart);
    const paddingDays = Array.from({ length: startDay }, () => null);
    
    // Group days into weeks
    const allDays = [...paddingDays, ...days];
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    return (
      <div key={format(monthDate, 'yyyy-MM')} className="px-3">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(monthDate, 'MMMM yyyy', { locale: it })}
          </h3>
        </div>
        
        <table className="w-full" style={{ borderSpacing: '0 2px' }}>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => (
                  <td key={dayIndex} className="p-0">
                    {day ? (
                      <div
                        className={getDayClassName(day)}
                        onClick={() => handleDateClick(day)}
                        data-testid={`calendar-day-${format(day, 'dd/MM/yyyy')}`}
                      >
                        {format(day, 'd')}
                      </div>
                    ) : (
                      <div className="w-[68px] h-[68px]" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("p-8 text-center", className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("airbnb-calendar bg-white", className)}>
      {/* Header with night count and date range */}
      <div className="mb-6">
        {range?.from && range?.to && (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {differenceInDays(range.to, range.from)} {differenceInDays(range.to, range.from) === 1 ? t('night') : t('nights')}
            </h2>
            <div className="text-gray-600">
              {format(range.from, 'd MMM yyyy', { locale: it })} - {format(range.to, 'd MMM yyyy', { locale: it })}
            </div>
          </div>
        )}
        
        {range?.from && !range?.to && (
          <div className="text-center">
            <p className="text-gray-600">
              {t('selectCheckout', { nights: getMinimumStay(range.from) })}
            </p>
          </div>
        )}
        
        {!range?.from && (
          <div className="text-center">
            <p className="text-gray-600">{t('selectDates')}</p>
          </div>
        )}
        
        {error && (
          <div className="text-center mt-2">
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-2 inline-block">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Day labels */}
      <div className="px-3 mb-4">
        <div className="grid grid-cols-7 gap-0">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="w-[68px] text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar months */}
      <div className="max-h-[600px] overflow-y-auto">
        {[0, 1, 2, 3].map(monthOffset => renderMonth(addMonths(currentMonth, monthOffset)))}
        
        {/* Load more button */}
        <div className="text-center py-6">
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 4))}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Carica altre date
          </button>
        </div>
      </div>

      {/* Clear dates button */}
      {(range?.from || range?.to) && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setRange(undefined);
              onDateChange(undefined);
              setError(null);
            }}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annulla date
          </button>
        </div>
      )}
    </div>
  );
}