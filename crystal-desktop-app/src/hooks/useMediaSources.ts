import { getMediaSources } from "@/lib/utils";
import { useReducer } from "react";

export type SourceDeviceStateProps = {
  displays?: {
    appIcon: null;
    display_id: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInputs?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  error?: string | null;
  isPending?: boolean;
};

type DisplayDeviceActionProps = {
  type: "GET_DEVICES";
  payload: SourceDeviceStateProps;
};

/**
 * Custom hook for managing media source detection and state.
 * 
 * This hook provides a centralized way to manage available media sources including:
 * - Display sources (screens, windows) from Electron's desktopCapturer
 * - Audio input devices from the browser's MediaDevices API
 * - Loading states and error handling
 * 
 * The hook uses a reducer pattern to manage complex state updates and provides
 * a simple interface for fetching and accessing media sources throughout the app.
 * 
 * @returns Object containing the current state and a function to fetch media resources
 */
export const useMediaSources = () => {
  const [state, action] = useReducer(
    (state: SourceDeviceStateProps, action: DisplayDeviceActionProps) => {
      switch (action.type) {
        case "GET_DEVICES":
          return { ...state, ...action.payload };
        default:
          return state;
      }
    },
    {
      displays: [],
      audioInputs: [],
      error: null,
      isPending: false,
    }
  );

  /**
   * Fetches available media sources from the system.
   * 
   * This function:
   * 1. Sets the loading state to true
   * 2. Calls the getMediaSources utility to fetch displays and audio devices
   * 3. Updates the state with the fetched sources and sets loading to false
   * 
   * The function handles both Electron's desktopCapturer API for display sources
   * and the browser's MediaDevices API for audio input devices.
   */
  const fetchMediaResources = () => {
    action({ type: "GET_DEVICES", payload: { isPending: true } });
    getMediaSources().then((sources) =>
      action({
        type: "GET_DEVICES",
        payload: {
          displays: sources.displays,
          isPending: false,
          audioInputs: sources.audio,
        },
      })
    );
  };

  return { state, fetchMediaResources };
};
