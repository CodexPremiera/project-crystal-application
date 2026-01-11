# Feature 5.5: Delete Folder

## Features Covered
| #   | Feature/Transaction                                    | Actor           |
|-----|--------------------------------------------------------|-----------------|
| 5.5 | Workspace owner can delete a folder and all its videos | Workspace Owner |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "Workspace Owner" as owner
actor "System" as system

rectangle "Delete Folder" {
  usecase "Open Delete Confirmation" as UC1
  usecase "Confirm Folder Deletion" as UC2
  usecase "Verify Ownership" as UC3
  usecase "Delete All Folder Videos" as UC4
  usecase "Delete Folder Record" as UC5
  usecase "Redirect to Workspace" as UC6
  usecase "Refresh Folder List" as UC7
}

owner --> UC1
owner --> UC2
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC2 ..> UC4 : <<include>>
UC2 ..> UC5 : <<include>>
UC2 ..> UC6 : <<include>>
UC2 ..> UC7 : <<include>>
system --> UC3
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
| **Use Case ID** | UC-5.5 |
| **Use Case Name** | Delete Folder and Videos |
| **Actor(s)** | Workspace Owner, System |
| **Description** | A workspace owner deletes a folder, which also permanently deletes all videos contained within it. This is a destructive operation with confirmation required. |
| **Preconditions** | 1. User is authenticated<br>2. User is the workspace owner<br>3. Folder exists in the workspace |
| **Postconditions** | 1. Folder record deleted<br>2. All videos in folder deleted<br>3. User redirected to workspace<br>4. Folder list refreshed |
| **Main Flow** | 1. Owner clicks delete option (from folder card menu or folder header)<br>2. System shows confirmation dialog with warning<br>3. Owner confirms deletion<br>4. System verifies workspace ownership<br>5. System deletes all videos in the folder<br>6. System deletes the folder record<br>7. System redirects to workspace dashboard<br>8. Success toast shown |
| **Alternative Flows** | A1: User cancels → Dialog closes, no action taken |
| **Exceptions** | E1: User is not owner → Return 403 forbidden<br>E2: Folder not found → Return 404 error |

---

## Activity Diagram

```plantuml
@startuml

start

:Owner clicks Delete Folder;

:Show confirmation dialog\n"This will permanently delete\nall videos in this folder";

if (Owner confirms?) then (yes)
  :Set loading state;
  
  :Get current user from Clerk;
  
  if (User authenticated?) then (yes)
    :Query folder with workspace ownership;
    
    if (Folder exists?) then (yes)
      :Check if user owns workspace;
      
      if (Is workspace owner?) then (yes)
        :Delete all videos in folder;
        
        :Delete folder record;
        
        :Close dialog;
        
        :Redirect to workspace dashboard;
        
        :Invalidate folder queries;
        
        :Show success toast;
        stop
      else (no)
        :Return 403 error\n"Only owners can delete";
        stop
      endif
    else (no)
      :Return 404\n"Folder not found";
      stop
    endif
  else (no)
    :Return 404 error;
    stop
  endif
else (no)
  :Close dialog;
  
  :No action taken;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Folder | `src/components/global/folders/folder.tsx` | Folder card with delete action in dropdown | Card Component |
| FolderHeader | `src/components/global/folders/folder-header.tsx` | Folder page header with delete in dropdown | Header Component |
| AlertDialog | `src/components/ui/alert-dialog.tsx` | Confirmation dialog component | UI Component |
| DropdownMenu | `src/components/ui/dropdown-menu.tsx` | Menu containing delete option | UI Component |
| Button | `src/components/ui/button.tsx` | Cancel and Delete buttons | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| deleteFolder | `src/actions/workspace.ts` | Server action to delete folder and videos | Server Action |
| useDeleteFolder | `src/hooks/useDeleteFolder.ts` | Custom hook for folder deletion with redirect | Custom Hook |
| Prisma Client | `src/lib/prisma.ts` | Database client for Folder, Video tables | Database Client |
| useRouter | `next/navigation` | Next.js router for redirect | Next.js Hook |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend - Folder Card" {
  [Folder Component] as FC
  [DropdownMenu] as DDM
  [AlertDialog] as AD1
}

package "Frontend - Folder Page" {
  [FolderHeader] as FH
  [AlertDialog] as AD2
}

package "Hooks" {
  [useDeleteFolder] as UDF
  [useMutation] as UM
}

package "Navigation" {
  [useRouter] as UR
}

package "Server Actions" {
  [deleteFolder] as DF
}

package "External Services" {
  [Clerk Auth] as CA
}

package "Database Layer" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Folder Table] as FT
    [Video Table] as VT
  }
}

FC --> DDM : contains
DDM --> AD1 : triggers
FH --> AD2 : triggers

AD1 --> UDF : uses
AD2 --> UDF : uses
UDF --> UM : wraps
UDF --> UR : redirect

UM --> DF : calls
DF --> CA : validates auth
DF --> PC : deletes data

PC --> VT : DELETE (videos in folder)
PC --> FT : DELETE (folder)
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "Workspace Owner" as owner
participant "FolderHeader" as header
participant "AlertDialog" as dialog
participant "useDeleteFolder" as hook
participant "deleteFolder\n(Server Action)" as action
participant "Clerk" as clerk
participant "Prisma Client" as prisma
database "PostgreSQL" as db
participant "Router" as router

owner -> header: Clicks "Delete Folder" in menu
activate header

header -> dialog: Open confirmation
activate dialog

dialog --> owner: "Are you sure? All videos will be deleted"

owner -> dialog: Clicks "Delete Folder"
dialog -> hook: deleteFolder()
activate hook

hook -> action: deleteFolder(folderId)
activate action

action -> clerk: currentUser()
clerk --> action: Clerk user

action -> prisma: findUnique (folder with workspace.User)
prisma -> db: SELECT folder, workspace, user
db --> prisma: Folder with ownership info

action -> action: Verify user.id === workspace.User.clerkId

action -> prisma: video.deleteMany({ folderId })
prisma -> db: DELETE FROM Video WHERE folderId
db --> prisma: { count: N }

action -> prisma: folder.delete({ id: folderId })
prisma -> db: DELETE FROM Folder WHERE id
db --> prisma: Deleted folder

action --> hook: { status: 200, data: "Folder deleted" }
deactivate action

hook -> dialog: Close dialog
deactivate dialog

hook -> router: push(`/dashboard/${workspaceId}`)
activate router
router --> owner: Redirect to workspace
deactivate router

hook -> hook: Invalidate queries
hook --> owner: Show success toast
deactivate hook
deactivate header
@enduml
```

---

## ERD and Schema

```plantuml
@startuml

entity "User" as user {
  * id : UUID <<PK>>
  --
  clerkId : String <<unique>>
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  userId : UUID <<FK>> (owner)
}

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  name : String
  workSpaceId : UUID <<FK>>
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  source : String
  folderId : UUID? <<FK>>
}

note right of folder
  Delete operation:
  1. DELETE FROM Video WHERE folderId
  2. DELETE FROM Folder WHERE id
  
  Only workspace owner can delete
end note

user ||--o{ workspace : "owns"
workspace ||--o{ folder : "contains"
folder ||--o{ video : "contains"
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
  source      String     @unique
  Folder      Folder?    @relation(fields: [folderId], references: [id], onDelete: Cascade)
  folderId    String?    @db.Uuid
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
}
```

### Server Action Code

```typescript
export const deleteFolder = async (folderId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'User not authenticated' }
    
    const folder = await client.folder.findUnique({
      where: { id: folderId },
      select: {
        id: true,
        name: true,
        WorkSpace: {
          select: {
            id: true,
            User: {
              select: { clerkId: true }
            }
          }
        }
      }
    })
    
    if (!folder) return { status: 404, data: 'Folder not found' }
    
    if (folder.WorkSpace?.User?.clerkId !== user.id) {
      return { status: 403, data: 'You can only delete your own folders' }
    }
    
    // Delete all videos in the folder
    await client.video.deleteMany({
      where: { folderId }
    })
    
    // Delete the folder
    const deletedFolder = await client.folder.delete({
      where: { id: folderId }
    })
    
    if (deletedFolder) {
      return { status: 200, data: 'Folder deleted successfully' }
    }
    
    return { status: 404, data: 'Folder not found' }
  } catch (error) {
    console.log('Error deleting folder:', error)
    return { status: 500, data: 'Failed to delete folder' }
  }
}
```

