import { protocol, session } from "electron";
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { lookup } from 'mime-types';

  win.webContents.on('will-navigate', (event, url) => {
    console.log('[Navigation] Attempting to navigate to:', url);
    
    // Allow Clerk authentication domains
    const isClerkAuth = url.includes('clerk') || 
                        url.includes('accounts.dev') ||
                        url.includes('accounts.google.com');
    
    if (isClerkAuth) {
      console.log('[Navigation] Allowing Clerk auth URL');
      return; // Don't block
    }
    
    // Block external web app URLs but NOT during auth flow
    const isWebAppUrl = url.includes('localhost:3000') || 
                        url.includes('127.0.0.1:3000');
    
    // Allow localhost:5173 and 127.0.0.1:5173 (our local server)
    const isDesktopAppUrl = url.includes('localhost:5173') || 
                            url.includes('127.0.0.1:5173');
    
    if (isWebAppUrl && !isClerkAuth) {
      console.log('[Navigation] Blocked web app URL, reloading desktop app');
      event.preventDefault();
      // ... existing reload logic ...
    }
  });
