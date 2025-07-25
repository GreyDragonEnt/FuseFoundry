'use client'

import { Bot, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import ServicePackages from '@/components/ServicePackages'

const services = [
  {
    id: 'ai-strategy',
    icon: Bot,
    title: 'AI Strategy & Implementation',
    description: 'Transform your business operations with cutting-edge artificial intelligence solutions tailored to your industry.',
    features: [
      'Custom AI model development',
      'Process automation & optimization',
      'Predictive analytics implementation',
      'AI-powered decision making systems',
      'Integration with existing systems'
    ],
    benefits: [
      '60% reduction in operational costs',
      '10x faster data processing',
      '95% accuracy in predictions',
      'Real-time insights and analytics'
    ],
    cta: 'Explore AI Solutions',
    href: '/ai-athena'
  },
  {
    id: 'creator-engine',
    icon: Users,
    title: 'Creator Engine & Content Strategy',
    description: 'Leverage our network of top-tier creators and influencers to amplify your brand reach and engagement.',
    features: [
      'Creator network matching',
      'Content strategy development',
      'Campaign management',
      'Performance tracking & analytics',
      'Brand safety & compliance'
    ],
    benefits: [
      '400% increase in brand awareness',
      '650% boost in social engagement',
      '5x higher conversion rates',
      'Authentic audience connections'
    ],
    cta: 'Join Creator Network',
    href: '/contact'
  },
  {
    id: 'growth-systems',
    icon: TrendingUp,
    title: 'Growth Systems & Automation',
    description: 'Implement scalable growth frameworks and automation systems that drive sustainable business expansion.',
    features: [
      'Sales funnel optimization',
      'Marketing automation',
      'Customer lifecycle management',
      'Revenue operations setup',
      'Performance monitoring'
    ],
    benefits: [
      '300% revenue growth potential',
      '75% reduction in churn',
      '450% ROI on implementation',
      'Scalable growth infrastructure'
    ],
    cta: 'Scale Your Business',
    href: '/foundry-method'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-molten/10 text-molten text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              Our Services
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
              Transformative
              <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We offer three core pillars of transformation that work together to 
              revolutionize your business operations and accelerate growth.
            </p>
          </div>
        </div>
      </section>

      {/* Service Packages Section */}
      <ServicePackages />

      {/* Custom Solutions Section */}
      <section className="py-16 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Accelerate your business growth with our
              <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
                custom done for you solution.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We offer custom application of the following three pillars to your business.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/contact"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Book Your Custom Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-24">
            {services.map((service, index) => {
              const Icon = service.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? '' : 'lg:grid-flow-col-dense'
                  }`}
                >
                  {/* Content */}
                  <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-brand-gradient rounded-2xl mr-4">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        {service.title}
                      </h2>
                    </div>

                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        What&apos;s Included:
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-catalyst mr-3 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        Expected Results:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.benefits.map((benefit, idx) => (
                          <div key={idx} className="bg-muted/30 dark:bg-muted/20 p-4 rounded-lg border border-border">
                            <span className="text-sm font-medium text-muted-foreground">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                    <div className="card p-8 text-center">
                      <Icon className={`h-32 w-32 mx-auto mb-6 ${
                        index === 0 ? 'text-molten' : 
                        index === 1 ? 'text-spark' : 'text-catalyst'
                      }`} />
                      <div className="text-4xl font-bold text-gradient mb-2">
                        {index === 0 ? '60%' : index === 1 ? '400%' : '300%'}
                      </div>
                      <div className="text-muted-foreground">
                        {index === 0 ? 'Cost Reduction' : 
                         index === 1 ? 'Brand Awareness' : 'Revenue Growth'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-forge text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how our three pillars can work together to accelerate your growth 
            and transform your operations.
          </p>
          <Link href="/contact" className="btn-primary">
            Start Your Transformation
          </Link>
        </div>
      </section>
    </div>
  )
}
