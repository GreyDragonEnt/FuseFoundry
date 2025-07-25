'use client'

import { ArrowRight, TrendingUp, Clock, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTextClasses } from '@/lib/theme-utils'
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
      'card p-8 hover:shadow-xl transition-all duration-300 group',
      isFeatured && 'ring-2 ring-molten/20 shadow-lg',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isFeatured && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-molten/10 text-molten text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Featured Case Study
            </div>
          )}
          
          <h3 className={cn(
            getTextClasses('heading'),
            'font-bold mb-2 transition-colors',
            isCompact ? 'text-lg' : 'text-xl lg:text-2xl'
          )}>
            {caseStudy.title}
          </h3>
          
          <div className={cn(
            getTextClasses('secondary'),
            'text-sm mb-2 flex items-center'
          )}>
            <span className="font-medium">{caseStudy.company}</span>
            <span className="mx-2">•</span>
            <span>{caseStudy.industry}</span>
          </div>
          
          <div className={cn(
            getTextClasses('muted'),
            'text-sm flex items-center'
          )}>
            <Clock className="h-4 w-4 mr-1" />
            <span>{caseStudy.duration}</span>
          </div>
        </div>
        
        {!isCompact && (
          <div className="flex-shrink-0 ml-4">
            <div className="p-3 bg-brand-gradient rounded-xl">
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
            className={cn("px-2 py-1 text-xs rounded-full bg-muted/30 border border-border", getTextClasses('secondary'))}
          >
            {tag}
          </span>
        ))}
        {caseStudy.tags.length > (isCompact ? 2 : 4) && (
          <span className={cn("px-2 py-1 text-xs rounded-full bg-muted/20 border border-border", getTextClasses('muted'))}>
            +{caseStudy.tags.length - (isCompact ? 2 : 4)} more
          </span>
        )}
      </div>

      {/* Challenge & Solution */}
      {!isCompact && (
        <div className="space-y-4 mb-6">
          <div>
            <h4 className={cn(getTextClasses('secondary'), 'text-sm font-semibold mb-2')}>
              Challenge
            </h4>
            <p className={cn(getTextClasses('muted'), 'text-sm leading-relaxed')}>
              {caseStudy.challenge}
            </p>
          </div>
          
          <div>
            <h4 className={cn(getTextClasses('secondary'), 'text-sm font-semibold mb-2')}>
              Solution
            </h4>
            <p className={cn(getTextClasses('muted'), 'text-sm leading-relaxed')}>
              {caseStudy.solution}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-6">
        <h4 className={cn(
          getTextClasses('secondary'),
          'font-semibold mb-3',
          isCompact ? 'text-sm' : 'text-base'
        )}>
          Key Results
        </h4>
        
        <div className={cn(
          'grid gap-3',
          isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}>
          {caseStudy.results.slice(0, isCompact ? 2 : 3).map((result, index) => (
            <div key={index} className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border">
              <div className={cn(
                'font-black bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-1',
                isCompact ? 'text-xl' : 'text-2xl'
              )}>
                {result.value}
              </div>
              <div className={cn(
                getTextClasses('secondary'),
                'font-medium mb-1',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                {result.metric}
              </div>
              {!isCompact && (
                <div className={cn(getTextClasses('muted'), 'text-xs')}>
                  {result.description}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {caseStudy.results.length > (isCompact ? 2 : 3) && (
          <div className="text-center mt-2">
            <span className={cn(getTextClasses('muted'), 'text-xs')}>
              +{caseStudy.results.length - (isCompact ? 2 : 3)} more results
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      {showCTA && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Link 
            href={`/case-studies/${caseStudy.id}`}
            className="inline-flex items-center text-molten hover:text-molten/80 dark:text-molten dark:hover:text-molten/80 transition-colors font-medium group/link"
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
