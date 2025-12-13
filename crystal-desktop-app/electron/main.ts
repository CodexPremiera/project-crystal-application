import { app, BrowserWindow, desktopCapturer, ipcMain, screen, dialog, shell } from "electron";
import { autoUpdater } from "electron-updater";
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

// Custom protocol for browser-based authentication
const PROTOCOL = 'crystalapp';
const DESKTOP_SIGNIN_URL = 'https://www.crystalapp.tech/auth/desktop-signin';

// Store pending deep link URL when app is launched via protocol
let pendingDeepLinkUrl: string | null = null;

// Global window references for the three main windows
let win: BrowserWindow | null;           // Main control window
let studio: BrowserWindow | null;        // Studio tray window
let floatingWebCam: BrowserWindow | null; // Webcam window

/**
 * Handles authentication callback from browser-based sign-in flow.
 * 
 * This function parses the deep link URL from the browser redirect,
 * extracts the sign-in ticket, and sends it to the renderer process
 * to complete the authentication flow.
 * 
 * @param url - The crystalapp:// deep link URL containing the auth ticket
 * @param immediate - If true, send immediately; if false, store for later
 */
function handleAuthCallback(url: string, immediate: boolean = true) {
  console.log('[Auth] Received deep link:', url);
  
  // DEBUG: Show dialog to confirm deep link was received
  dialog.showMessageBox({ 
    type: 'info', 
    title: 'Deep Link Received', 
    message: `URL: ${url}\nImmediate: ${immediate}\nWindow ready: ${win && !win.isDestroyed()}` 
  });
  
  try {
    const parsed = new URL(url);
    // For crystalapp://auth/callback, 'auth' becomes the host, '/callback' is the pathname
    const fullPath = `${parsed.host}${parsed.pathname}`;
    console.log('[Auth] Parsed URL - host:', parsed.host, 'pathname:', parsed.pathname, 'fullPath:', fullPath);
    
    if (fullPath === 'auth/callback' || parsed.pathname === '/auth/callback' || parsed.pathname === '//auth/callback') {
      const ticket = parsed.searchParams.get('ticket');
      console.log('[Auth] Extracted ticket:', ticket ? 'present' : 'missing');
      
      if (ticket) {
        if (immediate && win && !win.isDestroyed()) {
          console.log('[Auth] Sending ticket to renderer immediately');
          win.webContents.send('auth-callback', { ticket });
          win.show();
          win.focus();
          
          // DEBUG: Confirm ticket was sent
          dialog.showMessageBox({ type: 'info', title: 'Auth', message: 'Ticket sent to renderer!' });
        } else {
          console.log('[Auth] Window not ready, storing URL for later');
          pendingDeepLinkUrl = url;
        }
      } else {
        dialog.showErrorBox('Auth Error', 'No ticket found in URL');
      }
    } else {
      dialog.showErrorBox('Auth Error', `Unknown path: ${fullPath}`);
    }
  } catch (error) {
    console.error('[Auth] Failed to parse callback URL:', error);
    dialog.showErrorBox('Auth Error', `Failed to parse URL: ${error}`);
  }
}

/**
 * Process any pending deep link URL after window is ready.
 */
function processPendingDeepLink() {
  if (pendingDeepLinkUrl && win && !win.isDestroyed()) {
    console.log('[Auth] Processing pending deep link');
    handleAuthCallback(pendingDeepLinkUrl, true);
    pendingDeepLinkUrl = null;
  }
}

// Register custom protocol handler for browser-based authentication
// This must be called before app.whenReady()
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

// Check if app was launched via deep link (Windows)
// Store the URL to process after window is ready
console.log('[Auth] Launch args:', process.argv);
const launchUrl = process.argv.find(arg => arg.startsWith(`${PROTOCOL}://`));
if (launchUrl) {
  console.log('[Auth] App launched with deep link:', launchUrl);
  pendingDeepLinkUrl = launchUrl;
}

// DEBUG: Show launch args on startup (will show after app is ready)
app.whenReady().then(() => {
  if (process.argv.length > 1) {
    dialog.showMessageBox({ 
      type: 'info', 
      title: 'Launch Args', 
      message: `App launched with args:\n${process.argv.join('\n')}\n\nDeep link found: ${launchUrl || 'none'}` 
    });
  }
});

// Handle single instance lock for Windows/Linux deep link handling
const gotTheLock = app.requestSingleInstanceLock();
console.log('[Auth] Single instance lock:', gotTheLock ? 'acquired' : 'failed');

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    console.log('[Auth] Second instance detected, commandLine:', commandLine);
    
    // DEBUG: Show what we received
    dialog.showMessageBox({ 
      type: 'info', 
      title: 'Second Instance', 
      message: `Args received:\n${commandLine.join('\n')}` 
    });
    
    const url = commandLine.find(arg => arg.startsWith(`${PROTOCOL}://`));
    if (url) {
      handleAuthCallback(url, true);
    } else {
      dialog.showMessageBox({ type: 'warning', title: 'No URL', message: 'No crystalapp:// URL found in args' });
    }
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });
}

// Handle deep links on macOS
app.on('open-url', (event, url) => {
  event.preventDefault();
  console.log('[Auth] macOS open-url event:', url);
  if (app.isReady() && win && !win.isDestroyed()) {
    handleAuthCallback(url, true);
  } else {
    pendingDeepLinkUrl = url;
  }
});

/**
 * Creates and configures all three application windows.
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
    
    // Process any pending deep link after window is ready
    processPendingDeepLink();
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

/**
 * IPC handler for opening browser-based sign-in page.
 * 
 * This handler opens the user's default browser to the Crystal web app's
 * desktop sign-in page, initiating the OAuth-style authentication flow.
 * After authentication, the browser redirects back to the desktop app
 * via the crystalapp:// protocol.
 * 
 * @returns Promise that resolves when the browser is opened
 */
ipcMain.handle('open-browser-signin', async () => {
  console.log('[Auth] Opening browser for sign-in');
  await shell.openExternal(DESKTOP_SIGNIN_URL);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  try {
    createWindow();
    
    if (!VITE_DEV_SERVER_URL) {
      autoUpdater.checkForUpdatesAndNotify();
    }
  } catch (error) {
    console.error('[App] Startup error:', error);
    dialog.showErrorBox('Crystal Error', `Failed to start: ${error}`);
  }
});

// Auto-updater events
autoUpdater.on("checking-for-update", () => {
  console.log("[AutoUpdater] Checking for updates...");
});

autoUpdater.on("update-available", (info) => {
  console.log("[AutoUpdater] Update available:", info.version);
});

autoUpdater.on("update-not-available", () => {
  console.log("[AutoUpdater] No updates available.");
});

autoUpdater.on("download-progress", (progress) => {
  console.log(`[AutoUpdater] Download progress: ${progress.percent.toFixed(1)}%`);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("[AutoUpdater] Update downloaded:", info.version);
  autoUpdater.quitAndInstall(false, true);
});

autoUpdater.on("error", (err) => {
  console.error("[AutoUpdater] Error:", err.message);
});

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (error) => {
  console.error('[Process] Uncaught exception:', error);
  dialog.showErrorBox('Crystal Error', `Unexpected error: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Process] Unhandled rejection:', reason);
});
