/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { onStopRecording, selectSources, StartRecording } from "@/lib/recorder";
import { cn, resizeWindow, videoRecordingTime } from "@/lib/utils";
import { Cast, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * StudioTray component - The main recording control interface.
 * 
 * This component provides the recording controls and preview functionality for the Crystal Desktop App.
 * It manages the recording state, timer, and media source selection for screen recording.
 * 
 * Key Features:
 * - Real-time recording timer with automatic stop for FREE plan (5 minutes)
 * - Recording start/stop controls with visual feedback
 * - Live preview of the recording area
 * - Preview toggle to show/hide the recording preview
 * - Automatic media source selection and stream management
 * - Window resizing based on preview state
 * 
 * The component receives media source configuration through IPC communication
 * from the main control window and manages the recording workflow.
 */
export const StudioTray = () => {
  let initialTime = new Date();
  
  // Media source configuration received from main control window
  const [onSources, setOnSources] = useState<
    | {
        screen: string;
        id: string;
        audio: string;
        preset: "HD" | "SD";
        plan: "PRO" | "FREE";
      }
    | undefined
  >(undefined);
  
  // Recording state management
  const [recording, setRecording] = useState<boolean>(false);
  const [onTimer, setOnTimer] = useState<string>("00:00:00");
  const [count, setCount] = useState<number>(0);

  /**
   * Resets the recording timer to initial state.
   * Called when recording stops or when resetting the timer.
   */
  const clearTime = () => {
    setOnTimer("00:00:00");
    setCount(0);
  };

  // Listen for media source configuration from main control window
  window.ipcRenderer.on("profile-received", (event, payload) => {
    console.log(event);
    setOnSources(payload);
  });

  // Preview state for showing/hiding the recording preview
  const [preview, setPreview] = useState<boolean>(false);

  // Video element reference for displaying the recording preview
  const videoElement = useRef<HTMLVideoElement | null>(null);

  /**
   * Effect to handle media source selection and stream setup.
   * Automatically selects the configured sources when they change.
   */
  useEffect(() => {
    if (onSources && onSources.screen) selectSources(onSources, videoElement);
    return () => {
      selectSources(onSources!, videoElement);
    };
  }, [onSources]);

  /**
   * Effect to handle window resizing based on preview state.
   * Resizes the studio window when preview is toggled.
   */
  useEffect(() => {
    resizeWindow(preview);
    return () => resizeWindow(preview);
  }, [preview]);

  /**
   * Effect to handle recording timer and automatic stop for FREE plan.
   * Updates the timer every millisecond and automatically stops recording
   * after 5 minutes for FREE plan users.
   */
  useEffect(() => {
    if (!recording) return;
    const recordTimeInterval = setInterval(() => {
      let time = count + (new Date().getTime() - initialTime.getTime());
      setCount(time);
      const recordingTime = videoRecordingTime(time);
      
      // Auto-stop recording for FREE plan after 5 minutes
      if (onSources?.plan === "FREE" && recordingTime.minute == "05") {
        setRecording(false);
        clearTime();
        onStopRecording();
      }
      
      setOnTimer(recordingTime.length);
      if (time <= 0) {
        setOnTimer("00:00:00");
        clearInterval(recordTimeInterval);
      }
    }, 1);
    return () => clearInterval(recordTimeInterval);
  }, [recording]);

  return !onSources ? (
    <></>
  ) : (
    <div className="flex flex-col justify-end gap-y-5 h-screen">
      <video
        autoPlay
        ref={videoElement}
        className={cn(
          "w-8/12 border-2 self-end rounded-2xl border-white/40",
          preview ? "hidden" : ""
        )}></video>

      <div className="rounded-full flex justify-around px-8 items-center h-16 w-full border-2 bg-[#171717] draggable border-white/40">
        {!recording ? (
          <div
            {...(onSources && {
              onClick: () => {
                setRecording(true);
                StartRecording(onSources);
              },
            })}
            className={cn(
              "non-draggable rounded-full cursor-pointer relative hover:opacity-80 bg-red-400 w-8 h-8"
            )}>        
          </div>
        ) : (
          <>
            <Square
              size={32}
              className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150"
              fill="white"
              onClick={() => {
                setRecording(false);
                clearTime();
                onStopRecording();
              }}
              stroke="white"
            />
            <span className="text-white">
              {onTimer}
            </span>
          </>
        )}
        <Cast
          onClick={() => setPreview((prev) => !prev)}
          size={32}
          fill="white"
          className="non-draggable cursor-pointer hover:opacity-60"
          stroke="white"
        />
      </div>
    </div>
  );
};
