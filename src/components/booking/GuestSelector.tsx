"use client"

import { useState } from 'react';
import { Users, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuestSelectorProps {
  propertySlug: 'fienaroli' | 'moro';
  value: number;
  onChange: (value: number) => void;
  maxGuests: number;
  className?: string;
}

export function GuestSelector({ propertySlug, value, onChange, maxGuests, className }: GuestSelectorProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      border: 'hover:border-[hsl(20,65%,48%)]',
      focus: 'focus:border-[hsl(20,65%,48%)] focus:ring-[hsl(20,65%,48%)]',
      icon: 'text-[hsl(20,65%,48%)]',
      bg: 'hover:bg-[hsl(20,65%,98%)]',
      button: 'hover:bg-[hsl(20,65%,95%)] active:bg-[hsl(20,65%,90%)]'
    },
    moro: {
      border: 'hover:border-[hsl(345,55%,42%)]',
      focus: 'focus:border-[hsl(345,55%,42%)] focus:ring-[hsl(345,55%,42%)]',
      icon: 'text-[hsl(345,55%,42%)]',
      bg: 'hover:bg-[hsl(345,55%,98%)]',
      button: 'hover:bg-[hsl(345,55%,95%)] active:bg-[hsl(345,55%,90%)]'
    }
  };

  const colors = themeColors[propertySlug];

  const handleIncrement = () => {
    if (value < maxGuests) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "w-full p-4 rounded-xl transition-all duration-300",
        "bg-white border-2 border-gray-200",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-opacity-50",
        colors.border,
        colors.focus,
        colors.bg,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300",
            isHovered && propertySlug === 'fienaroli' && "bg-[hsl(20,65%,95%)]",
            isHovered && propertySlug === 'moro' && "bg-[hsl(345,55%,95%)]"
          )}>
            <Users className={cn(
              "w-5 h-5 transition-colors duration-300",
              isHovered ? colors.icon : "text-gray-400"
            )} />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg">
              {value} {value === 1 ? 'Ospite' : 'Ospiti'}
            </div>
            <div className="text-sm text-gray-500">
              Massimo {maxGuests} ospiti
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= 1}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              value > 1 && colors.button
            )}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-8 text-center font-medium text-gray-900">
            {value}
          </span>
          
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= maxGuests}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              value < maxGuests && colors.button
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}