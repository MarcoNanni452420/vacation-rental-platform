"use client"

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

function NoSSRComponent({ children }: NoSSRProps) {
  return <>{children}</>
}

export const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
  loading: () => null
})

export function withNoSSR<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function NoSSRWrapper(props: T) {
    return (
      <NoSSR fallback={fallback}>
        <Component {...props} />
      </NoSSR>
    )
  }
}