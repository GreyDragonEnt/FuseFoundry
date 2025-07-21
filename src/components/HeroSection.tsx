'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white-hot dark:bg-forge">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-brand-gradient opacity-5 animate-gradient-x" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 animate-spark-pulse">
        <Sparkles className="h-8 w-8 text-spark" />
      </div>
      <div className="absolute top-32 right-16 animate-spark-pulse" style={{ animationDelay: '1s' }}>
        <Zap className="h-6 w-6 text-catalyst" />
      </div>
      <div className="absolute bottom-32 left-20 animate-spark-pulse" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="h-10 w-10 text-molten" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-forge/80 border border-gray-200 dark:border-gray-700 mb-8">
            <Zap className="h-4 w-4 text-molten mr-2" />
            <span className="text-sm font-medium text-forge dark:text-white">
              AI-Powered Business Transformation
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-forge dark:text-white">Fuse</span>{' '}
            <span className="text-gradient">Innovation</span>
            <br />
            <span className="text-forge dark:text-white">Forge</span>{' '}
            <span className="text-gradient">Success</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            We fuse cutting-edge AI, creator-powered content, and strategic growth systems 
            to transform ambitious businesses into market leaders.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/contact"
              className="btn-primary group inline-flex items-center px-8 py-4 text-lg"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/foundry-method"
              className="btn-secondary inline-flex items-center px-8 py-4 text-lg"
            >
              Discover Our Method
            </Link>
          </div>

          {/* Social proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gradient mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Businesses Transformed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient mb-2">$50M+</div>
              <div className="text-gray-600 dark:text-gray-300">Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-molten rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
