import {onAuthenticateUser} from "@/actions/user";
import {redirect} from "next/navigation";

/**
 * Dashboard Page Component
 * 
 * This is the main dashboard entry point that handles:
 * 1. User authentication and verification
 * 2. Redirects to personalized dashboard workspace
 * 3. Handles authentication errors by redirecting to sign-in
 * 
 * The page acts as a router that ensures users are authenticated
 * before accessing their personal dashboard workspace.
 */
const DashboardPage = async () => {
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

// Export the dashboard page component as the default export
export default DashboardPage