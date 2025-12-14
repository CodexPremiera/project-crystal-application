import { Button } from "@/components/ui/button";
import { useSignIn, useClerk, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { saveDesktopUser, isDesktopAuthenticated } from "@/lib/desktop-auth";

/**
 * Authentication Button Component for Desktop App
 * 
 * This component provides browser-based authentication for the Electron desktop app.
 * Instead of using Clerk's built-in sign-in flow (which has issues with cookies in
 * the file:// context), it implements an OAuth-style flow:
 * 
 * 1. User clicks "Sign In" button
 * 2. Button opens the user's default browser to the web app's desktop-signin page
 * 3. User authenticates on the web app and clicks "Allow Sign In"
 * 4. Web app generates a sign-in ticket and redirects to crystalapp://auth/callback
 * 5. Electron receives the deep link and sends the ticket to this component via IPC
 * 6. Component exchanges the ticket for a Clerk session
 * 
 * This approach bypasses cookie/session issues in Electron by delegating
 * authentication to a proper browser context.
 */
export const AuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => isDesktopAuthenticated());
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const { user } = useUser();

  /**
   * Opens the user's default browser to the Crystal web app's desktop sign-in page.
   * The web app handles authentication and redirects back via deep link.
   */
  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await window.ipcRenderer.invoke('open-browser-signin');
    } catch (err) {
      console.error('[Auth] Failed to open browser:', err);
      setError('Failed to open browser');
      setIsLoading(false);
    }
  };

  // Save user to localStorage whenever Clerk user changes (after sign-in)
  useEffect(() => {
    if (user && !isAuthenticated) {
      console.log('[Auth] Saving user to localStorage:', user.id);
      saveDesktopUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || null,
        name: user.fullName || user.firstName || null,
        imageUrl: user.imageUrl || null,
        timestamp: Date.now(),
      });
      setIsAuthenticated(true);
    }
  }, [user, isAuthenticated]);

  // Handle auth callback from Electron
  useEffect(() => {
    const handleAuthCallback = async (_event: Electron.IpcRendererEvent, data: { ticket: string }) => {
      console.log('[Auth] Received auth callback with ticket');
      if (!signIn) {
        setError('Sign-in service not available');
        setIsLoading(false);
        return;
      }
      try {
        const result = await signIn.create({
          strategy: 'ticket',
          ticket: data.ticket,
        });

        if (result.status === 'complete' && result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          console.log('[Auth] Session established successfully');
          
          // Wait for Clerk to update user, then reload to pick up new state
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          throw new Error('Sign-in incomplete');
        }
      } catch (err) {
        console.error('[Auth] Failed to exchange ticket:', err);
        setError('Sign-in failed. Please try again.');
        setIsLoading(false);
      }
    };

    window.ipcRenderer.on('auth-callback', handleAuthCallback);
    return () => {
      window.ipcRenderer.off('auth-callback', handleAuthCallback);
    };
  }, [signIn, setActive]);

  // Don't show if authenticated via localStorage
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2 h-[120px] pt-12 justify-center items-center">
      <Button
        variant="secondary"
        className="px-10 rounded-full hover:bg-[#D0D0D0]"
        onClick={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Waiting for browser...
          </>
        ) : (
          'Sign In with Browser'
        )}
      </Button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
