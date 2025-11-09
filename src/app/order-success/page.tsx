import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Confirmation | FuseFoundry',
  description: 'Your order has been submitted successfully. We\'ll be in touch soon!',
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
            Order
            <span className="block bg-gradient-to-r from-molten via-spark to-catalyst bg-clip-text text-transparent">
              Confirmed!
            </span>
          </h1>

          {/* Message */}
          <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
            Thank you for choosing FuseFoundry! We&apos;ve received your order and will begin 
            processing your request immediately.
          </p>

          {/* What's Next */}
          <div className="card p-8 text-left mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              What Happens Next?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-molten/10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-molten font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Confirmation Email</h3>
                  <p className="text-muted-foreground text-sm">
                    You&apos;ll receive a confirmation email within the next few minutes with your order details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-spark/10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-spark font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Analysis Begins</h3>
                  <p className="text-muted-foreground text-sm">
                    Our team will start analyzing your website and social media accounts immediately.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-catalyst/10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-catalyst font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Delivery</h3>
                  <p className="text-muted-foreground text-sm">
                    Your comprehensive report will be delivered to your email within the specified timeframe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="card p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Questions? We&apos;re Here to Help
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:hello@fusefoundry.dev"
                className="flex items-center text-muted-foreground hover:text-molten transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                hello@fusefoundry.dev
              </a>
              <a 
                href="tel:+15551234567"
                className="flex items-center text-muted-foreground hover:text-spark transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Back to Home
            </Link>
            <Link 
              href="/services"
              className="btn-primary inline-flex items-center justify-center"
            >
              Explore More Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
