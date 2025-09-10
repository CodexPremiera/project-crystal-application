import React from "react";
import { Bell, CreditCard, File, Home, Settings } from "lucide-react";

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
 * - My Library: Video and folder management
 * - Notifications: User notification center
 * - Billing: Subscription and payment management
 * - Settings: User and workspace settings
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
                           }: {
  workspaceId: string
}): { title: string; href: string; icon: React.ReactNode }[] => [
  {
    title: 'Home',
    href: `/dashboard/${workspaceId}/home`,
    icon: <Home className="text-primary/50" /> },
  {
    title: 'My Library',
    href: `/dashboard/${workspaceId}`,
    icon: <File className="text-primary/50" />,
  },
  {
    title: 'Notifications',
    href: `/dashboard/${workspaceId}/notifications`,
    icon: <Bell className="text-primary/50" />,
  },
  {
    title: 'Billing',
    href: `/dashboard/${workspaceId}/billing`,
    icon: <CreditCard className="text-primary/50" />,
  },
  {
    title: 'Settings',
    href: `/dashboard/${workspaceId}/settings`,
    icon: <Settings className="text-primary/50" />,
  },
]