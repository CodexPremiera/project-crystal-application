import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

/**
 * Shared authentication and redirect utility
 * 
 * This function handles the common authentication flow used by:
 * - Dashboard page
 * - Auth callback page
 * 
 * It authenticates the user and redirects them to their personal workspace
 * or to the sign-in page if authentication fails.
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
