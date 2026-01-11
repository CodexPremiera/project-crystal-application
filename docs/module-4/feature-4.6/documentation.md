# Feature 4.6: Leave Workspace

## Features Covered
| #   | Feature/Transaction                      | Actor            |
|-----|------------------------------------------|------------------|
| 4.6 | Workspace member can leave a workspace   | Workspace Member |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "Workspace Member" as member
actor "System" as system

rectangle "Leave Workspace" {
  usecase "View Workspace Options" as UC0
  usecase "Leave Workspace" as UC1
  usecase "Confirm Leave Action" as UC2
  usecase "Validate Not Owner" as UC3
  usecase "Delete Membership Record" as UC4
  usecase "Redirect to Dashboard" as UC5
}

member --> UC0
member --> UC1
member --> UC2
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
| **Use Case ID** | UC-4.6 |
| **Use Case Name** | Leave Workspace |
| **Actor(s)** | Workspace Member, System |
| **Description** | A workspace member voluntarily leaves a workspace they were invited to, removing their access to all workspace content. |
| **Preconditions** | 1. User is authenticated<br>2. User is a member of the workspace (not owner)<br>3. Membership record exists |
| **Postconditions** | 1. Membership record deleted<br>2. User loses workspace access<br>3. User redirected to dashboard |
| **Main Flow** | 1. Member navigates to workspace<br>2. Member opens workspace actions dropdown<br>3. Member selects "Leave Workspace"<br>4. Confirmation dialog appears<br>5. Member confirms leave action<br>6. System validates user is not owner<br>7. System deletes membership record<br>8. User redirected to dashboard<br>9. Success toast displayed |
| **Alternative Flows** | A1: User is the workspace owner → Display error "Owners cannot leave. Delete the workspace instead." |
| **Exceptions** | E1: Membership not found → Display error "You are not a member of this workspace" |

---

## Activity Diagram

```plantuml
@startuml

start

:Member opens Workspace Actions;

:Member clicks "Leave Workspace";

:Show confirmation dialog;

if (Member confirms?) then (yes)
  :Set loading state;
  
  :Get current user from Clerk;
  
  if (User authenticated?) then (yes)
    :Find user's database ID;
    
    if (User found?) then (yes)
      :Check if user is workspace owner;
      
      if (Is owner?) then (yes)
        :Return 403 error\n"Owners cannot leave";
        stop
      else (no)
        :Find membership record;
        
        if (Membership exists?) then (yes)
          :Delete membership record;
          
          :Close dialog;
          
          :Redirect to /dashboard;
          stop
        else (no)
          :Return error\n"Not a member";
          stop
        endif
      endif
    else (no)
      :Return 404\n"User not found";
      stop
    endif
  else (no)
    :Return 404 error;
    stop
  endif
else (no)
  :Cancel operation;
  :Close dialog;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| LeaveWorkspaceModal | `src/components/global/workspace/leave-workspace-modal.tsx` | Confirmation dialog for leaving a workspace | Modal Component |
| WorkspaceActions | `src/components/global/workspace/workspace-actions.tsx` | Dropdown menu with workspace actions including leave | Dropdown Component |
| Dialog | `src/components/ui/dialog.tsx` | Base dialog component | UI Component |
| Button | `src/components/ui/button.tsx` | Cancel and Leave buttons | UI Component |
| DropdownMenu | `src/components/ui/dropdown-menu.tsx` | Workspace actions menu | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| leaveWorkspace | `src/actions/workspace.ts` | Server action to remove user's own membership | Server Action |
| Prisma Client | `src/lib/prisma.ts` | Database client for Member, WorkSpace, User tables | Database Client |
| useRouter | `next/navigation` | Next.js router for redirect | Next.js Hook |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend" {
  [WorkspaceActions] as WA
  [LeaveWorkspaceModal] as LWM
  [DropdownMenu] as DDM
  [Dialog] as DLG
  [Button] as BTN
}

package "Hooks / Navigation" {
  [useRouter] as UR
  [useState] as US
}

package "Server Actions" {
  [leaveWorkspace] as LW
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

WA --> DDM : uses
WA --> LWM : triggers
LWM --> DLG : uses
LWM --> BTN : uses

LWM --> US : manages loading state
LWM --> UR : redirect on success
LWM --> LW : calls action

LW --> CA : validates auth
LW --> PC : deletes membership

PC --> MT : DELETE
PC --> UT : SELECT (find userId)
PC --> WT : SELECT (check not owner)
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "Workspace Member" as member
participant "WorkspaceActions" as actions
participant "LeaveWorkspaceModal" as modal
participant "leaveWorkspace\n(Server Action)" as action
participant "Clerk" as clerk
participant "Prisma Client" as prisma
database "PostgreSQL" as db
participant "Next.js Router" as router

member -> actions: Opens workspace dropdown
activate actions

actions --> member: Show menu options
member -> actions: Clicks "Leave Workspace"

actions -> modal: Opens leave modal
activate modal
deactivate actions

modal --> member: "Are you sure you want to leave?"

member -> modal: Clicks "Leave Workspace"
modal -> modal: setIsLoading(true)

modal -> action: leaveWorkspace(workspaceId)
activate action

action -> clerk: currentUser()
clerk --> action: Clerk user

action -> prisma: findUnique (user by clerkId)
prisma -> db: SELECT id FROM User WHERE clerkId
db --> prisma: User record { id }

action -> prisma: findFirst (check if owner)
prisma -> db: SELECT * FROM WorkSpace WHERE id AND userId
db --> prisma: null (not owner)

action -> prisma: findFirst (membership)
prisma -> db: SELECT * FROM Member WHERE userId AND workSpaceId
db --> prisma: Membership record

action -> prisma: delete (membership)
prisma -> db: DELETE FROM Member WHERE id
db --> prisma: Deleted record

action --> modal: { status: 200, data: "Successfully left" }
deactivate action

modal -> modal: onClose()
modal -> router: push('/dashboard')
activate router

router --> member: Redirect to dashboard
deactivate router
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
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  type : Type (PERSONAL|PUBLIC)
  userId : UUID <<FK>> (owner)
}

entity "Member" as member {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  member : Boolean = true
  createdAt : DateTime
}

note right of member
  On leave:
  Member record is deleted
  User loses workspace access
  Can be re-invited later
end note

user ||--o{ workspace : "owns"
user ||--o{ member : "has membership"
workspace ||--o{ member : "contains"
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
  members      Member[]
  workspace    WorkSpace[]
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

enum Type {
  PERSONAL
  PUBLIC
}
```

