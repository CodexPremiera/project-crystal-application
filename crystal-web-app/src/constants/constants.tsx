import React from "react";
import {CreditCard, Settings, Home} from "@/components/icons";
import {Users} from "@/components/icons/user";

/**
 * Application Constants and Configuration
 * 
 * This file contains application-wide constants, configuration values,
 * and reusable data structures used throughout the application.
 */

/**
 * Navigation Menu Items Configuration
 * 
 * This function generates the main navigation menu items for the sidebar
 * based on the current workspace ID. It provides consistent navigation
 * structure with proper routing and icon configuration.
 * 
 * Purpose: Provide consistent navigation menu structure for sidebar
 * 
 * How it works:
 * 1. Accepts workspaceId parameter for dynamic routing
 * 2. Returns array of menu items with title, href, and icon
 * 3. Uses Lucide React icons for consistent iconography
 * 4. Provides proper routing paths for each section
 * 
 * Menu Items:
 * - Home: Main workspace dashboard
 * - Billing: Subscription and payment management
 * - Settings: User and workspace settings
 * - Users: Team member management (PUBLIC workspaces only)
 * 
 * Note: Notifications moved to header dropdown (YouTube-style)
 * 
 * Features:
 * - Dynamic workspace routing
 * - Consistent icon styling
 * - Type-safe menu structure
 * - Reusable configuration
 * 
 * Integration:
 * - Used by sidebar navigation component
 * - Provides navigation structure for dashboard
 * - Essential for user navigation experience
 * - Part of application navigation system
 * 
 * @param workspaceId - Current workspace ID for dynamic routing
 * @returns Array of menu items with navigation configuration
 */
export const MENU_ITEMS = ({
                             workspaceId,
                             currentWorkspace,
                           }: {
  workspaceId: string
  currentWorkspace?: { type: 'PERSONAL' | 'PUBLIC' }
}): { title: string; href: string; icon: React.ReactNode }[] => {
  const baseItems = [
    {
      title: 'Home',
      href: `/dashboard/${workspaceId}`,
      icon: <Home />,
    },
    {
      title: 'Billing',
      href: `/dashboard/${workspaceId}/billing`,
      icon: <CreditCard />,
    },
    {
      title: 'Settings',
      href: `/dashboard/${workspaceId}/settings`,
      icon: <Settings />,
    },
  ]

  // Add Users tab only for PUBLIC workspaces (after Home)
  if (currentWorkspace?.type === 'PUBLIC') {
    baseItems.splice(1, 0, {
      title: 'Users',
      href: `/dashboard/${workspaceId}/users`,
      icon: <Users opacity={30}/>,
    })
  }

  return baseItems
}