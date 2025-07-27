"use client"

import { useState } from 'react';
import { CalendarModal } from './CalendarModal';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface BookingCalendarProps {
  propertySlug: 'fienaroli' | 'moro';
  onDateChange: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;
  className?: string;
  selectedRange?: { from: Date | undefined; to: Date | undefined };
}

export function BookingCalendar({ propertySlug, onDateChange, className, selectedRange }: BookingCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateConfirm = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    onDateChange(range);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`w-full p-4 text-left border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white ${className}`}
      >
        <div className="flex items-center justify-between">
          <div>
            {selectedRange?.from ? (
              selectedRange.to ? (
                <div>
                  <div className="font-medium text-gray-900">
                    {format(selectedRange.from, 'dd MMM yyyy', { locale: it })} - {format(selectedRange.to, 'dd MMM yyyy', { locale: it })}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Date selezionate
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-medium text-gray-900">
                    {format(selectedRange.from, 'dd MMM yyyy', { locale: it })}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Seleziona check-out
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="font-medium text-gray-900">
                  Seleziona date
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Check-in / Check-out
                </div>
              </div>
            )}
          </div>
          <CalendarIcon className="w-5 h-5 text-gray-400" />
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