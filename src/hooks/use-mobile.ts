import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook for detecting mobile device screen sizes
 * 
 * This hook provides responsive design capabilities by detecting when the
 * user's screen width falls below the mobile breakpoint (768px). It uses
 * the browser's matchMedia API for efficient event-driven updates.
 * 
 * Purpose: Enable responsive UI behavior based on screen size
 * 
 * How it works:
 * 1. Uses window.matchMedia to create a media query listener
 * 2. Listens for viewport width changes in real-time
 * 3. Updates state when screen crosses the mobile breakpoint
 * 4. Automatically cleans up event listeners on unmount
 * 
 * Integration:
 * - Used by components that need to adapt their layout for mobile
 * - Provides boolean value for conditional rendering
 * - Handles SSR by returning undefined initially, then actual value
 * 
 * @returns Boolean indicating if current screen is mobile-sized (< 768px)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
