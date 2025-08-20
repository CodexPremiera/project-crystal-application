import { handleAuthRedirect } from "@/lib/auth-redirect";

/**
 * Dashboard Page Component
 * 
 * This is the main dashboard entry point that handles user authentication
 * and redirects them to their personalized workspace.
 * 
 * Uses the shared authentication utility to avoid code duplication.
 */
const DashboardPage = async () => {
  return await handleAuthRedirect()
}

export default DashboardPage