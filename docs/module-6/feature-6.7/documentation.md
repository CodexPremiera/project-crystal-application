# Feature 6.7: Webcam Preview

## Features Covered
| #   | Feature/Transaction                            | Actor |
|-----|------------------------------------------------|-------|
| 6.7 | User can view webcam preview during recording  | User  |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "User" as user
actor "System" as system

rectangle "Webcam Preview" {
  usecase "Open Webcam Window" as UC1
  usecase "View Live Camera Feed" as UC2
  usecase "Position Floating Window" as UC3
  usecase "Request Camera Access" as UC4
  usecase "Stream Camera Feed" as UC5
}

user --> UC1
user --> UC2
user --> UC3
UC1 ..> UC4 : <<include>>
UC1 ..> UC5 : <<include>>
system --> UC4
system --> UC5
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-6.7 |
| **Use Case Name** | Webcam Preview |
| **Actor(s)** | User, System |
| **Description** | User views a live webcam preview in a separate floating window that can be positioned anywhere on screen during recording. |
| **Preconditions** | 1. Desktop app is running<br>2. Webcam is connected<br>3. Camera permissions granted |
| **Postconditions** | 1. Live webcam feed displayed in floating window |
| **Main Flow** | 1. User launches webcam window from desktop app<br>2. System requests camera access from browser API<br>3. System receives MediaStream from webcam<br>4. System displays stream in video element<br>5. User can drag window to any position<br>6. Preview continues until window is closed |
| **Alternative Flows** | A1: Camera access denied → Window shows error state |
| **Exceptions** | E1: No camera found → Stream fails to initialize |

---

## Activity Diagram

```plantuml
@startuml

start

:User opens Webcam window;

:WebCam component mounts;

:Call navigator.mediaDevices.getUserMedia\n({ video: true, audio: false });

if (Camera access granted?) then (yes)
  :Receive MediaStream;
  
  :Set video element srcObject;
  
  :Call video.play();
  
  :Display live camera feed;
  
  :Window is draggable\n(always on top);
  
  :User positions window as needed;
  
  :Continue showing preview;
  stop
else (no)
  :Show permission error;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components (Desktop App)

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| WebCam | `src/components/global/webcam.tsx` | Webcam preview component with live feed | Video Component |
| web_cam_app.tsx | `src/web_cam_app.tsx` | Root app for webcam window | App Component |
| web_cam_main.tsx | `src/web_cam_main.tsx` | Entry point for webcam window | Entry Point |

### Electron Configuration

| Component | Description | Type |
|-----------|-------------|------|
| Webcam BrowserWindow | Separate Electron window for webcam | Electron Window |
| Always-on-top | Window property for overlay behavior | Window Property |
| Frameless | Removes window decorations | Window Property |
| Draggable | CSS class for window dragging | CSS Property |

---

## Component/Module Diagram

```plantuml
@startuml

package "Electron Main Process" {
  [Main Window] as MW
  [Webcam Window] as WW
}

package "Webcam Renderer" {
  [web_cam_main.tsx] as WCM
  [web_cam_app.tsx] as WCA
  [WebCam Component] as WC
}

package "Browser APIs" {
  [MediaDevices API] as MDA
  [getUserMedia] as GUM
}

package "Hardware" {
  [Camera Device] as CAM
}

MW --> WW : opens
WW --> WCM : loads
WCM --> WCA : renders
WCA --> WC : contains

WC --> GUM : requests stream
GUM --> MDA : calls
MDA --> CAM : accesses
CAM --> MDA : MediaStream
MDA --> WC : video stream
WC --> WC : displays in <video>
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "User" as user
participant "Electron Main" as main
participant "Webcam Window" as window
participant "WebCam Component" as component
participant "MediaDevices API" as media
participant "Camera" as camera

user -> main: Opens webcam preview
activate main

main -> window: Create new BrowserWindow\n(frameless, always-on-top)
activate window

window -> window: Load web_cam_main.tsx

window -> component: Mount WebCam component
activate component

component -> component: useEffect on mount

component -> media: getUserMedia({ video: true })
activate media

media -> camera: Request access
activate camera

camera --> media: MediaStream
deactivate camera

media --> component: stream
deactivate media

component -> component: camElement.srcObject = stream

component -> component: camElement.play()

component --> user: Display live webcam feed

note over component
  Video element properties:
  - Mirrored (scaleX: -1)
  - Circular crop (rounded-full)
  - 48x48 rem size
  - Draggable window
end note

deactivate component
deactivate window
deactivate main
@enduml
```

---

## ERD and Schema

```plantuml
@startuml

note as N1
  The Webcam Preview feature does not
  persist data to the database.
  
  It uses the browser's MediaDevices API
  to access the camera and displays
  the live feed in real-time.
  
  Window Properties:
  - Size: 192x192 pixels (circular)
  - Always on top: true
  - Frameless: true
  - Transparent background
  - Draggable
  - Mirrored horizontally
end note
@enduml
```

### Component Code Reference

```typescript
// WebCam component - src/components/global/webcam.tsx
export const WebCam = () => {
  const camElement = useRef<HTMLVideoElement | null>(null);

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

  useEffect(() => {
    streamWebCam();
  }, []);

  return (
    <video
      ref={camElement}
      className="w-48 h-48 draggable object-cover rounded-full border-2 border-white"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
};
```

### Video Element Styling

| Property | Value | Purpose |
|----------|-------|---------|
| width | 48 (192px) | Fixed circular size |
| height | 48 (192px) | Fixed circular size |
| object-cover | true | Fills container without distortion |
| rounded-full | true | Circular clip mask |
| border | 2px white | Visual boundary |
| transform | scaleX(-1) | Mirror image horizontally |
| draggable | class | Allows window repositioning |

