// Service form configuration for different packages

export interface ServiceFormConfig {
  website: boolean
  socialAccounts: number
  email: boolean
  phone: boolean
  businessConcerns: boolean
  consultationTime: boolean
}

export const serviceFormConfigs: Record<string, ServiceFormConfig> = {
  'health-check': {
    website: true,
    socialAccounts: 1,
    email: true,
    phone: true, // optional
    businessConcerns: false,
    consultationTime: false,
  },
  'strategy-package': {
    website: true,
    socialAccounts: 3,
    email: true,
    phone: true, // optional
    businessConcerns: false,
    consultationTime: false,
  },
  'transformation-blueprint': {
    website: true,
    socialAccounts: 3,
    email: true,
    phone: true, // optional
    businessConcerns: false,
    consultationTime: false,
  },
  'strategy-consultation': {
    website: true,
    socialAccounts: 4,
    email: true,
    phone: true, // optional
    businessConcerns: true,
    consultationTime: true,
  }
}

export const socialPlatforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'snapchat', label: 'Snapchat' },
]

export const consultationTimeSlots = [
  'Monday 9:00 AM - 12:00 PM EST',
  'Monday 1:00 PM - 5:00 PM EST',
  'Tuesday 9:00 AM - 12:00 PM EST',
  'Tuesday 1:00 PM - 5:00 PM EST',
  'Wednesday 9:00 AM - 12:00 PM EST',
  'Wednesday 1:00 PM - 5:00 PM EST',
  'Thursday 9:00 AM - 12:00 PM EST',
  'Thursday 1:00 PM - 5:00 PM EST',
  'Friday 9:00 AM - 12:00 PM EST',
  'Friday 1:00 PM - 5:00 PM EST',
]
