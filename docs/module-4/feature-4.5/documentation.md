# Feature 4.5: Member Removal

## Features Covered
| #   | Feature/Transaction                                    | Actor           |
|-----|--------------------------------------------------------|-----------------|
| 4.5 | Workspace owner can remove a member from the workspace | Workspace Owner |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "Workspace Owner" as owner
actor "System" as system

rectangle "Member Removal" {
  usecase "View Workspace Members" as UC0
  usecase "Remove Member from Workspace" as UC1
  usecase "Confirm Removal" as UC2
  usecase "Validate Owner Permission" as UC3
  usecase "Delete Member Record" as UC4
  usecase "Revoke Workspace Access" as UC5
}

owner --> UC0
owner --> UC1
owner --> UC2
UC1 ..> UC2 : <<include>>
UC1 ..> UC3 : <<include>>
UC1 ..> UC4 : <<include>>
UC1 ..> UC5 : <<include>>
system --> UC3
system --> UC4
system --> UC5
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-4.5 |
| **Use Case Name** | Remove Member from Workspace |
| **Actor(s)** | Workspace Owner, System |
| **Description** | A workspace owner removes a member from their workspace, revoking their access to all workspace content. |
| **Preconditions** | 1. User is authenticated<br>2. User is the workspace owner<br>3. Target user is a member of the workspace<br>4. Target user is not the owner |
| **Postconditions** | 1. Member record deleted from database<br>2. User loses access to workspace<br>3. Member count decremented |
| **Main Flow** | 1. Owner opens workspace members modal<br>2. Owner views list of workspace members<br>3. Owner clicks remove button on target member<br>4. Confirmation dialog appears<br>5. Owner confirms removal<br>6. System validates owner permission<br>7. System deletes member record<br>8. Member removed from list<br>9. Success confirmation displayed |
| **Alternative Flows** | A1: Owner tries to remove themselves → Display error "Cannot remove yourself"<br>A2: Member not found → Display error "User not found in workspace" |
| **Exceptions** | E1: Permission denied → Display error "Only workspace owners can remove members" |

---

## Activity Diagram

```plantuml
@startuml

start

:Owner opens Members Modal;

:System fetches workspace members;

:Display ordered member list;

:Owner clicks Remove button on member;

:Show confirmation dialog;

if (Owner confirms?) then (yes)
  :Get current user from Clerk;
  
  if (User authenticated?) then (yes)
    :Query workspace ownership;
    
    if (User is workspace owner?) then (yes)
      :Check if target is self;
      
      if (Trying to remove self?) then (yes)
        :Return error\n"Cannot remove yourself";
        stop
      else (no)
        :Find member record;
        
        if (Member exists?) then (yes)
          :Delete member record;
          
          :Return success message;
          
          :Update UI - remove from list;
          
          :Decrement member count;
          stop
        else (no)
          :Return error\n"User not found in workspace";
          stop
        endif
      endif
    else (no)
      :Return 403\n"Only owners can remove members";
      stop
    endif
  else (no)
    :Return 404 error;
    stop
  endif
else (no)
  :Cancel operation;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| WorkspaceMembersModal | `src/components/global/workspace/workspace-members-modal.tsx` | Popover showing all workspace members with remove buttons for owners | Modal Component |
| Avatar | `src/components/ui/avatar.tsx` | Member avatar display | UI Component |
| Badge | `src/components/ui/badge.tsx` | Role badges (owner, member, you) | UI Component |
| Button | `src/components/ui/button.tsx` | Remove action button | UI Component |
| Popover | `src/components/ui/popover.tsx` | Container for members list | UI Component |
| AlertDialog | `src/components/ui/alert-dialog.tsx` | Confirmation dialog for removal | UI Component |
| ScrollArea | `src/components/ui/scroll-area.tsx` | Scrollable member list | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| removeUserFromWorkspace | `src/actions/workspace.ts` | Server action to remove member from workspace | Server Action |
| getWorkspaceMembersOrdered | `src/actions/workspace.ts` | Server action to fetch ordered member list | Server Action |
| useMutationData | `src/hooks/useMutationData.ts` | React Query mutation hook for remove action | Custom Hook |
| useQueryData | `src/hooks/useQueryData.ts` | React Query hook for fetching members | Custom Hook |
| Prisma Client | `src/lib/prisma.ts` | Database client for Member table | Database Client |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend" {
  [WorkspaceMembersModal] as WMM
  [Popover] as POP
  [AlertDialog] as AD
  [ScrollArea] as SA
  [Avatar] as AVT
  [Badge] as BDG
  [Button] as BTN
}

package "Hooks" {
  [useMutationData] as UMD
  [useQueryData] as UQD
}

package "Server Actions" {
  [removeUserFromWorkspace] as RUW
  [getWorkspaceMembersOrdered] as GWMO
}

package "Database Layer" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Member Table] as MT
    [User Table] as UT
    [WorkSpace Table] as WT
  }
}

package "External Services" {
  [Clerk Auth] as CA
}

WMM --> POP : uses
WMM --> AD : confirmation
WMM --> SA : uses
WMM --> AVT : uses
WMM --> BDG : uses
WMM --> BTN : remove button

WMM --> UQD : fetches members
WMM --> UMD : handles removal

UQD --> GWMO : calls
UMD --> RUW : calls

RUW --> CA : validates auth
RUW --> PC : deletes member

PC --> MT : DELETE
PC --> UT : SELECT
PC --> WT : SELECT (verify ownership)
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "Workspace Owner" as owner
participant "WorkspaceMembersModal" as modal
participant "AlertDialog" as dialog
participant "useMutationData" as mutation
participant "removeUserFromWorkspace\n(Server Action)" as action
participant "Clerk" as clerk
participant "Prisma Client" as prisma
database "PostgreSQL" as db

owner -> modal: Opens members modal
activate modal

modal -> modal: Fetch members via useQueryData
modal --> owner: Display member list

owner -> modal: Clicks Remove on member
modal -> dialog: Show confirmation
activate dialog

dialog --> owner: "Remove this member?"
owner -> dialog: Confirms removal
deactivate dialog

modal -> mutation: mutate(memberClerkId)
activate mutation

mutation -> action: removeUserFromWorkspace(workspaceId, memberClerkId)
activate action

action -> clerk: currentUser()
clerk --> action: Clerk user

action -> prisma: findUnique (workspace with owner check)
prisma -> db: SELECT * FROM WorkSpace WHERE id AND owner
db --> prisma: Workspace record

action -> action: Validate not removing self

action -> prisma: deleteMany (member record)
prisma -> db: DELETE FROM Member WHERE workSpaceId AND userId
db --> prisma: { count: 1 }

action --> mutation: { status: 200, data: "User removed successfully" }
deactivate action

mutation --> modal: Success
mutation -> modal: Invalidate members query
deactivate mutation

modal -> modal: Refetch member list
modal --> owner: Updated list (member removed)
deactivate modal
@enduml
```

---

## ERD and Schema

```plantuml
@startuml

entity "User" as user {
  * id : UUID <<PK>>
  --
  email : String <<unique>>
  firstname : String?
  lastname : String?
  clerkId : String <<unique>>
  image : String?
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  type : Type (PERSONAL|PUBLIC)
  userId : UUID <<FK>> (owner)
  createdAt : DateTime
}

entity "Member" as member {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  member : Boolean = true
  createdAt : DateTime
}

user ||--o{ workspace : "owns"
user ||--o{ member : "participates as"
workspace ||--o{ member : "has"
@enduml
```

### Prisma Schema (Relevant Models)

```prisma
model User {
  id           String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email        String         @unique
  firstname    String?
  lastname     String?
  clerkId      String         @unique
  image        String?
  workspace    WorkSpace[]
  members      Member[]
}

model WorkSpace {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  type      Type
  name      String
  User      User?    @relation(fields: [userId], references: [id])
  userId    String?  @db.Uuid
  members   Member[]
}

model Member {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  User        User?      @relation(fields: [userId], references: [id])
  userId      String?    @db.Uuid
  createdAt   DateTime   @default(now())
  member      Boolean    @default(true)
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId String?    @db.Uuid
}
```

