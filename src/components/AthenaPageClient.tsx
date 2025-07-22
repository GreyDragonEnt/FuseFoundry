'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ContactForm from '@/components/ContactForm'

interface AthenaPageClientProps {
  children: React.ReactNode
}

export default function AthenaPageClient({ children }: AthenaPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between mb-6">
        <h4 className="text-xl font-bold text-foreground flex-1">
          Try Athena Live - Ask Any Business Question
        </h4>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="btn-secondary inline-flex items-center whitespace-nowrap">
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
      
      {children}
    </>
  )
}
