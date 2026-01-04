'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

const PROTOCOL = 'crystalapp://'
const DETECTION_TIMEOUT = 1500

/**
 * useDesktopApp Hook
 * 
 * Provides functionality to launch the Crystal desktop app via custom protocol
 * and detect whether the app is installed. Uses a timeout-based detection approach
 * where the page losing focus indicates the app was launched successfully.
 * 
 * Key Features:
 * 1. Attempts to open desktop app via crystalapp:// protocol
 * 2. Detects if app is installed using visibility/blur events
 * 3. Manages modal state for showing download prompt
 * 4. Prevents multiple simultaneous launch attempts
 * 
 * Detection Flow:
 * 1. User clicks Record button, triggering launchApp
 * 2. Hook navigates to crystalapp:// protocol
 * 3. Starts a 1.5s timeout
 * 4. If page loses focus (blur event), app opened successfully - cancel timeout
 * 5. If timeout fires without blur, app is likely not installed - show modal
 * 
 * @returns Object containing launch function, modal state, and controls
 */
export const useDesktopApp = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const launchAttemptedRef = useRef(false)

  const clearLaunchTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const handleBlur = useCallback(() => {
    if (launchAttemptedRef.current) {
      clearLaunchTimeout()
      setIsLaunching(false)
      launchAttemptedRef.current = false
    }
  }, [clearLaunchTimeout])

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && launchAttemptedRef.current) {
      clearLaunchTimeout()
      setIsLaunching(false)
      launchAttemptedRef.current = false
    }
  }, [clearLaunchTimeout])

  useEffect(() => {
    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearLaunchTimeout()
    }
  }, [handleBlur, handleVisibilityChange, clearLaunchTimeout])

  /**
   * Attempts to launch the Crystal desktop app.
   * 
   * Uses an iframe-based approach which is more reliable than window.location
   * for custom protocol detection. The iframe prevents navigation away from
   * the current page if the protocol fails.
   * 
   * How it works:
   * 1. Creates hidden iframe to attempt protocol navigation
   * 2. Sets timeout to detect if app didn't open
   * 3. Listens for blur/visibility events to detect successful launch
   * 4. Shows download modal if timeout fires (app not installed)
   */
  const launchApp = useCallback(() => {
    if (isLaunching) return
    
    setIsLaunching(true)
    launchAttemptedRef.current = true
    
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    
    try {
      iframe.contentWindow?.location.replace(PROTOCOL)
    } catch {
      // Protocol might throw in some browsers - fallback to window.location
      window.location.href = PROTOCOL
    }
    
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 100)
    
    timeoutRef.current = setTimeout(() => {
      if (launchAttemptedRef.current) {
        setShowDownloadModal(true)
        setIsLaunching(false)
        launchAttemptedRef.current = false
      }
    }, DETECTION_TIMEOUT)
  }, [isLaunching])

  const closeDownloadModal = useCallback(() => {
    setShowDownloadModal(false)
  }, [])

  const openDownloadModal = useCallback(() => {
    setShowDownloadModal(true)
  }, [])

  return {
    launchApp,
    isLaunching,
    showDownloadModal,
    closeDownloadModal,
    openDownloadModal
  }
}

