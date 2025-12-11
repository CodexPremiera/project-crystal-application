import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/clerk-react";

const WEB_APP_URL = import.meta.env.VITE_APP_URL || "https://www.crystalapp.tech";

/**
 * Opens the system browser to the desktop sign-in page.
 * This initiates the browser-based authentication flow where users
 * sign in via the web app and get redirected back to the desktop app.
 */
const openSignInBrowser = () => {
  const signInUrl = `${WEB_APP_URL}/auth/desktop-signin`;
  console.log("[Auth] Opening browser for sign-in:", signInUrl);
  window.ipcRenderer.send("open-external", signInUrl);
};

export const AuthButton = () => {
  return (
    <SignedOut>
      <div className="flex gap-x-3 h-[120px] pt-12 justify-center items-center">
        <Button
          variant="secondary"
          className="px-10 rounded-full hover:bg-[#D0D0D0]"
          onClick={openSignInBrowser}
        >
          Sign In
        </Button>
        <Button
          variant="default"
          className="px-10 rounded-full border-1 hover:bg-[#262626]"
          onClick={openSignInBrowser}
        >
          Sign Up
        </Button>
      </div>
    </SignedOut>
  );
};
