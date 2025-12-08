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
    // Use full href as base so file:// origins keep their path
    const target = new URL(to, window.location.href);
    const sameOrigin = target.origin === window.location.origin;
    const isClerkHost =
      target.hostname.includes("clerk") ||
      target.hostname.includes("accounts.dev") ||
      target.hostname.includes("accounts.google.com");

    if (isClerkHost) {
      window.location.href = target.href;
      return;
    }

    if (sameOrigin) {
      if (target.protocol === "file:") {
        // Stay on the bundled file path; only adjust search/hash if present
        const currentBase = window.location.href.split("#")[0].split("?")[0];
        const next = `${currentBase}${target.search}${target.hash}`;
        window.location.href = next;
        return;
      }

      window.location.href = target.href;
      return;
    }
  } catch {
    // fall through to safety redirect
  }

  window.location.href = "/";
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      signInUrl="/"
      signUpUrl="/"
      afterSignInUrl="/"
      afterSignUpUrl="/"
      afterSignOutUrl="/"
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
