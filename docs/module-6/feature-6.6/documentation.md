# Feature 6.6: Screen Recording

## Features Covered
| #     | Feature/Transaction                                               | Actor  |
|-------|-------------------------------------------------------------------|--------|
| 6.6   | User can record their screen (start and stop)                     | User   |
| 6.6.1 | System streams video chunks to server during recording            | System |
| 6.6.2 | System hides plugin window during recording to avoid capturing it | System |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "User" as user
actor "System" as system

rectangle "Screen Recording" {
  usecase "Start Recording" as UC1
  usecase "Stop Recording" as UC2
  usecase "View Recording Timer" as UC3
  usecase "Hide Plugin Window" as UC4
  usecase "Stream Video Chunks" as UC5
  usecase "Process Complete Video" as UC6
  usecase "Auto-stop at 5 min (FREE)" as UC7
}

user --> UC1
user --> UC2
user --> UC3
UC1 ..> UC4 : <<include>>
UC1 ..> UC5 : <<include>>
UC2 ..> UC6 : <<include>>
system --> UC4
system --> UC5
system --> UC6
system --> UC7
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-6.6 |
| **Use Case Name** | Screen Recording |
| **Actor(s)** | User, System |
| **Description** | User records their screen using the desktop app. The system streams video chunks in real-time to the server, hides the plugin window during recording, and processes the video when complete. |
| **Preconditions** | 1. User authenticated<br>2. Media sources configured<br>3. Studio tray received configuration |
| **Postconditions** | 1. Video file saved to server<br>2. Video processing initiated<br>3. Plugin window restored |
| **Main Flow** | 1. User clicks red record button<br>2. System hides plugin window (6.6.2)<br>3. System starts MediaRecorder with 1-second chunks<br>4. Timer starts counting<br>5. System streams chunks via WebSocket (6.6.1)<br>6. User clicks stop button<br>7. System stops MediaRecorder<br>8. System shows plugin window<br>9. System signals server to process video |
| **Alternative Flows** | A1: FREE user reaches 5 minutes → Auto-stop recording |
| **Exceptions** | E1: Media stream error → Recording fails to start |

---

## Activity Diagram

```plantuml
@startuml

start

:User clicks Record button;

:Generate unique video filename\n(UUID + userId);

:Hide plugin window via IPC;

:Start MediaRecorder\n(1-second chunk intervals);

:Set recording state = true;

:Start timer (millisecond precision);

fork
  repeat
    :Timer tick every 1ms;
    
    :Update timer display;
    
    if (Plan = FREE AND time >= 5 min?) then (yes)
      :Auto-stop recording;
      break
    endif
  repeat while (Recording?)
fork again
  repeat
    :MediaRecorder emits data chunk;
    
    :Emit "video-chunks" via WebSocket;
    
    :Server receives and saves chunk;
  repeat while (Recording?)
end fork

:User clicks Stop button\nOR Auto-stop triggered;

:Stop MediaRecorder;

:Show plugin window via IPC;

:Emit "process-video" via WebSocket;

:Server combines chunks\nand processes video;

:Clear timer state;

stop

@enduml
```

---

## Component List

### Frontend Components (Desktop App)

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| StudioTray | `src/components/global/studio.tsx` | Main recording interface with controls | Recording Component |
| Record Button | Built-in | Red circle button to start recording | UI Element |
| Stop Button | Built-in | Square button to stop recording | UI Element |
| Timer Display | Built-in | Shows recording duration (HH:MM:SS) | UI Element |
| Preview Toggle | Built-in | Cast icon to toggle preview | UI Element |

### Recording Logic

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| selectSources | `src/lib/recorder.ts` | Configures media streams and MediaRecorder | Function |
| StartRecording | `src/lib/recorder.ts` | Initiates recording with filename generation | Function |
| onStopRecording | `src/lib/recorder.ts` | Stops the MediaRecorder | Function |
| onDataAvailable | `src/lib/recorder.ts` | Handles video chunks, emits to WebSocket | Function |
| stopRecording | `src/lib/recorder.ts` | Cleanup and signals video processing | Function |

### Utilities

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| hidePluginWindow | `src/lib/utils.ts` | IPC call to hide/show plugin window | Function |
| resizeWindow | `src/lib/utils.ts` | IPC call to resize studio window | Function |
| videoRecordingTime | `src/lib/utils.ts` | Converts ms to HH:MM:SS format | Function |
| Socket.IO Client | `src/lib/recorder.ts` | WebSocket connection to server | Client |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Express Server | `express-backend/` | Handles video chunk uploads | Server |
| Socket.IO Server | Handles WebSocket events | Server |
| File System | Saves video chunks to disk | System |

---

## Component/Module Diagram

```plantuml
@startuml

package "Desktop App - Studio Tray" {
  [StudioTray Component] as ST
  [Video Preview] as VP
  [Recording Controls] as RC
  [Timer Display] as TD
}

package "Recording Logic" {
  [selectSources] as SS
  [StartRecording] as SR
  [onStopRecording] as OSR
  [onDataAvailable] as ODA
  [MediaRecorder] as MR
}

package "Media Streams" {
  [Screen Capture Stream] as SCS
  [Audio Input Stream] as AIS
  [Combined MediaStream] as CMS
}

package "Communication" {
  [Socket.IO Client] as SIO
  [Electron IPC] as IPC
}

package "Express Backend" {
  [Socket.IO Server] as SIOS
  [Video Processing] as VPR
}

cloud "File System" {
  [Video Chunks] as VC
  [Final Video] as FV
}

ST --> VP : displays
ST --> RC : contains
ST --> TD : shows timer
RC --> SR : start
RC --> OSR : stop

SS --> SCS : creates
SS --> AIS : creates
SCS --> CMS : combines
AIS --> CMS : combines
CMS --> MR : feeds

SR --> MR : start(1000)
MR --> ODA : ondataavailable
ODA --> SIO : emit("video-chunks")

SIO --> SIOS : WebSocket
SIOS --> VC : saves chunks

OSR --> MR : stop()
MR --> SIO : emit("process-video")
SIOS --> VPR : process
VPR --> FV : creates
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "User" as user
participant "StudioTray" as studio
participant "recorder.ts" as recorder
participant "MediaRecorder" as media
participant "Electron IPC" as ipc
participant "Socket.IO" as socket
participant "Express Server" as server
database "File System" as fs

== Start Recording ==

user -> studio: Clicks record button
activate studio

studio -> recorder: StartRecording(onSources)
activate recorder

recorder -> ipc: send("hide-plugin", true)
ipc --> recorder: Window hidden

recorder -> recorder: Generate filename\n(uuid-userId.webm)

recorder -> media: start(1000)
activate media

studio -> studio: setRecording(true)
studio -> studio: Start timer interval

studio --> user: Show timer, stop button

== During Recording ==

loop Every 1 second
  media -> recorder: ondataavailable(BlobEvent)
  recorder -> socket: emit("video-chunks", { chunks, filename })
  socket -> server: WebSocket message
  server -> fs: Append to video file
end

== Auto-stop for FREE ==

alt User is FREE and timer >= 5:00
  studio -> studio: setRecording(false)
  studio -> recorder: onStopRecording()
end

== Stop Recording ==

user -> studio: Clicks stop button

studio -> studio: setRecording(false)
studio -> studio: clearTime()

studio -> recorder: onStopRecording()

recorder -> media: stop()
deactivate media

media -> recorder: onstop event

recorder -> ipc: send("hide-plugin", false)
ipc --> recorder: Window shown

recorder -> socket: emit("process-video", { filename, userId })
socket -> server: WebSocket message
server -> server: Process video chunks
server -> fs: Save final video

deactivate recorder
deactivate studio
@enduml
```

---

## ERD and Schema

```plantuml
@startuml

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  description : String?
  source : String <<unique>>
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  processing : Boolean = true
  createdAt : DateTime
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  clerkId : String
}

note right of video
  source: Unique filename
  Format: {uuid}-{userId}.webm
  
  processing: true while
  video is being processed
end note

user ||--o{ video : "creates"
@enduml
```

### Recording Flow Notes

```
Recording Filename Format:
  {uuid}-{userId.slice(0,8)}.webm

Video Codec: VP9 in WebM container

Chunk Interval: 1 second (1000ms)

FREE Plan Limit: 5 minutes

Resolution:
  HD (PRO): 1920x1080 @ 30fps
  SD (FREE): 1280x720 @ 30fps
```

