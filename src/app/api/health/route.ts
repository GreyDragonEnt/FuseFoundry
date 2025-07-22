import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: 'not_configured', // Will be updated when database is added
        ai_service: process.env.GOOGLE_AI_API_KEY ? 'available' : 'unavailable',
        static_assets: 'ok'
      }
    };

    // Test AI service if available
    if (process.env.GOOGLE_AI_API_KEY && process.env.NODE_ENV === 'production') {
      try {
        // Quick test of Gemini API (without actually making a request)
        healthStatus.checks.ai_service = 'configured';
      } catch {
        healthStatus.checks.ai_service = 'error';
      }
    }

    return NextResponse.json(healthStatus, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
