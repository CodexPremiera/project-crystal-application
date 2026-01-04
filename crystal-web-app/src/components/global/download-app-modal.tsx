'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Monitor, ExternalLink } from 'lucide-react'

type Platform = 'windows' | 'mac' | 'linux'

type DownloadAppModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DOWNLOAD_LINKS = {
  windows: 'https://github.com/CodexPremiera/project-crystal-application/releases/latest/download/Crystal-Windows-Setup.exe',
  mac: 'https://github.com/CodexPremiera/project-crystal-application/releases/latest/download/Crystal-Mac-Installer.dmg',
  linux: 'https://github.com/CodexPremiera/project-crystal-application/releases/latest/download/Crystal-Linux.AppImage'
}

const PLATFORM_INFO = {
  windows: { name: 'Windows', version: 'Windows 10+', size: '~90 MB' },
  mac: { name: 'macOS', version: 'macOS 10.15+', size: '~95 MB' },
  linux: { name: 'Linux', version: 'Ubuntu 18.04+', size: '~90 MB' }
}

/**
 * Download App Modal Component
 * 
 * Displays a modal prompting users to download the Crystal desktop app.
 * Auto-detects the user's platform and highlights the relevant download option.
 * 
 * Features:
 * - Platform detection (Windows, macOS, Linux)
 * - Direct download links to GitHub releases
 * - Link to detailed installation instructions
 * - Clean, accessible modal interface
 * 
 * @param open - Controls modal visibility
 * @param onOpenChange - Callback when modal open state changes
 */
export function DownloadAppModal({ open, onOpenChange }: DownloadAppModalProps) {
  const [platform, setPlatform] = useState<Platform>('windows')

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('win') !== -1) setPlatform('windows')
    else if (userAgent.indexOf('mac') !== -1) setPlatform('mac')
    else if (userAgent.indexOf('linux') !== -1) setPlatform('linux')
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Desktop App Required</DialogTitle>
          <DialogDescription>
            To record your screen, you need to install the Crystal desktop app.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(DOWNLOAD_LINKS) as Platform[]).map((p) => (
              <a
                key={p}
                href={DOWNLOAD_LINKS[p]}
                download
                className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                  platform === p
                    ? 'bg-brand/10 border-2 border-brand'
                    : 'bg-surface-secondary/50 border border-white/10 hover:border-white/20'
                }`}
              >
                <Monitor className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium text-sm">{PLATFORM_INFO[p].name}</p>
                  <p className="text-xs text-muted-foreground">{PLATFORM_INFO[p].version}</p>
                </div>
                <Button
                  size="sm"
                  variant={platform === p ? 'default' : 'secondary'}
                  className="w-full mt-1"
                  asChild
                >
                  <span>
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </span>
                </Button>
                <span className="text-xs text-muted-foreground">{PLATFORM_INFO[p].size}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center justify-center pt-2">
            <Link
              href="/download"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View detailed installation instructions
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

