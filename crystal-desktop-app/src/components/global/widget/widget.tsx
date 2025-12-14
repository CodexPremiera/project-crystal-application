import { useMediaSources } from "@/hooks/useMediaSources";
import { fetchUserProfile } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {Spinner} from "@/components/global/loader-spinner.tsx";
import { MediaConfiguration } from "./media-configuration";
import { getDesktopUser, isDesktopAuthenticated } from "@/lib/desktop-auth";

/**
 * Widget component - Main configuration interface for the Crystal Desktop App.
 * 
 * This component serves as the central hub for user configuration and media setup.
 * It handles user authentication, profile fetching, and media source management,
 * providing a seamless interface for users to configure their recording settings.
 * 
 * Uses localStorage-based auth (getDesktopUser) as fallback when Clerk's 
 * session management fails in Electron.
 * 
 * Key Features:
 * - User authentication integration with Clerk + localStorage fallback
 * - Automatic profile fetching from backend
 * - Media source detection and management
 * - Loading states and error handling
 * - Integration with MediaConfiguration component
 */
export const Widget = () => {
  const { user } = useUser();
  const { state, fetchMediaResources } = useMediaSources();
  const [isAuthenticated] = useState(() => isDesktopAuthenticated());
  const [desktopUser] = useState(() => getDesktopUser());
  
  // User profile state with subscription and studio settings
  const [profile, setProfile] = useState<{
    status: number;
    user:
      | ({
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
      studio: {
        id: string;
        screen: string | null;
        mic: string | null;
        preset: "HD" | "SD";
        camera: string | null;
        userId: string | null;
      } | null;
    } & {
      id: string;
      email: string;
      firstname: string | null;
      lastname: string | null;
      createdAt: Date;
      clerkId: string;
    })
      | null;
  } | null>(null);
  
  /**
   * Effect to fetch user profile and media resources when user is authenticated.
   * Uses Clerk user ID if available, falls back to stored desktop user ID.
   */
  useEffect(() => {
    // Get clerkId from Clerk or from localStorage
    const clerkId = user?.id || desktopUser?.clerkId;
    
    console.log("fetching", { clerkId, hasClerkUser: !!user, hasDesktopUser: !!desktopUser });
    
    if (clerkId) {
      console.log("[Profile] fetching user profile for:", clerkId);
      fetchUserProfile(clerkId).then((p) => {
        console.log("[Profile] received:", p);
        setProfile(p);
      });
      console.log("getting sources");
      fetchMediaResources();
    }
  }, [user, desktopUser]);
  
  // Don't show anything if not authenticated
  if (!isAuthenticated && !user) {
    return null;
  }
  
  return (
    <div className="p-5">
      {profile ? (
        <MediaConfiguration state={state} user={profile?.user} />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner color="#fff" />
        </div>
      )}
    </div>
  );
};
