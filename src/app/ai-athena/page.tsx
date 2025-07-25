import { Bot, Brain, TrendingUp, Shield, Clock, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import AthenaInteractive from '@/components/AthenaInteractive'
import AthenaCapabilitiesClient from '@/components/AthenaCapabilitiesClient'

const features = [
  {
    icon: Brain,
    title: 'Advanced Analytics',
    description: 'Deep insights into your business metrics, customer behavior, and market opportunities.'
  },
  {
    icon: TrendingUp,
    title: 'Predictive Modeling',
    description: 'Forecast trends, identify risks, and uncover growth opportunities before your competitors.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with your data never leaving your control.'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Get instant answers and insights whenever you need them, around the clock.'
  }
]

const testimonials = [
  {
    quote: "Athena helped us identify a market opportunity worth $2M that we completely missed. The ROI was immediate.",
    author: "Sarah Chen",
    role: "CEO, TechStart Inc.",
    rating: 5
  },
  {
    quote: "The predictive analytics saved us from a costly mistake and redirected our strategy toward 300% growth.",
    author: "Marcus Rodriguez", 
    role: "Founder, EcoWave Solutions",
    rating: 5
  },
  {
    quote: "Having 24/7 access to AI-powered insights transformed how we make decisions. It&apos;s like having a genius consultant on speed dial.",
    author: "Jennifer Liu",
    role: "CTO, FinFlow Banking",
    rating: 5
  }
]

export default function AIAthenaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5" />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-molten/10 text-molten text-sm font-medium mb-6">
                <Bot className="h-4 w-4 mr-2" />
                AI-Powered Business Intelligence
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
                Meet 
                <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
                  Athena
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl">Your AI Business Strategist</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl">
                Athena is our proprietary AI assistant that analyzes your business data, 
                predicts market trends, and provides actionable insights to accelerate your growth.
              </p>

              <div className="flex justify-start mb-8">
                <a href="#try-athena" className="btn-primary inline-flex items-center group">
                  Try Athena Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">99.7%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">10x</div>
                  <div className="text-sm text-muted-foreground">Faster Insights</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="card p-8 text-center">
                <Bot className="h-32 w-32 mx-auto mb-6 text-catalyst" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Market Analysis</span>
                    <span className="font-semibold text-green-500">+24% Growth</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Risk Assessment</span>
                    <span className="font-semibold text-blue-500">Low Risk</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next Action</span>
                    <span className="font-semibold text-molten">Expand Market</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Athena&apos;s <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powered by advanced machine learning and trained on millions of business scenarios, 
              Athena provides insights that drive real results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-brand-gradient rounded-xl">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Capabilities List */}
      <section id="try-athena" className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AthenaCapabilitiesClient />
            </div>

            <div>
              <h4 className="text-xl font-bold text-foreground mb-6">
                Try Athena Live - Ask Any Business Question
              </h4>
              <AthenaInteractive businessContext="AI-powered business transformation and growth strategy" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-forge text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              What Our Clients Say About <span className="text-gradient">Athena</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-gray-800 border-gray-700 p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-spark fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Meet Your AI Business Strategist?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already using Athena to make smarter decisions 
            and achieve unprecedented growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Start Free 14-Day Trial
            </Link>
            <button className="btn-secondary">
              Book Strategy Session
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Full access • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
