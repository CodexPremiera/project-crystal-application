import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

/**
 * Authentication and Redirect Utility
 * 
 * This utility function provides a standardized authentication flow
 * for pages that require user authentication. It handles user verification,
 * workspace access, and appropriate redirection based on authentication status.
 * 
 * Purpose: Provide consistent authentication flow with proper redirection logic
 * 
 * How it works:
 * 1. Authenticates user using onAuthenticateUser action
 * 2. Checks authentication status and user data
 * 3. Redirects to personal workspace if authentication successful
 * 4. Redirects to sign-in page if authentication fails
 * 5. Handles edge cases and error scenarios
 * 
 * Authentication Flow:
 * - Success (200/201): Redirect to user's personal workspace
 * - No workspace: Redirect to sign-in page
 * - Error (400/500/404): Redirect to sign-in page
 * - Unexpected status: Redirect to sign-in page
 * 
 * Features:
 * - Comprehensive error handling
 * - Debug logging for troubleshooting
 * - Workspace validation
 * - Consistent redirect behavior
 * 
 * Integration:
 * - Used by dashboard and auth callback pages
 * - Connects to user authentication system
 * - Part of authentication flow infrastructure
 * - Essential for secure page access
 * 
 * @returns Promise that resolves to redirect action
 */
export const handleAuthRedirect = async () => {
  // Step 1: Authenticate user and get their data
  const auth = await onAuthenticateUser()
  
  // Step 2: If authentication successful (existing or new user), redirect to personal workspace
  if (auth.status === 200 || auth.status === 201) {
    if (!auth.user?.workspace?.[0]?.id) {
      console.error('No workspace found for user:', auth.user)
      return redirect('/auth/sign-in')
    }
    
    const workspaceUrl = `/dashboard/${auth.user.workspace[0].id}`
    console.log('Redirecting to:', workspaceUrl) // Debug log
    return redirect(workspaceUrl)
  }
  
  // Step 3: Handle authentication errors by redirecting to sign-in page
  if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
    console.error('Auth error:', auth) // Debug log
    return redirect('/auth/sign-in')
  }
  
  // Step 4: Handle unexpected status codes
  console.error('Unexpected auth status:', auth.status)
  return redirect('/auth/sign-in')
}
