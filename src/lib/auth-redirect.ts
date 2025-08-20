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
    const workspaceUrl = `/dashboard/${auth.user?.firstname}${auth.user?.lastname}`
    return redirect(workspaceUrl)
  }
  
  // Step 3: Handle authentication errors by redirecting to sign-in page
  if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
    return redirect('/auth/sign-in')
  }
}
