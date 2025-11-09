'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ServiceFormData } from '@/contexts/CartContext'
import { serviceFormConfigs, socialPlatforms, consultationTimeSlots } from '@/lib/service-form-config'

interface ServiceFormProps {
  serviceId: string
  serviceTitle: string
  onSubmit: (data: ServiceFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export default function ServiceForm({ 
  serviceId, 
  serviceTitle, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: ServiceFormProps) {
  const config = serviceFormConfigs[serviceId]
  
  const [formData, setFormData] = useState<ServiceFormData>({
    website: '',
    email: '',
    phone: '',
    socialAccounts: Array(config.socialAccounts).fill(null).map(() => ({
      platform: '',
      username: '',
      url: ''
    })),
    businessConcerns: '',
    preferredConsultationTime: '',
    additionalNotes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Website validation
    if (!formData.website.trim()) {
      newErrors.website = 'Website URL is required'
    } else if (!isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Social accounts validation
    formData.socialAccounts.forEach((account, index) => {
      if (!account.platform || !account.username) {
        newErrors[`social_${index}`] = 'Platform and username are required'
      }
    })

    // Business concerns validation (for consultation)
    if (config.businessConcerns && !formData.businessConcerns?.trim()) {
      newErrors.businessConcerns = 'Please describe your business concerns'
    }

    // Consultation time validation
    if (config.consultationTime && !formData.preferredConsultationTime) {
      newErrors.consultationTime = 'Please select a preferred consultation time'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Normalize website URL
      const normalizedData = {
        ...formData,
        website: formData.website.startsWith('http') ? formData.website : `https://${formData.website}`,
        socialAccounts: formData.socialAccounts.map(account => ({
          ...account,
          url: account.url || `https://${account.platform}.com/${account.username.replace('@', '')}`
        }))
      }
      onSubmit(normalizedData)
    }
  }

  const updateSocialAccount = (index: number, field: keyof typeof formData.socialAccounts[0], value: string) => {
    const newAccounts = [...formData.socialAccounts]
    newAccounts[index] = { ...newAccounts[index], [field]: value }
    setFormData({ ...formData, socialAccounts: newAccounts })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Order
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">{serviceTitle}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Please provide the following information to get started:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Website *
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://your-website.com"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  errors.website ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                )}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone (Optional) */}
            {config.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {/* Social Media Accounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Social Media Accounts ({config.socialAccounts} required) *
              </label>
              <div className="space-y-3">
                {formData.socialAccounts.map((account, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <select
                      value={account.platform}
                      onChange={(e) => updateSocialAccount(index, 'platform', e.target.value)}
                      className={cn(
                        'px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                        errors[`social_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                    >
                      <option value="">Platform</option>
                      {socialPlatforms.map(platform => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={account.username}
                      onChange={(e) => updateSocialAccount(index, 'username', e.target.value)}
                      placeholder="@username or account name"
                      className={cn(
                        'flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                        errors[`social_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      )}
                    />
                  </div>
                ))}
                {formData.socialAccounts.some((_, index) => errors[`social_${index}`]) && (
                  <p className="text-red-500 text-sm">Please fill in all social media accounts</p>
                )}
              </div>
            </div>

            {/* Business Concerns (Consultation only) */}
            {config.businessConcerns && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Concerns & Goals *
                </label>
                <textarea
                  value={formData.businessConcerns}
                  onChange={(e) => setFormData({ ...formData, businessConcerns: e.target.value })}
                  placeholder="Describe your main business challenges, goals, and what you'd like to focus on during the consultation..."
                  rows={4}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    errors.businessConcerns ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  )}
                />
                {errors.businessConcerns && <p className="text-red-500 text-sm mt-1">{errors.businessConcerns}</p>}
              </div>
            )}

            {/* Consultation Time (Consultation only) */}
            {config.consultationTime && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Consultation Time *
                </label>
                <select
                  value={formData.preferredConsultationTime}
                  onChange={(e) => setFormData({ ...formData, preferredConsultationTime: e.target.value })}
                  className={cn(
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                    errors.consultationTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  )}
                >
                  <option value="">Select a time slot</option>
                  {consultationTimeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.consultationTime && <p className="text-red-500 text-sm mt-1">{errors.consultationTime}</p>}
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Any additional information or special requests..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Processing...' : 'Submit Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
