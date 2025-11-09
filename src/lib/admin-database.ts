import pool from './database'

export interface AdminOrder {
  id: string
  service_id: string
  service_title: string
  service_price: number
  status: string
  payment_status: string
  created_at: string
  updated_at: string
  customer_email: string
  customer_phone?: string
  website_url: string
  business_concerns?: string
  preferred_consultation_time?: string
  additional_notes?: string
  social_accounts?: unknown
}

export interface OrderStatusUpdate {
  orderId: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  notes?: string
}

export interface CustomerSummary {
  email: string
  total_orders: number
  total_spent: number
  last_order_date?: string
}

export interface Customer {
  customer_id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  company?: string
  created_at: string
  total_orders: number
  total_spent: number
  last_order_date?: string
}

export interface RevenueData {
  date: string
  service_id: string
  service_title: string
  orders_count: number
  total_revenue: number
  average_order_value: number
}

export interface ServiceStats {
  service_id: string
  service_title: string
  order_count: number
  total_revenue: number
  average_price: number
  completed_count: number
}

export interface DetailedServiceAnalytics {
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
}

export interface ServiceTrend {
  date: string
  service_id: string
  service_title: string
  daily_orders: number
  daily_revenue: number
  daily_completed: number
}

export interface CustomerServicePreference {
  service_id: string
  service_title: string
  unique_customers: number
  total_orders: number
  total_revenue: number
  avg_customer_spend: number
  avg_orders_per_customer: number
}

export interface ServiceConversionFunnel {
  service_id: string
  service_title: string
  total_started: number
  total_progressed: number
  total_completed: number
  progress_rate: number
  completion_rate: number
  finish_rate: number
}

export class AdminDatabase {
  // Get all orders with customer details
  static async getAllOrders(limit = 50, offset = 0): Promise<AdminOrder[]> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          so.id,
          so.service_id,
          so.service_title,
          so.service_price,
          so.status,
          so.payment_status,
          so.created_at,
          so.updated_at,
          sr.email as customer_email,
          sr.phone as customer_phone,
          sr.website_url,
          sr.business_concerns,
          sr.preferred_consultation_time,
          sr.additional_notes,
          sr.social_accounts
        FROM service_orders so
        LEFT JOIN service_requirements sr ON so.id = sr.order_id
        ORDER BY so.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset])
      
      return result.rows as AdminOrder[]
    } finally {
      client.release()
    }
  }

  // Get orders by status
  static async getOrdersByStatus(status: string): Promise<AdminOrder[]> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          so.id,
          so.service_id,
          so.service_title,
          so.service_price,
          so.status,
          so.payment_status,
          so.created_at,
          so.updated_at,
          sr.email as customer_email,
          sr.phone as customer_phone,
          sr.website_url,
          sr.business_concerns,
          sr.preferred_consultation_time,
          sr.additional_notes,
          sr.social_accounts
        FROM service_orders so
        LEFT JOIN service_requirements sr ON so.id = sr.order_id
        WHERE so.status = $1
        ORDER BY so.created_at DESC
      `, [status])
      
      return result.rows as AdminOrder[]
    } finally {
      client.release()
    }
  }

  // Update order status
  static async updateOrderStatus(update: OrderStatusUpdate): Promise<boolean> {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Update the order status
      const result = await client.query(`
        UPDATE service_orders 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      `, [update.status, update.orderId])
      
      if (result.rows.length === 0) {
        throw new Error('Order not found')
      }

      // Log the status change (you could create a separate audit table)
      console.log(`Order ${update.orderId} status updated to ${update.status}`)
      
      await client.query('COMMIT')
      return true
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error updating order status:', error)
      return false
    } finally {
      client.release()
    }
  }

  // Get customer summary data
  static async getCustomerSummaries(): Promise<CustomerSummary[]> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          sr.email,
          COUNT(so.id) as total_orders,
          SUM(so.service_price) as total_spent,
          MAX(so.created_at) as latest_order_date,
          jsonb_object_agg(so.status, status_counts.count) as status_breakdown
        FROM service_requirements sr
        JOIN service_orders so ON sr.order_id = so.id
        LEFT JOIN (
          SELECT 
            sr2.email,
            so2.status,
            COUNT(*) as count
          FROM service_requirements sr2
          JOIN service_orders so2 ON sr2.order_id = so2.id
          GROUP BY sr2.email, so2.status
        ) status_counts ON sr.email = status_counts.email
        GROUP BY sr.email
        ORDER BY total_spent DESC
      `)
      
      return result.rows as CustomerSummary[]
    } finally {
      client.release()
    }
  }

  // Get orders summary stats
  static async getOrderStats() {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
          SUM(service_price) as total_revenue,
          AVG(service_price) as average_order_value,
          COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as orders_last_30_days
        FROM service_orders
      `)
      
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  // Get service performance data
  static async getServiceStats() {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          service_id,
          service_title,
          COUNT(*) as order_count,
          SUM(service_price) as total_revenue,
          AVG(service_price) as average_price,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
        FROM service_orders
        GROUP BY service_id, service_title
        ORDER BY order_count DESC
      `)
      
      return result.rows
    } finally {
      client.release()
    }
  }

  // Get all customers
  static async getAllCustomers(limit = 50, offset = 0): Promise<Customer[]> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          c.id as customer_id,
          c.email,
          c.first_name,
          c.last_name,
          c.phone,
          c.company,
          c.created_at,
          COUNT(so.id) as total_orders,
          SUM(so.service_price) as total_spent,
          MAX(so.created_at) as last_order_date
        FROM customers c
        LEFT JOIN service_requirements sr ON c.id = sr.customer_id
        LEFT JOIN service_orders so ON sr.order_id = so.id
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset])
      
      return result.rows as Customer[]
    } finally {
      client.release()
    }
  }

  // Get filtered orders by date range
  static async getFilteredOrders(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<AdminOrder[]> {
    const client = await pool.connect()
    
    try {
      const conditions: string[] = [
        'so.created_at >= $1',
        'so.created_at <= $2'
      ]
  const params: (string | string[])[] = [startDate, endDate + ' 23:59:59']

      if (serviceIds && serviceIds.length) {
        conditions.push(`so.service_id = ANY($${params.length + 1})`)
        params.push(serviceIds)
      }
      if (statuses && statuses.length) {
        conditions.push(`so.status = ANY($${params.length + 1})`)
        params.push(statuses)
      }

      const sql = `
        SELECT 
          so.id,
          so.service_id,
          so.service_title,
          so.service_price,
          so.status,
          so.payment_status,
          so.created_at,
          so.updated_at,
          sr.email as customer_email,
          sr.phone as customer_phone,
          sr.website_url,
          sr.business_concerns,
          sr.preferred_consultation_time,
          sr.additional_notes,
          sr.social_accounts
        FROM service_orders so
        LEFT JOIN service_requirements sr ON sr.order_id = so.id
        WHERE ${conditions.join(' AND ')}
        ORDER BY so.created_at DESC
      `

      const result = await client.query(sql, params)
      
      return result.rows as AdminOrder[]
    } finally {
      client.release()
    }
  }

  // Get customers in date range
  static async getCustomersInDateRange(startDate: string, endDate: string): Promise<Customer[]> {
    const client = await pool.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          DISTINCT sr.email as customer_id,
          sr.email,
          sr.first_name,
          sr.last_name,
          sr.phone,
          sr.company,
          MIN(sr.created_at) as created_at,
          COUNT(so.id) as total_orders,
          COALESCE(SUM(so.service_price), 0) as total_spent,
          MAX(so.created_at) as last_order_date
        FROM service_requirements sr
        LEFT JOIN service_orders so ON sr.order_id = so.id
        WHERE sr.created_at >= $1 AND sr.created_at <= $2
        GROUP BY sr.email, sr.first_name, sr.last_name, sr.phone, sr.company
        ORDER BY created_at DESC
      `, [startDate, endDate + ' 23:59:59'])
      
      return result.rows as Customer[]
    } finally {
      client.release()
    }
  }

  // Get revenue data in date range
  static async getRevenueInDateRange(startDate: string, endDate: string, serviceIds?: string[]): Promise<RevenueData[]> {
    const client = await pool.connect()
    
    try {
      const conditions: string[] = [
        'so.created_at >= $1',
        'so.created_at <= $2'
      ]
  const params: (string | string[])[] = [startDate, endDate + ' 23:59:59']
      if (serviceIds && serviceIds.length) {
        conditions.push(`so.service_id = ANY($${params.length + 1})`)
        params.push(serviceIds)
      }
      const sql = `
        SELECT 
          DATE(so.created_at) as date,
          so.service_id,
          so.service_title,
          COUNT(*) as orders_count,
          SUM(so.service_price) as total_revenue,
          AVG(so.service_price) as average_order_value
        FROM service_orders so
        WHERE ${conditions.join(' AND ')}
        GROUP BY DATE(so.created_at), so.service_id, so.service_title
        ORDER BY date DESC, total_revenue DESC
      `
      const result = await client.query(sql, params)
      
      return result.rows as RevenueData[]
    } finally {
      client.release()
    }
  }

  // Get service stats in date range
  static async getServiceStatsInDateRange(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<ServiceStats[]> {
    const client = await pool.connect()
    
    try {
      const conditions: string[] = [
        'created_at >= $1',
        'created_at <= $2'
      ]
  const params: (string | string[])[] = [startDate, endDate + ' 23:59:59']
      if (serviceIds && serviceIds.length) {
        conditions.push(`service_id = ANY($${params.length + 1})`)
        params.push(serviceIds)
      }
      if (statuses && statuses.length) {
        conditions.push(`status = ANY($${params.length + 1})`)
        params.push(statuses)
      }
      const sql = `
        SELECT 
          service_id,
          service_title,
          COUNT(*) as order_count,
          SUM(service_price) as total_revenue,
          AVG(service_price) as average_price,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
        FROM service_orders
        WHERE ${conditions.join(' AND ')}
        GROUP BY service_id, service_title
        ORDER BY order_count DESC
      `
      const result = await client.query(sql, params)
      
      return result.rows as ServiceStats[]
    } finally {
      client.release()
    }
  }

  // Get detailed service analytics with package-specific insights
  static async getDetailedServiceAnalytics(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<DetailedServiceAnalytics[]> {
    const client = await pool.connect()
    
    try {
      const conditions: string[] = [
        'so.created_at >= $1',
        'so.created_at <= $2'
      ]
  const params: (string | string[])[] = [startDate, endDate + ' 23:59:59']
      if (serviceIds && serviceIds.length) {
        conditions.push(`so.service_id = ANY($${params.length + 1})`)
        params.push(serviceIds)
      }
      if (statuses && statuses.length) {
        conditions.push(`so.status = ANY($${params.length + 1})`)
        params.push(statuses)
      }
      const sql = `
        SELECT 
          so.service_id,
          so.service_title,
          COUNT(*) as total_orders,
          SUM(so.service_price) as total_revenue,
          AVG(so.service_price) as average_price,
          MIN(so.service_price) as min_price,
          MAX(so.service_price) as max_price,
          COUNT(CASE WHEN so.status = 'completed' THEN 1 END) as completed_orders,
          COUNT(CASE WHEN so.status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN so.status = 'processing' THEN 1 END) as processing_orders,
          COUNT(CASE WHEN so.status = 'cancelled' THEN 1 END) as cancelled_orders,
          ROUND(AVG(CASE WHEN so.status = 'completed' THEN 1.0 ELSE 0.0 END) * 100, 2) as completion_rate,
          ROUND(AVG(CASE WHEN so.status = 'cancelled' THEN 1.0 ELSE 0.0 END) * 100, 2) as cancellation_rate,
          COUNT(DISTINCT sr.email) as unique_customers,
          ROUND(SUM(so.service_price) / NULLIF(COUNT(DISTINCT sr.email),0), 2) as revenue_per_customer,
          DATE_PART('day', AVG(so.updated_at - so.created_at)) as avg_completion_days
        FROM service_orders so
        LEFT JOIN service_requirements sr ON sr.order_id = so.id
        WHERE ${conditions.join(' AND ')}
        GROUP BY so.service_id, so.service_title
        ORDER BY total_revenue DESC
      `
      const result = await client.query(sql, params)
      
      return result.rows as DetailedServiceAnalytics[]
    } finally {
      client.release()
    }
  }

  // Get service performance trends over time
  static async getServiceTrends(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<ServiceTrend[]> {
    const client = await pool.connect()
    
    try {
      const conditions: string[] = [
        'so.created_at >= $1',
        'so.created_at <= $2'
      ]
  const params: (string | string[])[] = [startDate, endDate + ' 23:59:59']
      if (serviceIds && serviceIds.length) {
        conditions.push(`so.service_id = ANY($${params.length + 1})`)
        params.push(serviceIds)
      }
      if (statuses && statuses.length) {
        conditions.push(`so.status = ANY($${params.length + 1})`)
        params.push(statuses)
      }
      const sql = `
        SELECT 
          DATE(so.created_at) as date,
          so.service_id,
          so.service_title,
          COUNT(*) as daily_orders,
          SUM(so.service_price) as daily_revenue,
          COUNT(CASE WHEN so.status = 'completed' THEN 1 END) as daily_completed
        FROM service_orders so
        WHERE ${conditions.join(' AND ')}
        GROUP BY DATE(so.created_at), so.service_id, so.service_title
        ORDER BY date DESC, daily_revenue DESC
      `
      const result = await client.query(sql, params)
      
      return result.rows as ServiceTrend[]
    } finally {
      client.release()
    }
  }

  // Get customer service preferences analysis
  static async getCustomerServicePreferences(startDate: string, endDate: string, serviceIds?: string[]): Promise<CustomerServicePreference[]> {
    const client = await pool.connect()
    
    try {
      const conditions: string[] = [
        'so.created_at >= $1',
        'so.created_at <= $2'
      ]
  const params: (string | string[])[] = [startDate, endDate + ' 23:59:59']
      if (serviceIds && serviceIds.length) {
        conditions.push(`so.service_id = ANY($${params.length + 1})`)
        params.push(serviceIds)
      }
      const sql = `
        WITH customer_orders AS (
          SELECT 
            sr.email,
            sr.first_name,
            sr.last_name,
            so.service_id,
            so.service_title,
            so.service_price,
            COUNT(*) as order_count,
            SUM(so.service_price) as total_spent
          FROM service_orders so
          LEFT JOIN service_requirements sr ON sr.order_id = so.id
          WHERE ${conditions.join(' AND ')}
          GROUP BY sr.email, sr.first_name, sr.last_name, so.service_id, so.service_title, so.service_price
        )
        SELECT 
          service_id,
          service_title,
            COUNT(DISTINCT email) as unique_customers,
            SUM(order_count) as total_orders,
            SUM(total_spent) as total_revenue,
            ROUND(AVG(total_spent), 2) as avg_customer_spend,
            ROUND(SUM(order_count)::float / COUNT(DISTINCT email), 2) as avg_orders_per_customer
        FROM customer_orders
        GROUP BY service_id, service_title
        ORDER BY unique_customers DESC
      `
      const result = await client.query(sql, params)
      
      return result.rows as CustomerServicePreference[]
    } finally {
      client.release()
    }
  }

  // Get service conversion funnel analysis
  static async getServiceConversionFunnel(startDate: string, endDate: string, serviceIds?: string[], statuses?: string[]): Promise<ServiceConversionFunnel[]> {
    const client = await pool.connect()
    
    try {
      const conditions: string[] = [
        'so.created_at >= $1',
        'so.created_at <= $2'
      ]
  const params: (string | string[])[] = [startDate, endDate + ' 23:59:59']
      if (serviceIds && serviceIds.length) {
        conditions.push(`so.service_id = ANY($${params.length + 1})`)
        params.push(serviceIds)
      }
      if (statuses && statuses.length) {
        conditions.push(`so.status = ANY($${params.length + 1})`)
        params.push(statuses)
      }
      const sql = `
        SELECT 
          so.service_id,
          so.service_title,
          COUNT(*) as total_started,
          COUNT(CASE WHEN so.status IN ('processing', 'completed') THEN 1 END) as total_progressed,
          COUNT(CASE WHEN so.status = 'completed' THEN 1 END) as total_completed,
          ROUND(
            COUNT(CASE WHEN so.status IN ('processing', 'completed') THEN 1 END)::float / 
            COUNT(*)::float * 100, 2
          ) as progress_rate,
          ROUND(
            COUNT(CASE WHEN so.status = 'completed' THEN 1 END)::float / 
            COUNT(*)::float * 100, 2
          ) as completion_rate,
          ROUND(
            COUNT(CASE WHEN so.status = 'completed' THEN 1 END)::float / 
            COUNT(CASE WHEN so.status IN ('processing', 'completed') THEN 1 END)::float * 100, 2
          ) as finish_rate
        FROM service_orders so
        WHERE ${conditions.join(' AND ')}
        GROUP BY so.service_id, so.service_title
        ORDER BY completion_rate DESC
      `
      const result = await client.query(sql, params)
      
      return result.rows as ServiceConversionFunnel[]
    } finally {
      client.release()
    }
  }
}
