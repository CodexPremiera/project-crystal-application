# Feature 3.3-3.5: Manage Workspace (Rename & Delete)

## Features Covered

| #   | Feature                                                                            | Actor           |
|-----|------------------------------------------------------------------------------------|-----------------|
| 3.3 | Workspace owner can rename their workspace                                         | Workspace Owner |
| 3.4 | Workspace owner can delete their workspace                                         | Workspace Owner |
| 3.5 | System cascades deletion of workspace content (folders, videos, members, comments) | System          |

## Overview

This feature group covers workspace management actions available only to workspace owners. Owners can rename their workspace or delete it entirely. When a workspace is deleted, all associated content (folders, videos, members, comments, invitations) is automatically cascade deleted.

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "Workspace Owner" as owner
actor "System" as system <<system>>

rectangle "Crystal Application" {
  usecase "Open Workspace Menu" as UC1
  usecase "Rename Workspace" as UC2
  usecase "Delete Workspace" as UC3
  usecase "Validate Ownership" as UC4
  usecase "Cascade Delete Content" as UC5
  usecase "Confirm Deletion" as UC6
}

owner --> UC1
UC1 --> UC2
UC1 --> UC3
UC2 --> UC4 : <<include>>
UC3 --> UC4 : <<include>>
UC3 --> UC6 : <<include>>
UC3 --> UC5 : <<include>>
UC5 --> system

@enduml
```

---

## Use Case Description

### UC-3.3: Rename Workspace

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-3.3 |
| **Use Case Name** | Rename Workspace |
| **Actor(s)** | Workspace Owner |
| **Description** | A workspace owner changes the name of their workspace. |
| **Preconditions** | User is authenticated; User owns the workspace |
| **Trigger** | Owner clicks "Edit" from workspace menu |
| **Main Flow** | 1. Owner opens workspace dropdown menu<br>2. Owner clicks "Edit"<br>3. Edit modal opens with current name<br>4. Owner enters new name<br>5. Owner clicks "Save"<br>6. System validates ownership<br>7. System updates workspace name<br>8. Modal closes, UI updates |
| **Postconditions** | Workspace name updated in database and UI |
| **Exceptions** | Empty name; Name too long (>100 chars); Not owner |

### UC-3.4/3.5: Delete Workspace with Cascade

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-3.4 |
| **Use Case Name** | Delete Workspace with Cascade Deletion |
| **Actor(s)** | Workspace Owner, System |
| **Description** | A workspace owner deletes their workspace, triggering cascade deletion of all related content. |
| **Preconditions** | User is authenticated; User owns the workspace |
| **Trigger** | Owner clicks "Delete" from workspace menu |
| **Main Flow** | 1. Owner opens workspace dropdown menu<br>2. Owner clicks "Delete"<br>3. Confirmation modal appears with warning<br>4. Owner confirms deletion<br>5. System validates ownership<br>6. System deletes workspace record<br>7. Prisma cascade deletes: folders, videos, members, comments, invites<br>8. Owner redirected to another workspace |
| **Postconditions** | Workspace and all related content permanently deleted |
| **Exceptions** | Not owner; Database error; Last workspace (edge case) |

---

## Activity Diagram

![Activity Diagram](./activity.png)

```plantuml
@startuml
skinparam ActivityBackgroundColor #f8f9fa
skinparam ActivityBorderColor #343a40

start

:Owner opens workspace menu;

if (Action is "Edit"?) then (yes)
  :Open EditWorkspaceModal;
  :Display current name;
  :Owner enters new name;
  
  if (Name valid?) then (yes)
    :Call editWorkspaceName();
    :Validate owner;
    
    if (Is owner?) then (yes)
      :Update workspace name;
      :Close modal;
      :Refresh UI;
    else (no)
      :Show "Only owners can edit" error;
    endif
  else (no)
    :Show validation error;
  endif
  
else if (Action is "Delete"?) then (yes)
  :Open DeleteWorkspaceModal;
  :Show warning message;
  
  if (Owner confirms?) then (yes)
    :Call deleteWorkspace();
    :Validate owner;
    
    if (Is owner?) then (yes)
      :Delete workspace record;
      
      fork
        :Cascade delete folders;
      fork again
        :Cascade delete videos;
      fork again
        :Cascade delete members;
      fork again
        :Cascade delete invites;
      end fork
      
      :Redirect to another workspace;
    else (no)
      :Show "Only owners can delete" error;
    endif
  else (no)
    :Close modal;
  endif
endif

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `WorkspaceActions` | Action dropdown menu | Show edit/delete options for owners | React Client Component |
| `EditWorkspaceModal` | Rename modal | Form for updating workspace name | React Component |
| `DeleteWorkspaceModal` | Delete confirmation | Confirm and execute deletion | React Component |
| `DropdownMenu` | Menu container | Workspace action menu | Shadcn UI Component |
| `AlertDialog` | Confirmation dialog | Warn before destructive action | Shadcn UI Component |

### Backend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `editWorkspaceName` | Rename handler | Validate owner and update name | Server Action |
| `deleteWorkspace` | Delete handler | Validate owner and delete workspace | Server Action |
| `WorkspaceService.updateName` | Name updater | Update workspace name in DB | Service Function |
| `WorkspaceService.delete` | Workspace deleter | Delete workspace (triggers cascade) | Service Function |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2

package "Frontend (Next.js)" {
  [DashboardPage] as page
  [DropdownMenu] as menu
  [WorkspaceActions] as actions
  [EditWorkspaceModal] as editModal
  [DeleteWorkspaceModal] as deleteModal
}

package "Backend (Server Actions)" {
  [editWorkspaceName] as editAction
  [deleteWorkspace] as deleteAction
}

package "Data Layer" {
  [Prisma Client] as prisma
  database "PostgreSQL" as db {
    [WorkSpace]
    [Folder]
    [Video]
    [Member]
    [Invite]
    [Comment]
  }
}

page --> menu : contains
menu --> actions : renders
actions --> editModal : opens
actions --> deleteModal : opens
editModal --> editAction : calls
deleteModal --> deleteAction : calls
editAction --> prisma : UPDATE
deleteAction --> prisma : DELETE (cascade)
prisma --> db : CASCADE DELETE

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor "Workspace Owner" as Owner
participant "WorkspaceActions" as Actions
participant "DeleteWorkspaceModal" as Modal
participant "deleteWorkspace" as Delete
participant "Prisma" as Prisma
database "PostgreSQL" as DB

Owner -> Actions : Click menu
Actions -> Owner : Show Edit/Delete options
Owner -> Actions : Click "Delete"

Actions -> Modal : Open confirmation modal
Modal -> Owner : "Are you sure? This will delete all content."

Owner -> Modal : Confirm deletion

Modal -> Delete : deleteWorkspace(workspaceId)
Delete -> Delete : Get Clerk user

Delete -> Prisma : findUnique({ id, User: { clerkId } })
Prisma -> DB : SELECT * FROM WorkSpace WHERE owner
DB --> Prisma : Workspace (owned)

alt Is Owner
  Delete -> Prisma : delete({ id: workspaceId })
  
  note right of Prisma
    Prisma cascade deletes:
    - Member records
    - Folder records
    - Video records (cascade to comments)
    - Invite records
  end note
  
  Prisma -> DB : DELETE FROM WorkSpace WHERE id\n(CASCADE to related tables)
  DB --> Prisma : Deleted
  
  Delete --> Modal : { status: 200, data: 'Workspace deleted' }
  Modal -> Owner : Redirect to another workspace
else Not Owner
  Delete --> Modal : { status: 403, data: 'Only owners can delete' }
  Modal -> Owner : Show error message
end

@enduml
```

---

## ERD and Schema

```plantuml
@startuml
skinparam linetype ortho

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  * name : String
  * type : Type
  userId : UUID <<FK>>
}

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  * name : String
  workSpaceId : UUID <<FK>>
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  * title : String
  workSpaceId : UUID <<FK>>
  folderId : UUID <<FK>>
}

entity "Member" as member {
  * id : UUID <<PK>>
  --
  workSpaceId : UUID <<FK>>
}

entity "Invite" as invite {
  * id : UUID <<PK>>
  --
  workSpaceId : UUID <<FK>>
}

entity "Comment" as comment {
  * id : UUID <<PK>>
  --
  videoId : UUID <<FK>>
}

workspace ||--o{ folder : "onDelete: Cascade"
workspace ||--o{ video : "onDelete: Cascade"
workspace ||--o{ member : "onDelete: Cascade"
workspace ||--o{ invite : "onDelete: Cascade"
video ||--o{ comment : "onDelete: Cascade"

note bottom of workspace
  Deleting workspace cascades
  to all related records
end note

@enduml
```

### Prisma Schema (Cascade Relations)

```prisma
model WorkSpace {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  type      Type
  name      String
  User      User?    @relation(fields: [userId], references: [id])
  userId    String?  @db.Uuid
  folders   Folder[]   // Cascade via Folder model
  videos    Video[]    // Cascade via Video model
  members   Member[]   // Cascade via Member model
  invite    Invite[]   // Cascade via Invite model
}

model Folder {
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
}

model Video {
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
}

model Member {
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
}
```

---

## Code References

### deleteWorkspace Server Action

**File:** `crystal-web-app/src/actions/workspace.ts`

```typescript
export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'User not authenticated' }
    
    // Verify current user is the workspace owner
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        User: { clerkId: user.id }
      },
      select: { id: true, name: true }
    })
    
    if (!workspace) {
      return { status: 403, data: 'Only workspace owners can delete workspaces' }
    }
    
    // Delete the workspace (cascade will handle related data)
    const deletedWorkspace = await client.workSpace.delete({
      where: { id: workspaceId }
    })
    
    if (deletedWorkspace) {
      return { status: 200, data: 'Workspace deleted successfully' }
    }
    
    return { status: 404, data: 'Workspace not found' }
  } catch (error) {
    return { status: 500, data: 'Failed to delete workspace' }
  }
}
```

### editWorkspaceName Server Action

**File:** `crystal-web-app/src/actions/workspace.ts`

```typescript
export const editWorkspaceName = async (workspaceId: string, newName: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404, data: 'User not authenticated' }
    
    if (!newName || newName.trim().length === 0) {
      return { status: 400, data: 'Workspace name cannot be empty' }
    }
    
    // Verify current user is the workspace owner
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        User: { clerkId: user.id }
      }
    })
    
    if (!workspace) {
      return { status: 403, data: 'Only workspace owners can edit workspace name' }
    }
    
    // Update the workspace name
    const updatedWorkspace = await client.workSpace.update({
      where: { id: workspaceId },
      data: { name: newName.trim() }
    })
    
    if (updatedWorkspace) {
      return { status: 200, data: 'Workspace name updated successfully' }
    }
    
    return { status: 404, data: 'Workspace not found' }
  } catch (error) {
    return { status: 500, data: 'Failed to update workspace name' }
  }
}
```

