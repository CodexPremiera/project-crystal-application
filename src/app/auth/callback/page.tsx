import { handleAuthRedirect } from "@/lib/auth-redirect";

/**
 * Auth Callback Page Component
 * 
 * This page handles the authentication callback flow after users sign in.
 * It authenticates the user and redirects them to their personalized workspace.
 * 
 * Uses the shared authentication utility to avoid code duplication.
 */
const AuthCallbackPage = async () => {
  return await handleAuthRedirect()
}

export default AuthCallbackPage