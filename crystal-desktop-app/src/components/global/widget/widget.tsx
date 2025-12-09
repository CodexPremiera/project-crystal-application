import { useMediaSources } from "@/hooks/useMediaSources";
import { fetchUserProfile } from "@/lib/utils";
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {Spinner} from "@/components/global/loader-spinner.tsx";
import { MediaConfiguration } from "./media-configuration";

/**
 * Widget component - Main configuration interface for the Crystal Desktop App.
 * 
 * This component serves as the central hub for user configuration and media setup.
 * It handles user authentication, profile fetching, and media source management,
 * providing a seamless interface for users to configure their recording settings.
 * 
 * Key Features:
 * - User authentication integration with Clerk
 * - Automatic profile fetching from backend
 * - Media source detection and management
 * - Loading states and error handling
 * - Integration with MediaConfiguration component
 * 
 * The component coordinates between the authentication system, backend API,
 * and media source detection to provide a complete configuration experience.
 */
export const Widget = () => {
  const { user } = useUser();
  const { state, fetchMediaResources } = useMediaSources();
  
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
   * Fetches user data from the backend using Clerk ID and initializes media sources.
   */
  useEffect(() => {
    console.log("fetching");
    if (user && user.id) {
      fetchUserProfile(user.id).then((p) => setProfile(p));
      fetchMediaResources();
    }
  }, [user]);
  
  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Spinner />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfiguration state={state} user={profile?.user} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner color="#fff" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};
