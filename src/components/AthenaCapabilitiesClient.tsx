'use client'

import { useState } from 'react'
import { Calendar, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ContactForm from '@/components/ContactForm'

const capabilities = [
  'Market trend analysis and forecasting',
  'Customer behavior prediction',
  'Revenue optimization strategies',
  'Competitive intelligence gathering',
  'Risk assessment and mitigation',
  'Process automation recommendations',
  'Content strategy optimization',
  'Sales funnel analysis',
  'ROI calculation and projection',
  'Real-time performance monitoring'
]

export default function AthenaCapabilitiesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <h3 className="text-3xl font-bold text-foreground mb-8">
        What Athena Can Do For You
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {capabilities.map((capability, index) => (
          <div key={index} className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-catalyst flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground text-sm leading-relaxed">
              {capability}
            </span>
          </div>
        ))}
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button className="btn-secondary inline-flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule a Strategic Analysis
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground mb-4">
              Schedule Your Strategic Analysis
            </DialogTitle>
            <p className="text-muted-foreground">
              Get a personalized consultation with our team to discuss how AI transformation, 
              creator partnerships, and growth systems can accelerate your business success.
            </p>
          </DialogHeader>
          <div className="mt-6">
            <div className="max-w-none">
              <ContactForm />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
