'use client'

import Link from 'next/link'
import { Bot, Users, TrendingUp, Zap } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Strategy',
    description: 'Leverage our proprietary AI assistant "Athena" to analyze market trends, optimize operations, and predict growth opportunities.',
    color: 'molten',
    href: '/ai-athena'
  },
  {
    icon: Users,
    title: 'Creator Engine',
    description: 'Tap into our network of top-tier content creators and influencers to amplify your brand and reach new audiences.',
    color: 'spark',
    href: '/services'
  },
  {
    icon: TrendingUp,
    title: 'Growth Systems',
    description: 'Implement proven frameworks and automation systems that scale your revenue while reducing operational complexity.',
    color: 'catalyst',
    href: '/foundry-method'
  }
]

export default function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-molten/10 backdrop-blur-glass border border-molten/20 mb-6 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <Zap className="h-5 w-5 text-molten mr-3 animate-pulse group-hover:scale-110 transition-transform" />
            <span className="bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent text-sm font-semibold tracking-wide group-hover:scale-105 transition-transform">
              Our Core Services
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Transform Your Business with{' '}
            <span className="bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent animate-pulse">
              Three Pillars
            </span>
          </h2>
          
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-muted-foreground">
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
                className="card p-8 text-center group hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 cursor-pointer"
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`
                    p-4 rounded-2xl transition-all duration-500 transform group-hover:scale-110
                    ${feature.color === 'molten' ? 'bg-molten' : ''}
                    ${feature.color === 'spark' ? 'bg-spark' : ''}
                    ${feature.color === 'catalyst' ? 'bg-catalyst' : ''}
                  `}>
                    <Icon className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-500" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                
                <p className="leading-relaxed mb-6 text-muted-foreground">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <Link 
                  href={feature.href}
                  className={`
                    inline-flex items-center text-sm font-semibold hover:underline transition-all duration-300 group-hover:scale-110
                    ${feature.color === 'molten' ? 'text-molten' : ''}
                    ${feature.color === 'spark' ? 'text-spark' : ''}
                    ${feature.color === 'catalyst' ? 'text-catalyst' : ''}
                  `}
                >
                  Learn More →
                </Link>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="mb-6 text-lg text-muted-foreground">
            Ready to see these pillars in action?
          </p>
          <Link 
            href="/foundry-method" 
            className="btn-primary inline-flex items-center px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Zap className="mr-2 h-5 w-5" />
            Explore Our Method
          </Link>
        </div>
      </div>
    </section>
  )
}
