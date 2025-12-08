import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ClerkProvider} from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const APP_URL = import.meta.env.VITE_APP_URL || "https://www.crystalapp.tech";
const API_HOST = import.meta.env.VITE_HOST_URL;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Log early environment signals helpful for auth debugging without exposing secrets
console.log("[Renderer:init]", {
  href: window.location.href,
  origin: window.location.origin,
  appUrl: APP_URL,
  apiHost: API_HOST,
  hasPublishableKey: Boolean(PUBLISHABLE_KEY),
});

const safeRouterNavigate = (to: string) => {
  console.log("[Renderer:safeRouterNavigate] requested", { from: window.location.href, to });
  try {
    // Use full href as base so file:// origins keep their path
    const target = new URL(to, window.location.href);
    const sameOrigin = target.origin === window.location.origin;
    const isClerkHost =
      target.hostname.includes("clerk") ||
      target.hostname.includes("accounts.dev") ||
      target.hostname.includes("accounts.google.com");
    const isAppHost =
      target.hostname.includes("crystalapp.tech");

    if (isClerkHost || isAppHost) {
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

console.log("[Renderer:ClerkProvider] configuring", {
  signInUrl: "/",
  signUpUrl: "/",
  signInFallbackRedirectUrl: APP_URL,
  signUpFallbackRedirectUrl: APP_URL,
  afterSignOutUrl: APP_URL,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      signInUrl="/"
      signUpUrl="/"
      signInFallbackRedirectUrl={APP_URL}
      signUpFallbackRedirectUrl={APP_URL}
      afterSignOutUrl={APP_URL}
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
