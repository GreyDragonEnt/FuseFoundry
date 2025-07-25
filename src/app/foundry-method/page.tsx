import { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Target, Users, TrendingUp, ArrowRight, CheckCircle, Star } from 'lucide-react'
import ProcessTimeline from '@/components/ProcessTimeline'

export const metadata: Metadata = {
  title: 'The Foundry Method™ | FuseFoundry',
  description: 'Our proven framework that fuses AI innovation, creator-powered content, and strategic growth systems to unlock exponential business growth.',
  keywords: ['foundry method', 'business growth', 'AI strategy', 'creator economy', 'growth framework'],
}

const principles = [
  {
    icon: Target,
    title: 'Precision-Driven Strategy',
    description: 'Every solution is laser-focused on your specific goals, market position, and growth potential.',
    color: 'molten'
  },
  {
    icon: Zap,
    title: 'AI-First Innovation',
    description: 'Harness cutting-edge AI to automate, optimize, and accelerate every aspect of your business.',
    color: 'spark'
  },
  {
    icon: Users,
    title: 'Creator Amplification',
    description: 'Tap into our network of top-tier creators to expand reach and build authentic connections.',
    color: 'catalyst'
  },
  {
    icon: TrendingUp,
    title: 'Scalable Growth Systems',
    description: 'Build systems that grow with you, not against you—designed for sustainable, exponential scale.',
    color: 'molten'
  }
]

const results = [
  { metric: '400%', label: 'Average Revenue Growth', sublabel: 'in first 12 months' },
  { metric: '85%', label: 'Cost Reduction', sublabel: 'through AI automation' },
  { metric: '15x', label: 'Content Reach Multiplier', sublabel: 'via creator networks' },
  { metric: '92%', label: 'Client Retention Rate', sublabel: 'year-over-year' }
]

const testimonials = [
  {
    quote: "The Foundry Method transformed our entire business model. We went from struggling with manual processes to having AI handle 80% of our operations while our creator partnerships drove unprecedented growth.",
    author: "Sarah Chen",
    company: "TechScale Ventures",
    result: "300% revenue increase in 8 months"
  },
  {
    quote: "I was skeptical about AI and creator marketing, but FuseFoundry's approach made it all click. Their framework isn't just theory—it's a practical roadmap that actually works.",
    author: "Marcus Rodriguez",
    company: "Global Dynamics Corp",
    result: "Reduced operational costs by 60%"
  }
]

export default function FoundryMethodPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-molten/10 text-molten text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Proven Framework
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
              The Foundry
              <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
                Method™
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Our proven framework that fuses AI innovation, creator-powered content, and strategic growth systems 
              to unlock exponential business growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Four Pillars of
              <span className="block bg-gradient-to-r from-molten to-spark bg-clip-text text-transparent">
                Exponential Growth
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The Foundry Method isn&apos;t just another consulting framework—it&apos;s a battle-tested system 
              that combines the best of AI, creator economy, and growth strategy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <div key={index} className="card p-8 hover:shadow-xl transition-all group">
                  <div className="flex items-start space-x-6">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0
                      ${principle.color === 'molten' ? 'bg-molten' : ''}
                      ${principle.color === 'spark' ? 'bg-spark' : ''}
                      ${principle.color === 'catalyst' ? 'bg-catalyst' : ''}
                    `}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        {principle.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-lg">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Your Journey to
              <span className="block bg-gradient-to-r from-spark to-catalyst bg-clip-text text-transparent">
                Exponential Growth
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial assessment to scaled success, here&apos;s exactly how we&apos;ll transform your business 
              using the Foundry Method.
            </p>
          </div>
          
          <ProcessTimeline />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Proven
              <span className="bg-gradient-to-r from-molten to-catalyst bg-clip-text text-transparent ml-3">
                Results
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Numbers don&apos;t lie. Here&apos;s what happens when you implement the Foundry Method.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map((result, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-2">
                  {result.metric}
                </div>
                <div className="text-lg font-bold text-foreground mb-1">
                  {result.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Success
              <span className="bg-gradient-to-r from-spark to-catalyst bg-clip-text text-transparent ml-3">
                Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real businesses, real transformations, real results.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg text-muted-foreground mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-muted-foreground">
                        {testimonial.company}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-catalyst">
                        {testimonial.result}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="card p-12 text-center bg-gradient-to-br from-molten/10 via-spark/10 to-catalyst/10 border-molten/20">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Ready to Transform
              <span className="block bg-gradient-to-r from-molten to-catalyst bg-clip-text text-transparent">
                Your Business?
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don&apos;t wait for disruption to happen to you. Let&apos;s build your competitive advantage together 
              with the Foundry Method.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Your Foundry Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Schedule Strategy Call
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-catalyst" />
              Free consultation • No obligation • Immediate insights
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
