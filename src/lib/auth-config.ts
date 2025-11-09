/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For now, we'll use a simple admin check
        // In production, you'd want to check against a database
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@fusefoundry.dev'
        const adminPassword = process.env.ADMIN_PASSWORD || 'FuseFoundry2025!'

        if (credentials.email === adminEmail) {
          const isValidPassword = await bcrypt.compare(credentials.password, await bcrypt.hash(adminPassword, 12))
          
          if (isValidPassword || credentials.password === adminPassword) {
            return {
              id: '1',
              email: adminEmail,
              name: 'FuseFoundry Admin',
              role: 'admin'
            }
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}
