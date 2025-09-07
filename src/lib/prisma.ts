import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

/**
 * Prisma Database Client Configuration
 * 
 * This file configures the Prisma database client with proper singleton
 * pattern implementation to prevent multiple database connections in
 * development environments and ensure efficient connection pooling.
 * 
 * Purpose: Provide singleton Prisma client for database operations
 * 
 * How it works:
 * 1. Declares global Prisma client variable for singleton pattern
 * 2. Creates new PrismaClient instance if none exists globally
 * 3. Reuses existing client in development to prevent connection issues
 * 4. Ensures single database connection across the application
 * 
 * Features:
 * - Singleton pattern implementation
 * - Development environment optimization
 * - Connection pooling management
 * - Type-safe database operations
 * 
 * Environment Handling:
 * - Development: Reuses global client to prevent multiple connections
 * - Production: Creates new client instance for each process
 * - Prevents "too many connections" errors in development
 * 
 * Integration:
 * - Used by all server actions for database operations
 * - Provides type-safe database access
 * - Essential for data persistence layer
 * - Part of database infrastructure
 * 
 * @returns Configured Prisma client instance
 */
export const client = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client
