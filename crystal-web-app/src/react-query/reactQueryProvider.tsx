"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

type Props = {
  children?: React.ReactNode;
}

/**
 * React Query Client Configuration
 * 
 * This creates a new QueryClient instance that will be used throughout the application
 * for data fetching, caching, and state management. The QueryClient is the central
 * hub for all React Query operations.
 */
const client = new QueryClient();

/**
 * React Query Provider Component
 * 
 * This component provides React Query functionality to the entire application by
 * wrapping all child components with the QueryClientProvider. It enables:
 * 
 * 1. Data Fetching: useQuery for GET operations with automatic caching
 * 2. Data Mutations: useMutation for POST/PUT/DELETE operations with optimistic updates
 * 3. Cache Management: Automatic invalidation and background refetching
 * 4. Server State: Centralized state management for server-side data
 * 5. Performance: Reduces redundant API calls through intelligent caching
 * 
 * Purpose: Provide React Query context to all components in the application
 * 
 * How it works:
 * - Wraps the entire application with QueryClientProvider
 * - Provides the QueryClient instance to all child components
 * - Enables React Query hooks (useQuery, useMutation, etc.) throughout the app
 * - Manages global cache and state for server-side data
 * 
 * Integration:
 * - Used in the root layout to provide global React Query functionality
 * - Essential for all data fetching and mutation operations
 * - Works with server actions for complete data management
 * - Provides foundation for optimistic updates and caching
 * 
 * @param children - Child components to provide React Query context to
 * @returns JSX element with React Query provider context
 */
function ReactQueryProvider({ children }: Props) {
  return(
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;