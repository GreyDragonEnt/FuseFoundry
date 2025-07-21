'use client'

import { ArrowRight, TrendingUp, Clock, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CaseStudy {
  id: string
  title: string
  company: string
  industry: string
  challenge: string
  solution: string
  results: {
    metric: string
    value: string
    description: string
  }[]
  duration: string
  image?: string
  tags: string[]
  featured?: boolean
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  variant?: 'default' | 'featured' | 'compact'
  className?: string
  showCTA?: boolean
}

export default function CaseStudyCard({ 
  caseStudy, 
  variant = 'default',
  className,
  showCTA = true
}: CaseStudyCardProps) {
  const isFeatured = variant === 'featured' || caseStudy.featured
  const isCompact = variant === 'compact'

  return (
    <div className={cn(
      'card overflow-hidden transition-all duration-300 group hover:shadow-xl',
      isFeatured && 'ring-2 ring-molten/20 shadow-lg',
      isCompact ? 'p-4' : 'p-6',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isFeatured && (
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-molten/10 text-molten text-xs font-semibold mb-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured Case Study
            </div>
          )}
          
          <h3 className={cn(
            'font-bold text-forge dark:text-white mb-2 group-hover:text-molten transition-colors',
            isCompact ? 'text-lg' : 'text-xl lg:text-2xl'
          )}>
            {caseStudy.title}
          </h3>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <span className="font-medium">{caseStudy.company}</span>
            <span className="mx-2">•</span>
            <span>{caseStudy.industry}</span>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{caseStudy.duration}</span>
          </div>
        </div>
        
        {!isCompact && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spark to-catalyst flex items-center justify-center">
              <ExternalLink className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {caseStudy.tags.slice(0, isCompact ? 2 : 4).map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {caseStudy.tags.length > (isCompact ? 2 : 4) && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded-full">
            +{caseStudy.tags.length - (isCompact ? 2 : 4)} more
          </span>
        )}
      </div>

      {/* Challenge & Solution */}
      {!isCompact && (
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Challenge</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {caseStudy.challenge}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Solution</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {caseStudy.solution}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-6">
        <h4 className={cn(
          'font-semibold text-gray-700 dark:text-gray-300 mb-3',
          isCompact ? 'text-sm' : 'text-base'
        )}>
          Key Results
        </h4>
        
        <div className={cn(
          'grid gap-3',
          isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}>
          {caseStudy.results.slice(0, isCompact ? 2 : 3).map((result, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className={cn(
                'font-black bg-gradient-to-r from-molten to-catalyst bg-clip-text text-transparent mb-1',
                isCompact ? 'text-xl' : 'text-2xl'
              )}>
                {result.value}
              </div>
              <div className={cn(
                'font-medium text-gray-700 dark:text-gray-300 mb-1',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                {result.metric}
              </div>
              {!isCompact && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.description}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {caseStudy.results.length > (isCompact ? 2 : 3) && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{caseStudy.results.length - (isCompact ? 2 : 3)} more results
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      {showCTA && (
        <div className="border-t pt-4">
          <Link 
            href={`/case-studies/${caseStudy.id}`}
            className="inline-flex items-center text-molten hover:text-spark transition-colors font-medium group/link"
          >
            <span className={isCompact ? 'text-sm' : 'text-base'}>
              Read Full Case Study
            </span>
            <ArrowRight className={cn(
              'ml-2 transition-transform group-hover/link:translate-x-1',
              isCompact ? 'h-4 w-4' : 'h-5 w-5'
            )} />
          </Link>
        </div>
      )}
    </div>
  )
}
