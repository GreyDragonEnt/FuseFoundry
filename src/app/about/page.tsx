import { Metadata } from 'next'
import { Users, Target, Zap, Heart, Globe, ArrowRight, CheckCircle, Lightbulb, Rocket, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About FuseFoundry | Our Story & Mission',
  description: 'Learn about FuseFoundry&apos;s mission to fuse AI innovation, creator-powered content, and strategic growth systems to transform businesses worldwide.',
  keywords: ['about fusefoundry', 'company mission', 'business transformation', 'AI innovation', 'creator economy', 'growth strategy'],
}

const values = [
  {
    icon: Target,
    title: 'Precision-Driven',
    description: 'Every solution is laser-focused on delivering measurable results that align with your specific business goals.',
    color: 'molten'
  },
  {
    icon: Zap,
    title: 'Innovation First',
    description: 'We stay at the cutting edge of AI and creator economy trends to give our clients competitive advantages.',
    color: 'spark'
  },
  {
    icon: Users,
    title: 'Partnership Mindset',
    description: 'We&apos;re not just consultants—we&apos;re your strategic partners invested in your long-term success.',
    color: 'catalyst'
  },
  {
    icon: Heart,
    title: 'Authentic Impact',
    description: 'We believe in creating genuine value for businesses, their customers, and the broader community.',
    color: 'molten'
  }
]

const milestones = [
  {
    year: '2023',
    title: 'Foundation',
    description: 'FuseFoundry was founded with a vision to bridge the gap between AI innovation and practical business growth.',
    metric: 'Day 1'
  },
  {
    year: '2023',
    title: 'First Success',
    description: 'Helped our first client achieve 300% revenue growth through AI-powered automation and creator partnerships.',
    metric: '6 Months'
  },
  {
    year: '2024',
    title: 'Proven Method',
    description: 'Developed and refined the Foundry Method™ framework based on consistent client success patterns.',
    metric: '1 Year'
  },
  {
    year: '2024',
    title: 'Scale & Impact',
    description: 'Expanded to serve 50+ businesses across multiple industries with average growth rates exceeding 250%.',
    metric: '18 Months'
  },
  {
    year: '2025',
    title: 'Global Reach',
    description: 'Launched international expansion with creator networks spanning 15 countries and 8 languages.',
    metric: 'Today'
  }
]

const stats = [
  { metric: '50+', label: 'Businesses Transformed', icon: Users },
  { metric: '400%', label: 'Average Growth Rate', icon: TrendingUp },
  { metric: '95%', label: 'Client Retention Rate', icon: Heart },
  { metric: '15', label: 'Countries Served', icon: Globe }
]

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    bio: 'Former AI researcher at Google with 10+ years in business transformation. Passionate about democratizing AI for growth.',
    expertise: ['AI Strategy', 'Business Growth', 'Team Leadership']
  },
  {
    name: 'Sarah Rodriguez',
    role: 'Head of Creator Networks',
    bio: 'Ex-influencer marketing director at major tech companies. Expert in building authentic creator partnerships that drive results.',
    expertise: ['Creator Economy', 'Content Strategy', 'Brand Partnerships']
  },
  {
    name: 'Marcus Thompson',
    role: 'Chief Technology Officer',
    bio: 'Full-stack engineer and automation specialist. Builds the systems that power our clients&apos; growth transformations.',
    expertise: ['System Architecture', 'Automation', 'Technical Integration']
  },
  {
    name: 'Jennifer Liu',
    role: 'Head of Growth Strategy',
    bio: 'Former McKinsey consultant with expertise in scaling businesses. Architect of the Foundry Method™ framework.',
    expertise: ['Strategic Planning', 'Process Optimization', 'Change Management']
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-molten/10 text-molten text-sm font-medium mb-6">
              <Lightbulb className="h-4 w-4 mr-2" />
              Our Story
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
              Fusing Innovation
              <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
                with Impact
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We&apos;re on a mission to transform businesses by fusing AI innovation, creator-powered content, 
              and strategic growth systems into one unstoppable force.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="h-8 w-8 text-molten" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-2">
                      {stat.metric}
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-8">
              Our
              <span className="bg-gradient-to-r from-molten to-spark bg-clip-text text-transparent ml-3">
                Mission
              </span>
            </h2>
            
            <div className="card p-12 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5 border-molten/20">
              <blockquote className="text-2xl lg:text-3xl text-muted-foreground font-medium italic leading-relaxed mb-8">
                &ldquo;To democratize exponential growth by making cutting-edge AI technology, creator networks, 
                and strategic systems accessible to businesses of all sizes.&rdquo;
              </blockquote>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We believe every business deserves the opportunity to achieve extraordinary growth. 
                That&apos;s why we&apos;ve created the Foundry Method™—a proven framework that levels 
                the playing field and gives you the same advantages as industry giants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Our
              <span className="bg-gradient-to-r from-spark to-catalyst bg-clip-text text-transparent ml-3">
                Values
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These principles guide everything we do and shape how we partner with our clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="card p-8 hover:shadow-xl transition-all group">
                  <div className="flex items-start space-x-6">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0
                      ${value.color === 'molten' ? 'bg-molten' : ''}
                      ${value.color === 'spark' ? 'bg-spark' : ''}
                      ${value.color === 'catalyst' ? 'bg-catalyst' : ''}
                    `}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        {value.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-lg">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Our
              <span className="bg-gradient-to-r from-molten to-catalyst bg-clip-text text-transparent ml-3">
                Journey
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From a bold vision to proven results—here&apos;s how we&apos;ve grown alongside our clients.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-molten to-spark flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground">
                        {milestone.title}
                      </h3>
                      <span className="text-sm font-medium text-catalyst">
                        {milestone.metric}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Meet the
              <span className="bg-gradient-to-r from-spark to-catalyst bg-clip-text text-transparent ml-3">
                Team
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The experts behind your transformation—each bringing unique expertise to drive your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="card p-8 hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-molten to-catalyst flex items-center justify-center flex-shrink-0">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-molten font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {member.bio}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    Expertise:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-catalyst/10 text-catalyst text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
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
          <div className="card p-12 text-center bg-gradient-to-br from-molten/10 via-spark/10 to-catalyst/10 border-molten/20 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-molten via-spark to-catalyst flex items-center justify-center">
                <Rocket className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Ready to Partner
              <span className="block bg-gradient-to-r from-molten to-catalyst bg-clip-text text-transparent">
                with Us?
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the businesses that trust FuseFoundry to transform their operations and 
              achieve exponential growth through proven strategies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Meet the Team
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-catalyst" />
              Free consultation • Custom strategy • Proven results
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
