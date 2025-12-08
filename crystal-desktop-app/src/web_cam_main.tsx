import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./web_cam_app";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const safeRouterNavigate = (to: string) => {
  try {
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

ReactDOM.createRoot(document.getElementById("root")!).render(
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
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
