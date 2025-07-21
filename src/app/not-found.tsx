import { Metadata } from 'next'
import { AlertTriangle, Home, ArrowLeft, Search, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 - Page Not Found | FuseFoundry',
  description: 'Sorry, the page you&apos;re looking for doesn&apos;t exist. Let us help you find what you need.',
}

const quickLinks = [
  { name: 'Home', href: '/', description: 'Return to our homepage' },
  { name: 'Services', href: '/services', description: 'Explore our transformation services' },
  { name: 'AI Athena', href: '/ai-athena', description: 'Learn about our AI platform' },
  { name: 'Foundry Method', href: '/foundry-method', description: 'Discover our proven framework' },
  { name: 'Case Studies', href: '/case-studies', description: 'See our success stories' },
  { name: 'Contact', href: '/contact', description: 'Get in touch with our team' }
]

const suggestions = [
  {
    icon: Search,
    title: 'Try a different search',
    description: 'The page might have moved or been renamed. Try searching for what you need.',
    action: 'Search our site'
  },
  {
    icon: Home,
    title: 'Go back to homepage',
    description: 'Start fresh from our homepage and navigate to what you&apos;re looking for.',
    action: 'Visit homepage'
  },
  {
    icon: Lightbulb,
    title: 'Need help?',
    description: 'Our team is here to help you find exactly what you&apos;re looking for.',
    action: 'Contact support'
  }
]

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Icon & Code */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-molten/20 to-spark/20 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-molten" />
            </div>
          </div>
          
          {/* Error Message */}
          <h1 className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent mb-4">
            404
          </h1>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-forge dark:text-white mb-6">
            Oops! Page Not Found
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            The page you&apos;re looking for seems to have vanished into the digital void. 
            But don&apos;t worry—we&apos;ll help you get back on track!
          </p>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon
              return (
                <div key={index} className="card p-6 hover:shadow-lg transition-all group">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spark to-catalyst flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-forge dark:text-white mb-2">
                    {suggestion.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {suggestion.description}
                  </p>
                  
                  <button className="text-molten hover:text-spark transition-colors font-medium text-sm">
                    {suggestion.action}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-forge dark:text-white mb-8">
              Popular Pages
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  className="card p-4 hover:shadow-lg transition-all group text-left"
                >
                  <h4 className="font-bold text-forge dark:text-white mb-1 group-hover:text-molten transition-colors">
                    {link.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            
            <Link href="/contact" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Contact Support
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Still can&apos;t find what you&apos;re looking for? 
              <Link href="/contact" className="text-molten hover:text-spark ml-1 font-medium">
                Contact our support team
              </Link>
              {' '}and we&apos;ll help you out.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
