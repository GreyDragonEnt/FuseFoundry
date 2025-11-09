import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import { AdminDatabase } from '@/lib/admin-database'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceStats = await AdminDatabase.getServiceStats()
    return NextResponse.json(serviceStats)
    
  } catch (error) {
    console.error('Error fetching service stats:', error)
    return NextResponse.json({ error: 'Failed to fetch service stats' }, { status: 500 })
  }
}
