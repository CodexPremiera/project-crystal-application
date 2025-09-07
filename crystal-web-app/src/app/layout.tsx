import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/theme";
import ReactQueryProvider from "@/react-query/reactQueryProvider";
import React from "react";
import {ReduxProvider} from "@/redux/provider";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Opal",
  description: "Share AI powered vidoes with your friends",
};

/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps the entire application.
 * It provides essential providers and configuration for the application
 * including authentication, theming, state management, and data fetching.
 * 
 * Purpose: Set up global application providers and configuration
 * 
 * How it works:
 * 1. Configures Google Fonts (Manrope) with multiple weights
 * 2. Sets up Clerk authentication provider for user management
 * 3. Provides theme system with system preference detection
 * 4. Integrates Redux for global state management
 * 5. Sets up React Query for server state management
 * 6. Applies global CSS and styling configuration
 * 
 * Provider Hierarchy:
 * - ClerkProvider: Authentication and user management
 * - ThemeProvider: Dark/light theme system
 * - ReduxProvider: Global application state
 * - ReactQueryProvider: Server state and caching
 * 
 * Features:
 * - Font optimization with Google Fonts
 * - Hydration warning suppression for SSR
 * - System theme detection and switching
 * - Global CSS application
 * - Provider composition for clean architecture
 * 
 * Integration:
 * - Used by Next.js App Router as root layout
 * - Provides context to all child components
 * - Sets up global application infrastructure
 * - Essential for application functionality
 * 
 * @param children - Child components to render within the layout
 * @returns JSX element with provider hierarchy and global configuration
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${manrope.className} bg-[#171717] antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
