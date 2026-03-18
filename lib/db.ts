import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if DATABASE_URL is available
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://user:pass@localhost:5432/db') {
    console.warn('DATABASE_URL not configured, database features will be disabled')
    return null
  }
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) globalForPrisma.prisma = prisma
