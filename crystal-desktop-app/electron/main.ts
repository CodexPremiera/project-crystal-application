import { app, BrowserWindow, desktopCapturer, ipcMain, screen, dialog } from "electron";
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

// Global window references for the three main windows
let win: BrowserWindow | null;
let studio: BrowserWindow | null;
let floatingWebCam: BrowserWindow | null;

/**
 * Creates and configures all three application windows.
 */
function createWindow() {
  try {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    
    const margin = 20;
    const mainWidth = 480;
    const mainHeight = 400;
    const studioWidth = 320;
    const studioHeight = 50;
    const webcamSize = 192;
    
    const mainX = Math.floor((screenWidth - mainWidth) / 2);
    const mainY = Math.floor((screenHeight - mainHeight) / 2);
    const studioX = screenWidth - studioWidth - 2 * margin;
    const studioY = screenHeight - 5 * studioHeight - 2 * margin;
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
    
    win.webContents.on("did-finish-load", () => {
      win?.webContents.send("main-process-message", new Date().toLocaleString());
    });
    
    studio.webContents.on("did-finish-load", () => {
      studio?.webContents.send("main-process-message", new Date().toLocaleString());
    });
    
    // Handle navigation
    win.webContents.on('will-navigate', (event, url) => {
      console.log('[Navigation] Attempting to navigate to:', url);
      
      const isClerkAuth = url.includes('clerk') || 
                          url.includes('accounts.dev') || 
                          url.includes('accounts.google.com') ||
                          url.includes('.clerk.');
      
      if (isClerkAuth) {
        return;
      }
      
      const isLocalAppUrl = url.includes('localhost:5173') || 
                            url.includes('127.0.0.1:5173');
      
      if (isLocalAppUrl) {
        return;
      }
      
      const isWebAppUrl = url.includes('localhost:3000') || 
                          url.includes('127.0.0.1:3000');
      
      const isWebAppDashboard = url.includes('crystalapp.tech/dashboard') ||
                                url.includes('crystalapp.tech/auth/callback');
      
      if (isWebAppUrl || isWebAppDashboard) {
        event.preventDefault();
        setTimeout(() => {
          if (VITE_DEV_SERVER_URL) {
            win?.loadURL(VITE_DEV_SERVER_URL);
          } else {
            win?.loadFile(path.join(RENDERER_DIST, "index.html"));
          }
        }, 500);
      }
    });
    
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.includes('clerk') || 
          url.includes('accounts.dev') || 
          url.includes('accounts.google.com') ||
          url.includes('.clerk.') ||
          url.includes('localhost') ||
          url.includes('127.0.0.1')) {
        return { action: 'allow' };
      }
      return { action: 'deny' };
    });
    
    // Load the app
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
      studio.loadURL("http://localhost:5173/studio.html");
      floatingWebCam.loadURL("http://localhost:5173/webcam.html");
    } else {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
      studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
      floatingWebCam.loadFile(path.join(RENDERER_DIST, "webcam.html"));
    }
    
    // Handle window errors
    win.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
      console.error(`[Window] Failed to load: ${errorCode} - ${errorDescription}`);
    });
    
  } catch (error) {
    console.error('[CreateWindow] Error:', error);
    dialog.showErrorBox('Crystal Error', `Failed to create window: ${error}`);
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

ipcMain.on("closeApp", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

ipcMain.handle("getSources", async () => {
  return await desktopCapturer.getSources({
    thumbnailSize: { height: 100, width: 150 },
    fetchWindowIcons: true,
    types: ["window", "screen"],
  });
});

ipcMain.on("media-sources", (_event, payload) => {
  studio?.webContents.send("profile-received", payload);
});

ipcMain.on("resize-studio", (_event, payload) => {
  if (payload.shrink) {
    studio?.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio?.setSize(400, 250);
  }
});

ipcMain.on("hide-plugin", (_event, payload) => {
  win?.webContents.send("hide-plugin", payload);
});

ipcMain.on("open-devtools", () => {
  win?.webContents.openDevTools();
});

ipcMain.on("minimize-window", () => {
  win?.minimize();
});

app.on("activate", () => {
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
