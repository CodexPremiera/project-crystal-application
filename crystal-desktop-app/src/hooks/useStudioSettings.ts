import { updateStudioSettings } from "@/lib/utils";
import { updateStudioSettingsSchema } from "@/schemas/studio-settings.schema";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useZodForm } from "./useZodForm";

/**
 * Custom hook for managing studio settings and media source configuration.
 * 
 * This hook provides a complete solution for managing studio settings including:
 * - Form state management with Zod validation
 * - Real-time settings updates to the backend
 * - IPC communication with the studio tray window
 * - Subscription-based feature restrictions
 * 
 * The hook automatically syncs changes between the control panel and studio tray,
 * ensuring that recording settings are always up-to-date across all windows.
 * 
 * @param id - User ID for backend updates
 * @param screen - Default screen source ID
 * @param audio - Default audio input device ID
 * @param preset - Default recording quality preset
 * @param plan - User's subscription plan (affects available features)
 * @returns Object containing form registration, loading state, and current preset
 */
export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD",
  plan?: "PRO" | "FREE"
) => {
  // Initialize form with default values, using empty strings as fallback
  const defaultValues = {
    screen: screen || "",
    audio: audio || "",
    preset: preset || "SD" as "HD" | "SD",
  };

  const { register, watch, control } = useZodForm(updateStudioSettingsSchema, defaultValues);

  // Track current preset for UI updates
  const [onPreset, setPreset] = useState<"HD" | "SD" | undefined>();
  
  // Mutation for updating studio settings on the backend
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      screen: string;
      id: string;
      audio: string;
      preset: "HD" | "SD";
    }) => updateStudioSettings(data.id, data.screen, data.audio, data.preset),
    onSuccess: (data) => {
      return toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
  });

  /**
   * Effect to initialize media sources on component mount.
   * Sends the initial configuration to the studio tray window.
   */
  useEffect(() => {
    //set sources on mount
    if (screen && audio && preset)
      window.ipcRenderer.send("media-sources", {
        screen,
        id: id,
        audio,
        preset,
        plan,
      });
  }, []);

  /**
   * Effect to handle form changes and sync with backend and studio tray.
   * Watches for changes in form values and automatically updates both
   * the backend settings and the studio tray configuration.
   */
  useEffect(() => {
    //set sources on change
    const subscribe = watch((values) => {
      setPreset(values.preset);
      mutate({
        screen: values.screen!,
        id: id,
        audio: values.audio!,
        preset: values.preset!,
      });
      //we send the user id to the second screen to sync the studio tray
      window.ipcRenderer.send("media-sources", {
        screen: values.screen,
        id: id,
        audio: values.audio,
        preset: values.preset,
        plan,
      });
    });
    return () => subscribe.unsubscribe();
  }, [watch]);

  return { register, isPending, onPreset, control };
};
