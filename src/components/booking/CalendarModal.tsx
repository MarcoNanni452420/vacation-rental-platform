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

  // Dynamic theme colors based on property
  const themeColors = {
    fienaroli: {
      primary: 'hsl(20, 65%, 48%)', // Terracotta
      primaryLight: 'hsl(20, 65%, 95%)', // Very light terracotta
      accent: 'hsl(35, 75%, 55%)', // Muted orange
      background: 'hsl(30, 40%, 98%)', // Warm cream
      hover: 'hsl(20, 65%, 88%)',
      text: 'hsl(25, 35%, 20%)'
    },
    moro: {
      primary: 'hsl(345, 55%, 42%)', // Burgundy
      primaryLight: 'hsl(345, 55%, 95%)', // Very light burgundy
      accent: 'hsl(25, 65%, 45%)', // Soft bronze
      background: 'hsl(15, 20%, 98%)', // Soft blush
      hover: 'hsl(345, 55%, 88%)',
      text: 'hsl(0, 0%, 15%)'
    }
  };

  const colors = themeColors[propertySlug];

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
    const base = "w-[40px] h-[40px] md:w-[44px] md:h-[44px] text-center cursor-pointer transition-all duration-300 flex items-center justify-center text-sm font-medium border-0 rounded-xl hover:scale-105";
    
    if (isDateDisabled(date)) {
      return cn(base, "text-gray-300 cursor-not-allowed bg-white/50 hover:scale-100");
    }
    
    if (isDateCheckIn(date)) {
      return cn(base, "bg-gradient-to-br text-white shadow-lg font-semibold", {
        'from-[hsl(20,65%,48%)] to-[hsl(20,65%,42%)]': propertySlug === 'fienaroli',
        'from-[hsl(345,55%,42%)] to-[hsl(345,55%,36%)]': propertySlug === 'moro'
      });
    }
    
    if (isDateCheckOut(date)) {
      return cn(base, "bg-gradient-to-br text-white shadow-lg font-semibold", {
        'from-[hsl(20,65%,48%)] to-[hsl(20,65%,42%)]': propertySlug === 'fienaroli',
        'from-[hsl(345,55%,42%)] to-[hsl(345,55%,36%)]': propertySlug === 'moro'
      });
    }
    
    if (isDateInRange(date)) {
      return cn(base, "text-gray-800 font-medium", {
        'bg-[hsl(20,65%,95%)]': propertySlug === 'fienaroli',
        'bg-[hsl(345,55%,95%)]': propertySlug === 'moro'
      });
    }
    
    const isWeekend = getDay(date) === 0 || getDay(date) === 6;
    if (isWeekend) {
      return cn(base, "text-gray-900 font-semibold", {
        'hover:bg-[hsl(20,65%,88%)]': propertySlug === 'fienaroli',
        'hover:bg-[hsl(345,55%,88%)]': propertySlug === 'moro'
      });
    }
    
    return cn(base, "text-gray-700", {
      'hover:bg-[hsl(20,65%,88%)]': propertySlug === 'fienaroli',
      'hover:bg-[hsl(345,55%,88%)]': propertySlug === 'moro'
    });
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
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-center"
              style={{ color: colors.text }}>
            {format(monthDate, 'MMMM yyyy', { locale: it })}
          </h3>
        </div>
        
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="w-[40px] md:w-[44px] text-center text-xs font-semibold text-gray-600 py-1">
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
      <div className="relative rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" 
           style={{ backgroundColor: colors.background }}>        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b" 
             style={{ borderColor: `${colors.primary}20` }}>
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>
              {range?.from && range?.to 
                ? `${differenceInDays(range.to, range.from)} notti`
                : 'Seleziona le date del tuo soggiorno'
              }
            </h2>
            {range?.from && range?.to && (
              <p className="mt-1" style={{ color: `${colors.text}80` }}>
                {format(range.from, 'd MMM yyyy', { locale: it })} - {format(range.to, 'd MMM yyyy', { locale: it })}
              </p>
            )}
            {range?.from && !range?.to && (
              <p className="mt-1" style={{ color: `${colors.text}80` }}>
                Seleziona la data di check-out (minimo {getMinimumStay(range.from)} notti)
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: `${colors.primary}10` }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}20`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
          >
            <X className="w-6 h-6" style={{ color: colors.primary }} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 animate-fade-in">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Calendar content */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
                   style={{ borderBottomColor: colors.primary }}></div>
            </div>
          ) : (
            <>
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                  className="p-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: `${colors.primary}10` }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
                >
                  <ChevronLeft className="w-6 h-6" style={{ color: colors.primary }} />
                </button>
                
                <div className="text-lg font-semibold" style={{ color: colors.text }}>
                  {format(currentMonth, 'yyyy', { locale: it })}
                </div>
                
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-3 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: `${colors.primary}10` }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}20`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
                >
                  <ChevronRight className="w-6 h-6" style={{ color: colors.primary }} />
                </button>
              </div>

              {/* Two months side by side on desktop, single on mobile */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center">
                <div className="md:hidden">
                  {renderMonth(currentMonth)}
                </div>
                <div className="hidden md:flex gap-12">
                  {renderMonth(currentMonth)}
                  {renderMonth(addMonths(currentMonth, 1))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border-t gap-4" 
             style={{ borderColor: `${colors.primary}20`, backgroundColor: `${colors.primary}05` }}>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium bg-white border rounded-xl transition-all duration-200 hover:scale-105 order-2 sm:order-1"
            style={{ 
              color: colors.text, 
              borderColor: `${colors.primary}30`,
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Cancella date
          </button>
          
          <div className="flex gap-3 order-1 sm:order-2">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium bg-white border rounded-xl transition-all duration-200 hover:scale-105"
              style={{ 
                color: colors.text, 
                borderColor: `${colors.primary}30`,
                backgroundColor: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Annulla
            </button>
            <button
              onClick={handleConfirm}
              disabled={!range?.from || !range?.to}
              className="px-6 py-2 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              style={{ 
                background: !range?.from || !range?.to 
                  ? '#9CA3AF' 
                  : `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
              }}
            >
              Conferma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}