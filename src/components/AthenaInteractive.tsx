'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, User, Sparkles, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'athena' | 'system'
  content: string
  timestamp: Date
  isTeaser?: boolean
}

interface AthenaInteractiveProps {
  businessContext?: string
  mode?: 'teaser' | 'full'
  maxTeaserMessages?: number
}

export default function AthenaInteractive({ 
  businessContext, 
  mode = 'teaser',
  maxTeaserMessages = 3 
}: AthenaInteractiveProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'athena',
      content: mode === 'teaser' 
        ? "Hello! I'm Athena, your AI business strategist. I can provide you with valuable insights about AI transformation, creator partnerships, and growth systems. Ask me anything to get started! 🚀"
        : "Hello! I'm Athena, your AI business strategist. I specialize in AI transformation, creator partnerships, and growth systems. What business challenge can I help you solve today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [teaserCount, setTeaserCount] = useState(0)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Check if we've reached the teaser limit
    if (mode === 'teaser' && teaserCount >= maxTeaserMessages) {
      setShowLeadCapture(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/athena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input.trim(),
          businessContext,
          mode
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from Athena')
      }

      const data = await response.json()

      const athenaMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'athena',
        content: data.response,
        timestamp: new Date(),
        isTeaser: mode === 'teaser'
      }

      setMessages(prev => [...prev, athenaMessage])
      
      // Increment teaser count if in teaser mode
      if (mode === 'teaser') {
        setTeaserCount(prev => prev + 1)
        
        // Show lead capture hint after 2 teaser responses
        if (teaserCount + 1 >= maxTeaserMessages - 1) {
          setTimeout(() => {
            const hintMessage: Message = {
              id: (Date.now() + 2).toString(),
              type: 'system',
              content: "🔒 Want deeper insights tailored to your specific business? Share your details to unlock Athena's full analytical power and get a comprehensive strategy session!",
              timestamp: new Date()
            }
            setMessages(prev => [...prev, hintMessage])
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Athena API Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'athena',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact our team for immediate assistance.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = [
    "How can AI transform my business operations?",
    "What's the best creator partnership strategy?",
    "How do I scale my business with limited resources?",
    "What growth metrics should I focus on?"
  ]

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-molten/10 via-spark/10 to-catalyst/10 p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-8 w-8 text-catalyst" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Athena AI</h3>
            <p className="text-sm text-muted-foreground">Your Business Strategist</p>
          </div>
          <Sparkles className="h-5 w-5 text-spark ml-auto" />
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 
              message.type === 'system' ? 'justify-center' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-molten text-white'
                  : message.type === 'system'
                  ? 'bg-gradient-to-r from-spark/20 to-catalyst/20 border border-spark/30 text-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'athena' && (
                  <Bot className="h-4 w-4 mt-0.5 text-catalyst flex-shrink-0" />
                )}
                {message.type === 'user' && (
                  <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                )}
                {message.type === 'system' && (
                  <Lock className="h-4 w-4 mt-0.5 text-spark flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.type === 'system' && (
                    <div className="mt-3 flex justify-center">
                      <Link 
                        href="/contact?source=athena-chat"
                        className="inline-flex items-center px-4 py-2 bg-molten text-white rounded-lg hover:bg-molten/90 transition-colors text-sm font-medium"
                      >
                        Get Full Analysis
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                  <p className={`text-xs mt-1 opacity-70`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-catalyst" />
                <Loader2 className="h-4 w-4 animate-spin text-catalyst" />
                <span className="text-sm text-muted-foreground">Athena is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Lead Capture Overlay */}
        {showLeadCapture && mode === 'teaser' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full">
              <div className="text-center">
                <Lock className="h-12 w-12 text-molten mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Unlock Athena&apos;s Full Power
                </h3>
                <p className="text-muted-foreground mb-6">
                  You&apos;ve reached the preview limit. Share your business details to get comprehensive, 
                  personalized insights from Athena.
                </p>
                <div className="flex flex-col gap-3">
                  <Link 
                    href="/contact?source=athena-limit"
                    className="btn-primary flex items-center justify-center"
                  >
                    Get Full Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setShowLeadCapture(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Continue with limited preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground mb-3">Try asking Athena:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-left text-sm p-2 rounded bg-background hover:bg-muted transition-colors border text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        {mode === 'teaser' && teaserCount >= maxTeaserMessages ? (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-molten/10 to-catalyst/10 rounded-lg border border-molten/20">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-molten" />
              <span className="text-sm text-foreground">
                Preview limit reached. Get full access for unlimited insights.
              </span>
            </div>
            <Link 
              href="/contact?source=athena-preview-limit"
              className="btn-primary text-sm px-4 py-2"
            >
              Unlock Now
            </Link>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'teaser' 
                  ? `Ask Athena anything... (${maxTeaserMessages - teaserCount} preview${maxTeaserMessages - teaserCount !== 1 ? 's' : ''} remaining)`
                  : "Ask Athena about your business..."
              }
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-molten"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-molten text-white rounded-lg hover:bg-molten/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
