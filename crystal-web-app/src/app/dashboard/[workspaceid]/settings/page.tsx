'use client'
import { enableFirstView, getFirstView } from '@/actions/user'
import { DarkMode } from '@/components/theme/dark.mode'
import { LightMode } from '@/components/theme/light-mode'
import { SystemMode } from '@/components/theme/system-mode'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * User Settings and Preferences Page
 * 
 * This page provides users with comprehensive settings management including
 * theme selection (dark/light/system) and video sharing preferences. It
 * allows users to customize their application experience and control
 * notification settings for video engagement.
 * 
 * Purpose: Provide user settings and preferences management interface
 * 
 * How it works:
 * 1. Manages theme selection with visual theme previews
 * 2. Handles first-view notification preferences
 * 3. Fetches current user settings on component mount
 * 4. Updates settings with real-time feedback via toast notifications
 * 5. Provides interactive theme selection with visual feedback
 * 
 * Theme Management:
 * - Dark Mode: Dark theme with dark backgrounds
 * - Light Mode: Light theme with light backgrounds
 * - System Mode: Follows system preference automatically
 * - Visual theme previews with selection indicators
 * 
 * Video Sharing Settings:
 * - First View Notifications: Toggle for video view alerts
 * - Email notifications when videos get first view
 * - Useful for client outreach and engagement tracking
 * - Real-time preference updates
 * 
 * Features:
 * - Interactive theme selection with visual feedback
 * - First-view notification toggle
 * - Real-time settings updates
 * - Toast notifications for user feedback
 * - Responsive settings layout
 * - Visual theme previews
 * 
 * User Experience:
 * - Intuitive theme selection interface
 * - Clear setting descriptions and benefits
 * - Immediate feedback on setting changes
 * - Organized settings categories
 * 
 * Integration:
 * - Connects to user preference system
 * - Uses theme management system
 * - Integrates with notification system
 * - Part of user account management
 * 
 * @returns JSX element with user settings and preferences interface
 */
const SettingsPage = () => {
  const [firstView, setFirstView] = useState<undefined | boolean>(undefined)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    if (firstView !== undefined) return
    const fetchData = async () => {
      const response = await getFirstView()
      if (response.status === 200) setFirstView(response?.data)
    }
    fetchData()
  }, [firstView])

  const switchState = async (checked: boolean) => {
    const view = await enableFirstView(checked)
    if (view) {
      toast(view.status === 200 ? 'Success' : 'Failed', {
        description: view.data,
      })
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-4 flex lg:flex-row flex-col items-start gap-5">
          <div
            className={cn(
              'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent',
              theme == 'system' && 'border-purple-800'
            )}
            onClick={() => setTheme('system')}
          >
            <SystemMode />
          </div>
          <div
            className={cn(
              'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent',
              theme == 'light' && 'border-purple-800'
            )}
            onClick={() => setTheme('light')}
          >
            <LightMode />
          </div>
          <div
            className={cn(
              'rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent',
              theme == 'dark' && 'border-purple-800'
            )}
            onClick={() => setTheme('dark')}
          >
            <DarkMode />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-4">Video Sharing Settings</h2>
      <p className="text-muted-foreground">
        Enabling this feature will send you notifications when someone watched
        your video for the first time. This feature can help during client
        outreach.
      </p>
      <Label className="flex items-center gap-x-3 mt-4 text-md">
        Enable First View
        <Switch
          onCheckedChange={switchState}
          disabled={firstView === undefined}
          checked={firstView}
          onClick={() => setFirstView(!firstView)}
        />
      </Label>
    </div>
  )
}

export default SettingsPage
