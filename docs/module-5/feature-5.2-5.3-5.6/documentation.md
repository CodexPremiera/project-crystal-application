# Features 5.2, 5.3, 5.6: View Folders and Content

## Features Covered
| #   | Feature/Transaction                                  | Actor |
|-----|------------------------------------------------------|-------|
| 5.2 | User can view all folders in a workspace             | User  |
| 5.3 | User can view folder information (name, video count) | User  |
| 5.6 | User can view videos within a specific folder        | User  |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "User" as user
actor "System" as system

rectangle "View Folders and Content" {
  usecase "View Workspace Dashboard" as UC1
  usecase "View All Folders in Workspace" as UC2
  usecase "View Folder Card Details" as UC3
  usecase "Navigate to Folder Page" as UC4
  usecase "View Folder Header Info" as UC5
  usecase "View Videos in Folder" as UC6
  usecase "Fetch Folder Data" as UC7
  usecase "Fetch Folder Videos" as UC8
}

user --> UC1
user --> UC4
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC4 ..> UC5 : <<include>>
UC4 ..> UC6 : <<include>>
system --> UC7
system --> UC8
UC2 ..> UC7 : <<include>>
UC5 ..> UC7 : <<include>>
UC6 ..> UC8 : <<include>>
@enduml
```

---

## Use Case Description

### UC-5.2: View All Folders in Workspace

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-5.2 |
| **Use Case Name** | View All Folders in Workspace |
| **Actor(s)** | User, System |
| **Description** | User views all folders within a workspace displayed as horizontal scrollable cards. |
| **Preconditions** | 1. User is authenticated<br>2. User has access to the workspace |
| **Postconditions** | 1. Folders displayed in UI<br>2. Folder data cached for performance |
| **Main Flow** | 1. User navigates to workspace dashboard<br>2. System fetches workspace folders via getWorkspaceFolders<br>3. System displays folder cards in horizontal scroll section<br>4. Each card shows folder name and video count |

### UC-5.3: View Folder Information

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-5.3 |
| **Use Case Name** | View Folder Information |
| **Actor(s)** | User, System |
| **Description** | User views detailed folder information including name, creation date, and video count. |
| **Preconditions** | 1. User is on folder page or viewing folder card |
| **Postconditions** | 1. Folder metadata displayed |
| **Main Flow** | 1. System calls getFolderInfo with folder ID<br>2. System retrieves name, createdAt, and video count<br>3. Information displayed in folder header or card |

### UC-5.6: View Videos in Folder

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-5.6 |
| **Use Case Name** | View Videos Within Folder |
| **Actor(s)** | User, System |
| **Description** | User navigates to a folder and views all videos contained within it. |
| **Preconditions** | 1. User has access to workspace<br>2. Folder exists |
| **Postconditions** | 1. Videos displayed in folder page |
| **Main Flow** | 1. User clicks on folder card<br>2. System navigates to folder page<br>3. System calls getFolderVideos<br>4. System displays videos with full management capabilities |
| **Alternative Flows** | A1: Folder not found → Show 404 page |

---

## Activity Diagram

```plantuml
@startuml

start

:User navigates to workspace;

:System fetches workspace folders;

if (Folders exist?) then (yes)
  :Display folder cards with names;
  
  :Show video count on each card;
  
  if (User clicks folder?) then (yes)
    :Navigate to folder page URL;
    
    :Prefetch folder info;
    
    if (Folder exists?) then (yes)
      :Display folder header\n(name, workspace, date);
      
      :Fetch folder videos;
      
      if (Videos exist?) then (yes)
        :Display video cards in grid;
        stop
      else (no)
        :Display "No videos in folder";
        stop
      endif
    else (no)
      :Show 404 Not Found page;
      stop
    endif
  else (no)
    :Continue browsing folders;
    stop
  endif
else (no)
  :Display "No folders in workspace";
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Folders | `src/components/global/folders/folders.tsx` | Container for folder list with horizontal scroll | List Component |
| Folder | `src/components/global/folders/folder.tsx` | Individual folder card with name and actions | Card Component |
| FolderHeader | `src/components/global/folders/folder-header.tsx` | Folder page header with name, date, actions | Header Component |
| Videos | `src/components/global/videos/videos.tsx` | Video grid component for folder contents | Grid Component |
| Folder Page | `src/app/dashboard/[workspaceid]/folder/[folder]/page.tsx` | Server component for folder view | Page Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| getWorkspaceFolders | `src/actions/workspace.ts` | Fetches all folders for a workspace | Server Action |
| getFolderInfo | `src/actions/workspace.ts` | Fetches folder metadata with video count | Server Action |
| getFolderVideos | `src/actions/workspace.ts` | Fetches videos within a folder | Server Action |
| useQueryData | `src/hooks/useQueryData.ts` | React Query wrapper for data fetching | Custom Hook |
| VideoService | `src/services/video.service.ts` | Video data operations | Service |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend - Workspace View" {
  [Folders Container] as FC
  [Folder Card] as FCard
}

package "Frontend - Folder Page" {
  [Folder Page] as FP
  [FolderHeader] as FH
  [Videos Grid] as VG
}

package "Hooks" {
  [useQueryData] as UQD
}

package "Server Actions" {
  [getWorkspaceFolders] as GWF
  [getFolderInfo] as GFI
  [getFolderVideos] as GFV
}

package "Services" {
  [WorkspaceService] as WS
  [VideoService] as VS
}

package "Database Layer" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Folder Table] as FT
    [Video Table] as VT
  }
}

FC --> FCard : renders
FCard --> FP : navigates to
FP --> FH : contains
FP --> VG : contains

FC --> UQD : fetches folders
FH --> UQD : fetches folder info
VG --> UQD : fetches videos

UQD --> GWF : workspace folders
UQD --> GFI : folder info
UQD --> GFV : folder videos

GWF --> WS : uses
GFI --> PC : queries
GFV --> VS : uses

PC --> FT : SELECT
PC --> VT : SELECT (with _count)
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "User" as user
participant "Folders Component" as folders
participant "Folder Card" as card
participant "Folder Page" as page
participant "FolderHeader" as header
participant "Videos Grid" as videos
participant "Server Actions" as actions
participant "Prisma Client" as prisma
database "PostgreSQL" as db

== View Folders in Workspace ==

user -> folders: Navigate to workspace
activate folders

folders -> actions: getWorkspaceFolders(workspaceId)
activate actions

actions -> prisma: findMany folders
prisma -> db: SELECT * FROM Folder WHERE workSpaceId
db --> prisma: Folder records

prisma --> actions: Folders with _count
actions --> folders: { status: 200, data: folders[] }
deactivate actions

folders -> card: Render folder cards
card --> user: Display folder name, video count
deactivate folders

== Navigate to Folder ==

user -> card: Click folder card
activate card

card -> page: Navigate to /folder/{id}
deactivate card
activate page

page -> actions: getFolderInfo(folderId)
activate actions
actions -> prisma: findUnique folder
prisma -> db: SELECT name, createdAt, _count FROM Folder
db --> prisma: Folder info
prisma --> actions: Folder data
actions --> page: { status: 200, data: folder }
deactivate actions

page -> header: Render with folder data
header --> user: Show folder name, workspace, date

page -> actions: getFolderVideos(folderId)
activate actions
actions -> prisma: findMany videos
prisma -> db: SELECT * FROM Video WHERE folderId
db --> prisma: Video records
prisma --> actions: Videos
actions --> page: Video list
deactivate actions

page -> videos: Render video grid
videos --> user: Display video cards
deactivate page
@enduml
```

---

## ERD and Schema

```plantuml
@startuml

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  type : Type
  userId : UUID <<FK>>
}

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  name : String
  workSpaceId : UUID <<FK>>
  createdAt : DateTime
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  description : String?
  source : String <<unique>>
  folderId : UUID? <<FK>>
  workSpaceId : UUID <<FK>>
  createdAt : DateTime
  views : Int
  likes : Int
}

workspace ||--o{ folder : "contains"
folder ||--o{ video : "contains"
workspace ||--o{ video : "unfiled videos"
@enduml
```

### Prisma Schema (Relevant Models)

```prisma
model Folder {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String     @default("Untitled Folder")
  createdAt   DateTime   @default(now())
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
  videos      Video[]
}

model Video {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title       String?    @default("Untitled Video")
  description String?    @default("No Description")
  source      String     @unique
  createdAt   DateTime   @default(now())
  Folder      Folder?    @relation(fields: [folderId], references: [id], onDelete: Cascade)
  folderId    String?    @db.Uuid
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
  views       Int        @default(0)
  likes       Int        @default(0)
}
```

