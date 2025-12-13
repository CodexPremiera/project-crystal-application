"use client";

import { useState } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, CheckCircle, Loader2, XCircle } from "lucide-react";

/**
 * Desktop Sign-In Page
 *
 * This page handles the browser-based authentication flow for the Crystal Desktop App.
 * When users click "Sign In" in the desktop app, they're directed to this page where
 * they can authorize the desktop app to access their account.
 *
 * Flow:
 * 1. User is redirected here from the desktop app
 * 2. If not signed in, they're redirected to Clerk sign-in
 * 3. Once signed in, they see a confirmation prompt
 * 4. On confirmation, a sign-in ticket is generated
 * 5. User is redirected back to the desktop app via crystalapp:// protocol
 */
export default function DesktopSignInPage() {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the authorization flow by requesting a sign-in ticket
   * from the backend and redirecting to the desktop app.
   */
  const handleAuthorize = async () => {
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/auth/desktop-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate sign-in ticket");
      }

      const { ticket } = await response.json();
      setStatus("success");

      // Small delay to show success state before redirect
      setTimeout(() => {
        window.location.href = `crystalapp://auth/callback?ticket=${encodeURIComponent(ticket)}`;
      }, 1000);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Monitor className="size-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Sign in to Crystal Desktop</CardTitle>
            <CardDescription>
              The Crystal Desktop app is requesting access to your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {user && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                  {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {user.fullName || "Crystal User"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                <CheckCircle className="size-5 shrink-0" />
                <p className="text-sm">Authorization successful! Redirecting to desktop app...</p>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                <XCircle className="size-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handleAuthorize}
              disabled={status === "loading" || status === "success"}
              className="w-full"
              size="lg"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Authorizing...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle className="size-4" />
                  Authorized
                </>
              ) : (
                "Allow Sign In"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, the Crystal Desktop app will be able to access your account
              and recording settings.
            </p>
          </CardFooter>
        </Card>
      </SignedIn>
    </>
  );
}


