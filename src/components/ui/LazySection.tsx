"use client"

import { Suspense, ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazySection({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-100 h-48 rounded-lg" />, 
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazySectionProps) {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true
  })

  return (
    <div ref={ref} className={className} suppressHydrationWarning={true}>
      {inView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  )
}