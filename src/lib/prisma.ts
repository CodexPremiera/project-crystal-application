import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pool configuration
    __internal: {
      engine: {
        connectionLimit: 5,
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          destroyTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 1000,
          createRetryIntervalMillis: 200,
        },
      },
    },
  })
}

export const client = globalThis.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

// Graceful shutdown
process.on('beforeExit', async () => {
  await client.$disconnect()
})

process.on('SIGINT', async () => {
  await client.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await client.$disconnect()
  process.exit(0)
})