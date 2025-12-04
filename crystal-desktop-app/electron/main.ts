import { app, BrowserWindow, desktopCapturer, ipcMain, screen, session } from "electron";
import { autoUpdater } from "electron-updater";
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'

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

// Local HTTP server for production to avoid file:// protocol issues with cookies
let localServer: ReturnType<typeof createServer> | null = null;
const LOCAL_SERVER_PORT = 45789; // Using a random high port to avoid conflicts

/**
 * MIME type lookup for serving static files.
 */
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
};

/**
 * Starts a local HTTP server to serve the built files.
 * This is necessary to avoid file:// protocol issues with Clerk authentication cookies.
 */
function startLocalServer(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (VITE_DEV_SERVER_URL) {
      resolve(VITE_DEV_SERVER_URL);
      return;
    }

    localServer = createServer((req: IncomingMessage, res: ServerResponse) => {
      let urlPath = req.url || '/';
      
      // Remove query strings
      urlPath = urlPath.split('?')[0];
      
      // Default to index.html for root
      if (urlPath === '/') {
        urlPath = '/index.html';
      }
      
      let filePath = path.join(RENDERER_DIST, urlPath);
      
      // If file doesn't exist, serve index.html (for SPA routing)
      if (!existsSync(filePath)) {
        // Check if it's a known HTML route
        if (urlPath.endsWith('.html')) {
          filePath = path.join(RENDERER_DIST, urlPath);
        } else {
          filePath = path.join(RENDERER_DIST, 'index.html');
        }
      }
      
      // Ensure the file exists
      if (!existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
      
      try {
        const content = readFileSync(filePath);
        res.writeHead(200, { 
          'Content-Type': mimeType,
          'Cache-Control': 'no-cache',
        });
        res.end(content);
      } catch (err) {
        console.error('[LocalServer] Error reading file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });

    localServer.on('error', (err) => {
      console.error('[LocalServer] Server error:', err);
      reject(err);
    });

    localServer.listen(LOCAL_SERVER_PORT, '127.0.0.1', () => {
      const baseUrl = `http://127.0.0.1:${LOCAL_SERVER_PORT}`;
      console.log(`[LocalServer] Started at ${baseUrl}`);
      resolve(baseUrl);
    });
  });
}

/**
 * Configures the session to allow third-party cookies and fix Origin headers for Clerk authentication.
 * 
 * Clerk's production API keys are domain-locked, so we need to:
 * 1. Modify the Origin header for Clerk requests to match the allowed domain
 * 2. Handle CORS and cookie policies appropriately
 */
function configureSession() {
  // Configure both the default session and our custom partition session
  const sessions = [
    session.defaultSession,
    session.fromPartition('persist:crystal-main')
  ];
  
  const ALLOWED_ORIGIN = 'https://www.crystalapp.tech';
  
  sessions.forEach(ses => {
    // Intercept requests to Clerk and modify the Origin header
    ses.webRequest.onBeforeSendHeaders(
      { urls: ['*://*.clerk.com/*', '*://*.clerk.dev/*', '*://clerk.*/*', '*://*.accounts.dev/*', '*://*clerk*/*'] },
      (details, callback) => {
        const requestHeaders = { ...details.requestHeaders };
        
        // Set the Origin header to the allowed domain for Clerk requests
        if (details.url.includes('clerk')) {
          requestHeaders['Origin'] = ALLOWED_ORIGIN;
          requestHeaders['Referer'] = ALLOWED_ORIGIN + '/';
          console.log(`[Clerk] Modified Origin header for: ${details.url}`);
        }
        
        callback({ requestHeaders });
      }
    );
    
    // Allow cookies from Clerk domains and handle CORS
    ses.webRequest.onHeadersReceived((details, callback) => {
      const responseHeaders = { ...details.responseHeaders };
      
      // Handle Clerk domain responses
      if (details.url.includes('clerk') || details.url.includes('accounts.dev')) {
        // Remove restrictive headers
        delete responseHeaders['x-frame-options'];
        delete responseHeaders['X-Frame-Options'];
        
        // Allow CORS from our app
        responseHeaders['Access-Control-Allow-Origin'] = ['*'];
        responseHeaders['Access-Control-Allow-Credentials'] = ['true'];
        responseHeaders['Access-Control-Allow-Methods'] = ['GET, POST, PUT, DELETE, OPTIONS'];
        responseHeaders['Access-Control-Allow-Headers'] = ['*'];
      }
      
      callback({ responseHeaders });
    });
    
    // Configure cookie handling to be more permissive for auth
    ses.cookies.on('changed', (_event, cookie, _cause, removed) => {
      if (cookie.domain?.includes('clerk')) {
        console.log(`[Cookies] Clerk cookie ${removed ? 'removed' : 'set'}: ${cookie.name}`);
      }
    });
  });
}

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Global window references for the three main windows
let win: BrowserWindow | null;           // Main control window
let studio: BrowserWindow | null;        // Studio tray window
let floatingWebCam: BrowserWindow | null; // Webcam window
let appBaseUrl: string = '';              // Base URL for loading app (HTTP server or dev server)

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
function createWindow(baseUrl: string) {
  appBaseUrl = baseUrl;
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
      partition: 'persist:crystal-main',
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
      partition: 'persist:crystal-main',
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
      partition: 'persist:crystal-main',
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
  
  /**
   * Navigation interception for authentication flow.
   * 
   * Monitors navigation events for debugging. Allows Clerk auth URLs and
   * blocks navigation to the web app domain to keep users in the desktop app.
   */
  win.webContents.on('will-navigate', (event, url) => {
    console.log('[Navigation] Attempting to navigate to:', url);
    
    // Always allow Clerk authentication URLs
    const isClerkAuth = url.includes('clerk') || 
                        url.includes('accounts.dev') || 
                        url.includes('accounts.google.com') ||
                        url.includes('.clerk.');
    
    if (isClerkAuth) {
      console.log('[Navigation] Allowing Clerk auth URL');
      return;
    }
    
    // Allow our local server URLs (both dev and production)
    const isLocalAppUrl = url.includes('localhost:5173') || 
                          url.includes('127.0.0.1:5173') ||
                          url.includes(`127.0.0.1:${LOCAL_SERVER_PORT}`) ||
                          url.includes(`localhost:${LOCAL_SERVER_PORT}`);
    
    if (isLocalAppUrl) {
      console.log('[Navigation] Allowing local app URL');
      return;
    }
    
    // Block navigation to web app URLs (localhost:3000 and production web app)
    const isWebAppUrl = url.includes('localhost:3000') || 
                        url.includes('127.0.0.1:3000');
    
    // Note: We no longer block crystalapp.tech entirely, only the dashboard routes
    const isWebAppDashboard = url.includes('crystalapp.tech/dashboard') ||
                              url.includes('crystalapp.tech/auth/callback');
    
    if (isWebAppUrl || isWebAppDashboard) {
      console.log('[Navigation] Blocked web app URL, reloading desktop app');
      event.preventDefault();
      
      setTimeout(() => {
        win?.loadURL(appBaseUrl);
      }, 500);
    } else {
      console.log('[Navigation] Allowing external URL:', url);
    }
  });
  
  /**
   * Window open handler for controlling popup behavior.
   * 
   * Allows Clerk authentication popups and OAuth providers to open normally.
   */
  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log('[WindowOpen] Requested:', url);
    // Allow Clerk auth, OAuth providers (Google, etc.), and localhost
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
  
  // Load the app using the HTTP base URL (works for both dev and production)
  console.log(`[App] Loading from: ${baseUrl}`);
  win.loadURL(baseUrl);
  studio.loadURL(`${baseUrl}/studio.html`);
  floatingWebCam.loadURL(`${baseUrl}/webcam.html`);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  // Close local server if running
  if (localServer) {
    localServer.close();
    localServer = null;
  }
  
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
  if (BrowserWindow.getAllWindows().length === 0 && appBaseUrl) {
    createWindow(appBaseUrl);
  }
});

app.whenReady().then(async () => {
  // Configure session for Clerk authentication cookies
  configureSession();
  
  // Start local HTTP server (in production) or use dev server URL
  const baseUrl = await startLocalServer();
  
  createWindow(baseUrl);
  
  // Check for updates in production (not during development)
  if (!VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

/**
 * Auto-updater event handlers for logging update status.
 */
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
  // Automatically install update when the app quits
  autoUpdater.quitAndInstall(false, true);
});

autoUpdater.on("error", (err) => {
  console.error("[AutoUpdater] Error:", err.message);
});
