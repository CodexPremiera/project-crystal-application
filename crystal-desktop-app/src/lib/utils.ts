import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution.
 * 
 * This function combines clsx for conditional class handling with tailwind-merge
 * for proper Tailwind CSS class conflict resolution. It ensures that only the
 * last conflicting class is applied (e.g., 'bg-red-500 bg-blue-500' becomes 'bg-blue-500').
 * 
 * @param inputs - Variable number of class values (strings, objects, arrays)
 * @returns Merged and resolved class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

/**
 * Fetches user profile data from the backend API.
 * 
 * This function retrieves the complete user profile including subscription
 * information and studio settings from the backend using the Clerk user ID.
 * 
 * @param clerkId - The Clerk user ID for authentication
 * @returns Promise resolving to user profile data
 */
export const fetchUserProfile = async (clerkId: string) => {
  const response = await httpClient.get(`/auth/${clerkId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  return response.data;
};

/**
 * Sends a close application signal to the Electron main process.
 * 
 * This function triggers the application shutdown process through IPC communication.
 * It's used by the close button in the control layout.
 */
export const onCloseApp = () => window.ipcRenderer.send("closeApp");

/**
 * Retrieves available media sources from the system.
 * 
 * This function combines two different APIs to get all available media sources:
 * 1. Electron's desktopCapturer API for display sources (screens, windows)
 * 2. Browser's MediaDevices API for audio input devices
 * 
 * @returns Promise resolving to object containing displays and audio inputs
 */
export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke("getSources");
  const enumerateDevices =
    await window.navigator.mediaDevices.enumerateDevices();
  const audioInputs = enumerateDevices.filter(
    (device) => device.kind == "audioinput"
  );
  console.log("getting sources");
  return { displays, audio: audioInputs };
};

/**
 * Updates studio settings on the backend.
 * 
 * This function sends the current studio configuration (screen source, audio input,
 * and quality preset) to the backend for persistence and synchronization.
 * 
 * @param id - User ID for the studio settings
 * @param screen - Selected screen source ID
 * @param audio - Selected audio input device ID
 * @param preset - Recording quality preset (HD or SD)
 * @returns Promise resolving to the API response
 */
export const updateStudioSettings = async (
  id: string,
  screen: string,
  audio: string,
  preset: "HD" | "SD"
) => {
  const response = await httpClient.post(
    `/studio/${id}`,
    { screen, audio, preset },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * Resizes the studio window based on preview state.
 * 
 * This function sends a resize command to the Electron main process to adjust
 * the studio window size when the preview is toggled on or off.
 * 
 * @param shrink - Whether to shrink the window (hide preview) or expand it
 */
export const resizeWindow = (shrink: boolean) =>
  window.ipcRenderer.send("resize-studio", { shrink });

/**
 * Controls the visibility of the plugin window during recording.
 * 
 * This function hides or shows the main control window during recording to
 * prevent it from appearing in the recorded video.
 * 
 * @param state - Whether to hide (true) or show (false) the window
 */
export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

/**
 * Converts milliseconds to a formatted time string.
 * 
 * This function converts a duration in milliseconds to a human-readable
 * time format (HH:MM:SS) and also provides the minute value for
 * recording limit checks.
 * 
 * @param ms - Duration in milliseconds
 * @returns Object containing formatted time string and minute value
 */
export const videoRecordingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");
  const hour = Math.floor(ms / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");
  return { length: `${hour}:${minute}:${second}`, minute };
};
