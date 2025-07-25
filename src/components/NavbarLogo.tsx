'use client'

interface NavbarLogoProps {
  className?: string
}

export default function NavbarLogo({ className = "" }: NavbarLogoProps) {  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="FuseFoundry Icon"
      >
        <defs>
          <linearGradient id="navbar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#FF6A2C"}}/>
            <stop offset="50%" style={{stopColor:"#FFC84A"}}/>
            <stop offset="100%" style={{stopColor:"#18E0DF"}}/>
          </linearGradient>
        </defs>
        
        {/* Compact icon */}
        <rect x="2" y="6" width="24" height="6" rx="2" fill="url(#navbar-grad)" />
        <rect x="2" y="14" width="18" height="6" rx="2" fill="url(#navbar-grad)" />
        <rect x="2" y="22" width="15" height="6" rx="2" fill="url(#navbar-grad)" opacity="0.6" />
        <circle cx="24" cy="17" r="2" fill="#18E0DF"/>
        <circle cx="19" cy="25" r="1.5" fill="#FFC84A"/>
        <circle cx="25" cy="25" r="1.5" fill="#FF6A2C"/>
      </svg>
      
      <span 
        className="font-bold text-xl tracking-tight bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent dark:from-molten dark:via-spark dark:to-catalyst"
        style={{ 
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          letterSpacing: '-0.025em'
        }}
      >
        FuseFoundry
      </span>
    </div>
  )
}
