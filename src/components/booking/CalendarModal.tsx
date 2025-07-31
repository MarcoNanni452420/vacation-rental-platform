"use client"

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format, differenceInDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { isBeforeTodayInItaly, startOfTodayInItaly, formatDateForAPI, isValidDateRangeInItaly, getTimezoneDebugInfo } from '@/lib/date-utils';
import { it, enUS, fr, de, es } from 'date-fns/locale';
import { fetchAvailability } from '@/lib/octorate-api';
import { OctorateCalendarResponse } from '@/types/octorate';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface CalendarModalProps {
  propertySlug: 'fienaroli' | 'moro';
  isOpen: boolean;
  onClose: () => void;
  onDateConfirm: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;
  initialRange?: { from: Date | undefined; to: Date | undefined };
  preloadedAvailability?: OctorateCalendarResponse | null;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function CalendarModal({ propertySlug, isOpen, onClose, onDateConfirm, initialRange, preloadedAvailability }: CalendarModalProps) {
  const t = useTranslations('property');
  const locale = useLocale();
  
  // Dynamic date-fns locale
  const getDateLocale = () => {
    switch (locale) {
      case 'it': return it;
      case 'fr': return fr;
      case 'de': return de;
      case 'es': return es;
      case 'en':
      default: return enUS;
    }
  };
  const dateLocale = getDateLocale();
  
  // Helper function to capitalize first letter of month names
  const formatMonthCapitalized = (date: Date, formatStr: string) => {
    const formatted = format(date, formatStr, { locale: dateLocale });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
  const [availability, setAvailability] = useState<OctorateCalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mounted, setMounted] = useState(false);

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
      accent: 'hsl(340, 60%, 38%)', // Deeper burgundy accent
      background: 'hsl(15, 20%, 98%)', // Soft blush
      hover: 'hsl(345, 55%, 88%)',
      text: 'hsl(0, 0%, 15%)'
    }
  };

  const colors = themeColors[propertySlug];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      // Use preloaded data if available, otherwise fetch
      if (preloadedAvailability) {
        setAvailability(preloadedAvailability);
        setLoading(false);
      } else {
        setLoading(true);
        const data = await fetchAvailability(propertySlug);
        setAvailability(data);
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
      setRange(initialRange);
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, propertySlug, initialRange, preloadedAvailability]);


  const isDateAvailable = (date: Date): boolean => {
    if (!availability) return false;
    const dateStr = formatDateForAPI(date); // Use Italian timezone-aware formatting
    const dayData = availability.calendar.find(day => day.date === dateStr);
    return dayData?.available ?? false;
  };

  const getMinimumStay = (date: Date): number => {
    if (!availability) return 2;
    const dateStr = formatDateForAPI(date); // Use Italian timezone-aware formatting
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
    // CRITICAL FIX: Use Italian timezone for all date validations
    if (isBeforeTodayInItaly(date) || !isDateAvailable(date)) return;

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
          setError(t('minimumStay', { nights: minStay }));
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
    // CRITICAL FIX: Use Italian timezone for past date validation
    if (isBeforeTodayInItaly(date)) return true;
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
            {formatMonthCapitalized(monthDate, 'MMMM yyyy')}
          </h3>
        </div>
        
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {(t.raw('weekdays') as string[]).map((day: string, index: number) => (
            <div key={index} className="w-[40px] md:w-[44px] text-center text-xs font-semibold text-gray-600 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="space-y-1 md:min-h-0 min-h-[280px]">
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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pt-16">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden" 
           style={{ backgroundColor: colors.background }}>        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b" 
             style={{ borderColor: `${colors.primary}20` }}>
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>
              {range?.from && range?.to 
                ? `${differenceInDays(range.to, range.from)} ${differenceInDays(range.to, range.from) === 1 ? t('night') : t('nights')}`
                : t('selectDates')
              }
            </h2>
            {range?.from && range?.to && (
              <p className="mt-1" style={{ color: `${colors.text}80` }}>
                {formatMonthCapitalized(range.from, 'd MMM yyyy')} - {formatMonthCapitalized(range.to, 'd MMM yyyy')}
              </p>
            )}
            {range?.from && !range?.to && (
              <p className="mt-1" style={{ color: `${colors.text}80` }}>
                {t('selectCheckout', { nights: getMinimumStay(range.from) })}
              </p>
            )}
            {!range?.from && (
              <p className="mt-1" style={{ color: `${colors.text}80` }}>
{t('selectCheckin')}
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center md:bg-transparent md:border-0"
            style={{ 
              backgroundColor: window.innerWidth < 768 ? '#F3F4F6' : `${colors.primary}10`,
              border: window.innerWidth < 768 ? '1px solid #D1D5DB' : 'none'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.backgroundColor = `${colors.primary}20`
              } else {
                e.currentTarget.style.backgroundColor = '#E5E7EB'
                e.currentTarget.style.borderColor = '#9CA3AF'
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.backgroundColor = `${colors.primary}10`
              } else {
                e.currentTarget.style.backgroundColor = '#F3F4F6'
                e.currentTarget.style.borderColor = '#D1D5DB'
              }
            }}
          >
            <X className="w-6 h-6" style={{ color: window.innerWidth < 768 ? '#374151' : colors.primary }} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 animate-fade-in">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Calendar content - Scrollable */}
        <div className="p-4 md:p-6 flex-1 overflow-y-auto">
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
                  className="p-3 rounded-xl transition-all duration-200 hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{ 
                    backgroundColor: window.innerWidth < 768 ? '#F3F4F6' : `${colors.primary}10`,
                    border: window.innerWidth < 768 ? '1px solid #D1D5DB' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.backgroundColor = `${colors.primary}20`
                    } else {
                      e.currentTarget.style.backgroundColor = '#E5E7EB'
                      e.currentTarget.style.borderColor = '#9CA3AF'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.backgroundColor = `${colors.primary}10`
                    } else {
                      e.currentTarget.style.backgroundColor = '#F3F4F6'
                      e.currentTarget.style.borderColor = '#D1D5DB'
                    }
                  }}
                >
                  <ChevronLeft className="w-6 h-6" style={{ color: window.innerWidth < 768 ? '#374151' : colors.primary }} />
                </button>
                
                <div className="text-lg font-semibold" style={{ color: colors.text }}>
                  {format(currentMonth, 'yyyy', { locale: dateLocale })}
                </div>
                
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-3 rounded-xl transition-all duration-200 hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{ 
                    backgroundColor: window.innerWidth < 768 ? '#F3F4F6' : `${colors.primary}10`,
                    border: window.innerWidth < 768 ? '1px solid #D1D5DB' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.backgroundColor = `${colors.primary}20`
                    } else {
                      e.currentTarget.style.backgroundColor = '#E5E7EB'
                      e.currentTarget.style.borderColor = '#9CA3AF'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.backgroundColor = `${colors.primary}10`
                    } else {
                      e.currentTarget.style.backgroundColor = '#F3F4F6'
                      e.currentTarget.style.borderColor = '#D1D5DB'
                    }
                  }}
                >
                  <ChevronRight className="w-6 h-6" style={{ color: window.innerWidth < 768 ? '#374151' : colors.primary }} />
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

        {/* Footer - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border-t gap-4 flex-shrink-0 bg-white" 
             style={{ borderColor: `${colors.primary}20` }}>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium border rounded-xl transition-all duration-200 hover:scale-105 order-2 sm:order-1 min-h-[44px]"
            style={{ 
              color: window.innerWidth < 768 ? '#374151' : colors.text,
              borderColor: window.innerWidth < 768 ? '#D1D5DB' : `${colors.primary}30`,
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.backgroundColor = `${colors.primary}10`
              } else {
                e.currentTarget.style.backgroundColor = '#F3F4F6'
                e.currentTarget.style.borderColor = '#9CA3AF'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              if (window.innerWidth >= 768) {
                e.currentTarget.style.borderColor = `${colors.primary}30`
              } else {
                e.currentTarget.style.borderColor = '#D1D5DB'
              }
            }}
          >
{t('clearDates')}
          </button>
          
          <div className="flex gap-3 order-1 sm:order-2">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium border rounded-xl transition-all duration-200 hover:scale-105 min-h-[44px]"
              style={{ 
                color: window.innerWidth < 768 ? '#374151' : colors.text,
                borderColor: window.innerWidth < 768 ? '#D1D5DB' : `${colors.primary}30`,
                backgroundColor: 'white'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`
                } else {
                  e.currentTarget.style.backgroundColor = '#F3F4F6'
                  e.currentTarget.style.borderColor = '#9CA3AF'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.borderColor = `${colors.primary}30`
                } else {
                  e.currentTarget.style.borderColor = '#D1D5DB'
                }
              }}
            >
{t('cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!range?.from || !range?.to}
              className="px-6 py-2 text-sm font-medium text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg min-h-[44px] font-semibold"
              style={{ 
                background: !range?.from || !range?.to 
                  ? '#9CA3AF' 
                  : window.innerWidth < 768 
                    ? (propertySlug === 'fienaroli'
                        ? 'linear-gradient(135deg, #B7794B, #A0632C)' // Fixed Fienaroli mobile
                        : 'linear-gradient(135deg, #A8344C, #8E2B3E)') // Fixed Moro mobile - more burgundy
                    : `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` // Dynamic desktop
              }}
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}