'use client'

import { Search, Zap, Hammer, Rocket, ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTextClasses } from '@/lib/theme-utils'

const steps = [
  {
    number: '01',
    title: 'Audit',
    subtitle: 'Deep Dive Analysis',
    icon: Search,
    description: 'We conduct a comprehensive analysis of your current business operations, market position, and growth blockers.',
    duration: '1-2 weeks',
    deliverables: [
      'Business assessment report',
      'Market opportunity analysis',
      'Competitive landscape review',
      'Growth bottleneck identification',
      'Technology stack audit'
    ],
    color: 'molten'
  },
  {
    number: '02',
    title: 'Fuse',
    subtitle: 'Strategy Integration',
    icon: Zap,
    description: 'We integrate AI solutions, creator networks, and growth systems into a unified strategy tailored to your goals.',
    duration: '2-3 weeks',
    deliverables: [
      'Custom AI implementation plan',
      'Creator network matching',
      'Growth system architecture',
      'Integration roadmap',
      'Success metrics definition'
    ],
    color: 'spark'
  },
  {
    number: '03',
    title: 'Forge',
    subtitle: 'Build & Implement',
    icon: Hammer,
    description: 'We build and deploy the solutions, train your team, and ensure everything works seamlessly together.',
    duration: '4-8 weeks',
    deliverables: [
      'AI system deployment',
      'Creator campaign launch',
      'Automation implementation',
      'Team training sessions',
      'Quality assurance testing'
    ],
    color: 'catalyst'
  },
  {
    number: '04',
    title: 'Scale',
    subtitle: 'Optimize & Grow',
    icon: Rocket,
    description: 'We continuously optimize performance, scale successful initiatives, and unlock new growth opportunities.',
    duration: 'Ongoing',
    deliverables: [
      'Performance optimization',
      'Scaling strategy execution',
      'Continuous monitoring',
      'Regular strategy updates',
      'Growth opportunity identification'
    ],
    color: 'molten'
  }
]

interface ProcessTimelineProps {
  className?: string
}

export default function ProcessTimeline({ className }: ProcessTimelineProps) {
  return (
    <div className={cn('space-y-8 md:space-y-0', className)}>
      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1
          
          return (
            <div key={step.number} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />
              )}
              
              {/* Step content */}
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={cn(
                  'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                  step.color === 'molten' && 'bg-molten text-white',
                  step.color === 'spark' && 'bg-spark text-white',
                  step.color === 'catalyst' && 'bg-catalyst text-white'
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                
                {/* Content */}
                <div className="card flex-1 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-2">
                    <span className={cn(
                      'text-sm font-bold mr-3',
                      step.color === 'molten' && 'text-molten',
                      step.color === 'spark' && 'text-spark',
                      step.color === 'catalyst' && 'text-catalyst'
                    )}>
                      {step.number}
                    </span>
                    <h3 className={cn(getTextClasses('heading'), "text-xl font-bold")}>
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className={cn(
                    'text-sm font-medium mb-3',
                    step.color === 'molten' && 'text-molten',
                    step.color === 'spark' && 'text-spark',
                    step.color === 'catalyst' && 'text-catalyst'
                  )}>
                    {step.subtitle}
                  </p>
                  
                  <p className={cn(getTextClasses('secondary'), "mb-4 text-sm")}>
                    {step.description}
                  </p>
                  
                  <div className={cn(getTextClasses('muted'), "text-xs mb-3")}>
                    Duration: {step.duration}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className={cn(getTextClasses('heading'), "text-sm font-semibold")}>
                      Key Deliverables:
                    </h4>
                    <ul className="space-y-1">
                      {step.deliverables.slice(0, 3).map((deliverable, idx) => (
                        <li key={idx} className={cn("flex items-center text-xs", getTextClasses('secondary'))}>
                          <CheckCircle className="h-3 w-3 mr-2 text-catalyst flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                      {step.deliverables.length > 3 && (
                        <li className={cn("text-xs", getTextClasses('muted'))}>
                          +{step.deliverables.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop: Horizontal Timeline */}
      <div className="hidden md:block">
        {/* Timeline line */}
        <div className="relative mb-16">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
          
          {/* Steps */}
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLast = index === steps.length - 1
              
              return (
                <div key={step.number} className="relative">
                  {/* Arrow between steps */}
                  {!isLast && (
                    <div className="absolute top-6 -right-4 z-10">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={cn(
                    'relative z-20 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-6',
                    step.color === 'molten' && 'bg-molten text-white',
                    step.color === 'spark' && 'bg-spark text-white',
                    step.color === 'catalyst' && 'bg-catalyst text-white'
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  {/* Content */}
                  <div className="card p-8 hover:shadow-xl transition-all duration-300">
                    <div className="text-center mb-4">
                      <span className={cn(
                        'text-sm font-bold',
                        step.color === 'molten' && 'text-molten',
                        step.color === 'spark' && 'text-spark',
                        step.color === 'catalyst' && 'text-catalyst'
                      )}>
                        {step.number}
                      </span>
                      <h3 className={cn(getTextClasses('heading'), "text-xl font-bold mt-2")}>
                        {step.title}
                      </h3>
                      <p className={cn(
                        'text-sm font-medium',
                        step.color === 'molten' && 'text-molten',
                        step.color === 'spark' && 'text-spark',
                        step.color === 'catalyst' && 'text-catalyst'
                      )}>
                        {step.subtitle}
                      </p>
                    </div>
                    
                    <p className={cn(getTextClasses('secondary'), "text-sm mb-4 leading-relaxed")}>
                      {step.description}
                    </p>
                    
                    <div className={cn(getTextClasses('muted'), "text-xs text-center mb-4")}>
                      Duration: {step.duration}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className={cn(getTextClasses('heading'), "text-sm font-semibold text-center")}>
                        Key Deliverables
                      </h4>
                      <ul className="space-y-2">
                        {step.deliverables.map((deliverable, idx) => (
                          <li key={idx} className={cn("flex items-start text-xs", getTextClasses('secondary'))}>
                            <CheckCircle className="h-3 w-3 mr-2 text-catalyst flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
