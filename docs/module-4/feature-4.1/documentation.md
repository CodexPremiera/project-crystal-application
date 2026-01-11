# Feature 4.1: Workspace Invitation

## Features Covered
| #     | Feature/Transaction                                                              | Actor           |
|-------|----------------------------------------------------------------------------------|-----------------|
| 4.1   | Public workspace owner can invite other users to their workspace                 | Workspace Owner |
| 4.1.1 | System validates that user is not already a member before sending invite         | System          |
| 4.1.2 | System validates that user doesn't have pending invitation                       | System          |
| 4.1.3 | System creates notification for both sender and receiver when invitation is sent | System          |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "Workspace Owner\n(PRO)" as owner
actor "System" as system

rectangle "Workspace Invitation" {
  usecase "Invite User to Workspace" as UC1
  usecase "Search for Users" as UC2
  usecase "Validate User Not Member" as UC3
  usecase "Validate No Pending Invite" as UC4
  usecase "Create Invitation Record" as UC5
  usecase "Create Sender Notification" as UC6
  usecase "Create Receiver Notification" as UC7
}

owner --> UC1
owner --> UC2
UC1 ..> UC2 : <<include>>
UC1 ..> UC3 : <<include>>
UC1 ..> UC4 : <<include>>
UC1 ..> UC5 : <<include>>
system --> UC3
system --> UC4
system --> UC5
system --> UC6
system --> UC7
UC5 ..> UC6 : <<include>>
UC5 ..> UC7 : <<include>>
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-4.1 |
| **Use Case Name** | Invite User to Workspace |
| **Actor(s)** | Workspace Owner (PRO subscription), System |
| **Description** | A PRO workspace owner searches for users and invites them to join their public workspace. The system validates the invitation and creates notifications. |
| **Preconditions** | 1. Owner is authenticated and has PRO subscription<br>2. Workspace is PUBLIC type<br>3. Target user exists in the system |
| **Postconditions** | 1. Invitation record created in database<br>2. Sender notification created<br>3. Receiver notification created |
| **Main Flow** | 1. Owner opens invite modal from workspace dashboard<br>2. Owner searches for users by name<br>3. System returns matching users<br>4. Owner clicks "Invite" on desired user<br>5. System validates user is not already a member (4.1.1)<br>6. System validates no pending invitation exists (4.1.2)<br>7. System creates invitation record<br>8. System creates notifications for both parties (4.1.3)<br>9. Success message displayed |
| **Alternative Flows** | A1: User is already a member → Display error "User is already a member"<br>A2: Pending invitation exists → Display error "User already has a pending invitation"<br>A3: User is workspace owner → Display error "Cannot invite the workspace owner" |
| **Exceptions** | E1: Network error → Display generic error message<br>E2: User not authenticated → Redirect to login |

---

## Activity Diagram

```plantuml
@startuml

start

:Owner opens Invite Modal;

:Owner enters search query;

:System searches for users;

if (Users found?) then (yes)
  :Display user results;
  
  :Owner clicks Invite button;
  
  :Get current user from Clerk;
  
  if (User authenticated?) then (yes)
    :Query sender info from database;
    
    :Query workspace details;
    
    if (Workspace exists?) then (yes)
      :Check if target is already member;
      
      if (Already member?) then (yes)
        :Return error "Already a member";
        stop
      else (no)
        :Check if target is workspace owner;
        
        if (Is owner?) then (yes)
          :Return error "Cannot invite owner";
          stop
        else (no)
          :Check for pending invitation;
          
          if (Pending invite exists?) then (yes)
            :Return error "Already has pending invite";
            stop
          else (no)
            :Create invitation record;
            
            :Create sender notification;
            
            :Create receiver notification;
            
            :Return success "Invite sent";
            stop
          endif
        endif
      endif
    else (no)
      :Return error "Workspace not found";
      stop
    endif
  else (no)
    :Return 404 error;
    stop
  endif
else (no)
  :Display "No Users Found";
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| InviteWorkspaceModal | `src/components/global/invite-workspace-modal.tsx` | Modal dialog for inviting users, only visible for PUBLIC workspaces with PRO subscription | Modal Component |
| Search | `src/components/global/search.tsx` | User search interface with real-time results and invite buttons | Form Component |
| Modal | `src/components/global/modal.tsx` | Reusable modal wrapper component | UI Component |
| DashboardInviteSection | `src/components/global/dashboard-invite-section.tsx` | Container for invite functionality in dashboard | Layout Component |
| Input | `src/components/ui/input.tsx` | Text input for search query | UI Component |
| Button | `src/components/ui/button.tsx` | Invite action button | UI Component |
| Avatar | `src/components/ui/avatar.tsx` | User avatar display in search results | UI Component |
| Loader | `src/components/global/loader/loader.tsx` | Loading spinner for pending state | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| inviteMembers | `src/actions/user.ts` | Server action that validates and creates invitation with notifications | Server Action |
| searchUsers | `src/actions/user.ts` | Server action to search users by name | Server Action |
| useSearch | `src/hooks/useSearch.ts` | Custom hook for debounced user search | Custom Hook |
| useMutationData | `src/hooks/useMutationData.ts` | React Query mutation hook for invite action | Custom Hook |
| Prisma Client | `src/lib/prisma.ts` | Database client for Invite, Member, User, Notification tables | Database Client |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend" {
  [DashboardInviteSection] as DIS
  [InviteWorkspaceModal] as IWM
  [Search Component] as SC
  [Modal] as MOD
}

package "Hooks" {
  [useSearch] as USH
  [useMutationData] as UMD
  [useQueryData] as UQD
}

package "Server Actions" {
  [inviteMembers] as IM
  [searchUsers] as SU
  [getWorkSpaces] as GW
}

package "Database Layer" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Invite Table] as IT
    [Member Table] as MT
    [User Table] as UT
    [Notification Table] as NT
    [WorkSpace Table] as WT
  }
}

package "External Services" {
  [Clerk Auth] as CA
}

DIS --> IWM : renders
IWM --> MOD : uses
IWM --> SC : contains
SC --> USH : uses for search
SC --> UMD : uses for invite
IWM --> UQD : fetches workspaces
UQD --> GW : calls
USH --> SU : calls
UMD --> IM : calls
IM --> CA : validates auth
IM --> PC : creates invitation
SU --> PC : queries users
PC --> IT : INSERT
PC --> MT : SELECT (check member)
PC --> UT : SELECT/UPDATE
PC --> NT : INSERT
PC --> WT : SELECT
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "Workspace Owner" as owner
participant "InviteWorkspaceModal" as modal
participant "Search Component" as search
participant "useSearch Hook" as hook
participant "useMutationData" as mutation
participant "inviteMembers\n(Server Action)" as action
participant "Clerk" as clerk
participant "Prisma Client" as prisma
database "PostgreSQL" as db

owner -> modal: Opens invite modal
activate modal

modal -> search: Renders search interface
activate search

owner -> search: Types user name
search -> hook: onSearchQuery(query)
activate hook

hook -> hook: Debounce (500ms)
hook -> action: searchUsers(query)
action -> prisma: findMany users
prisma -> db: SELECT * FROM User WHERE...
db --> prisma: User records
prisma --> action: User list
action --> hook: Search results
hook --> search: onUsers (filtered list)
deactivate hook

search --> owner: Display user cards

owner -> search: Clicks "Invite" button
search -> mutation: mutate({ receiverId })
activate mutation

mutation -> action: inviteMembers(workspaceId, receiverId)
activate action

action -> clerk: currentUser()
clerk --> action: Clerk user

action -> prisma: findUnique (sender info)
prisma -> db: SELECT * FROM User WHERE clerkId
db --> prisma: Sender record

action -> prisma: findUnique (workspace)
prisma -> db: SELECT * FROM WorkSpace
db --> prisma: Workspace record

action -> prisma: findFirst (existing member)
prisma -> db: SELECT * FROM Member WHERE...
db --> prisma: null (not a member)

action -> prisma: findFirst (pending invite)
prisma -> db: SELECT * FROM Invite WHERE isActive=true
db --> prisma: null (no pending)

action -> prisma: create (invitation)
prisma -> db: INSERT INTO Invite
db --> prisma: New invitation

action -> prisma: update (sender notification)
prisma -> db: INSERT INTO Notification
db --> prisma: Notification created

action -> prisma: update (receiver notification)
prisma -> db: INSERT INTO Notification
db --> prisma: Notification created

action --> mutation: { status: 200, data: "Invite sent" }
deactivate action

mutation --> search: Success
deactivate mutation

search --> owner: Display success
deactivate search
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
  createdAt : DateTime
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  type : Type (PERSONAL|PUBLIC)
  userId : UUID <<FK>>
  createdAt : DateTime
}

entity "Invite" as invite {
  * id : UUID <<PK>>
  --
  senderId : UUID <<FK>>
  receiverId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  content : String
  accepted : Boolean = false
  isActive : Boolean = true
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

entity "Notification" as notification {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  content : String
  type : NotificationType
  isRead : Boolean = false
  createdAt : DateTime
}

entity "NotificationInvite" as notif_invite {
  * id : UUID <<PK>>
  --
  notificationId : UUID <<FK>> <<unique>>
  inviteId : UUID <<FK>>
}

user ||--o{ workspace : "owns"
user ||--o{ invite : "sends (sender)"
user ||--o{ invite : "receives (receiver)"
user ||--o{ member : "has membership"
user ||--o{ notification : "receives"
workspace ||--o{ invite : "has invites"
workspace ||--o{ member : "has members"
invite ||--o{ notif_invite : "linked to"
notification ||--o| notif_invite : "linked to"
@enduml
```

### Prisma Schema (Relevant Models)

```prisma
model Invite {
  id                String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  sender            User?               @relation("sender", fields: [senderId], references: [id])
  senderId          String?             @db.Uuid
  receiver          User?               @relation("receiver", fields: [receiverId], references: [id])
  receiverId        String?             @db.Uuid
  content           String
  WorkSpace         WorkSpace?          @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  workSpaceId       String?             @db.Uuid
  accepted          Boolean             @default(false)
  isActive          Boolean             @default(true)
  createdAt         DateTime            @default(now())
  NotificationInvite NotificationInvite[]
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

model Notification {
  id               String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  User             User?               @relation(fields: [userId], references: [id])
  userId           String?             @db.Uuid
  content          String
  type             NotificationType    @default(INVITE)
  isRead           Boolean             @default(false)
  createdAt        DateTime            @default(now())
  NotificationInvite NotificationInvite?
}

model NotificationInvite {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  notification   Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)
  notificationId String       @unique @db.Uuid
  Invite         Invite       @relation(fields: [inviteId], references: [id], onDelete: Cascade)
  inviteId       String       @db.Uuid
}
```

