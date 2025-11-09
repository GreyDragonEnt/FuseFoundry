// Mock database for local development
// This simulates database operations without requiring a real database connection

interface MockOrder {
  id: string
  service_id: string
  service_title: string
  service_price: number
  status: string
  payment_status: string
  created_at: string
  requirements: {
    website_url?: string
    email?: string
    phone?: string
    social_accounts?: unknown
    business_concerns?: string
    preferred_consultation_time?: string
    additional_notes?: string
  }
}

// In-memory storage for development
let mockOrders: MockOrder[] = [
  {
    id: 'mock-order-1',
    service_id: 'health-check',
    service_title: 'Business Health Check',
    service_price: 29.99,
    status: 'completed',
    payment_status: 'paid',
    created_at: '2024-11-01T10:00:00Z',
    requirements: { website_url: 'https://example1.com', email: 'test1@example.com' }
  },
  {
    id: 'mock-order-2',
    service_id: 'health-check',
    service_title: 'Business Health Check',
    service_price: 29.99,
    status: 'completed',
    payment_status: 'paid',
    created_at: '2024-11-15T14:30:00Z',
    requirements: { website_url: 'https://example2.com', email: 'test2@example.com' }
  },
  {
    id: 'mock-order-3',
    service_id: 'strategy-package',
    service_title: 'Business Strategy Package',
    service_price: 49.99,
    status: 'completed',
    payment_status: 'paid',
    created_at: '2024-10-15T11:20:00Z',
    requirements: { website_url: 'https://example3.com', email: 'test3@example.com' }
  },
  {
    id: 'mock-order-4',
    service_id: 'strategy-package',
    service_title: 'Business Strategy Package',
    service_price: 49.99,
    status: 'processing',
    payment_status: 'paid',
    created_at: '2024-11-20T16:45:00Z',
    requirements: { website_url: 'https://example4.com', email: 'test4@example.com' }
  },
  {
    id: 'mock-order-5',
    service_id: 'transformation-blueprint',
    service_title: 'DIY Business Transformation Blueprint',
    service_price: 99.99,
    status: 'completed',
    payment_status: 'paid',
    created_at: '2024-10-20T15:00:00Z',
    requirements: { website_url: 'https://example5.com', email: 'test5@example.com' }
  },
  {
    id: 'mock-order-6',
    service_id: 'strategy-consultation',
    service_title: 'Business Strategy Consultation',
    service_price: 199.99,
    status: 'completed',
    payment_status: 'paid',
    created_at: '2024-11-10T12:00:00Z',
    requirements: { website_url: 'https://example6.com', email: 'test6@example.com' }
  },
  {
    id: 'mock-order-7',
    service_id: 'strategy-consultation',
    service_title: 'Business Strategy Consultation',
    service_price: 199.99,
    status: 'cancelled',
    payment_status: 'refunded',
    created_at: '2024-11-25T17:15:00Z',
    requirements: { website_url: 'https://example7.com', email: 'test7@example.com' }
  }
]

export class MockDatabase {
  static async connect() {
    return {
      query: async (sql: string, params?: unknown[]) => {
        console.log('🔄 Mock Database Query:', sql)
        console.log('📝 Parameters:', params)

        // Mock transaction commands
        if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') {
          return { rows: [] }
        }

        // Mock insert into service_orders
        if (sql.includes('INSERT INTO service_orders')) {
          const orderId = `mock-order-${Date.now()}`
          const mockOrder: MockOrder = {
            id: orderId,
            service_id: (params?.[0] as string) || 'unknown',
            service_title: (params?.[1] as string) || 'Unknown Service',
            service_price: (params?.[2] as number) || 0,
            status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            requirements: {}
          }
          mockOrders.push(mockOrder)
          
          console.log('✅ Mock order created:', orderId)
          return { rows: [{ id: orderId }] }
        }

        // Mock insert into service_requirements
        if (sql.includes('INSERT INTO service_requirements')) {
          const orderId = params?.[0] as string
          const orderIndex = mockOrders.findIndex(order => order.id === orderId)
          
          if (orderIndex >= 0) {
            mockOrders[orderIndex].requirements = {
              website_url: params?.[1] as string,
              email: params?.[2] as string,
              phone: params?.[3] as string,
              social_accounts: params?.[4],
              business_concerns: params?.[5] as string,
              preferred_consultation_time: params?.[6] as string,
              additional_notes: params?.[7] as string
            }
            console.log('✅ Mock requirements added for order:', orderId)
          }
          
          return { rows: [] }
        }

        // Mock service analytics queries
        if (sql.includes('GROUP BY so.service_id, so.service_title') || (sql.includes('GROUP BY service_id') && sql.includes('total_revenue'))) {
          // Service analytics query
          const analytics = mockOrders.reduce((acc, order) => {
            const existing = acc.find(a => a.service_id === order.service_id)
            if (existing) {
              existing.total_orders++
              existing.total_revenue += order.service_price
              if (order.status === 'completed') existing.completed_orders++
              if (order.status === 'pending') existing.pending_orders++
              if (order.status === 'processing') existing.processing_orders++
              if (order.status === 'cancelled') existing.cancelled_orders++
              if (order.service_price > existing.max_price) existing.max_price = order.service_price
              if (order.service_price < existing.min_price) existing.min_price = order.service_price
            } else {
              acc.push({
                service_id: order.service_id,
                service_title: order.service_title,
                total_orders: 1,
                total_revenue: order.service_price,
                average_price: order.service_price,
                min_price: order.service_price,
                max_price: order.service_price,
                completed_orders: order.status === 'completed' ? 1 : 0,
                pending_orders: order.status === 'pending' ? 1 : 0,
                processing_orders: order.status === 'processing' ? 1 : 0,
                cancelled_orders: order.status === 'cancelled' ? 1 : 0,
                completion_rate: 0,
                cancellation_rate: 0,
                unique_customers: 1,
                revenue_per_customer: 0,
                avg_completion_days: 0
              })
            }
            return acc
          }, [] as Array<{
            service_id: string
            service_title: string
            total_orders: number
            total_revenue: number
            average_price: number
            min_price: number
            max_price: number
            completed_orders: number
            pending_orders: number
            processing_orders: number
            cancelled_orders: number
            completion_rate: number
            cancellation_rate: number
            unique_customers: number
            revenue_per_customer: number
            avg_completion_days: number
          }>)

          // Calculate rates and averages
          analytics.forEach(a => {
            a.completion_rate = (a.completed_orders / a.total_orders) * 100
            a.cancellation_rate = (a.cancelled_orders / a.total_orders) * 100
            a.average_price = a.total_revenue / a.total_orders
            a.revenue_per_customer = a.total_revenue / a.unique_customers
          })

          return { rows: analytics }
        }

        // Mock service trends query
        if (sql.includes('DATE_TRUNC')) {
          const trends = [
            { period: '2024-10-01', service_id: 'health-check', orders: 0, revenue: 0 },
            { period: '2024-10-01', service_id: 'strategy-package', orders: 1, revenue: 49.99 },
            { period: '2024-10-01', service_id: 'transformation-blueprint', orders: 1, revenue: 99.99 },
            { period: '2024-11-01', service_id: 'health-check', orders: 2, revenue: 59.98 },
            { period: '2024-11-01', service_id: 'strategy-package', orders: 1, revenue: 49.99 },
            { period: '2024-11-01', service_id: 'strategy-consultation', orders: 2, revenue: 199.99 },
            { period: '2024-12-01', service_id: 'health-check', orders: 0, revenue: 0 }
          ]
          return { rows: trends }
        }

        // Mock orders query (for reports) - MUST COME BEFORE customer preferences
        if (sql.includes('FROM service_orders so') && sql.includes('LEFT JOIN service_requirements')) {
          const ordersWithRequirements = mockOrders.map(order => ({
            id: order.id,
            service_id: order.service_id,
            service_title: order.service_title,
            service_price: order.service_price,
            status: order.status,
            payment_status: order.payment_status,
            created_at: order.created_at,
            updated_at: order.created_at, // Use same as created_at for mock
            customer_email: order.requirements.email || '',
            customer_phone: order.requirements.phone || '',
            website_url: order.requirements.website_url || '',
            business_concerns: order.requirements.business_concerns || '',
            preferred_consultation_time: order.requirements.preferred_consultation_time || '',
            additional_notes: order.requirements.additional_notes || '',
            social_accounts: order.requirements.social_accounts || null
          }))
          
          console.log('✅ Mock orders with requirements returned:', ordersWithRequirements.length)
          return { rows: ordersWithRequirements }
        }

        // Mock customer preferences query
        if (sql.includes('customer_email') || sql.includes('preferences')) {
          const preferences = [
            { customer_email: 'test1@example.com', service_count: 1, total_spent: 29.99, preferred_service: 'health-check' },
            { customer_email: 'test2@example.com', service_count: 1, total_spent: 29.99, preferred_service: 'health-check' },
            { customer_email: 'test3@example.com', service_count: 1, total_spent: 49.99, preferred_service: 'strategy-package' },
            { customer_email: 'test4@example.com', service_count: 1, total_spent: 49.99, preferred_service: 'strategy-package' },
            { customer_email: 'test5@example.com', service_count: 1, total_spent: 99.99, preferred_service: 'transformation-blueprint' },
            { customer_email: 'test6@example.com', service_count: 1, total_spent: 199.99, preferred_service: 'strategy-consultation' },
          ]
          return { rows: preferences }
        }

        // Mock conversion funnel query
        if (sql.includes('funnel') || sql.includes('conversion')) {
          const funnel = [
            { service_id: 'health-check', total_quotes: 5, completed_orders: 2, conversion_rate: 40.0 },
            { service_id: 'strategy-package', total_quotes: 4, completed_orders: 2, conversion_rate: 50.0 },
            { service_id: 'transformation-blueprint', total_quotes: 2, completed_orders: 1, conversion_rate: 50.0 },
            { service_id: 'strategy-consultation', total_quotes: 3, completed_orders: 1, conversion_rate: 33.33 }
          ]
          return { rows: funnel }
        }

        // Mock simple orders query
        if (sql.includes('FROM service_orders') && !sql.includes('LEFT JOIN')) {
          console.log('✅ Mock simple orders returned:', mockOrders.length)
          return { rows: mockOrders }
        }

        // Mock customers query
        if (sql.includes('FROM users') || sql.includes('customer')) {
          const customers = [
            { customer_email: 'test1@example.com', first_name: 'Test', last_name: 'User 1', phone: '+1234567890', company: 'Test Co 1', total_orders: 1, total_spent: 29.99, first_order: '2024-11-01T10:00:00Z', last_order: '2024-11-01T10:00:00Z' },
            { customer_email: 'test2@example.com', first_name: 'Test', last_name: 'User 2', phone: null, company: 'Test Co 2', total_orders: 1, total_spent: 29.99, first_order: '2024-11-15T14:30:00Z', last_order: '2024-11-15T14:30:00Z' },
            { customer_email: 'test3@example.com', first_name: 'Test', last_name: 'User 3', phone: '+1234567891', company: 'Test Co 3', total_orders: 1, total_spent: 49.99, first_order: '2024-10-15T11:20:00Z', last_order: '2024-10-15T11:20:00Z' }
          ]
          return { rows: customers }
        }

        // Mock revenue query
        if (sql.includes('revenue') || sql.includes('SUM(service_price)')) {
          const revenue = [
            { period: '2024-10', total_revenue: 149.98, order_count: 2, avg_order_value: 74.99 },
            { period: '2024-11', total_revenue: 279.97, order_count: 4, avg_order_value: 69.99 },
            { period: '2024-12', total_revenue: 0, order_count: 0, avg_order_value: 0 }
          ]
          return { rows: revenue }
        }

        // Default response for unhandled queries
        console.log('⚠️ Unhandled query:', sql.substring(0, 100))
        return { rows: [] }
      },
      release: () => {
        console.log('🔌 Mock database connection released')
      }
    }
  }

  static getAllOrders() {
    return mockOrders
  }

  static clearOrders() {
    mockOrders = []
  }

  static getOrderCount() {
    return mockOrders.length
  }
}

// Mock pool for development
export const mockPool = {
  connect: MockDatabase.connect,
  on: (event: string, callback: () => void) => {
    if (event === 'connect') {
      console.log('🎭 Mock PostgreSQL database connected (development mode)')
      callback()
    }
    if (event === 'error') {
      // Don't call error callback in mock mode
    }
  }
}
