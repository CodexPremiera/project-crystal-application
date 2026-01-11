# Features 6.1-6.5, 6.8: Media Configuration

## Features Covered
| #   | Feature/Transaction                                                | Actor    |
|-----|--------------------------------------------------------------------|----------|
| 6.1 | User can view available screen capture sources                     | User     |
| 6.2 | User can select a screen source for recording                      | User     |
| 6.3 | User can select an audio input device for recording                | User     |
| 6.4 | PRO user can select recording quality preset (SD/HD)               | PRO User |
| 6.5 | System syncs studio settings between control panel and studio tray | System   |
| 6.8 | System saves studio settings to the database                       | System   |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "User" as user
actor "PRO User" as prouser
actor "System" as system

rectangle "Media Configuration" {
  usecase "View Available Screen Sources" as UC1
  usecase "Select Screen Source" as UC2
  usecase "Select Audio Input Device" as UC3
  usecase "Select Quality Preset" as UC4
  usecase "Sync Settings via IPC" as UC5
  usecase "Save Settings to Database" as UC6
  usecase "Fetch Media Sources" as UC7
}

user --> UC1
user --> UC2
user --> UC3
prouser --> UC4
UC1 ..> UC7 : <<include>>
UC2 ..> UC5 : <<include>>
UC2 ..> UC6 : <<include>>
UC3 ..> UC5 : <<include>>
UC3 ..> UC6 : <<include>>
UC4 ..> UC5 : <<include>>
UC4 ..> UC6 : <<include>>
system --> UC5
system --> UC6
system --> UC7
@enduml
```

---

## Use Case Description

### UC-6.1: View Available Screen Sources

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-6.1 |
| **Use Case Name** | View Available Screen Sources |
| **Actor(s)** | User, System |
| **Description** | User views all available screen capture sources (displays and windows) detected by the system. |
| **Preconditions** | 1. Desktop app is running<br>2. User is authenticated |
| **Postconditions** | 1. Available displays listed in dropdown |
| **Main Flow** | 1. User opens media configuration<br>2. System calls Electron's desktopCapturer API<br>3. System fetches audio input devices from MediaDevices API<br>4. Available sources displayed in dropdowns |

### UC-6.2-6.4: Select Media Sources and Quality

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-6.2-6.4 |
| **Use Case Name** | Configure Recording Sources |
| **Actor(s)** | User, PRO User, System |
| **Description** | User selects screen source, audio input, and quality preset for recording. |
| **Preconditions** | 1. Media sources fetched<br>2. User authenticated |
| **Postconditions** | 1. Selection saved to database<br>2. Settings synced to studio tray window |
| **Main Flow** | 1. User selects screen source from dropdown<br>2. User selects audio input from dropdown<br>3. User selects quality preset (HD for PRO users only)<br>4. System sends settings via IPC to studio tray<br>5. System saves settings to backend database |

### UC-6.5, 6.8: Settings Synchronization

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-6.5/6.8 |
| **Use Case Name** | Sync and Save Settings |
| **Actor(s)** | System |
| **Description** | System syncs settings between control panel and studio tray, and persists to database. |
| **Preconditions** | 1. User has made configuration changes |
| **Postconditions** | 1. Studio tray has updated settings<br>2. Database updated |
| **Main Flow** | 1. User changes any setting<br>2. System watches for form changes<br>3. System sends IPC message to studio tray<br>4. System calls backend API to save settings<br>5. Success toast displayed |

---

## Activity Diagram

```plantuml
@startuml

start

:User opens Desktop App;

:App authenticates via Clerk;

:Fetch user profile with studio settings;

fork
  :Call Electron desktopCapturer;
  
  :Get available display sources;
fork again
  :Call MediaDevices.enumerateDevices();
  
  :Filter audio input devices;
end fork

:Display sources in configuration form;

:Load saved preferences or defaults;

:User selects screen source;

:User selects audio input;

if (User subscription?) then (PRO)
  :User can select HD quality;
else (FREE)
  :HD option disabled\nDefault to SD;
endif

:User changes any setting;

fork
  :Send IPC message to studio tray;
  
  :Studio tray receives configuration;
  
  :Update media streams;
fork again
  :Call backend API to save settings;
  
  if (Save successful?) then (yes)
    :Show success toast;
  else (no)
    :Show error toast;
  endif
end fork

stop

@enduml
```

---

## Component List

### Frontend Components (Desktop App)

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| MediaConfiguration | `src/components/global/widget/media-configuration.tsx` | Main configuration form with dropdowns | Form Component |
| Widget | `src/components/global/widget/widget.tsx` | Container for media configuration | Layout Component |
| Select | `src/components/ui/select.tsx` | Dropdown component for source selection | UI Component |
| Spinner | `src/components/global/loader-spinner.tsx` | Loading state indicator | UI Component |

### Hooks and Utilities

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| useMediaSources | `src/hooks/useMediaSources.ts` | Fetches available displays and audio inputs | Custom Hook |
| useStudioSettings | `src/hooks/useStudioSettings.ts` | Manages settings form with sync and save | Custom Hook |
| getMediaSources | `src/lib/utils.ts` | Utility to call Electron and browser APIs | Utility Function |
| updateStudioSettings | `src/lib/utils.ts` | HTTP call to save settings | Utility Function |
| fetchUserProfile | `src/lib/utils.ts` | Fetches user data with studio settings | Utility Function |

### Backend Components (Express Server)

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Studio Route | `express-backend/routes/studio.ts` | API endpoint for studio settings | Express Route |
| Prisma Client | Database client for Media table | Database Client |

---

## Component/Module Diagram

```plantuml
@startuml

package "Desktop App - Control Panel" {
  [Widget Container] as WC
  [MediaConfiguration] as MC
  [Select Dropdowns] as SD
}

package "Hooks" {
  [useMediaSources] as UMS
  [useStudioSettings] as USS
  [useZodForm] as UZF
}

package "Utilities" {
  [getMediaSources] as GMS
  [updateStudioSettings] as USS_API
  [fetchUserProfile] as FUP
}

package "Electron IPC" {
  [IPC Renderer] as IPC
}

package "Desktop App - Studio Tray" {
  [StudioTray] as ST
}

package "Backend API" {
  [Studio Route] as SR
  [Prisma Client] as PC
}

database "PostgreSQL" {
  [Media Table] as MT
}

package "System APIs" {
  [desktopCapturer] as DC
  [MediaDevices API] as MDA
}

WC --> MC : contains
MC --> SD : renders
MC --> USS : uses
USS --> UZF : form state
USS --> USS_API : save settings
USS --> IPC : sync settings

UMS --> GMS : calls
GMS --> DC : get displays
GMS --> MDA : get audio inputs

IPC --> ST : profile-received
ST --> ST : update media sources

USS_API --> SR : POST /studio/:id
SR --> PC : update
PC --> MT : UPDATE
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "User" as user
participant "MediaConfiguration" as config
participant "useMediaSources" as mediahook
participant "useStudioSettings" as settingshook
participant "Electron IPC" as ipc
participant "StudioTray" as tray
participant "Backend API" as api
database "PostgreSQL" as db

== Initialization ==

user -> config: Opens control panel
activate config

config -> mediahook: fetchMediaResources()
activate mediahook

mediahook -> ipc: invoke("getSources")
ipc --> mediahook: Display sources[]

mediahook -> mediahook: enumerateDevices()
mediahook --> config: { displays, audioInputs }
deactivate mediahook

config -> settingshook: Initialize with saved settings
activate settingshook

settingshook -> ipc: send("media-sources", initial config)
ipc -> tray: profile-received
activate tray
tray -> tray: setOnSources(config)
tray -> tray: selectSources()
deactivate tray

config --> user: Show dropdowns with sources

== User Changes Setting ==

user -> config: Selects new screen source
config -> settingshook: watch() triggers

settingshook -> ipc: send("media-sources", updated config)
ipc -> tray: profile-received
tray -> tray: Update media streams

settingshook -> api: POST /studio/:id
activate api
api -> db: UPDATE Media SET screen, audio, preset
db --> api: Updated
api --> settingshook: { status: 200, message: "Success" }
deactivate api

settingshook --> config: Show success toast
deactivate settingshook
deactivate config
@enduml
```

---

## ERD and Schema

```plantuml
@startuml

entity "User" as user {
  * id : UUID <<PK>>
  --
  email : String
  clerkId : String <<unique>>
}

entity "Media (Studio)" as media {
  * id : UUID <<PK>>
  --
  screen : String?
  mic : String?
  camera : String?
  preset : PRESET (SD|HD)
  userId : UUID <<FK>> <<unique>>
}

entity "Subscription" as subscription {
  * id : UUID <<PK>>
  --
  plan : SUBSCRIPTION_PLAN
  userId : UUID <<FK>>
}

user ||--o| media : "has studio settings"
user ||--o| subscription : "has plan"

note right of media
  screen: Display source ID
  mic: Audio input device ID
  preset: HD (1080p) or SD (720p)
  HD requires PRO subscription
end note
@enduml
```

### Prisma Schema (Relevant Models)

```prisma
model Media {
  id     String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  screen String?
  mic    String?
  camera String?
  preset PRESET  @default(SD)
  User   User?   @relation(fields: [userId], references: [id])
  userId String? @unique @db.Uuid
}

enum PRESET {
  SD
  HD
}

enum SUBSCRIPTION_PLAN {
  PRO
  FREE
}
```

