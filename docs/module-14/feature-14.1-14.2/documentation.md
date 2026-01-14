# Features 14.1-14.2: Auto Update System

## Features Covered
| #    | Feature/Transaction                                     | Actor  |
|------|---------------------------------------------------------|--------|
| 14.1 | System checks for desktop app updates                   | System |
| 14.2 | System downloads and installs app updates automatically | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "System" as system
actor "GitHub Releases" as github

rectangle "Auto Update" {
  usecase "App Starts" as UC1
  usecase "Check for Updates" as UC2
  usecase "Query Release Server" as UC3
  usecase "Compare Versions" as UC4
  usecase "Download Update" as UC5
  usecase "Show Progress" as UC6
  usecase "Install Update" as UC7
  usecase "Restart App" as UC8
}

system --> UC1
UC1 ..> UC2 : <<triggers>>
UC2 ..> UC3 : <<include>>
UC3 --> github
UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<if newer>>
UC5 ..> UC6 : <<include>>
UC5 ..> UC7 : <<include>>
UC7 ..> UC8 : <<include>>
@enduml
```

---

## Use Case Description

### UC-14.1: Check for Updates

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-14.1 |
| **Use Case Name** | Check for Desktop App Updates |
| **Actor(s)** | System |
| **Trigger** | App startup (production mode only) |
| **Description** | System checks GitHub releases for a newer app version. |
| **Preconditions** | 1. App running in production<br>2. Internet connection available |
| **Postconditions** | 1. Update status logged<br>2. Download initiated if update available |

### UC-14.2: Download and Install

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-14.2 |
| **Use Case Name** | Download and Install Update |
| **Actor(s)** | System |
| **Description** | System downloads update in background and installs on completion. |
| **Preconditions** | 1. Update available<br>2. Sufficient disk space |
| **Postconditions** | 1. New version installed<br>2. App restarted |

---

## Activity Diagram

```plantuml
@startuml
start

:App starts (app.whenReady);

if (Development mode?) then (yes)
  :Skip update check;
  stop
else (no)
  :Call autoUpdater.checkForUpdatesAndNotify();
  
  :Log "Checking for updates...";
  
  :Query GitHub releases API;
  
  :Compare local version with latest;
  
  if (Update available?) then (yes)
    :Log "Update available: {version}";
    
    :Begin background download;
    
    :Log download progress;
    
    note right
      Progress events:
      "Download progress: X%"
    end note
    
    :Download complete;
    
    :Log "Update downloaded: {version}";
    
    :Call autoUpdater.quitAndInstall();
    
    :Close app gracefully;
    
    :Install update;
    
    :Restart app with new version;
    stop
  else (no)
    :Log "No updates available";
    stop
  endif
endif

@enduml
```

---

## Component List

### Electron Main Process

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| autoUpdater | electron-updater | Auto update manager | Library |
| main.ts | `crystal-desktop-app/electron/main.ts` | Main process entry | Electron Main |

### External Services

| Service | Purpose |
|---------|---------|
| GitHub Releases | Hosts update packages |
| electron-updater | Manages update lifecycle |

---

## Component/Module Diagram

```plantuml
@startuml
package "Desktop App" {
  [main.ts] as MAIN
  [autoUpdater] as AU
}

package "Electron" {
  [app] as APP
  [BrowserWindow] as BW
}

package "External" {
  cloud "GitHub Releases" as GH
}

APP --> MAIN : whenReady
MAIN --> AU : checkForUpdatesAndNotify

AU --> GH : GET latest release
GH --> AU : Release info + assets

AU --> AU : Compare versions
AU --> AU : Download if newer
AU --> APP : quitAndInstall
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
participant "Electron App" as app
participant "main.ts" as main
participant "autoUpdater" as updater
participant "GitHub Releases" as github

app -> main: app.whenReady()
activate main

main -> main: Check if production
alt Production mode
  main -> updater: checkForUpdatesAndNotify()
  activate updater
  
  updater -> updater: emit "checking-for-update"
  updater -> github: GET /releases/latest
  github --> updater: Release metadata
  
  updater -> updater: Compare versions
  
  alt Update available (14.1)
    updater -> updater: emit "update-available"
    note right: Log version info
    
    updater -> github: Download update asset
    
    loop Download progress
      updater -> updater: emit "download-progress"
      note right: Log percentage
    end
    
    updater -> updater: emit "update-downloaded" (14.2)
    
    updater -> app: quitAndInstall(false, true)
    app -> app: Close windows
    app -> app: Install update
    app -> app: Restart
  else No update
    updater -> updater: emit "update-not-available"
    note right: Log "No updates available"
  end
  
  deactivate updater
end

deactivate main
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
note as N1
  Auto-update system uses
  electron-updater library.
  
  No database operations -
  version comparison is done
  against GitHub releases API.
  
  Release assets stored on
  GitHub as .exe, .dmg, .AppImage
end note
@enduml
```

### electron-updater Configuration

```typescript
// In main.ts
import { autoUpdater } from "electron-updater";

// Check for updates on startup (production only)
app.whenReady().then(() => {
  if (!VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// Event handlers
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
```

### Update Lifecycle Events

| Event | Description |
|-------|-------------|
| checking-for-update | Started version check |
| update-available | Newer version found |
| update-not-available | Already on latest |
| download-progress | Download percentage |
| update-downloaded | Ready to install |
| error | Update failed |

