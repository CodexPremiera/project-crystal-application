import { useMediaSources } from "@/hooks/useMediaSources";
import { fetchUserProfile } from "@/lib/utils";
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {Spinner} from "@/components/global/loader-spinner.tsx";
import { MediaConfiguration } from "./media-configuration";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Widget component - Main configuration interface for the Crystal Desktop App.
 * 
 * This component serves as the central hub for user configuration and media setup.
 * It handles user authentication, profile fetching, and media source management,
 * providing a seamless interface for users to configure their recording settings.
 */
export const Widget = () => {
  const { user } = useUser();
  const { state, fetchMediaResources } = useMediaSources();
  
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
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const p = await fetchUserProfile(user.id);
      setProfile(p);
      fetchMediaResources();
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Unable to connect to server. Please check your internet connection or try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && user.id) {
      loadProfile();
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
        {error ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4 text-center px-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <div className="flex flex-col gap-2">
              <p className="text-white font-medium">Connection Error</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
            <button
              onClick={loadProfile}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        ) : profile ? (
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
