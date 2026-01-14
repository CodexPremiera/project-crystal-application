# Features 4.2-4.4: Invitation Responses

## Features Covered
| #   | Feature/Transaction                                         | Actor           |
|-----|-------------------------------------------------------------|-----------------|
| 4.2 | User can accept a workspace invitation, which adds them as a member | Invited User    |
| 4.3 | User can decline a workspace invitation                     | Invited User    |
| 4.4 | Workspace owner can cancel a pending workspace invitation   | Workspace Owner |

---

## Use Case Diagram

```plantuml
@startuml

left to right direction

actor "Invited User" as invitee
actor "Workspace Owner" as owner
actor "System" as system

rectangle "Invitation Responses" {
  usecase "View Invitation Notification" as UC0
  usecase "Accept Invitation" as UC1
  usecase "Decline Invitation" as UC2
  usecase "Cancel Invitation" as UC3
  usecase "Add User as Member" as UC4
  usecase "Mark Invite Inactive" as UC5
  usecase "Validate Invite Active" as UC6
}

invitee --> UC0
invitee --> UC1
invitee --> UC2
owner --> UC3
UC1 ..> UC6 : <<include>>
UC2 ..> UC6 : <<include>>
UC3 ..> UC6 : <<include>>
UC1 ..> UC4 : <<include>>
UC1 ..> UC5 : <<include>>
UC2 ..> UC5 : <<include>>
UC3 ..> UC5 : <<include>>
system --> UC4
system --> UC5
system --> UC6
@enduml
```

---

## Use Case Description

### UC-4.2: Accept Invitation

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-4.2 |
| **Use Case Name** | Accept Workspace Invitation |
| **Actor(s)** | Invited User, System |
| **Description** | An invited user accepts a workspace invitation, which adds them as a member of the workspace. |
| **Preconditions** | 1. User is authenticated<br>2. Valid invitation exists<br>3. Invitation is active (isActive=true)<br>4. User is the intended receiver |
| **Postconditions** | 1. Invitation marked as accepted<br>2. Invitation marked as inactive<br>3. User added as workspace member |
| **Main Flow** | 1. User views notification dropdown<br>2. User sees pending invitation<br>3. User clicks "Accept" button<br>4. System validates invitation ownership<br>5. System validates invitation is active<br>6. System updates invitation (accepted=true, isActive=false)<br>7. System creates member record<br>8. User gains access to workspace |
| **Alternative Flows** | A1: Invitation already processed → Display error message |
| **Exceptions** | E1: Database transaction fails → Rollback changes |

### UC-4.3: Decline Invitation

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-4.3 |
| **Use Case Name** | Decline Workspace Invitation |
| **Actor(s)** | Invited User, System |
| **Description** | An invited user declines a workspace invitation without joining. |
| **Preconditions** | 1. User is authenticated<br>2. Valid invitation exists<br>3. Invitation is active<br>4. User is the intended receiver |
| **Postconditions** | 1. Invitation marked as inactive<br>2. User not added to workspace |
| **Main Flow** | 1. User views notification dropdown<br>2. User sees pending invitation<br>3. User clicks "Decline" button<br>4. System validates invitation ownership<br>5. System updates invitation (isActive=false)<br>6. Invitation disappears from active list |

### UC-4.4: Cancel Invitation

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-4.4 |
| **Use Case Name** | Cancel Workspace Invitation |
| **Actor(s)** | Workspace Owner, System |
| **Description** | A workspace owner cancels a pending invitation they sent. |
| **Preconditions** | 1. Owner is authenticated<br>2. Valid invitation exists<br>3. Invitation is active<br>4. User is the invitation sender |
| **Postconditions** | 1. Invitation marked as inactive<br>2. Receiver can no longer accept |
| **Main Flow** | 1. Owner views notification dropdown<br>2. Owner sees sent invitation<br>3. Owner clicks "Cancel" button<br>4. System validates sender ownership<br>5. System updates invitation (isActive=false)<br>6. Invitation no longer actionable |

---

## Activity Diagram

```plantuml
@startuml

|Invited User|
start

:Open Notification Dropdown;

:View pending invitations;

if (Action?) then (Accept)
  |System|
  :Get current user from Clerk;
  
  :Query invitation by ID;
  
  if (Invitation exists?) then (yes)
    if (Invitation active?) then (yes)
      if (User is receiver?) then (yes)
        :Begin Transaction;
        
        :Update invitation\n(accepted=true, isActive=false);
        
        :Create Member record;
        
        :Commit Transaction;
        
        |Invited User|
        :Access workspace content;
        stop
      else (no)
        :Return 401 Unauthorized;
        stop
      endif
    else (no)
      :Return "Invitation no longer active";
      stop
    endif
  else (no)
    :Return "Invitation not found";
    stop
  endif
  
else if (Action?) then (Decline)
  |System|
  :Get current user from Clerk;
  
  :Query invitation by ID;
  
  if (User is receiver?) then (yes)
    :Update invitation\n(isActive=false);
    
    |Invited User|
    :Invitation removed from list;
    stop
  else (no)
    :Return Unauthorized;
    stop
  endif
  
else (Cancel - by sender)
  |Workspace Owner|
  :Click Cancel on sent invite;
  
  |System|
  :Get current user from Clerk;
  
  :Query invitation by ID;
  
  if (User is sender?) then (yes)
    :Update invitation\n(isActive=false);
    
    |Workspace Owner|
    :Invitation cancelled;
    stop
  else (no)
    :Return Unauthorized;
    stop
  endif
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| NotificationDropdown | `src/components/global/notifications/notification-dropdown.tsx` | Dropdown showing all notifications with accept/decline/cancel buttons for invites | Dropdown Component |
| Avatar | `src/components/ui/avatar.tsx` | Displays user avatars in notification items | UI Component |
| Button | `src/components/ui/button.tsx` | Accept, Decline, Cancel action buttons | UI Component |
| Badge | `src/components/ui/badge.tsx` | Shows invite status (pending, accepted, declined) | UI Component |
| Popover | `src/components/ui/popover.tsx` | Notification dropdown container | UI Component |
| ScrollArea | `src/components/ui/scroll-area.tsx` | Scrollable notification list | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| acceptInvite | `src/actions/user.ts` | Server action to accept invitation and create membership | Server Action |
| declineInvite | `src/actions/user.ts` | Server action to decline invitation | Server Action |
| cancelInvite | `src/actions/user.ts` | Server action to cancel sent invitation | Server Action |
| getNotifications | `src/actions/user.ts` | Server action to fetch user notifications | Server Action |
| useMutationData | `src/hooks/useMutationData.ts` | React Query mutation hook for invitation actions | Custom Hook |
| useQueryData | `src/hooks/useQueryData.ts` | React Query hook for fetching notifications | Custom Hook |
| Prisma Client | `src/lib/prisma.ts` | Database client for Invite, Member tables | Database Client |

---

## Component/Module Diagram

```plantuml
@startuml

package "Frontend" {
  [NotificationDropdown] as ND
  [Popover] as POP
  [ScrollArea] as SA
  [Badge] as BDG
  [Button] as BTN
}

package "Hooks" {
  [useMutationData] as UMD
  [useQueryData] as UQD
}

package "Server Actions" {
  [getNotifications] as GN
  [acceptInvite] as AI
  [declineInvite] as DI
  [cancelInvite] as CI
}

package "Database Layer" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Invite Table] as IT
    [Member Table] as MT
    [User Table] as UT
    [Notification Table] as NT
  }
}

package "External Services" {
  [Clerk Auth] as CA
}

ND --> POP : uses
ND --> SA : uses
ND --> BDG : uses
ND --> BTN : uses (Accept/Decline/Cancel)

ND --> UQD : fetches notifications
ND --> UMD : handles actions

UQD --> GN : calls
UMD --> AI : calls (accept)
UMD --> DI : calls (decline)
UMD --> CI : calls (cancel)

AI --> CA : validates auth
DI --> CA : validates auth
CI --> CA : validates auth

AI --> PC : transaction
DI --> PC : updates invite
CI --> PC : updates invite

PC --> IT : UPDATE
PC --> MT : INSERT (on accept)
PC --> UT : SELECT
PC --> NT : SELECT
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml

actor "User" as user
participant "NotificationDropdown" as dropdown
participant "useMutationData" as mutation
participant "acceptInvite\n(Server Action)" as accept
participant "declineInvite\n(Server Action)" as decline
participant "Clerk" as clerk
participant "Prisma Client" as prisma
database "PostgreSQL" as db

== Accept Invitation Flow ==

user -> dropdown: Clicks "Accept"
activate dropdown

dropdown -> mutation: mutate(inviteId)
activate mutation

mutation -> accept: acceptInvite(inviteId)
activate accept

accept -> clerk: currentUser()
clerk --> accept: Clerk user

accept -> prisma: findUnique(invitation)
prisma -> db: SELECT * FROM Invite
db --> prisma: Invitation record

accept -> accept: Validate receiver == user

accept -> prisma: $transaction([updateInvite, createMember])
prisma -> db: BEGIN TRANSACTION
prisma -> db: UPDATE Invite SET accepted=true, isActive=false
prisma -> db: INSERT INTO Member (userId, workSpaceId)
prisma -> db: COMMIT
db --> prisma: Transaction complete

accept --> mutation: { status: 200, data: "Invitation accepted" }
deactivate accept

mutation --> dropdown: Success
deactivate mutation

dropdown --> user: Update UI (remove from pending)
deactivate dropdown

== Decline Invitation Flow ==

user -> dropdown: Clicks "Decline"
activate dropdown

dropdown -> mutation: mutate(inviteId)
activate mutation

mutation -> decline: declineInvite(inviteId)
activate decline

decline -> clerk: currentUser()
clerk --> decline: Clerk user

decline -> prisma: findUnique(invitation)
prisma -> db: SELECT * FROM Invite
db --> prisma: Invitation record

decline -> decline: Validate receiver == user

decline -> prisma: update(invitation)
prisma -> db: UPDATE Invite SET isActive=false
db --> prisma: Updated record

decline --> mutation: { status: 200, data: "Invitation declined" }
deactivate decline

mutation --> dropdown: Success
deactivate mutation

dropdown --> user: Update UI
deactivate dropdown
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

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  type : Type
  userId : UUID <<FK>>
}

entity "Notification" as notification {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  content : String
  type : NotificationType
  isRead : Boolean = false
}

entity "NotificationInvite" as notif_invite {
  * id : UUID <<PK>>
  --
  notificationId : UUID <<FK>>
  inviteId : UUID <<FK>>
}

user ||--o{ invite : "sends"
user ||--o{ invite : "receives"
user ||--o{ member : "joins as"
workspace ||--o{ invite : "for"
workspace ||--o{ member : "contains"
invite ||--o{ notif_invite : "links"
notification ||--o| notif_invite : "links"
user ||--o{ notification : "receives"
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
```

