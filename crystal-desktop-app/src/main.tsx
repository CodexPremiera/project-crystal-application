import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ClerkProvider} from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const safeRouterNavigate = (to: string) => {
  try {
    const target = new URL(to, window.location.origin);
    if (target.origin !== window.location.origin) {
      window.location.href = "/";
      return;
    }
    window.location.href = `${target.pathname}${target.search}${target.hash}`;
  } catch {
    window.location.href = "/";
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignInUrl="/"
      afterSignUpUrl="/"
      afterSignOutUrl="/"
      signInUrl="/"
      signUpUrl="/"
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
      routerPush={safeRouterNavigate}
      routerReplace={safeRouterNavigate}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
