'use client'

import { Bot, Users, TrendingUp, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Strategy',
    description: 'Leverage our proprietary AI assistant "Athena" to analyze market trends, optimize operations, and predict growth opportunities.',
    color: 'text-molten'
  },
  {
    icon: Users,
    title: 'Creator Engine',
    description: 'Tap into our network of top-tier content creators and influencers to amplify your brand and reach new audiences.',
    color: 'text-spark'
  },
  {
    icon: TrendingUp,
    title: 'Growth Systems',
    description: 'Implement proven frameworks and automation systems that scale your revenue while reducing operational complexity.',
    color: 'text-catalyst'
  }
]

export default function FeatureGrid() {
  return (
    <section className="py-20 bg-white dark:bg-forge">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <Zap className="h-4 w-4 text-molten mr-2" />
            <span className="text-sm font-medium text-forge dark:text-white">
              Our Core Services
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-forge dark:text-white mb-6">
            Transform Your Business with{' '}
            <span className="text-gradient">Three Pillars</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We combine artificial intelligence, creator networks, and growth systems 
            to deliver unprecedented business transformation.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={cn(
                  'card p-8 text-center group hover:shadow-xl transition-all duration-300',
                  'hover:scale-105 hover:-translate-y-2'
                )}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={cn(
                    'p-4 rounded-2xl bg-gray-50 dark:bg-gray-800',
                    'group-hover:bg-brand-gradient group-hover:text-white transition-all duration-300'
                  )}>
                    <Icon className={cn('h-8 w-8', feature.color)} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-forge dark:text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <button className={cn(
                  'text-sm font-semibold hover:underline transition-colors',
                  feature.color,
                  'group-hover:text-white'
                )}>
                  Learn More →
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ready to see these pillars in action?
          </p>
          <button className="btn-primary">
            Explore Our Method
          </button>
        </div>
      </div>
    </section>
  )
}
