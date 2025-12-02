import { app, ipcMain, desktopCapturer, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let studio;
let floatingWebCam;
function createWindow() {
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
      preload: path.join(__dirname, "preload.mjs")
    }
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
      preload: path.join(__dirname, "preload.mjs")
    }
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
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  studio.webContents.on("did-finish-load", () => {
    studio == null ? void 0 : studio.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  win.webContents.on("will-navigate", (event, url) => {
    console.log("[Navigation] Attempting to navigate to:", url);
    const isWebAppUrl = url.includes("localhost:3000") || url.includes("127.0.0.1:3000");
    const isDesktopAppUrl = url.includes("localhost:5173") || url.includes("127.0.0.1:5173");
    if (isWebAppUrl) {
      console.log("[Navigation] Blocked web app URL, reloading desktop app");
      event.preventDefault();
      setTimeout(() => {
        if (VITE_DEV_SERVER_URL) {
          win == null ? void 0 : win.loadURL(VITE_DEV_SERVER_URL);
        } else {
          win == null ? void 0 : win.loadFile(path.join(RENDERER_DIST, "index.html"));
        }
      }, 500);
    } else if (isDesktopAppUrl) {
      console.log("[Navigation] Allowing desktop app URL");
    } else {
      console.log("[Navigation] Allowing external URL (Clerk auth):", url);
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log("[WindowOpen] Requested:", url);
    if (url.includes("clerk") || url.includes("accounts.dev") || url.includes("accounts.google.com") || url.includes("localhost:5173")) {
      return { action: "allow" };
    }
    return { action: "deny" };
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL("http://localhost:5173/studio.html");
    floatingWebCam.loadURL("http://localhost:5173/webcam.html");
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    floatingWebCam.loadFile(path.join(RENDERER_DIST, "webcam.html"));
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
    types: ["window", "screen"]
  });
});
ipcMain.on("media-sources", (event, payload) => {
  console.log(event);
  studio == null ? void 0 : studio.webContents.send("profile-received", payload);
});
ipcMain.on("resize-studio", (event, payload) => {
  console.log(event);
  if (payload.shrink) {
    studio == null ? void 0 : studio.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio == null ? void 0 : studio.setSize(400, 250);
  }
});
ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event);
  win == null ? void 0 : win.webContents.send("hide-plugin", payload);
});
ipcMain.on("open-devtools", () => {
  win == null ? void 0 : win.webContents.openDevTools();
});
ipcMain.on("minimize-window", () => {
  win == null ? void 0 : win.minimize();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
