'use client'

import { useState } from 'react'
import { Bot, Lightbulb, Loader2 } from 'lucide-react'

interface AISuggestionProps {
  businessType?: string
  onSuggestionSelect: (suggestion: string) => void
}

export default function AISuggestion({ businessType, onSuggestionSelect }: AISuggestionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const generateSuggestions = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/athena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate 3 specific business inquiry examples that ${businessType ? `a ${businessType} business` : 'businesses'} might ask FuseFoundry about AI transformation, creator partnerships, or growth systems. Format as a simple list, each item under 15 words.`,
          businessContext: 'Lead generation and business inquiry assistance',
          mode: 'teaser'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      
      // Parse the response into individual suggestions
      const suggestionList = data.response
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, ''))
        .filter((line: string) => line.length > 10)
        .slice(0, 3)

      setSuggestions(suggestionList)
    } catch (error) {
      console.error('Error generating suggestions:', error)
      // Fallback suggestions
      setSuggestions([
        "How can AI automation reduce our operational costs?",
        "What's the ROI of implementing creator partnerships?",
        "Can you help us scale from $1M to $10M revenue?"
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Bot className="h-5 w-5 text-catalyst" />
        <h4 className="font-semibold text-foreground">AI Suggestion Assistant</h4>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Not sure what to ask? Let Athena suggest relevant business questions based on your industry.
      </p>

      {suggestions.length === 0 ? (
        <button
          onClick={generateSuggestions}
          disabled={isGenerating}
          className="flex items-center space-x-2 text-molten hover:text-molten/80 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating suggestions...</span>
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4" />
              <span className="text-sm">Get AI-powered suggestions</span>
            </>
          )}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Suggested inquiries:</p>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionSelect(suggestion)}
              className="block w-full text-left text-sm p-2 rounded bg-background hover:bg-muted transition-colors border text-foreground"
            >
              {suggestion}
            </button>
          ))}
          <button
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="text-xs text-muted-foreground hover:text-foreground mt-2"
          >
            Generate new suggestions
          </button>
        </div>
      )}
    </div>
  )
}
