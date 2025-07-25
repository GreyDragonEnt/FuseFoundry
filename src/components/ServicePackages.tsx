'use client'

import { CheckCircle, Search, Target, Rocket, Phone } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useEffect, useState } from 'react'

const servicePackages = [
  {
    id: 'health-check',
    icon: Search,
    title: 'Business Health Check',
    price: '$29.99',
    description: 'Get a comprehensive assessment of your business\'s digital presence and performance.',
    features: [
      'Website Audit',
      'Social Media Presence Review (1 platforms)',
      '1 Priority Recommendation',
      'Digital Scorecard (1-100 rating)',
      'Delivery via E-mail within 24 hours'
    ],
    popular: false
  },
  {
    id: 'strategy-package',
    icon: Target,
    title: 'Business Strategy Package',
    price: '$49.99',
    description: 'Complete digital strategy with actionable growth plans for your business.',
    features: [
      'Website Audit',
      'Social Media Presence Review (2-3 platforms)',
      '3 Priority Recommendations',
      'Digital Scorecard (1-100 rating)',
      '1 Revenue Growth Strategies',
      'Competitor Analysis (3 competitors)',
      'Marketing Funnel Assessment',
      '30 day Action Plan',
      'Delivery via E-mail within 36 hours'
    ],
    popular: true
  },
  {
    id: 'transformation-blueprint',
    icon: Rocket,
    title: 'DIY Business Transformation Blueprint',
    price: '$99.99',
    description: 'DIY Business optimization roadmap.',
    features: [
      'All Business Strategy Package features',
      'Custom Analysis for your industry',
      'Implementation Roadmap (90-day plan)',
      'ROI Projections',
      'Delivery via E-mail within 48 hours hours'
    ],
    popular: false
  },
  {
    id: 'strategy-consultation',
    icon: Phone,
    title: 'Business Strategy Consultation',
    price: '$199.99',
    description: '1-on-1 expert session with personalized guidance and real-time problem solving.',
    features: [
      '45-minute live consultation',
      'Real-time problem solving',
      'Custom recommendations',
      'Session recording for reference',
      'Action item summary (24 hours delivery)'
    ],
    popular: false
  }
]

export default function ServicePackages() {
  const [isMounted, setIsMounted] = useState(false)
  const { dispatch } = useCart()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddToCart = (pkg: typeof servicePackages[0]) => {
    if (!isMounted) return
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: pkg.id,
        title: pkg.title,
        price: pkg.price,
        description: pkg.description
      }
    })
  }

  return (
    <section className="py-20 bg-background/50 dark:bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Business Analysis
            <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
              Service Packages
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect package to analyze and optimize your business with AI-powered insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicePackages.map((pkg) => {
            const Icon = pkg.icon
            return (
              <div
                key={pkg.id}
                className={`card p-6 relative ${
                  pkg.popular 
                    ? 'ring-2 ring-spark border-spark/20 bg-background' 
                    : 'bg-background'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-molten to-spark text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="p-3 bg-brand-gradient rounded-2xl w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{pkg.title}</h3>
                  <div className="text-3xl font-bold text-gradient mb-2">{pkg.price}</div>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-catalyst mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleAddToCart(pkg)}
                  className="w-full btn-primary mb-3"
                >
                  Add to Cart
                </button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
