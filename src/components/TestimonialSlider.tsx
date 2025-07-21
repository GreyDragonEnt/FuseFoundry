'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  quote: string
  author: string
  company: string
  position: string
  avatar?: string
  rating: number
  result?: string
  industry?: string
}

interface TestimonialSliderProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

export default function TestimonialSlider({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className
}: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, autoPlayInterval, testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
    // Resume auto-play after user interaction
    setTimeout(() => setIsPlaying(autoPlay), 3000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(autoPlay), 3000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(autoPlay), 3000)
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No testimonials available</p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Main testimonial display */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <div className="card p-8 lg:p-12 text-center max-w-4xl mx-auto">
                {/* Quote icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-molten to-spark flex items-center justify-center">
                    <Quote className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        'h-5 w-5 mx-1',
                        i < testimonial.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 dark:text-gray-600'
                      )} 
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 italic font-medium leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author info */}
                <div className="border-t pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="font-bold text-lg text-forge dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {testimonial.position}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        {testimonial.company}
                      </div>
                      {testimonial.industry && (
                        <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          {testimonial.industry}
                        </div>
                      )}
                    </div>
                    
                    {testimonial.result && (
                      <div className="text-center sm:text-right">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-catalyst/10 text-catalyst text-sm font-semibold">
                          {testimonial.result}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:shadow-xl transition-all group border border-gray-200 dark:border-gray-700"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-molten transition-colors" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:shadow-xl transition-all group border border-gray-200 dark:border-gray-700"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-molten transition-colors" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && testimonials.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-molten scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      {testimonials.length > 1 && (
        <div className="mt-6">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            {currentIndex + 1} of {testimonials.length}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 max-w-xs mx-auto">
            <div 
              className="bg-gradient-to-r from-molten to-spark h-1 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
