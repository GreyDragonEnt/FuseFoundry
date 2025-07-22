import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For static export builds, return a service unavailable response
    if (process.env.GITHUB_PAGES === 'true') {
      return NextResponse.json(
        { 
          error: 'AI service temporarily unavailable',
          message: 'Please contact us directly for assistance.'
        },
        { status: 503 }
      );
    }

    // Check if API key is available
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI service temporarily unavailable',
          message: 'Please contact us directly for assistance.'
        },
        { status: 503 }
      );
    }

    // Dynamically import gemini only when API key is available
    const { gemini } = await import('@/lib/gemini');
    
    const { prompt, businessContext, mode = 'teaser' } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let enhancedPrompt: string;

    if (mode === 'teaser') {
      // Teaser mode for public pages - limited insights that encourage lead capture
      enhancedPrompt = `As Athena, FuseFoundry's AI business strategist, provide a compelling but LIMITED preview response to: "${prompt}"

IMPORTANT GUIDELINES:
- Give 2-3 valuable but high-level insights (max 150 words)
- Mention specific benefits but don't give away the complete strategy
- End with a clear call-to-action to share business details for a comprehensive analysis
- Reference FuseFoundry's expertise in AI transformation, creator partnerships, and growth systems
- Create urgency and demonstrate deep expertise without giving away everything

Example structure:
1. Brief valuable insight
2. Hint at deeper analysis available
3. Clear CTA to get full analysis

Keep it professional, intriguing, and conversion-focused.`;
    } else {
      // Full mode for authenticated users or after lead capture
      enhancedPrompt = businessContext 
        ? `As Athena, FuseFoundry's AI business strategist, provide expert insights for this business context: "${businessContext}". 

User question: ${prompt}

Provide a comprehensive, actionable response that demonstrates expertise in:
- AI-powered business transformation
- Creator economy strategies  
- Growth system optimization
- Strategic planning and execution

Keep the response professional, insightful, and specific to their business needs.`
        : `As Athena, FuseFoundry's AI business strategist, provide expert business insights for: ${prompt}

Focus on actionable strategies involving AI innovation, creator partnerships, and growth systems.`;
    }

    const response = await gemini.getSimpleResponse(enhancedPrompt);
    
    return NextResponse.json({ 
      response,
      mode,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Athena API Error:', error);
    return NextResponse.json(
      { error: 'Athena is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
