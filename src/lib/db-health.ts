import { client } from './prisma'

/**
 * Checks the database connection health and returns status information
 * @returns Promise<{ status: 'healthy' | 'unhealthy', message: string, timestamp: Date }>
 */
export async function checkDatabaseHealth() {
  const startTime = Date.now()
  
  try {
    // Simple query to test connection
    await client.$queryRaw`SELECT 1`
    
    const responseTime = Date.now() - startTime
    
    return {
      status: 'healthy' as const,
      message: `Database connection successful. Response time: ${responseTime}ms`,
      timestamp: new Date(),
      responseTime
    }
  } catch (error) {
    return {
      status: 'unhealthy' as const,
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Gets current database connection pool status
 * @returns Promise<{ activeConnections: number, idleConnections: number }>
 */
export async function getConnectionPoolStatus() {
  try {
    // This is a simplified version - actual implementation depends on your database
    const result = await client.$queryRaw`
      SELECT 
        count(*) as active_connections,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
      FROM pg_stat_activity 
      WHERE state = 'active'
    `
    
    return {
      activeConnections: result[0]?.active_connections || 0,
      maxConnections: result[0]?.max_connections || 0
    }
  } catch (error) {
    return {
      activeConnections: 0,
      maxConnections: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Resets the database connection pool
 * Use this sparingly - only when experiencing connection issues
 */
export async function resetConnectionPool() {
  try {
    await client.$disconnect()
    // The singleton will recreate the connection on next use
    return { success: true, message: 'Connection pool reset successfully' }
  } catch (error) {
    return { 
      success: false, 
      message: `Failed to reset connection pool: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }
  }
}
