import { handleAuthRedirect } from "@/lib/auth-redirect";
import {onAuthenticateUser} from "@/actions/user";
import {redirect} from "next/navigation";

/**
 * Auth Callback Page Component
 * 
 * This page handles the authentication callback flow after users sign in.
 * It authenticates the user and redirects them to their personalized workspace.
 * 
 * Uses the shared authentication utility to avoid code duplication.
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