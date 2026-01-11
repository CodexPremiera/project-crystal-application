# Features 10.1-10.2, 10.4: Video Viewing & View Tracking

## Features Covered
| #    | Feature/Transaction                                                         | Actor  |
|------|-----------------------------------------------------------------------------|--------|
| 10.1 | User can view video preview page                                            | User   |
| 10.2 | System records unique video view per user and increments video view counter | System |
| 10.4 | System creates notification for video owner on view (public workspaces)     | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Video Viewing" {
  usecase "Navigate to Video URL" as UC1
  usecase "View Video Preview Page" as UC2
  usecase "Play Video" as UC3
  usecase "Check Existing View" as UC4
  usecase "Record Unique View" as UC5
  usecase "Increment View Counter" as UC6
  usecase "Create View Notification" as UC7
}

user --> UC1
user --> UC3
UC1 ..> UC2 : <<include>>
UC2 ..> UC4 : <<include>>
UC4 ..> UC5 : <<if new view>>
UC5 ..> UC6 : <<include>>
UC5 ..> UC7 : <<if public workspace>>
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
| **Use Case ID** | UC-10.1-10.2-10.4 |
| **Use Case Name** | Video Preview with View Tracking |
| **Actor(s)** | User, System |
| **Description** | User views video preview page. System automatically tracks unique views per user, increments view counter, and notifies video owner for public workspaces. |
| **Preconditions** | 1. User is authenticated<br>2. Video exists |
| **Postconditions** | 1. Video page displayed<br>2. View recorded (if first view)<br>3. Notification sent (if public workspace) |
| **Main Flow** | 1. User navigates to /preview/:videoId<br>2. System loads video data via getPreviewVideo<br>3. System displays video player and metadata<br>4. useEffect triggers recordVideoView<br>5. System checks VideoView table for existing view<br>6. If no existing view: create VideoView + increment counter<br>7. If public workspace & not owner: create notification |
| **Alternative Flows** | A1: Already viewed → Skip recording |
| **Exceptions** | E1: Video not found → Redirect to home |

---

## Activity Diagram

```plantuml
@startuml
start

:User navigates to /preview/:videoId;

:Fetch video data via getPreviewVideo;

if (Video exists?) then (yes)
  :Render video preview page;
  
  :Display video player;
  
  :Display metadata (title, description, views, likes);
  
  fork
    :User watches video;
  fork again
    :useEffect triggers on mount;
    
    :Call recordVideoView(videoId);
    
    :Get current user from Clerk;
    
    :Find user in database;
    
    :Fetch video with workspace info;
    
    :Check VideoView table for existing view;
    
    if (Already viewed?) then (yes)
      :Return { recorded: false, alreadyViewed: true };
      stop
    else (no)
      :Create VideoView record;
      
      :Increment Video.views counter;
      
      note right
        $transaction:
        1. videoView.create
        2. video.update views++
      end note
      
      if (Public workspace?) then (yes)
        if (Viewer is not owner?) then (yes)
          :Create VIDEO_VIEW notification;
          
          note right
            Notification content:
            "{ViewerName} viewed
             your video {title}"
          end note
        else (no)
        endif
      else (no)
      endif
      
      :Return { recorded: true };
      stop
    endif
  end fork
else (no)
  :Redirect to home;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Main preview page | Page Component |
| video element | Native HTML | Video player | HTML Element |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| getPreviewVideo | `src/actions/workspace.ts` | Fetches video data | Server Action |
| recordVideoView | `src/actions/workspace.ts` | Records unique view | Server Action |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview Page" {
  [VideoPreview] as VP
  [Video Player] as VID
  [Metadata Display] as MD
}

package "React Hooks" {
  [useEffect] as UE
  [useQueryData] as UQD
}

package "Server Actions" {
  [getPreviewVideo] as GPV
  [recordVideoView] as RVV
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video] as VT
    [VideoView] as VVT
    [Notification] as NT
  }
}

VP --> VID : renders
VP --> MD : renders
VP --> UQD : fetch data
UQD --> GPV : calls

VP --> UE : on mount
UE --> RVV : record view

GPV --> PC : query
RVV --> PC : transaction
PC --> VT : SELECT/UPDATE
PC --> VVT : findUnique/CREATE
PC --> NT : CREATE (if public)
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "VideoPreview" as preview
participant "useQueryData" as query
participant "getPreviewVideo" as gpv
participant "recordVideoView" as rvv
participant "Prisma" as prisma
database "PostgreSQL" as db

== Page Load (10.1) ==

user -> preview: Navigate to /preview/:id
activate preview

preview -> query: useQueryData(['preview-video'])
query -> gpv: getPreviewVideo(videoId)
activate gpv

gpv -> prisma: video.findUnique with User
prisma -> db: SELECT video JOIN user
db --> prisma: video data
gpv --> query: { data, status, author }
deactivate gpv

preview --> user: Render video player + metadata

== View Tracking (10.2, 10.4) ==

preview -> preview: useEffect on mount
preview -> rvv: recordVideoView(videoId)
activate rvv

rvv -> prisma: user.findUnique(clerkId)
prisma -> db: SELECT user
db --> prisma: user

rvv -> prisma: video.findUnique with WorkSpace
prisma -> db: SELECT video, workspace
db --> prisma: video + workspace

rvv -> prisma: videoView.findUnique
prisma -> db: SELECT WHERE videoId AND userId
db --> prisma: null (no existing view)

rvv -> prisma: $transaction
prisma -> db: INSERT VideoView
prisma -> db: UPDATE Video views++

alt Public Workspace & Not Owner (10.4)
  rvv -> prisma: notification.create
  prisma -> db: INSERT Notification (VIDEO_VIEW)
end

rvv --> preview: { recorded: true }
deactivate rvv

deactivate preview
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
  views : Int = 0
  likes : Int = 0
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
}

entity "VideoView" as videoview {
  * id : UUID <<PK>>
  --
  videoId : UUID <<FK>>
  userId : UUID <<FK>>
  createdAt : DateTime
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  firstname : String?
  lastname : String?
  clerkId : String
}

entity "Notification" as notification {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  actorId : UUID? <<FK>>
  videoId : UUID? <<FK>>
  content : String
  type : NotificationType
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  type : Type (PERSONAL|PUBLIC)
}

note right of videoview
  Unique constraint:
  @@unique([videoId, userId])
  
  Ensures one view
  record per user per video
end note

video ||--o{ videoview : "has views"
user ||--o{ videoview : "views"
video ||--o{ notification : "triggers"
user ||--o{ notification : "receives"
workspace ||--o{ video : "contains"
@enduml
```

### View Tracking Logic

| Condition | Action |
|-----------|--------|
| VideoView exists | Return `{ recorded: false, alreadyViewed: true }` |
| First view | Create VideoView + increment counter |
| Public workspace & not owner | Create VIDEO_VIEW notification |

