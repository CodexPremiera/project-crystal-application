# Features 9.1-9.2: Video Viewing

## Features Covered
| #   | Feature/Transaction                                            | Actor |
|-----|----------------------------------------------------------------|-------|
| 9.1 | User can view all unfiled videos in a workspace                | User  |
| 9.2 | User can view video details (title, description, views, likes) | User  |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user

rectangle "Video Viewing" {
  usecase "Navigate to Workspace" as UC1
  usecase "View Unfiled Videos" as UC2
  usecase "Open Video Preview" as UC3
  usecase "View Video Details" as UC4
  usecase "See Title & Description" as UC5
  usecase "See View Count" as UC6
  usecase "See Like Count" as UC7
  usecase "See Creator Info" as UC8
}

user --> UC1
user --> UC3
UC1 ..> UC2 : <<include>>
UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<include>>
UC4 ..> UC6 : <<include>>
UC4 ..> UC7 : <<include>>
UC4 ..> UC8 : <<include>>
@enduml
```

---

## Use Case Description

### UC-9.1: View Unfiled Videos

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.1 |
| **Use Case Name** | View Unfiled Videos |
| **Actor(s)** | User |
| **Description** | User views all videos in a workspace that are not assigned to any folder. |
| **Preconditions** | 1. User is authenticated<br>2. User has access to workspace |
| **Postconditions** | 1. Unfiled videos displayed in grid |
| **Main Flow** | 1. User navigates to workspace<br>2. System queries videos where folderId = null<br>3. System displays video cards in grid layout |

### UC-9.2: View Video Details

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.2 |
| **Use Case Name** | View Video Details |
| **Actor(s)** | User |
| **Description** | User views comprehensive video metadata including title, description, views, and likes. |
| **Preconditions** | 1. Video exists<br>2. User has access |
| **Postconditions** | 1. Video preview page displayed |
| **Main Flow** | 1. User clicks video card<br>2. System fetches video details via getPreviewVideo<br>3. System displays title, description, creator, views, likes |

---

## Activity Diagram

```plantuml
@startuml
start

partition "View Unfiled Videos (9.1)" {
  :User navigates to workspace;
  
  :Query videos with folderId = null;
  
  :Fetch video list with metadata;
  
  :Render video cards in grid;
  
  :Display video thumbnails, titles, durations;
}

partition "View Video Details (9.2)" {
  :User clicks on video card;
  
  :Navigate to /preview/:videoId;
  
  :Call getPreviewVideo(videoId);
  
  :Fetch video with User relation;
  
  :Check if current user is author;
  
  :Display video player;
  
  :Display title and description;
  
  :Display creator info (name, image);
  
  :Display view count;
  
  :Display like count;
  
  :Display creation date;
}

stop
@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| VideoCard | `src/components/global/videos/video-card.tsx` | Video card in grid view | Card Component |
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Full video preview page | Page Component |
| Videos (Grid) | `src/components/global/videos/index.tsx` | Video grid container | Container |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| getPreviewVideo | `src/actions/workspace.ts` | Fetches video details | Server Action |
| VideoService.getUnfiledInWorkspace | `src/services/video.service.ts` | Gets unfiled videos | Service |

---

## Component/Module Diagram

```plantuml
@startuml
package "Workspace Page" {
  [Videos Grid] as VG
  [VideoCard] as VC
}

package "Video Preview Page" {
  [VideoPreview] as VP
  [Video Player] as VID
  [Metadata Display] as MD
}

package "Hooks & Actions" {
  [getPreviewVideo] as GPV
  [useQueryData] as UQD
}

package "Services" {
  [VideoService] as VS
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video] as VT
    [User] as UT
  }
}

VG --> VC : renders
VC --> VP : navigates to

VP --> UQD : uses
UQD --> GPV : calls
GPV --> PC : queries
PC --> VT : SELECT
PC --> UT : JOIN

VS --> PC : queries
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "Workspace Page" as workspace
participant "Videos Grid" as grid
participant "VideoService" as service
participant "VideoPreview" as preview
participant "getPreviewVideo" as action
participant "Prisma" as prisma
database "PostgreSQL" as db

== View Unfiled Videos (9.1) ==

user -> workspace: Navigate to workspace
activate workspace

workspace -> grid: Render videos grid
activate grid

grid -> service: getUnfiledInWorkspace(workspaceId)
service -> prisma: findMany({ folderId: null })
prisma -> db: SELECT videos WHERE folderId IS NULL
db --> prisma: Video[]
prisma --> service: videos
service --> grid: videos

grid --> user: Display video cards
deactivate grid
deactivate workspace

== View Video Details (9.2) ==

user -> grid: Click video card
grid -> preview: Navigate to /preview/:id
activate preview

preview -> action: getPreviewVideo(videoId)
activate action

action -> prisma: video.findUnique with User
prisma -> db: SELECT video JOIN user
db --> prisma: video + user data

action -> action: Compare clerkId (isAuthor)

action --> preview: { data, status, author }
deactivate action

preview --> user: Display video player
preview --> user: Display title, description
preview --> user: Display views, likes
preview --> user: Display creator info
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
  description : String?
  source : String
  views : Int = 0
  likes : Int = 0
  processing : Boolean
  createdAt : DateTime
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  folderId : UUID? <<FK>>
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  firstname : String?
  lastname : String?
  image : String?
  clerkId : String
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
}

note right of video
  Unfiled videos:
  folderId = null
  
  views/likes:
  Counters updated by
  user interactions
end note

user ||--o{ video : "creates"
workspace ||--o{ video : "contains"
folder ||--o{ video : "organizes"
@enduml
```

### Video Details Retrieved

| Field | Type | Description |
|-------|------|-------------|
| title | String | Video title (default: "Untitled Video") |
| description | String | Video description |
| source | String | S3 file reference |
| views | Int | View counter |
| likes | Int | Like counter |
| createdAt | DateTime | Upload timestamp |
| User.firstname | String | Creator first name |
| User.lastname | String | Creator last name |
| User.image | String | Creator avatar URL |

