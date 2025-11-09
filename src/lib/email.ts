import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  orderId: string
  customerEmail: string
  customerName?: string
  service: {
    id: string
    title: string
    price: string
    description: string
  }
  requirements: {
    website: string
    email: string
    phone?: string
    businessConcerns?: string
    preferredConsultationTime?: string
    additionalNotes?: string
  }
}

type TeamNotificationData = OrderEmailData

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    // In development, use configured dev email; in production, use customer's email
    const recipientEmail = process.env.NODE_ENV === 'development' 
      ? (process.env.DEV_EMAIL_RECIPIENT || 'your-verified-email@domain.com')
      : data.customerEmail

    const { data: emailData, error } = await resend.emails.send({
      from: 'FuseFoundry <orders@fusefoundry.dev>',
      to: [recipientEmail],
      subject: `Order Confirmation - ${data.service.title}`,
      html: generateCustomerEmailTemplate(data),
      text: generateCustomerEmailText(data)
    })

    if (error) {
      console.error('Failed to send customer confirmation email:', error)
      return false
    }

    console.log('Customer confirmation email sent:', emailData?.id)
    return true
  } catch (error) {
    console.error('Error sending customer confirmation email:', error)
    return false
  }
}

export async function sendTeamNotificationEmail(data: TeamNotificationData): Promise<boolean> {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'FuseFoundry <orders@fusefoundry.dev>',
      to: [process.env.DEV_EMAIL_RECIPIENT || process.env.TEAM_EMAIL || 'your-verified-email@domain.com'],
      subject: `New Service Order - ${data.service.title}`,
      html: generateTeamEmailTemplate(data),
      text: generateTeamEmailText(data)
    })

    if (error) {
      console.error('Failed to send team notification email:', error)
      return false
    }

    console.log('Team notification email sent:', emailData?.id)
    return true
  } catch (error) {
    console.error('Error sending team notification email:', error)
    return false
  }
}

function generateCustomerEmailTemplate(data: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - FuseFoundry</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #FF6B35; font-size: 24px; font-weight: bold; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .order-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FuseFoundry</div>
          <h1>Order Confirmation</h1>
        </div>
        
        <div class="content">
          <p>Thank you for choosing FuseFoundry! We've received your order and will begin working on it shortly.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Service:</strong> ${data.service.title}</p>
            <p><strong>Price:</strong> ${data.service.price}</p>
            <p><strong>Website:</strong> ${data.requirements.website}</p>
            ${data.requirements.phone ? `<p><strong>Phone:</strong> ${data.requirements.phone}</p>` : ''}
            ${data.requirements.businessConcerns ? `<p><strong>Business Concerns:</strong> ${data.requirements.businessConcerns}</p>` : ''}
            ${data.requirements.preferredConsultationTime ? `<p><strong>Preferred Consultation Time:</strong> ${data.requirements.preferredConsultationTime}</p>` : ''}
          </div>
          
          <h3>What's Next?</h3>
          <ol>
            <li>Our team will review your requirements within 24 hours</li>
            <li>We'll reach out to schedule a discovery call or begin the audit</li>
            <li>You'll receive regular updates on the progress</li>
            <li>Final deliverables will be sent within the specified timeframe</li>
          </ol>
          
          <p>If you have any questions, feel free to reply to this email or contact us at hello@fusefoundry.dev</p>
        </div>
        
        <div class="footer">
          <p>© 2025 FuseFoundry. All rights reserved.</p>
          <p>Visit us at <a href="https://fusefoundry.dev">fusefoundry.dev</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmailText(data: OrderEmailData): string {
  return `
Order Confirmation - FuseFoundry

Thank you for choosing FuseFoundry! We've received your order and will begin working on it shortly.

Order Details:
- Order ID: ${data.orderId}
- Service: ${data.service.title}
- Price: ${data.service.price}
- Website: ${data.requirements.website}
${data.requirements.phone ? `- Phone: ${data.requirements.phone}` : ''}
${data.requirements.businessConcerns ? `- Business Concerns: ${data.requirements.businessConcerns}` : ''}
${data.requirements.preferredConsultationTime ? `- Preferred Consultation Time: ${data.requirements.preferredConsultationTime}` : ''}

What's Next?
1. Our team will review your requirements within 24 hours
2. We'll reach out to schedule a discovery call or begin the audit
3. You'll receive regular updates on the progress
4. Final deliverables will be sent within the specified timeframe

If you have any questions, feel free to reply to this email or contact us at hello@fusefoundry.dev

© 2025 FuseFoundry. All rights reserved.
Visit us at https://fusefoundry.dev
  `
}

function generateTeamEmailTemplate(data: TeamNotificationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Service Order - FuseFoundry</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; background: #FF6B35; color: white; padding: 20px; border-radius: 8px; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .order-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .urgent { background: #e74c3c; color: white; padding: 10px; border-radius: 4px; font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Service Order!</h1>
        </div>
        
        <div class="urgent">
          Action Required: New customer order needs review
        </div>
        
        <div class="content">
          <div class="order-details">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Service:</strong> ${data.service.title}</p>
            <p><strong>Price:</strong> ${data.service.price}</p>
            <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="order-details">
            <h3>Customer Information</h3>
            <p><strong>Email:</strong> ${data.requirements.email}</p>
            <p><strong>Website:</strong> ${data.requirements.website}</p>
            ${data.requirements.phone ? `<p><strong>Phone:</strong> ${data.requirements.phone}</p>` : ''}
          </div>
          
          <div class="order-details">
            <h3>Requirements & Notes</h3>
            ${data.requirements.businessConcerns ? `<p><strong>Business Concerns:</strong><br>${data.requirements.businessConcerns}</p>` : ''}
            ${data.requirements.preferredConsultationTime ? `<p><strong>Preferred Consultation Time:</strong><br>${data.requirements.preferredConsultationTime}</p>` : ''}
            ${data.requirements.additionalNotes ? `<p><strong>Additional Notes:</strong><br>${data.requirements.additionalNotes}</p>` : ''}
          </div>
          
          <div class="order-details">
            <h3>Next Steps</h3>
            <ol>
              <li>Review customer requirements and website</li>
              <li>Schedule discovery call or begin audit process</li>
              <li>Update order status in the system</li>
              <li>Send customer timeline confirmation</li>
            </ol>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateTeamEmailText(data: TeamNotificationData): string {
  return `
🎉 NEW SERVICE ORDER - ACTION REQUIRED

Order Information:
- Order ID: ${data.orderId}
- Service: ${data.service.title}
- Price: ${data.service.price}
- Order Time: ${new Date().toLocaleString()}

Customer Information:
- Email: ${data.requirements.email}
- Website: ${data.requirements.website}
${data.requirements.phone ? `- Phone: ${data.requirements.phone}` : ''}

Requirements & Notes:
${data.requirements.businessConcerns ? `Business Concerns: ${data.requirements.businessConcerns}` : ''}
${data.requirements.preferredConsultationTime ? `Preferred Consultation Time: ${data.requirements.preferredConsultationTime}` : ''}
${data.requirements.additionalNotes ? `Additional Notes: ${data.requirements.additionalNotes}` : ''}

Next Steps:
1. Review customer requirements and website
2. Schedule discovery call or begin audit process
3. Update order status in the system
4. Send customer timeline confirmation

Log into the admin panel or database to manage this order.
  `
}
