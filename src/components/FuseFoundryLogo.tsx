'use client'

interface FuseFoundryLogoProps {
  width?: number
  height?: number
  className?: string
}

export default function FuseFoundryLogo({ 
  width = 600, 
  height = 128, 
  className = "" 
}: FuseFoundryLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 600 128" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FuseFoundry Logo"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#FF6A2C"}}/>
          <stop offset="50%" style={{stopColor:"#FFC84A"}}/>
          <stop offset="100%" style={{stopColor:"#18E0DF"}}/>
        </linearGradient>
      </defs>
      
      {/* Icon portion */}
      <g>
        <rect x="0" y="16" width="96" height="24" rx="6" fill="url(#grad1)" />
        <rect x="0" y="52" width="72" height="24" rx="6" fill="url(#grad1)" />
        <rect x="0" y="88" width="60" height="24" rx="6" fill="url(#grad1)" opacity="0.6" />
        <circle cx="94" cy="70" r="6" fill="#18E0DF"/>
        <circle cx="76" cy="102" r="4" fill="#FFC84A"/>
        <circle cx="98" cy="102" r="4" fill="#FF6A2C"/>
      </g>
      
      {/* Wordmark */}
      <text 
        x="120" 
        y="90" 
        fontSize="64" 
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" 
        fill="#202326" 
        fontWeight="700" 
        letterSpacing="-1"
        className="dark:fill-white"
      >
        FuseFoundry
      </text>
    </svg>
  )
}
