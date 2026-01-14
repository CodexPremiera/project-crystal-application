# Features 14.3-14.4: Developer Tools and App Download

## Features Covered
| #    | Feature/Transaction                                 | Actor |
|------|-----------------------------------------------------|-------|
| 14.3 | User can open DevTools for debugging                | User  |
| 14.4 | User can download the desktop app from the web app  | User  |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "Developer" as dev
actor "System" as system

rectangle "DevTools & Download" {
  usecase "Click Debug Button" as UC1
  usecase "Open DevTools Window" as UC2
  usecase "View Console Logs" as UC3
  
  usecase "Click Record Button" as UC4
  usecase "Check App Installed" as UC5
  usecase "Show Download Modal" as UC6
  usecase "Detect Platform" as UC7
  usecase "Download Installer" as UC8
}

dev --> UC1
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>

user --> UC4
UC4 ..> UC5 : <<include>>
UC5 ..> UC6 : <<if not installed>>
UC6 ..> UC7 : <<include>>
user --> UC8
system --> UC5
system --> UC7
@enduml
```

---

## Use Case Description

### UC-14.3: Open DevTools

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-14.3 |
| **Use Case Name** | Open DevTools for Debugging |
| **Actor(s)** | Developer/User |
| **Description** | User opens Chromium DevTools to view console logs and debug the app. |
| **Preconditions** | 1. Desktop app running |
| **Postconditions** | 1. DevTools window opened |
| **Main Flow** | 1. User clicks debug/settings button<br>2. App sends IPC message to main process<br>3. Main process calls openDevTools() |

### UC-14.4: Download Desktop App

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-14.4 |
| **Use Case Name** | Download Desktop App from Web |
| **Actor(s)** | User |
| **Description** | User downloads the desktop app installer from the web application. |
| **Preconditions** | 1. User on web app<br>2. Wants to record screen |
| **Postconditions** | 1. Installer downloaded |
| **Main Flow** | 1. User clicks Record button<br>2. System attempts crystalapp:// protocol<br>3. If app not installed, show download modal<br>4. Modal detects user platform<br>5. User clicks Download<br>6. Installer downloads from GitHub |

---

## Activity Diagram

```plantuml
@startuml
start

fork
  partition "Open DevTools (14.3)" {
    :User clicks debug button;
    
    :Send IPC 'open-devtools';
    
    :Main process receives message;
    
    :Call win.webContents.openDevTools();
    
    :DevTools window opens;
    
    :User can view console, network, etc.;
    stop
  }
fork again
  partition "Download App (14.4)" {
    :User clicks Record button;
    
    :Call launchApp() hook;
    
    :Create hidden iframe;
    
    :Attempt crystalapp:// protocol;
    
    :Start 1.5s timeout;
    
    if (Page loses focus?) then (yes)
      :App launched successfully;
      
      :Cancel timeout;
      stop
    else (no - timeout fires)
      :App not installed;
      
      :Show DownloadAppModal;
      
      :Detect user platform;
      
      note right
        navigator.userAgent:
        - 'win' → Windows
        - 'mac' → macOS
        - 'linux' → Linux
      end note
      
      :Highlight platform download;
      
      :User clicks Download;
      
      :Redirect to GitHub releases;
      
      :Download installer;
      stop
    endif
  }
end fork

@enduml
```

---

## Component List

### Desktop App Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| IPC Handler | `crystal-desktop-app/electron/main.ts` | open-devtools handler | IPC Handler |

### Web App Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| DownloadAppModal | `src/components/global/download-app-modal.tsx` | Download dialog | Modal Component |
| useDesktopApp | `src/hooks/useDesktopApp.ts` | App detection hook | Hook |
| RecordButton | `src/components/global/record-button.tsx` | Triggers launch | Button Component |

---

## Component/Module Diagram

```plantuml
@startuml
package "Desktop App" {
  [main.ts] as MAIN
  [preload.ts] as PRE
  [Renderer] as REN
}

package "Web App" {
  [RecordButton] as RB
  [useDesktopApp] as UDA
  [DownloadAppModal] as DAM
}

package "External" {
  cloud "GitHub Releases" as GH
}

REN --> PRE : ipcRenderer.send
PRE --> MAIN : ipcMain.on('open-devtools')
MAIN --> MAIN : openDevTools()

RB --> UDA : uses
UDA --> UDA : Try crystalapp://
UDA --> DAM : Show if not installed
DAM --> GH : Download link
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "Desktop App" as desktop
participant "main.ts" as main

== Open DevTools (14.3) ==

user -> desktop: Click debug button
desktop -> desktop: ipcRenderer.send('open-devtools')
desktop -> main: IPC 'open-devtools'
activate main

main -> main: win.webContents.openDevTools()
main --> desktop: DevTools window opens

deactivate main

== Download App (14.4) ==

actor "User" as user2
participant "RecordButton" as btn
participant "useDesktopApp" as hook
participant "DownloadAppModal" as modal
participant "GitHub" as gh

user2 -> btn: Click Record
btn -> hook: launchApp()
activate hook

hook -> hook: Create iframe
hook -> hook: Navigate to crystalapp://
hook -> hook: Start 1.5s timeout

alt App installed
  hook -> hook: blur event received
  hook -> hook: Cancel timeout
  hook --> btn: App launched
else App not installed
  hook -> hook: Timeout fires
  hook -> modal: setShowDownloadModal(true)
  deactivate hook
  
  activate modal
  modal -> modal: Detect platform
  modal --> user2: Show download options
  
  user2 -> modal: Click Download (Windows)
  modal -> gh: Redirect to .exe download
  gh --> user2: Download Crystal-Windows-Setup.exe
  deactivate modal
end
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
note as N1
  No database operations.
  
  DevTools:
  Uses Electron's built-in
  Chromium DevTools.
  
  Download:
  Links to GitHub releases
  for each platform.
end note
@enduml
```

### IPC Handler for DevTools

```typescript
// In main.ts
ipcMain.on("open-devtools", () => {
  win?.webContents.openDevTools();
});
```

### Download Links

| Platform | File | URL |
|----------|------|-----|
| Windows | .exe | `github.com/.../Crystal-Windows-Setup.exe` |
| macOS | .dmg | `github.com/.../Crystal-Mac-Installer.dmg` |
| Linux | .AppImage | `github.com/.../Crystal-Linux.AppImage` |

### useDesktopApp Hook

```typescript
export const useDesktopApp = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)

  const launchApp = useCallback(() => {
    // Create hidden iframe for protocol attempt
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.contentWindow?.location.replace('crystalapp://')
    
    // Timeout-based detection
    setTimeout(() => {
      if (!appLaunched) {
        setShowDownloadModal(true)
      }
    }, 1500)
  }, [])

  return {
    launchApp,
    isLaunching,
    showDownloadModal,
    closeDownloadModal,
    openDownloadModal
  }
}
```

### Platform Detection

```typescript
useEffect(() => {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.indexOf('win') !== -1) setPlatform('windows')
  else if (userAgent.indexOf('mac') !== -1) setPlatform('mac')
  else if (userAgent.indexOf('linux') !== -1) setPlatform('linux')
}, [])
```

