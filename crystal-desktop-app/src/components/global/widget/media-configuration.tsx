import { SourceDeviceStateProps } from "@/hooks/useMediaSources";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import { Headphones, Monitor, Settings } from "lucide-react";
import {Spinner} from "@/components/global/loader-spinner.tsx";

type MediaConfigurationProps = {
  state: SourceDeviceStateProps;
  user:
    | ({
        subscription: {
          plan: "PRO" | "FREE";
        } | null;
        studio: {
          id: string;
          screen: string | null;
          mic: string | null;
          camera: string | null;
          preset: "HD" | "SD";
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
};

/**
 * MediaConfiguration component - Media source selection and settings interface.
 * 
 * This component provides the main configuration interface for users to select
 * their recording sources and quality settings. It manages the selection of
 * display sources, audio inputs, and recording presets, with real-time updates
 * to the studio tray window.
 * 
 * Key Features:
 * - Display source selection with live preview
 * - Audio input device selection
 * - Recording quality preset selection (HD/SD)
 * - Real-time settings synchronization with studio tray
 * - Subscription-based feature restrictions
 * - Form validation and error handling
 * 
 * The component integrates with the useStudioSettings hook to manage form state
 * and automatically syncs changes with the recording interface through IPC.
 */
export const MediaConfiguration = ({
  user,
  state,
}: MediaConfigurationProps) => {
  
  // Find currently active screen and audio sources from user settings
  const activeScreen = state.displays?.find(
    (screen) => screen.id === user?.studio?.screen
  );

  const activeAudio = state.audioInputs?.find(
    (device) => device.deviceId === user?.studio?.mic
  );

  // Initialize studio settings with user preferences or defaults
  const { register, isPending, onPreset } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset || "SD",
    user?.subscription?.plan
  );
  
  // Show loading if we don't have the required data yet
  if (!user || !state.displays?.length || !state.audioInputs?.length) {
    return (
      <div className="flex h-full justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <form className="flex h-full relative w-full flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      <div className="flex gap-x-5 justify-center items-center">
        <Monitor fill="#575655" color="#575655" size={36} />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full">
          {state.displays?.map((display, key) => (
            <option
              selected={activeScreen && activeScreen.id === display.id}
              value={display.id}
              className="bg-[#171717] cursor-pointer"
              key={key}>
              {display.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Headphones color="#575655" size={36} />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full">
          {state.audioInputs?.map((device, key) => (
            <option
              selected={activeAudio && activeAudio.deviceId === device.deviceId}
              value={device.deviceId}
              className="bg-[#171717] cursor-pointer"
              key={key}>
              {device.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Settings color="#575655" size={36} />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full">
          <option
            disabled={user?.subscription?.plan === "FREE"}
            selected={onPreset === "HD" || user?.studio?.preset === "HD"}
            value={"HD"}
            className="bg-[#171717] cursor-pointer">
            1080p{" "}
            {user?.subscription?.plan === "FREE" && "(Upgrade to PRO plan)"}
          </option>
          <option
            value={"SD"}
            selected={onPreset === "SD" || user?.studio?.preset === "SD"}
            className="bg-[#171717] cursor-pointer">
            720p
          </option>
        </select>
      </div>
    </form>
  );
};
