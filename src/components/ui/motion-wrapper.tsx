"use client"

import { motion, MotionProps } from "framer-motion"
import { useState, useEffect } from "react"

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  as?: keyof typeof motion
}

export function MotionWrapper({ 
  children, 
  fallback = null, 
  as = "div",
  ...motionProps 
}: MotionWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const MotionComponent = motion[as] as any

  if (!hasMounted) {
    return <div>{fallback || children}</div>
  }

  return <MotionComponent {...motionProps}>{children}</MotionComponent>
}