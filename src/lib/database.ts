import { Pool } from 'pg'
import { mockPool } from './mock-database'

// Use mock database in development mode if NODE_ENV is development
const isDevelopment = process.env.NODE_ENV === 'development'
const useMockDatabase = isDevelopment && (process.env.USE_MOCK_DB === 'true' || !process.env.DATABASE_URL)

let pool: Pool | typeof mockPool

if (useMockDatabase) {
  console.log('🎭 Using mock database for development')
  pool = mockPool
} else {
  console.log('🗄️ Connecting to PostgreSQL database...')
  
  // Create a PostgreSQL connection pool
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
  })

  // Test the connection
  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database')
  })

  pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
}

export default pool
