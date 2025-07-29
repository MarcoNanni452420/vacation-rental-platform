"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TruncatedDescriptionProps {
  text: string
  className?: string
  propertySlug: 'fienaroli' | 'moro'
  mobileCharLimit?: number
}

// Simple markdown parser for bold text
function parseMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index}>{boldText}</strong>;
    }
    return part;
  });
}

export function TruncatedDescription({ 
  text, 
  className,
  propertySlug,
  mobileCharLimit = 150 
}: TruncatedDescriptionProps) {
  const t = useTranslations('property')
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Theme colors based on property
  const themeColors = {
    fienaroli: {
      button: 'text-[hsl(20,65%,48%)] hover:bg-[hsl(20,65%,95%)]'
    },
    moro: {
      button: 'text-[hsl(345,55%,42%)] hover:bg-[hsl(345,55%,95%)]'
    }
  }
  
  const colors = themeColors[propertySlug]
  
  // Check if we're on mobile (will be false during SSR)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  // Only truncate on mobile
  const shouldTruncate = isMobile && text.length > mobileCharLimit
  const displayText = shouldTruncate && !isExpanded 
    ? text.slice(0, mobileCharLimit) + '...'
    : text
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-line">
        {parseMarkdown(displayText)}
      </div>
      
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300",
            colors.button,
            "md:hidden" // Only show on mobile
          )}
        >
          {isExpanded ? (
            <>
              {t('showLess')}
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              {t('showMore')}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}