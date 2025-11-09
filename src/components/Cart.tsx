'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, X, Trash2, ExternalLink } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { ServiceFormData } from '@/contexts/CartContext'
import { getTextClasses, getCardClasses } from '@/lib/theme-utils'
import { cn } from '@/lib/utils'
import ServiceForm from './ServiceForm'

export default function Cart() {
  const { state, dispatch } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState<string | null>(null)
  const [submittingOrder, setSubmittingOrder] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering on server
  if (!isMounted) {
    return null
  }

  const totalItems = state.items.length
  const totalPrice = state.items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''))
    return sum + price
  }, 0)

  const handleCheckout = () => {
    if (state.items.length === 1) {
      // Single item - show service form
      const item = state.items[0]
      setShowServiceForm(item.id)
    } else {
      // Multiple items - redirect to contact
      setIsCheckingOut(true)
      setTimeout(() => {
        window.location.href = '/contact'
      }, 1000)
    }
  }

  const handleServiceFormSubmit = async (serviceId: string, formData: ServiceFormData) => {
    setSubmittingOrder(true)
    try {
      const item = state.items.find(i => i.id === serviceId)
      if (!item) return

      const response = await fetch('/api/service-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: item,
          requirements: formData
        })
      })

      if (response.ok) {
        const result = await response.json()
        // Clear cart and show success
        dispatch({ type: 'CLEAR_CART' })
        setShowServiceForm(null)
        // Redirect to success page or show success message
        window.location.href = `/order-success?orderId=${result.orderId}`
      } else {
        throw new Error('Order submission failed')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setSubmittingOrder(false)
    }
  }

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
        className={cn(getCardClasses('elevated'), "fixed top-4 right-4 z-50 shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300")}
      >
        <div className="relative">
          <ShoppingCart className={cn("h-6 w-6", getTextClasses('secondary'))} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-spark text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* Cart Sidebar */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          />
          
          {/* Cart Panel */}
          <div className={cn(getCardClasses(), "absolute right-0 top-0 h-full w-full max-w-md shadow-xl")}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className={cn(getTextClasses('heading'), "text-lg font-semibold")}>
                  Your Cart ({totalItems})
                </h2>
                <button
                  onClick={() => dispatch({ type: 'CLOSE_CART' })}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className={cn("h-5 w-5", getTextClasses('muted'))} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {state.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className={cn("h-12 w-12 mx-auto mb-4", getTextClasses('muted'))} />
                    <p className={getTextClasses('muted')}>Your cart is empty</p>
                    <button
                      onClick={() => dispatch({ type: 'CLOSE_CART' })}
                      className="mt-4 text-spark hover:text-spark/80 font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={item.id} className={cn(getCardClasses('bordered'), "p-4")}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className={cn(getTextClasses('heading'), "font-medium")}>
                              {item.title}
                            </h3>
                            <p className={cn(getTextClasses('muted'), "text-sm mt-1")}>
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-lg font-bold text-spark">
                                {item.price}
                              </span>
                              <button
                                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className={cn(getTextClasses('heading'), "text-lg font-semibold")}>
                      Total: ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-brand-gradient text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isCheckingOut ? (
                      'Processing...'
                    ) : state.items.length === 1 ? (
                      <>
                        Complete Order Details
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                  
                  <p className={cn(getTextClasses('muted'), "text-xs text-center mt-3")}>
                    Secure checkout • 30-day money back guarantee
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <ServiceForm
          serviceId={showServiceForm}
          serviceTitle={state.items.find(item => item.id === showServiceForm)?.title || ''}
          onSubmit={(formData) => handleServiceFormSubmit(showServiceForm, formData)}
          onCancel={() => setShowServiceForm(null)}
          isSubmitting={submittingOrder}
        />
      )}
    </>
  )
}
