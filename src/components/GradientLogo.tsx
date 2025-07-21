'use client'

import { cn } from '@/lib/utils'

interface GradientLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function GradientLogo({ className, size = 'md' }: GradientLogoProps) {
  const sizeClasses = {
    sm: 'w-24 h-8',
    md: 'w-32 h-10',
    lg: 'w-40 h-12',
    xl: 'w-48 h-16'
  }

  return (
    <div className={cn('flex items-center', className)}>
      <svg
        viewBox="0 0 200 40"
        className={cn('fill-current', sizeClasses[size])}
        aria-label="FuseFoundry Logo"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6A2C" />
            <stop offset="50%" stopColor="#FFC84A" />
            <stop offset="100%" stopColor="#18E0DF" />
          </linearGradient>
        </defs>
        
        {/* FuseFoundry text with gradient */}
        <text
          x="10"
          y="28"
          fontSize="24"
          fontWeight="bold"
          fill="url(#brandGradient)"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          FuseFoundry
        </text>
        
        {/* Spark icon */}
        <circle
          cx="185"
          cy="20"
          r="8"
          fill="url(#brandGradient)"
          className="animate-spark-pulse"
        />
        <circle
          cx="185"
          cy="20"
          r="4"
          fill="white"
        />
      </svg>
    </div>
  )
}
