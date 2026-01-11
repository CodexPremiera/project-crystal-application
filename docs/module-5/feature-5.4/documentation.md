# Feature 5.4: Rename Folder

## Features Covered
| #   | Feature/Transaction                    | Actor |
|-----|----------------------------------------|-------|
| 5.4 | User can rename an existing folder     | User  |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "User" as user
actor "System" as system

rectangle "Rename Folder" {
  usecase "Double-click Folder Name" as UC1
  usecase "Open Edit Dialog" as UC2
  usecase "Enter New Folder Name" as UC3
  usecase "Submit Rename Request" as UC4
  usecase "Update Database Record" as UC5
  usecase "Show Optimistic Update" as UC6
  usecase "Refresh Folder List" as UC7
}

user --> UC1
user --> UC2
user --> UC3
user --> UC4
UC1 ..> UC3 : <<include>>
UC2 ..> UC3 : <<include>>
UC4 ..> UC5 : <<include>>
UC4 ..> UC6 : <<include>>
UC4 ..> UC7 : <<include>>
system --> UC5
system --> UC6
system --> UC7
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-5.4 |
| **Use Case Name** | Rename Folder |
| **Actor(s)** | User, System |
| **Description** | User renames an existing folder using either inline editing (double-click) or a dialog modal. The change is optimistically shown and persisted to the database. |
| **Preconditions** | 1. User is authenticated<br>2. Folder exists in user's workspace |
| **Postconditions** | 1. Folder name updated in database<br>2. UI reflects new name immediately |
| **Main Flow** | 1. User double-clicks folder name OR opens edit dialog<br>2. Input field becomes editable with current name<br>3. User types new folder name<br>4. User confirms by pressing Enter or clicking save<br>5. System shows optimistic update<br>6. System calls renameFolders server action<br>7. System updates database record<br>8. Cache invalidated and list refreshed |
| **Alternative Flows** | A1: Empty name submitted → Revert to original name<br>A2: User presses Escape → Cancel edit mode |
| **Exceptions** | E1: Database error → Show error, revert to original name |

---

## Activity Diagram

```plantuml
@startuml

start

if (Trigger method?) then (Double-click name)
  :Enable inline edit mode;
  
  :Show input with current name;
else (Edit dialog)
  :Open edit folder dialog;
  
  :Show form with current name;
endif

:User types new folder name;

if (User confirms?) then (yes)
  if (Name is empty?) then (yes)
    :Revert to original name;
    
    :Exit edit mode;
    stop
  else (no)
    :Show optimistic update in UI;
    
    :Call renameFolders server action;
    
    :Update Folder record in database;
    
    if (Update successful?) then (yes)
      :Invalidate workspace-folders cache;
      
      :Show success state;
      stop
    else (no)
      :Revert to original name;
      
      :Show error toast;
      stop
    endif
  endif
else (no - Escape/Cancel)
  :Revert to original name;
  
  :Exit edit mode;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Folder | `src/components/global/folders/folder.tsx` | Folder card with inline rename capability | Card Component |
| FolderHeader | `src/components/global/folders/folder-header.tsx` | Folder page header with edit dialog | Header Component |
| EditFolderNameForm | `src/components/forms/edit-folder/edit-folder-name.tsx` | Form component for folder rename dialog | Form Component |
| Input | `src/components/ui/input.tsx` | Text input for folder name | UI Component |
| Dialog | `src/components/ui/dialog.tsx` | Modal container for edit form | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| renameFolders | `src/actions/workspace.ts` | Server action to update folder name | Server Action |
| useMutationData | `src/hooks/useMutationData.ts` | React Query mutation with optimistic updates | Custom Hook |
| useMutationDataState | `src/hooks/useMutationDataState.ts` | Access mutation state for optimistic UI | Custom Hook |
| Prisma Client | `src/lib/prisma.ts` | Database client for Folder table | Database Client |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend - Folder Card" {
  [Folder Component] as FC
  [Inline Input] as II
}

package "Frontend - Folder Page" {
  [FolderHeader] as FH
  [EditFolderNameForm] as EFNF
  [Dialog Modal] as DM
}

package "Hooks" {
  [useMutationData] as UMD
  [useMutationDataState] as UMDS
}

package "Server Actions" {
  [renameFolders] as RF
}

package "Database Layer" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Folder Table] as FT
  }
}

FC --> II : inline edit
FH --> DM : opens
DM --> EFNF : contains

FC --> UMD : mutation
EFNF --> UMD : mutation
FC --> UMDS : optimistic state

UMD --> RF : calls
RF --> PC : updates folder
PC --> FT : UPDATE name
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "User" as user
participant "Folder Component" as folder
participant "useMutationData" as mutation
participant "renameFolders\n(Server Action)" as action
participant "Prisma Client" as prisma
database "PostgreSQL" as db

== Inline Rename Flow ==

user -> folder: Double-click folder name
activate folder

folder -> folder: setOnRename(true)
folder --> user: Show input with current name

user -> folder: Type new name, press Enter
folder -> folder: updateFolderName()

alt Name is not empty
  folder -> mutation: mutate({ name: newName, id: folderId })
  activate mutation
  
  mutation -> folder: Optimistic update (show new name)
  folder --> user: Display new name immediately
  
  mutation -> action: renameFolders(folderId, newName)
  activate action
  
  action -> prisma: folder.update
  prisma -> db: UPDATE Folder SET name WHERE id
  db --> prisma: Updated record
  
  prisma --> action: Updated folder
  action --> mutation: { status: 200, data: "Folder Updated" }
  deactivate action
  
  mutation -> mutation: Invalidate "workspace-folders"
  mutation --> folder: Confirmed
  deactivate mutation
  
  folder -> folder: setOnRename(false)
  folder --> user: Exit edit mode
else Name is empty
  folder -> folder: Renamed() - revert
  folder --> user: Show original name
end

deactivate folder
@enduml
```

---

## ERD and Schema

```plantuml
@startuml

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  name : String
  workSpaceId : UUID <<FK>>
  createdAt : DateTime
}

note right of folder
  Rename operation:
  UPDATE Folder
  SET name = :newName
  WHERE id = :folderId
end note
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
```

### Server Action Code

```typescript
export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    })
    if (folder) {
      return { status: 200, data: 'Folder Updated' }
    }
    return { status: 400, data: 'Folder not found' }
  } catch (error) {
    console.log(error)
    return { status: 500, data: 'Something went wrong' }
  }
}
```

