import { useEffect, useRef } from "react";

/**
 * WebCam component - Displays live camera feed in a floating window.
 * 
 * This component provides a dedicated window for displaying the user's webcam feed.
 * It automatically requests camera access and displays the live stream in a draggable,
 * always-on-top window that can be positioned anywhere on the screen.
 * 
 * Key Features:
 * - Automatic camera access request
 * - Live video stream display
 * - Draggable window interface
 * - Responsive aspect ratio (16:9)
 * - Clean, minimal UI with rounded corners
 * 
 * The component is designed to work alongside the main recording interface,
 * providing users with a separate camera feed window for reference or inclusion
 * in their recordings.
 */
export const WebCam = () => {
  const camElement = useRef<HTMLVideoElement | null>(null);

  /**
   * Initializes the webcam stream and starts displaying the video feed.
   * Requests access to the user's camera and sets up the video element.
   */
  const streamWebCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (camElement.current) {
      camElement.current.srcObject = stream;
      await camElement.current.play();
    }
  };

  // Initialize webcam stream on component mount
  useEffect(() => {
    streamWebCam();
  }, []);

  return (
    <video
      ref={camElement}
      className="h-screen draggable object-cover rounded-lg aspect-video border-2 relative border-white"></video>
  );
};
