import { client } from './prisma'

/**
 * Database Health Monitoring Utilities
 * 
 * This file provides utilities for monitoring database connection health,
 * checking connection pool status, and managing database connections.
 * These functions are essential for maintaining database reliability
 * and troubleshooting connection issues.
 */

/**
 * Checks the database connection health and returns status information
 * 
 * This function performs a simple database query to verify connection
 * health and measures response time for performance monitoring.
 * 
 * Purpose: Monitor database connection health and performance
 * 
 * How it works:
 * 1. Executes a simple SELECT 1 query to test connection
 * 2. Measures response time for performance monitoring
 * 3. Returns detailed health status with timing information
 * 4. Handles connection errors gracefully
 * 
 * Features:
 * - Connection health verification
 * - Response time measurement
 * - Detailed error reporting
 * - Timestamp tracking
 * 
 * Integration:
 * - Used by health check endpoints
 * - Part of monitoring and debugging tools
 * - Essential for database reliability
 * - Available via npm scripts for manual testing
 * 
 * @returns Promise with database health status and performance metrics
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
 * 
 * This function queries the database to retrieve information about
 * active connections and connection pool limits for monitoring
 * and capacity planning purposes.
 * 
 * Purpose: Monitor database connection pool utilization
 * 
 * How it works:
 * 1. Queries PostgreSQL system tables for connection information
 * 2. Retrieves active connection count and maximum connections
 * 3. Returns connection pool status for monitoring
 * 4. Handles query errors gracefully
 * 
 * Features:
 * - Active connection monitoring
 * - Maximum connection limit tracking
 * - PostgreSQL-specific implementation
 * - Error handling and fallback values
 * 
 * Integration:
 * - Used by monitoring and debugging tools
 * - Part of database health monitoring system
 * - Essential for capacity planning
 * - Helps identify connection pool issues
 * 
 * @returns Promise with connection pool status information
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
    ` as Array<{ active_connections: number; max_connections: number }>
    
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
 * 
 * This function disconnects the current Prisma client to reset
 * the connection pool. It should be used sparingly and only
 * when experiencing persistent connection issues.
 * 
 * Purpose: Reset database connection pool for troubleshooting
 * 
 * How it works:
 * 1. Disconnects the current Prisma client
 * 2. Forces recreation of connection on next use
 * 3. Returns success/failure status
 * 4. Handles disconnection errors gracefully
 * 
 * Features:
 * - Connection pool reset
 * - Error handling and reporting
 * - Success/failure status tracking
 * - Safe disconnection process
 * 
 * Usage Notes:
 * - Use sparingly - only for troubleshooting
 * - Will recreate connection automatically
 * - May cause temporary service interruption
 * - Available via npm scripts for manual use
 * 
 * Integration:
 * - Used by debugging and troubleshooting tools
 * - Part of database maintenance utilities
 * - Essential for connection issue resolution
 * - Available via npm scripts for manual execution
 * 
 * @returns Promise with reset operation status
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
