import { SourceDeviceStateProps } from "@/hooks/useMediaSources";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import { Headphones, Monitor, Settings } from "lucide-react";
import {Spinner} from "@/components/global/loader-spinner.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

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
  
  // Initialize studio settings with user preferences or defaults
  const { control, isPending } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0]?.id,
    user?.studio?.mic || state.audioInputs?.[0]?.deviceId,
    user?.studio?.preset || "SD",
    user?.subscription?.plan
  );
  
  // Show loading if we don't have the required data yet
  if (!user || !state.displays?.length || !state.audioInputs?.length || !control) {
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
      
      <Controller
        name="screen"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full !h-10 px-4 py-2 rounded-full border-none text-white bg-[#292929] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 outline-none">
              <div className="flex items-center gap-x-4 w-full min-w-0">
                <Monitor fill="#777777" color="#777777" size={40} className="shrink-0" />
                <span className="truncate flex-1 text-left">
                  <SelectValue placeholder="Select display" />
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl bg-[#171717] border-[#292929] w-full min-w-0">
              {state.displays?.map((display, key) => (
                <SelectItem
                  value={display.id}
                  className="text-[#dddddd] cursor-pointer"
                  key={key}>
                  <span className="truncate block pr-6">{display.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="audio"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full !h-10 px-4 py-2 rounded-full border-none text-white bg-[#292929] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 outline-none">
              <div className="flex items-center gap-x-4 w-full min-w-0">
                <Headphones color="#888888" size={40} className="shrink-0" />
                <span className="truncate flex-1 text-left">
                  <SelectValue placeholder="Select audio input" />
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl bg-[#171717] border-[#292929] w-full min-w-0">
              {state.audioInputs?.map((device, key) => (
                <SelectItem
                  value={device.deviceId}
                  className="text-[#dddddd] cursor-pointer"
                  key={key}>
                  <span className="truncate block pr-6">{device.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="preset"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-full !h-10 px-4 py-2 rounded-full border-none text-white bg-[#292929] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 outline-none">
              <div className="flex items-center gap-x-4 w-full min-w-0">
                <Settings color="#888888" size={40} className="shrink-0" />
                <span className="truncate flex-1 text-left">
                  <SelectValue placeholder="Select quality" />
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl bg-[#171717] border-[#292929] w-full min-w-0">
              <SelectItem
                disabled={user?.subscription?.plan === "FREE"}
                value="HD"
                className="text-[#dddddd] cursor-pointer">
                <span className="truncate block pr-6">
                  1080p{" "}
                  {user?.subscription?.plan === "FREE" && "(Upgrade to PRO plan)"}
                </span>
              </SelectItem>
              <SelectItem
                value="SD"
                className="text-[#dddddd] cursor-pointer">
                <span className="truncate block pr-6">720p</span>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </form>
  );
};
