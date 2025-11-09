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

    const stats = await AdminDatabase.getOrderStats()
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
