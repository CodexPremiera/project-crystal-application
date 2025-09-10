import io from "socket.io-client";
import { v4 as uuid } from "uuid";
import { hidePluginWindow } from "./utils";
import React from "react";

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

let mediaRecorder: MediaRecorder;
let videoTransferFileName: string | undefined;
let userId: string;

/**
 * Selects and configures media sources for screen recording.
 * 
 * This function sets up the media streams for screen recording by:
 * 1. Creating a screen capture stream with the specified display source
 * 2. Creating an audio capture stream with the specified audio input
 * 3. Combining both streams into a single MediaStream
 * 4. Setting up the MediaRecorder with appropriate codecs
 * 5. Configuring the video element for preview display
 * 
 * @param onSources - Configuration object containing screen source, audio source, user ID, and quality preset
 * @param videoElement - React ref to the video element for preview display
 */
export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement> | null
) => {
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: onSources?.screen,
          minWidth: onSources.preset === "HD" ? 1920 : 1280,
          maxWidth: onSources.preset === "HD" ? 1920 : 1280,
          minHeight: onSources.preset === "HD" ? 1080 : 720,
          maxHeight: onSources.preset === "HD" ? 1080 : 720,
          frameRate: 30,
        },
      },
    };

    userId = onSources.id;

    //create stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    //audio & webcam stream
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: onSources?.audio
        ? { deviceId: { exact: onSources.audio } }
        : false,
    });

    if (videoElement && videoElement.current) {
      videoElement.current.srcObject = stream;
      await videoElement.current.play();
    }

    const combinedStream = new MediaStream([
      ...stream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = stopRecording;
  }
};

/**
 * Starts the screen recording process.
 * 
 * This function initiates the recording by:
 * 1. Hiding the plugin window to avoid recording the UI
 * 2. Generating a unique filename for the video
 * 3. Starting the MediaRecorder with 1-second chunks
 * 
 * @param onSources - Configuration object containing the user ID for filename generation
 */
export const StartRecording = (onSources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

/**
 * Handles video data chunks as they become available during recording.
 * 
 * This function is called by the MediaRecorder whenever new data is available.
 * It sends the video chunks to the server via WebSocket for real-time processing.
 * 
 * @param e - BlobEvent containing the video data chunk
 */
const onDataAvailable = (e: BlobEvent) => {
  socket.emit("video-chunks", {
    chunks: e.data,
    filename: videoTransferFileName,
  });
};

/**
 * Stops the current recording session.
 * 
 * This function stops the MediaRecorder, which triggers the stopRecording
 * callback to process the final video.
 */
export const onStopRecording = () => mediaRecorder.stop();

/**
 * Handles the completion of the recording process.
 * 
 * This function is called when the MediaRecorder stops recording. It:
 * 1. Shows the plugin window again
 * 2. Sends a signal to the server to process the complete video
 * 
 * The server will combine all the video chunks and perform final processing.
 */
const stopRecording = () => {
  hidePluginWindow(false);
  socket.emit("process-video", {
    filename: videoTransferFileName,
    userId,
  });
};
