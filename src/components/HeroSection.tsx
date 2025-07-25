'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5" />
      
      {/* Enhanced floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-molten/10 rounded-full animate-float opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-catalyst/10 rounded-full animate-float opacity-20" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-spark/10 rounded-full animate-float opacity-25" style={{ animationDelay: '0.5s' }} />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 animate-spark-pulse">
        <Sparkles className="h-8 w-8 text-molten" />
      </div>
      <div className="absolute top-32 right-16 animate-spark-pulse" style={{ animationDelay: '1s' }}>
        <Zap className="h-6 w-6 text-catalyst" />
      </div>
      <div className="absolute bottom-32 left-20 animate-spark-pulse" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="h-10 w-10 text-spark" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-molten/10 text-molten text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Business Transformation
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
            Fuse
            <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
              Innovation
            </span>
            Forge
            <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
              Success
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We fuse cutting-edge AI, creator-powered content, and strategic growth systems 
            to transform ambitious businesses into market leaders.
          </p>

          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              Start Your Transformation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link href="/foundry-method" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
              Discover Our Method
            </Link>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-muted-foreground">Businesses Transformed</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-2">$50M+</div>
              <div className="text-muted-foreground">Revenue Generated</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
