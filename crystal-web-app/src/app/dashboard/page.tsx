import { handleAuthRedirect } from "@/lib/auth-redirect";
export const dynamic = "force-dynamic";

/**
 * Main Dashboard Entry Page
 * 
 * This is the primary entry point for the dashboard section of the application.
 * It serves as a redirect hub that authenticates users and directs them to
 * their appropriate workspace based on their authentication status and
 * workspace access.
 * 
 * Purpose: Provide secure entry point to dashboard with automatic workspace routing
 * 
 * How it works:
 * 1. Uses handleAuthRedirect utility for consistent authentication flow
 * 2. Authenticates user and retrieves their workspace information
 * 3. Redirects to user's personal workspace if authentication successful
 * 4. Redirects to sign-in page if authentication fails
 * 5. Handles edge cases like missing workspaces
 * 
 * Authentication Flow:
 * - Success: Redirect to user's first workspace (/dashboard/{workspaceId})
 * - No workspaces: Redirect to sign-in page
 * - Authentication failure: Redirect to sign-in page
 * - Error handling: Redirect to sign-in page with logging
 * 
 * Features:
 * - Automatic workspace detection and routing
 * - Secure authentication verification
 * - Consistent error handling and redirection
 * - Integration with shared authentication utility
 * 
 * User Experience:
 * - Seamless entry to dashboard for authenticated users
 * - Automatic routing to appropriate workspace
 * - Graceful handling of authentication issues
 * - No manual workspace selection required
 * 
 * Integration:
 * - Uses shared handleAuthRedirect utility
 * - Connects to user authentication system
 * - Part of dashboard routing infrastructure
 * - Essential for secure dashboard access
 * 
 * @returns Promise that resolves to redirect action
 */
const DashboardPage = async () => {
  return await handleAuthRedirect()
}

export default DashboardPage