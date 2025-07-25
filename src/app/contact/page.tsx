import { Mail, Phone, MapPin, Clock, MessageCircle, Video } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant answers to your questions',
    action: 'Start Chat',
    available: true
  },
  {
    icon: Video,
    title: 'Video Call',
    description: 'Schedule a personalized consultation',
    action: 'Book Meeting',
    available: true
  },
  {
    icon: Phone,
    title: 'Phone Call',
    description: 'Speak directly with our team',
    action: '+1 (555) 123-4567',
    available: true
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message',
    action: 'hello@fusefoundry.com',
    available: true
  }
]

const officeHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST' },
  { day: 'Sunday', hours: 'Closed' }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-molten/5 via-spark/5 to-catalyst/5" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-molten/10 text-molten text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Us
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
              Get in
              <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ready to transform your business? We&apos;d love to hear about your challenges 
              and discuss how FuseFoundry can help you achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-gradient rounded-full">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {method.description}
                  </p>
                  <button 
                    className={`text-sm font-medium ${
                      method.available 
                        ? 'text-molten hover:text-spark' 
                        : 'text-gray-400'
                    } transition-colors`}
                    disabled={!method.available}
                  >
                    {method.action}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-background/50 dark:bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Send us a Message
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-molten" />
                  Our Office
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>123 Innovation Drive</p>
                  <p>San Francisco, CA 94105</p>
                  <p>United States</p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-molten" />
                  Office Hours
                </h3>
                <div className="space-y-2">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {schedule.day}
                      </span>
                      <span className="font-medium text-foreground">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Why Choose Us?
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">24h</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">500+</div>
                    <div className="text-sm text-muted-foreground">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient">98%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card p-6 bg-molten text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Need Urgent Help?
                </h3>
                <p className="text-sm mb-4 opacity-90">
                  For critical issues, call our emergency line.
                </p>
                <button className="btn-secondary bg-background dark:bg-gray-800 text-molten hover:bg-muted dark:hover:bg-gray-700">
                  Call Emergency Line
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Common questions about working with FuseFoundry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-2">
                How quickly can you start working on my project?
              </h3>
              <p className="text-muted-foreground text-sm">
                We typically begin projects within 1-2 weeks of signing an agreement, 
                depending on project complexity and our current capacity.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-2">
                Do you work with businesses of all sizes?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes! We work with startups, mid-market companies, and enterprises. 
                Our solutions are tailored to fit your specific needs and budget.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-2">
                What industries do you specialize in?
              </h3>
              <p className="text-muted-foreground text-sm">
                We have experience across SaaS, e-commerce, fintech, healthcare, 
                and many other industries. Our AI-driven approach adapts to any sector.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-foreground mb-2">
                How do you measure success?
              </h3>
              <p className="text-muted-foreground text-sm">
                We establish clear KPIs at project start and provide regular reporting 
                on metrics like revenue growth, cost reduction, and efficiency gains.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
