'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeSafe } from './ThemeProvider'
import FuseFoundryLogo from './FuseFoundryLogo'

interface NavbarProps {
  className?: string
}

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'AI Athena', href: '/ai-athena' },
  { name: 'Foundry Method', href: '/foundry-method' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar({ className }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isDark, toggleTheme, mounted } = useThemeSafe()

  return (
    <nav className={cn(
      'sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border',
      className
    )}>
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <FuseFoundryLogo width={225} height={48} className="transition-transform hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-foreground hover:text-molten transition-colors duration-200',
                  'font-medium text-sm focus-visible:outline-molten'
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-lg bg-secondary hover:bg-muted',
                  'transition-colors duration-200 focus-visible:outline-molten'
                )}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-spark" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
              </button>
            )}

            {/* CTA Button */}
            <Link
              href="/contact"
              className="btn-primary ml-4"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {mounted && (
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-lg bg-secondary hover:bg-muted',
                  'transition-colors duration-200 focus-visible:outline-molten'
                )}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-spark" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
              </button>
            )}
            
            <button
              type="button"
              className={cn(
                'p-2 rounded-lg text-foreground hover:text-molten',
                'transition-colors duration-200 focus-visible:outline-molten'
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-3 text-base font-medium',
                    'text-foreground hover:text-molten hover:bg-muted',
                    'transition-colors duration-200 rounded-lg',
                    'focus-visible:outline-molten min-h-[48px] flex items-center'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 pt-4">
                <Link
                  href="/contact"
                  className="btn-primary w-full text-center block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
