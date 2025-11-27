import { app, BrowserWindow, desktopCapturer, ipcMain, screen } from "electron";
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Global window references for the three main windows
let win: BrowserWindow | null;           // Main control window
let studio: BrowserWindow | null;        // Studio tray window
let floatingWebCam: BrowserWindow | null; // Webcam window

/**
 * Creates and configures all three application windows.
 * 
 * This function sets up the main Electron windows for the Crystal Desktop App:
 * 1. Main Control Window (600x600px) - Primary configuration interface
 * 2. Studio Tray Window (400x50px) - Recording controls and preview
 * 3. Webcam Window (160x160px) - Optional camera feed
 * 
 * All windows are configured as:
 * - Frameless and transparent for modern appearance
 * - Always on top for easy access during recording
 * - Non-focusable to avoid interfering with user workflow
 * - Set to be visible on all workspaces including fullscreen apps
 */
function createWindow() {
  // Get primary display dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  
  const margin = 20; // Margin from screen edges
  
  // Main window dimensions
  const mainWidth = 480;
  const mainHeight = 400;
  
  // Studio window dimensions
  const studioWidth = 320;
  const studioHeight = 50;
  
  // Webcam window dimensions
  const webcamSize = 192;
  
  // Calculate positions
  // Main window - centered
  const mainX = Math.floor((screenWidth - mainWidth) / 2);
  const mainY = Math.floor((screenHeight - mainHeight) / 2);
  
  // Studio - lower right
  const studioX = screenWidth - studioWidth - 2 * margin;
  const studioY = screenHeight - 5 * studioHeight - 2 * margin;
  
  // Webcam - lower left
  const webcamX = margin;
  const webcamY = screenHeight - webcamSize - margin;
  
  win = new BrowserWindow({
    width: mainWidth,
    height: mainHeight,
    x: mainX,
    y: mainY,
    minWidth: 540,
    minHeight: 200,
    frame: false,
    transparent: true,  
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  
  studio = new BrowserWindow({
    width: studioWidth,
    height: studioHeight,
    x: studioX,
    y: studioY,
    minHeight: 70,
    maxHeight: 400,
    minWidth: studioWidth,
    maxWidth: studioWidth,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  
  floatingWebCam = new BrowserWindow({
    width: webcamSize,
    height: webcamSize,
    x: webcamX,
    y: webcamY,
    minHeight: 192,
    maxHeight: 192,
    minWidth: 192,
    maxWidth: 192,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);
  
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  
  studio.webContents.on("did-finish-load", () => {
    studio?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });
  
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL("http://localhost:5173/studio.html");
    floatingWebCam.loadURL("http://localhost:5173/webcam.html");
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    floatingWebCam.loadFile(path.join(RENDERER_DIST, "webcam.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  //this only works on windows
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

/**
 * IPC handler for closing the application.
 * Only works on Windows - macOS handles this automatically.
 */
ipcMain.on("closeApp", () => {
  //only works on windows, mac does not need this
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

/**
 * IPC handler for retrieving available media sources.
 * 
 * This handler uses Electron's desktopCapturer API to get available
 * display sources (screens and windows) for screen recording.
 * 
 * @returns Promise resolving to array of available sources
 */
ipcMain.handle("getSources", async () => {
  return await desktopCapturer.getSources({
    thumbnailSize: { height: 100, width: 150 },
    fetchWindowIcons: true,
    types: ["window", "screen"],
  });
});

/**
 * IPC handler for syncing media source configuration between windows.
 * 
 * This handler forwards media source configuration from the main control
 * window to the studio tray window to keep them synchronized.
 * 
 * @param event - IPC event object
 * @param payload - Media source configuration object
 */
ipcMain.on("media-sources", (event, payload) => {
  console.log(event);
  studio?.webContents.send("profile-received", payload);
});

/**
 * IPC handler for resizing the studio window.
 * 
 * This handler adjusts the studio window size based on whether the
 * preview is being shown or hidden.
 * 
 * @param event - IPC event object
 * @param payload - Object containing shrink boolean
 */
ipcMain.on("resize-studio", (event, payload) => {
  console.log(event);
  if (payload.shrink) {
    studio?.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio?.setSize(400, 250);
  }
});

/**
 * IPC handler for controlling plugin window visibility.
 * 
 * This handler hides or shows the main control window during recording
 * to prevent it from appearing in the recorded video.
 * 
 * @param event - IPC event object
 * @param payload - Object containing state boolean
 */
ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event);
  win?.webContents.send("hide-plugin", payload);
});

/**
 * IPC handler for opening DevTools for debugging.
 * 
 * This handler opens the DevTools window when the debug button is clicked,
 * allowing developers to view console logs and debug the application.
 * 
 * @param event - IPC event object
 */
ipcMain.on("open-devtools", () => {
  win?.webContents.openDevTools();
});

/**
 * IPC handler for minimizing the main window.
 * Minimizes the window to the taskbar/dock.
 */
ipcMain.on("minimize-window", () => {
  win?.minimize();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
