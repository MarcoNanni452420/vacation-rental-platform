"use client"

import { useState, useEffect } from 'react';
import { format, isBefore, startOfToday, differenceInDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { fetchAvailability } from '@/lib/octorate-api';
import { OctorateCalendarResponse } from '@/types/octorate';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CalendarModalProps {
  propertySlug: 'fienaroli' | 'moro';
  isOpen: boolean;
  onClose: () => void;
  onDateConfirm: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;
  initialRange?: { from: Date | undefined; to: Date | undefined };
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function CalendarModal({ propertySlug, isOpen, onClose, onDateConfirm, initialRange }: CalendarModalProps) {
  const [availability, setAvailability] = useState<OctorateCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchAvailability(propertySlug);
      setAvailability(data);
      setLoading(false);
    };

    if (isOpen) {
      loadData();
      setRange(initialRange);
    }
  }, [isOpen, propertySlug, initialRange]);


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
          setError(null);
        } else {
          setError(`Il soggiorno minimo è di ${minStay} notti.`);
        }
      } else {
        // Invalid checkout, reset to new check-in
        const newRange = { from: date, to: undefined };
        setRange(newRange);
        setError(null);
      }
    } else {
      // Both dates selected: reset to new check-in
      const newRange = { from: date, to: undefined };
      setRange(newRange);
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
    const base = "w-[50px] h-[50px] text-center cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-medium border-0 rounded-lg";
    
    if (isDateDisabled(date)) {
      return cn(base, "text-gray-300 cursor-not-allowed bg-white");
    }
    
    if (isDateCheckIn(date)) {
      return cn(base, "bg-gray-900 text-white");
    }
    
    if (isDateCheckOut(date)) {
      return cn(base, "bg-gray-900 text-white");
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
      <div key={format(monthDate, 'yyyy-MM')} className="flex-1 min-w-0">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            {format(monthDate, 'MMMM yyyy', { locale: it })}
          </h3>
        </div>
        
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="w-[50px] text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className="flex justify-center">
                  {day ? (
                    <div
                      className={getDayClassName(day)}
                      onClick={() => handleDateClick(day)}
                      data-testid={`calendar-day-${format(day, 'dd/MM/yyyy')}`}
                    >
                      {format(day, 'd')}
                    </div>
                  ) : (
                    <div className="w-[50px] h-[50px]" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleConfirm = () => {
    onDateConfirm(range);
    onClose();
  };

  const handleClear = () => {
    setRange(undefined);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {range?.from && range?.to 
                ? `${differenceInDays(range.to, range.from)} notti`
                : 'Seleziona le date del tuo soggiorno'
              }
            </h2>
            {range?.from && range?.to && (
              <p className="text-gray-600 mt-1">
                {format(range.from, 'd MMM yyyy', { locale: it })} - {format(range.to, 'd MMM yyyy', { locale: it })}
              </p>
            )}
            {range?.from && !range?.to && (
              <p className="text-gray-600 mt-1">
                Seleziona la data di check-out (minimo {getMinimumStay(range.from)} notti)
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Calendar content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                
                <div className="text-lg font-medium text-gray-900">
                  {format(currentMonth, 'yyyy', { locale: it })}
                </div>
                
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Two months side by side */}
              <div className="flex gap-12 justify-center">
                {renderMonth(currentMonth)}
                {renderMonth(addMonths(currentMonth, 1))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancella date
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleConfirm}
              disabled={!range?.from || !range?.to}
              className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Conferma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}