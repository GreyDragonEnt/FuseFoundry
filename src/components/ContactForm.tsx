'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import AISuggestion from '@/components/AISuggestion'

interface FormData {
  name: string
  email: string
  company: string
  message: string
  services: string[]
}

const serviceOptions = [
  { id: 'ai-strategy', label: 'AI Strategy & Implementation' },
  { id: 'creator-engine', label: 'Creator Engine & Content' },
  { id: 'growth-systems', label: 'Growth Systems & Automation' },
  { id: 'consultation', label: 'Strategic Consultation' },
]

export default function ContactForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
    services: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setFormData(prev => ({ 
      ...prev, 
      message: prev.message ? `${prev.message}\n\n${suggestion}` : suggestion 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // TODO: Implement actual form submission
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      })
      
      setSubmitted(true)
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      })
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 text-catalyst mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Thank You!
        </h3>
        <p className="text-muted-foreground mb-6">
          We&apos;ve received your message and will get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setFormData({
              name: '',
              email: '',
              company: '',
              message: '',
              services: []
            })
          }}
          className="btn-secondary"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className={cn(
              'w-full px-4 py-3 border border-border',
              'bg-input text-foreground',
              'rounded-lg focus:ring-2 focus:ring-molten focus:border-transparent',
              'transition-colors duration-200'
            )}
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={cn(
              'w-full px-4 py-3 border border-border',
              'bg-input text-foreground',
              'rounded-lg focus:ring-2 focus:ring-molten focus:border-transparent',
              'transition-colors duration-200'
            )}
            placeholder="john@company.com"
          />
        </div>
      </div>

      {/* Company */}
      <div className="mb-6">
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
          Company Name
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className={cn(
            'w-full px-4 py-3 border border-border',
            'bg-input text-foreground',
            'rounded-lg focus:ring-2 focus:ring-molten focus:border-transparent',
            'transition-colors duration-200'
          )}
          placeholder="Your Company Inc."
        />
      </div>

      {/* Services */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Services of Interest
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {serviceOptions.map((service) => (
            <label key={service.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.services.includes(service.id)}
                onChange={() => handleServiceChange(service.id)}
                className="sr-only"
              />
              <div className={cn(
                'w-5 h-5 border-2 rounded mr-3 flex items-center justify-center',
                'transition-colors duration-200',
                formData.services.includes(service.id)
                  ? 'bg-molten border-molten'
                  : 'border-border'
              )}>
                {formData.services.includes(service.id) && (
                  <CheckCircle className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {service.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          className={cn(
            'w-full px-4 py-3 border border-border',
            'bg-input text-foreground',
            'rounded-lg focus:ring-2 focus:ring-molten focus:border-transparent',
            'transition-colors duration-200 resize-vertical'
          )}
          placeholder="Tell us about your business challenges and goals..."
        />
        
        {/* AI Suggestion Helper */}
        <div className="mt-4">
          <AISuggestion 
            businessType={formData.company}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-destructive mr-3" />
          <span className="text-destructive">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'btn-primary w-full flex items-center justify-center',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="ml-2 h-5 w-5" />
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        We respect your privacy. Your information will never be shared with third parties.
      </p>
    </form>
  )
}
