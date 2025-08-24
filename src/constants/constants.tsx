import React from "react";
import { Bell, CreditCard, File, Home, Settings } from "lucide-react";

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