import { NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET() {
  try {
    // Basic health checks
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: 'checking',
        ai_service: process.env.GOOGLE_AI_API_KEY ? 'available' : 'unavailable',
        static_assets: 'ok'
      }
    };

    // Test database connection
    try {
      if (process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'development') {
        healthStatus.checks.database = 'mock';
      } else if (process.env.DATABASE_URL) {
        // Test database connection with a simple query
        await pool.query('SELECT 1');
        healthStatus.checks.database = 'connected';
      } else {
        healthStatus.checks.database = 'not_configured';
      }
    } catch (dbError) {
      healthStatus.checks.database = 'error';
      console.error('Database health check failed:', dbError);
    }

    // Test AI service if available
    if (process.env.GOOGLE_AI_API_KEY) {
      try {
        // In production, we mark as configured if the API key exists
        // A full test would require an actual API call
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
