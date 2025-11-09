import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
import { sendOrderConfirmationEmail, sendTeamNotificationEmail } from '@/lib/email'

interface ServiceOrderRequest {
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
    socialAccounts: Array<{
      platform: string
      username: string
      url: string
    }>
    businessConcerns?: string
    preferredConsultationTime?: string
    additionalNotes?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ServiceOrderRequest = await request.json()
    
    // Validate required fields
    if (!body.service || !body.requirements) {
      return NextResponse.json(
        { error: 'Service and requirements are required' },
        { status: 400 }
      )
    }

    if (!body.requirements.website || !body.requirements.email) {
      return NextResponse.json(
        { error: 'Website and email are required' },
        { status: 400 }
      )
    }

    // Create service order in database
    const orderId = await createServiceOrder(body)
    
    console.log('Service Order Created:', {
      orderId,
      service: body.service,
      requirements: body.requirements,
      timestamp: new Date().toISOString()
    })

    // Send confirmation email to customer
    try {
      await sendOrderConfirmationEmail({
        orderId,
        customerEmail: body.requirements.email,
        service: body.service,
        requirements: body.requirements
      })
    } catch (emailError) {
      console.error('Failed to send customer confirmation email:', emailError)
      // Don't fail the order if email fails
    }

    // Send notification email to team
    try {
      await sendTeamNotificationEmail({
        orderId,
        customerEmail: body.requirements.email,
        service: body.service,
        requirements: body.requirements
      })
    } catch (emailError) {
      console.error('Failed to send team notification email:', emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order submitted successfully',
      service: body.service.title
    })

  } catch (error) {
    console.error('Service order API error:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}

async function createServiceOrder(orderData: ServiceOrderRequest): Promise<string> {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Insert into service_orders table
    const orderResult = await client.query(`
      INSERT INTO service_orders (service_id, service_title, service_price, status, payment_status)
      VALUES ($1, $2, $3, 'pending', 'pending')
      RETURNING id
    `, [
      orderData.service.id, 
      orderData.service.title, 
      parseFloat(orderData.service.price.replace('$', ''))
    ])
    
    const orderId = orderResult.rows[0].id
    
    // Insert into service_requirements table
    await client.query(`
      INSERT INTO service_requirements (
        order_id, website_url, email, phone, social_accounts, 
        business_concerns, preferred_consultation_time, additional_notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      orderId,
      orderData.requirements.website,
      orderData.requirements.email,
      orderData.requirements.phone || null,
      JSON.stringify({ accounts: orderData.requirements.socialAccounts }),
      orderData.requirements.businessConcerns || null,
      orderData.requirements.preferredConsultationTime || null,
      orderData.requirements.additionalNotes || null
    ])
    
    await client.query('COMMIT')
    return orderId
    
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}


