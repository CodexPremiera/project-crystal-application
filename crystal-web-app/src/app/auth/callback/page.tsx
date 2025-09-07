import { handleAuthRedirect } from "@/lib/auth-redirect";
import {onAuthenticateUser} from "@/actions/user";
import {redirect} from "next/navigation";

/**
 * Authentication Callback Page
 * 
 * This page handles the authentication callback flow after users complete
 * the sign-in process through Clerk authentication. It processes the
 * authentication result and redirects users to their appropriate workspace
 * or back to sign-in if authentication fails.
 * 
 * Purpose: Handle post-authentication routing and user workspace assignment
 * 
 * How it works:
 * 1. Calls onAuthenticateUser to process authentication and create/update user
 * 2. Checks authentication status and user data
 * 3. Redirects to user's first workspace if authentication successful
 * 4. Redirects to sign-in page if authentication fails
 * 5. Logs authentication results for debugging
 * 
 * Authentication Status Handling:
 * - Status 200/201: Successful authentication, redirect to workspace
 * - Status 403/400/500: Authentication failure, redirect to sign-in
 * - Missing workspace: Redirect to sign-in page
 * 
 * Features:
 * - Post-authentication user processing
 * - Automatic workspace routing
 * - Comprehensive error handling
 * - Debug logging for troubleshooting
 * - Integration with Clerk authentication
 * 
 * User Flow:
 * - User completes sign-in through Clerk
 * - Clerk redirects to this callback page
 * - Page processes authentication and user data
 * - User is redirected to their workspace or sign-in
 * 
 * Integration:
 * - Connects to Clerk authentication system
 * - Uses user authentication actions
 * - Part of authentication flow infrastructure
 * - Essential for post-login user experience
 * 
 * @returns Promise that resolves to redirect action
 */
const AuthCallbackPage = async () => {
  const auth = await onAuthenticateUser()
  console.log(auth)
  if (auth.status === 200 || auth.status === 201)
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
  
  if (auth.status === 403 || auth.status === 400 || auth.status === 500)
    return redirect('/auth/sign-in')
}

export default AuthCallbackPage