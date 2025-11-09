'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AdminOrder {
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

function OrdersPageContent() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status')

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      
      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, fetchOrders])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      })

      if (response.ok) {
        await fetchOrders() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600">
              {statusFilter ? `Showing ${statusFilter} orders` : 'All orders'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={!statusFilter ? "default" : "outline"}
              onClick={() => window.location.href = '/admin/orders'}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'pending' ? "default" : "outline"}
              onClick={() => window.location.href = '/admin/orders?status=pending'}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'processing' ? "default" : "outline"}
              onClick={() => window.location.href = '/admin/orders?status=processing'}
            >
              Processing
            </Button>
            <Button
              variant={statusFilter === 'completed' ? "default" : "outline"}
              onClick={() => window.location.href = '/admin/orders?status=completed'}
            >
              Completed
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                {statusFilter ? `No ${statusFilter} orders found` : 'No orders found'}
              </div>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.service_title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Order #{order.id.slice(-8)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Customer:</strong> {order.customer_email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Website:</strong> {order.website_url}
                        </p>
                        {order.customer_phone && (
                          <p className="text-sm text-gray-600">
                            <strong>Phone:</strong> {order.customer_phone}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <strong>Price:</strong> ${order.service_price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Created:</strong> {formatDate(order.created_at)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Updated:</strong> {formatDate(order.updated_at)}
                        </p>
                        {order.preferred_consultation_time && (
                          <p className="text-sm text-gray-600">
                            <strong>Preferred Time:</strong> {order.preferred_consultation_time}
                          </p>
                        )}
                      </div>
                    </div>

                    {order.business_concerns && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Business Concerns:</p>
                        <p className="text-sm text-gray-600">{order.business_concerns}</p>
                      </div>
                    )}

                    {order.additional_notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Additional Notes:</p>
                        <p className="text-sm text-gray-600">{order.additional_notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/admin/reports/generate?orderId=${order.id}`}
                    >
                      Generate Report
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  )
}
