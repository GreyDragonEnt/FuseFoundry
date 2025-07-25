'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface CartItem {
  id: string
  title: string
  price: string
  description: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  isOpen: false
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item already exists
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state // Don't add duplicate items
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        isOpen: true
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      }
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      }
    case 'HYDRATE':
      return {
        ...state,
        items: action.payload
      }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Save to localStorage when cart changes (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined' && state.items.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    }
  }, [state.items])

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedItems = localStorage.getItem('cartItems')
        if (savedItems) {
          const items = JSON.parse(savedItems)
          if (items.length > 0) {
            dispatch({ type: 'HYDRATE', payload: items })
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    // Return safe defaults during SSR or when provider is not available
    return {
      state: { items: [], isOpen: false },
      dispatch: () => {} // No-op function for SSR safety
    }
  }
  return context
}
