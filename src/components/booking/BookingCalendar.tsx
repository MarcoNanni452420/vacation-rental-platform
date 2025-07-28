"use client"

import { useState } from 'react';
import { CalendarModal } from './CalendarModal';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  propertySlug: 'fienaroli' | 'moro';
  onDateChange: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;
  className?: string;
  selectedRange?: { from: Date | undefined; to: Date | undefined };
}

export function BookingCalendar({ propertySlug, onDateChange, className, selectedRange }: BookingCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDateConfirm = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
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

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
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
                <div>
                  <div className="flex items-baseline gap-3">
                    <div className="font-semibold text-gray-900 text-lg">
                      {format(selectedRange.from, 'd MMM', { locale: it })} - {format(selectedRange.to, 'd MMM yyyy', { locale: it })}
                    </div>
                    <div className={cn(
                      "text-sm font-medium px-2 py-0.5 rounded-full",
                      propertySlug === 'fienaroli' 
                        ? "bg-[hsl(20,65%,95%)] text-[hsl(20,65%,48%)]" 
                        : "bg-[hsl(345,55%,95%)] text-[hsl(345,55%,42%)]"
                    )}>
                      {nights} {nights === 1 ? 'notte' : 'notti'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Check-in → Check-out
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {format(selectedRange.from, 'd MMMM yyyy', { locale: it })}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Seleziona la data di check-out
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="font-semibold text-gray-700 text-lg">
                  Quando vuoi soggiornare?
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  Aggiungi le date del tuo viaggio
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
      />
    </>
  );
}