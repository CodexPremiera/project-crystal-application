# Feature 5.1: Create Folder

## Features Covered
| #   | Feature/Transaction                         | Actor |
|-----|---------------------------------------------|-------|
| 5.1 | User can create a new folder in a workspace | User  |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "User" as user
actor "System" as system

rectangle "Create Folder" {
  usecase "Click Create Folder Button" as UC1
  usecase "Create Folder in Workspace" as UC2
  usecase "Generate Default Name" as UC3
  usecase "Display Optimistic UI" as UC4
  usecase "Persist to Database" as UC5
  usecase "Refresh Folder List" as UC6
}

user --> UC1
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC2 ..> UC4 : <<include>>
UC2 ..> UC5 : <<include>>
UC2 ..> UC6 : <<include>>
system --> UC3
system --> UC4
system --> UC5
system --> UC6
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-5.1 |
| **Use Case Name** | Create Folder in Workspace |
| **Actor(s)** | User, System |
| **Description** | A user creates a new folder within their workspace. The folder is created with a default "Untitled" name and immediately appears in the UI through optimistic updates. |
| **Preconditions** | 1. User is authenticated<br>2. User has access to the workspace (owner or member) |
| **Postconditions** | 1. New folder record created in database<br>2. Folder appears in workspace folder list<br>3. Folder has default "Untitled" name |
| **Main Flow** | 1. User views workspace dashboard with folders section<br>2. User hovers over "+" button to see "Create a new folder" tooltip<br>3. User clicks the create folder button<br>4. System immediately shows optimistic folder in UI<br>5. System creates folder record in database<br>6. System refreshes folder list with server data<br>7. New folder is confirmed in list |
| **Alternative Flows** | A1: Database error → Show error toast, remove optimistic folder |
| **Exceptions** | E1: User not authenticated → Return 404 error |

---

## Activity Diagram

```plantuml
@startuml

start

:User clicks Create Folder button;

:Trigger useMutationData hook;

:Show optimistic folder in UI\n(name: "Untitled", id: temporary);

:Call createFolder server action;

:Query WorkSpace by ID;

if (Workspace exists?) then (yes)
  :Update WorkSpace with nested folder create;
  
  :Create Folder record\n(name: "Untitled");
  
  if (Creation successful?) then (yes)
    :Return success status;
    
    :Invalidate workspace-folders query;
    
    :Refetch folder list from server;
    
    :Replace optimistic folder with real data;
    stop
  else (no)
    :Return error status;
    
    :Remove optimistic folder from UI;
    
    :Show error toast;
    stop
  endif
else (no)
  :Return workspace not found error;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| CreateFolders | `src/components/global/create-folders.tsx` | Button with tooltip that triggers folder creation | Button Component |
| Folders | `src/components/global/folders/folders.tsx` | Container showing all folders with optimistic UI support | List Component |
| Folder | `src/components/global/folders/folder.tsx` | Individual folder card display | Card Component |
| HoverCard | `src/components/ui/hover-card.tsx` | Tooltip showing "Create a new folder" | UI Component |
| Button | `src/components/ui/button.tsx` | Plus icon button | UI Component |
| Add Icon | `src/components/icons/add.tsx` | Plus icon for create button | Icon Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| createFolder | `src/actions/workspace.ts` | Server action to create folder with default name | Server Action |
| useCreateFolders | `src/hooks/useCreateFolders.ts` | Custom hook wrapping createFolder with mutation | Custom Hook |
| useMutationData | `src/hooks/useMutationData.ts` | React Query mutation hook with cache invalidation | Custom Hook |
| Prisma Client | `src/lib/prisma.ts` | Database client for WorkSpace and Folder tables | Database Client |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend" {
  [Folders Container] as FC
  [CreateFolders Button] as CFB
  [Folder Card] as FCard
  [HoverCard Tooltip] as HCT
}

package "Hooks" {
  [useCreateFolders] as UCF
  [useMutationData] as UMD
  [useMutationDataState] as UMDS
}

package "Server Actions" {
  [createFolder] as CF
}

package "Database Layer" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Folder Table] as FT
    [WorkSpace Table] as WT
  }
}

FC --> CFB : contains
FC --> FCard : renders list
CFB --> HCT : tooltip
CFB --> UCF : uses

UCF --> UMD : wraps mutation
UMD --> CF : calls
FC --> UMDS : reads optimistic state

CF --> PC : creates folder
PC --> WT : UPDATE (add folder)
PC --> FT : INSERT
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "User" as user
participant "CreateFolders" as button
participant "useCreateFolders" as hook
participant "useMutationData" as mutation
participant "Folders Container" as folders
participant "createFolder\n(Server Action)" as action
participant "Prisma Client" as prisma
database "PostgreSQL" as db

user -> button: Clicks "+" button
activate button

button -> hook: onCreateNewFolder()
activate hook

hook -> mutation: mutate({ name: "Untitled", id: "optimistic-id" })
activate mutation

mutation -> folders: Update with optimistic data
folders --> user: Show temporary folder card

mutation -> action: createFolder(workspaceId)
activate action

action -> prisma: workSpace.update with nested create
prisma -> db: INSERT INTO Folder (name, workSpaceId)
db --> prisma: New folder record

prisma --> action: Updated workspace
action --> mutation: { status: 200, message: "New Folder Created" }
deactivate action

mutation -> mutation: Invalidate "workspace-folders" query
mutation -> folders: Trigger refetch
folders -> action: getWorkspaceFolders()
action --> folders: Updated folder list

folders --> user: Replace optimistic with real data
deactivate mutation
deactivate hook
deactivate button
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
  type : Type (PERSONAL|PUBLIC)
  userId : UUID <<FK>>
  createdAt : DateTime
}

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  name : String = "Untitled Folder"
  workSpaceId : UUID <<FK>>
  createdAt : DateTime
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  folderId : UUID? <<FK>>
  workSpaceId : UUID <<FK>>
}

workspace ||--o{ folder : "contains"
folder ||--o{ video : "contains"
@enduml
```

### Prisma Schema (Relevant Models)

```prisma
model WorkSpace {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  type      Type
  name      String
  User      User?    @relation(fields: [userId], references: [id])
  userId    String?  @db.Uuid
  createdAt DateTime @default(now())
  folders   Folder[]
  videos    Video[]
  members   Member[]
}

model Folder {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String     @default("Untitled Folder")
  createdAt   DateTime   @default(now())
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
  videos      Video[]
}
```

