import { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp, Users, Zap, ArrowRight } from 'lucide-react'
import CaseStudyCard from '@/components/CaseStudyCard'
import TestimonialSlider from '@/components/TestimonialSlider'
import caseStudiesData from '@/data/case-studies.json'

export const metadata: Metadata = {
  title: 'Case Studies | FuseFoundry',
  description: 'See how we&apos;ve helped businesses achieve exponential growth through AI innovation, creator partnerships, and strategic growth systems.',
  keywords: ['case studies', 'success stories', 'business growth', 'AI transformation', 'creator marketing', 'client results'],
}

// Transform case studies data to match our component interfaces
const caseStudies = caseStudiesData.map(study => ({
  ...study,
  id: study.id.toString()
}))

const testimonials = caseStudiesData.map(study => ({
  id: study.id,
  quote: study.testimonial.quote,
  author: study.testimonial.author,
  company: study.testimonial.company,
  position: study.testimonial.position,
  rating: study.testimonial.rating,
  result: study.testimonial.result,
  industry: study.testimonial.industry
}))

const stats = [
  { metric: '500%', label: 'Average Growth', sublabel: 'across all clients' },
  { metric: '95%', label: 'Client Satisfaction', sublabel: 'rating score' },
  { metric: '50+', label: 'Success Stories', sublabel: 'and counting' },
  { metric: '18 Mo.', label: 'Average ROI Timeline', sublabel: 'to see results' }
]

export default function CaseStudiesPage() {
  // Get featured case study
  const featuredCaseStudy = caseStudies.find(study => study.featured) || caseStudies[0]
  const otherCaseStudies = caseStudies.filter(study => study.id !== featuredCaseStudy.id)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-molten/10 text-molten text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              Proven Results
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
              Success
              <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              See how we&apos;ve helped businesses achieve exponential growth through AI innovation, 
              creator partnerships, and strategic growth systems.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-2">
                    {stat.metric}
                  </div>
                  <div className="text-sm font-bold text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.sublabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Featured
              <span className="bg-gradient-to-r from-molten to-spark bg-clip-text text-transparent ml-3">
                Success Story
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our most impactful transformation showcasing the full power of the Foundry Method.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <CaseStudyCard 
              caseStudy={featuredCaseStudy}
              variant="featured"
              showCTA={false}
            />
            
            {/* Become Next Case Study CTA */}
            <div className="text-center mt-8">
              <Link 
                href="/services"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Become our next Case study
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* All Case Studies Grid */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              More
              <span className="bg-gradient-to-r from-spark to-catalyst bg-clip-text text-transparent ml-3">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every business is unique. See how we&apos;ve tackled different challenges across various industries.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {otherCaseStudies.map((caseStudy) => (
              <CaseStudyCard 
                key={caseStudy.id}
                caseStudy={caseStudy}
                variant="default"
                showCTA={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials Slider */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              What Our
              <span className="bg-gradient-to-r from-molten to-catalyst bg-clip-text text-transparent ml-3">
                Clients Say
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Hear directly from the leaders who&apos;ve transformed 
              their businesses with FuseFoundry.
            </p>
          </div>
          
          <TestimonialSlider 
            testimonials={testimonials}
            autoPlay={true}
            autoPlayInterval={6000}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="card p-12 text-center bg-gradient-to-br from-molten/10 via-spark/10 to-catalyst/10 border-molten/20 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-molten via-spark to-catalyst flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
              Ready to Write Your
              <span className="block bg-gradient-to-r from-molten to-catalyst bg-clip-text text-transparent">
                Success Story?
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the growing list of businesses that have transformed their operations and 
              achieved exponential growth with FuseFoundry.
            </p>
            
            <div className="flex justify-center">
              <Link 
                href="/services"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Start Your Transformation
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-muted-foreground">
              Free consultation • Custom growth plan • No obligation
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
