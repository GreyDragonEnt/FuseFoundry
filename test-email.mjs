// Test script for email functionality
// Run with: node --loader ts-node/esm test-email.ts

import { sendOrderConfirmationEmail, sendTeamNotificationEmail } from './src/lib/email.js'

const testOrderData = {
  orderId: 'test-order-123',
  customerEmail: 'hello@fusefoundry.dev', // Using your actual email for testing
  service: {
    id: 'health-check',
    title: 'Website Health Check',
    price: '$497',
    description: 'Comprehensive analysis of your website performance, security, and SEO'
  },
  requirements: {
    website: 'https://example.com',
    email: 'hello@fusefoundry.dev',
    phone: '+1 (555) 123-4567',
    businessConcerns: 'Website is loading slowly and we are losing customers',
    preferredConsultationTime: 'Weekdays 2-4 PM EST',
    additionalNotes: 'Please focus on mobile performance issues'
  }
}

async function testEmails() {
  console.log('Testing email notifications...')
  
  try {
    // Test customer confirmation email
    console.log('Sending customer confirmation email...')
    const customerEmailSent = await sendOrderConfirmationEmail(testOrderData)
    console.log('Customer email sent:', customerEmailSent)
    
    // Test team notification email
    console.log('Sending team notification email...')
    const teamEmailSent = await sendTeamNotificationEmail(testOrderData)
    console.log('Team email sent:', teamEmailSent)
    
    if (customerEmailSent && teamEmailSent) {
      console.log('✅ All emails sent successfully!')
    } else {
      console.log('❌ Some emails failed to send')
    }
    
  } catch (error) {
    console.error('Error testing emails:', error)
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmails()
}
