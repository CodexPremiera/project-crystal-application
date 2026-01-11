# Features 9.4-9.5: Video Moving

## Features Covered
| #   | Feature/Transaction                                         | Actor |
|-----|-------------------------------------------------------------|-------|
| 9.4 | User can move a video to a different folder (drag and drop) | User  |
| 9.5 | User can move a video to a different workspace              | User  |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Video Moving" {
  usecase "Drag Video Card" as UC1
  usecase "Drop on Folder" as UC2
  usecase "Open Move Dialog" as UC3
  usecase "Select Workspace" as UC4
  usecase "Select Folder" as UC5
  usecase "Confirm Move" as UC6
  usecase "Update Video Location" as UC7
  usecase "Fetch Folders" as UC8
  usecase "Invalidate Caches" as UC9
}

user --> UC1
user --> UC2
user --> UC3
user --> UC4
user --> UC5
user --> UC6
UC2 ..> UC7 : <<include>>
UC6 ..> UC7 : <<include>>
UC4 ..> UC8 : <<include>>
UC7 ..> UC9 : <<include>>
system --> UC7
system --> UC8
system --> UC9
@enduml
```

---

## Use Case Description

### UC-9.4: Drag and Drop to Folder

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.4 |
| **Use Case Name** | Move Video via Drag and Drop |
| **Actor(s)** | User |
| **Description** | User drags a video card and drops it onto a folder to move it. |
| **Preconditions** | 1. Video exists<br>2. Target folder exists in same workspace |
| **Postconditions** | 1. Video's folderId updated |
| **Main Flow** | 1. User starts dragging video card<br>2. System stores videoId in drag context<br>3. User hovers over folder (visual highlight)<br>4. User drops on folder<br>5. System calls moveVideoToFolder<br>6. System updates video.folderId |

### UC-9.5: Move to Different Workspace

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.5 |
| **Use Case Name** | Move Video Between Workspaces |
| **Actor(s)** | User |
| **Description** | User moves a video to a different workspace using a dialog form. |
| **Preconditions** | 1. Video exists<br>2. User has access to target workspace |
| **Postconditions** | 1. Video's workSpaceId updated<br>2. Optional: folderId updated |
| **Main Flow** | 1. User opens move video dialog<br>2. System shows available workspaces<br>3. User selects target workspace<br>4. System fetches folders for selected workspace<br>5. User optionally selects target folder<br>6. User confirms move<br>7. System calls moveVideoLocation |

---

## Activity Diagram

```plantuml
@startuml
start

fork
  partition "Drag and Drop (9.4)" {
    :User starts dragging video card;
    
    :Set dragging state in context;
    
    :Store videoId in dataTransfer;
    
    :User hovers over folder;
    
    :Folder shows drag-over highlight;
    
    :User drops video on folder;
    
    :Extract videoId from dataTransfer;
    
    :Call moveVideoToFolder(videoId, folderId);
    
    :Update Video.folderId;
    
    :Invalidate folder-videos query;
    
    :Show success toast;
    stop
  }
fork again
  partition "Move Dialog (9.5)" {
    :User opens Move Video dialog;
    
    :Load available workspaces from Redux;
    
    :Display workspace dropdown;
    
    :User selects target workspace;
    
    :Fetch folders for selected workspace;
    
    :Display folder dropdown;
    
    :User optionally selects folder;
    
    :User clicks Move;
    
    :Call moveVideoLocation;
    
    note right
      moveVideoLocation(
        videoId,
        workspaceId,
        folderId || null
      )
    end note
    
    :Update Video.workSpaceId;
    
    :Update Video.folderId;
    
    :Invalidate related queries;
    
    :Show success toast;
    
    :Close dialog;
    stop
  }
end fork

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| VideoCard | `src/components/global/videos/video-card.tsx` | Draggable video card | Drag Source |
| Folder | `src/components/global/folders/folder.tsx` | Drop target for videos | Drop Target |
| ChangeVideoLocation | `src/components/forms/change-video-location/index.tsx` | Move dialog form | Form Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useMoveVideos | `src/hooks/useFolders.ts` | Manages move form state and mutation |
| useVideoDrag | Context | Drag and drop context provider |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| moveVideoLocation | `src/actions/workspace.ts` | Updates video location | Server Action |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Card (Drag Source)" {
  [VideoCard] as VC
  [onDragStart] as DS
}

package "Folder (Drop Target)" {
  [Folder] as FL
  [onDrop] as DP
  [onDragOver] as DO
}

package "Move Dialog" {
  [ChangeVideoLocation] as CVL
  [Workspace Select] as WS
  [Folder Select] as FS
}

package "Hooks" {
  [useMoveVideos] as UMV
  [useVideoDrag] as UVD
}

package "Server Actions" {
  [moveVideoLocation] as MVL
}

package "State" {
  [Redux Store] as RX
  [Workspaces] as WKS
  [Folders] as FLS
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video] as VT
  }
}

VC --> DS : triggers
DS --> UVD : sets videoId

FL --> DO : highlight
FL --> DP : handles drop
DP --> UVD : gets videoId
DP --> MVL : move to folder

CVL --> WS : displays
CVL --> FS : displays
WS --> RX : reads workspaces
FS --> UMV : fetches folders

CVL --> UMV : uses
UMV --> MVL : calls
MVL --> PC : update
PC --> VT : UPDATE workSpaceId, folderId
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "VideoCard" as card
participant "VideoDragContext" as ctx
participant "Folder" as folder
participant "ChangeVideoLocation" as dialog
participant "useMoveVideos" as hook
participant "moveVideoLocation" as action
participant "Prisma" as prisma
database "PostgreSQL" as db

== Drag and Drop (9.4) ==

user -> card: Start drag
card -> ctx: setDragging(true)
card -> card: dataTransfer.setData('videoId', id)

user -> folder: Drag over
folder -> folder: setIsDragOver(true)
folder --> user: Show highlight

user -> folder: Drop
folder -> folder: e.dataTransfer.getData('videoId')
folder -> ctx: moveVideoToFolder(videoId, folderId)

ctx -> action: moveVideoLocation(videoId, wsId, folderId)
action -> prisma: video.update({ folderId })
prisma -> db: UPDATE Video
db --> prisma: Updated
action --> ctx: { status: 200 }

ctx --> user: Show success toast

== Move Dialog (9.5) ==

user -> dialog: Open move dialog
activate dialog

dialog -> hook: Initialize with current location
hook --> dialog: workspaces from Redux

user -> dialog: Select workspace
dialog -> hook: Workspace changed
hook -> action: getWorkspaceFolders(wsId)
action --> hook: folders
hook --> dialog: Update folder dropdown

user -> dialog: Select folder (optional)
user -> dialog: Click Move

dialog -> hook: mutate()
hook -> action: moveVideoLocation(videoId, wsId, folderId)

action -> prisma: video.update()
prisma -> db: UPDATE workSpaceId, folderId
db --> prisma: Updated
action --> hook: { status: 200 }

hook -> hook: Invalidate queries
hook --> dialog: Success

dialog --> user: Show success toast
dialog --> user: Close dialog
deactivate dialog
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
  source : String
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  folderId : UUID? <<FK>>
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  type : Type
}

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  name : String
  workSpaceId : UUID <<FK>>
}

note right of video
  Move operations update:
  - workSpaceId (cross-workspace)
  - folderId (within workspace)
  
  folderId = null means
  video is at workspace root
end note

workspace ||--o{ video : "contains"
workspace ||--o{ folder : "has"
folder ||--o{ video : "organizes"
@enduml
```

### Move Location Types

| Scenario | workSpaceId | folderId |
|----------|-------------|----------|
| Move to workspace root | target workspace | null |
| Move to folder (same workspace) | unchanged | target folder |
| Move to folder (different workspace) | target workspace | target folder |

