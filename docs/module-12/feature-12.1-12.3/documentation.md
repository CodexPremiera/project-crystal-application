# Features 12.1-12.3: Notification Viewing & Management

## Features Covered
| #    | Feature/Transaction                         | Actor |
|------|---------------------------------------------|-------|
| 12.1 | User can view all their notifications       | User  |
| 12.2 | User can view unread notification count     | User  |
| 12.3 | User can mark all notifications as read     | User  |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Notification Management" {
  usecase "Click Bell Icon" as UC1
  usecase "View Unread Badge" as UC2
  usecase "Open Notifications Dropdown" as UC3
  usecase "View Notification List" as UC4
  usecase "Mark All as Read" as UC5
  usecase "View Notification Details" as UC6
  usecase "Accept/Decline Invite" as UC7
  usecase "Navigate to Video" as UC8
}

user --> UC1
user --> UC7
user --> UC8
UC1 ..> UC2 : <<include>>
UC1 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>
UC3 ..> UC5 : <<auto-trigger>>
system --> UC2
system --> UC5
system --> UC6
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-12.1-12.3 |
| **Use Case Name** | View and Manage Notifications |
| **Actor(s)** | User, System |
| **Description** | User views notifications via dropdown, sees unread count, and marks all as read automatically on open. |
| **Preconditions** | 1. User is authenticated<br>2. User has notifications |
| **Postconditions** | 1. Notifications displayed<br>2. Unread count updated |
| **Main Flow** | 1. User sees bell icon with unread badge (12.2)<br>2. User clicks bell icon<br>3. Dropdown opens with notification list (12.1)<br>4. System auto-marks all as read (12.3)<br>5. User can view details, accept invites, or navigate |
| **Alternative Flows** | A1: No notifications → Show empty state |

---

## Activity Diagram

```plantuml
@startuml
start

:User views header;

:Fetch notifications via getNotifications;

:Calculate unread count from notifications;

if (Unread count > 0?) then (yes)
  :Display badge with count (12.2);
else (no)
  :Hide badge;
endif

:User clicks bell icon;

:Open NotificationDropdown popover;

:Display scrollable notification list (12.1);

note right
  Each notification shows:
  - Icon (by type)
  - Actor avatar
  - Content text
  - Timestamp
  - Unread dot (if unread)
end note

:useEffect triggers on open;

if (Unread count > 0?) then (yes)
  :Call markAllNotificationsAsRead (12.3);
  
  :Update local unread count to 0;
  
  :Invalidate 'user-notifications' cache;
else (no)
endif

if (Notification type?) then (INVITE)
  :Show Accept/Decline buttons;
  
  if (User clicks Accept?) then (yes)
    :Call acceptInvite;
    
    :Add user to workspace;
  else (Decline)
    :Call declineInvite;
    
    :Deactivate invite;
  endif
else (VIDEO_VIEW/LIKE/UPLOAD)
  :User clicks notification;
  
  :Navigate to video preview page;
endif

stop
@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| NotificationDropdown | `src/components/global/notifications/notification-dropdown.tsx` | Bell icon with dropdown | Popover Component |
| Bell Icon | `src/components/icons` | Notification bell icon | Icon |
| Popover | `src/components/ui/popover.tsx` | Dropdown container | UI Component |
| ScrollArea | `src/components/ui/scroll-area.tsx` | Scrollable notification list | UI Component |
| Avatar | `src/components/ui/avatar.tsx` | Actor avatar | UI Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useQueryData | `src/hooks/useQueryData.ts` | Fetches notifications |
| useMutationData | `src/hooks/useMutationData.ts` | Marks as read, accepts/declines |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| getNotifications | `src/actions/user.ts` | Fetches all notifications | Server Action |
| markAllNotificationsAsRead | `src/actions/user.ts` | Marks all as read | Server Action |
| NotificationService | `src/services/notification.service.ts` | Database operations | Service |

---

## Component/Module Diagram

```plantuml
@startuml
package "Header" {
  [NotificationDropdown] as ND
  [Bell Icon] as BI
  [Badge] as BG
}

package "Dropdown Content" {
  [Popover] as POP
  [ScrollArea] as SA
  [Notification Cards] as NC
}

package "Hooks" {
  [useQueryData] as UQD
  [useMutationData] as UMD
}

package "Server Actions" {
  [getNotifications] as GN
  [markAllNotificationsAsRead] as MAR
  [acceptInvite] as AI
  [declineInvite] as DI
}

package "Services" {
  [NotificationService] as NS
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Notification] as NT
  }
}

ND --> BI : displays
ND --> BG : shows count
ND --> POP : opens

POP --> SA : contains
SA --> NC : renders

ND --> UQD : fetch
UQD --> GN : calls

ND --> UMD : mark read
UMD --> MAR : calls
UMD --> AI : calls
UMD --> DI : calls

GN --> NS : uses
MAR --> NS : uses
NS --> PC : queries
PC --> NT : SELECT/UPDATE
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "NotificationDropdown" as dropdown
participant "useQueryData" as query
participant "getNotifications" as action
participant "markAllNotificationsAsRead" as mark
participant "NotificationService" as service
participant "Prisma" as prisma
database "PostgreSQL" as db

== Load Notifications ==

dropdown -> query: useQueryData(['user-notifications'])
activate query

query -> action: getNotifications()
action -> prisma: user.findUnique with notification
prisma -> db: SELECT notifications ORDER BY createdAt DESC
db --> prisma: Notification[]
action --> query: { notification[], _count }

query --> dropdown: notifications data
deactivate query

== Display Badge (12.2) ==

dropdown -> dropdown: Calculate unread count
dropdown --> user: Show badge with count

== Open Dropdown (12.1) ==

user -> dropdown: Click bell icon
dropdown --> user: Open popover
dropdown --> user: Display notification list

== Mark All as Read (12.3) ==

dropdown -> dropdown: useEffect on open
alt Unread count > 0
  dropdown -> mark: markAllNotificationsAsRead()
  activate mark
  
  mark -> service: markAllAsRead(userId)
  service -> prisma: notification.updateMany
  prisma -> db: UPDATE isRead = true
  db --> prisma: Updated count
  
  mark --> dropdown: Success
  deactivate mark
  
  dropdown -> dropdown: setLocalUnreadCount(0)
end

== Invite Actions ==

alt INVITE notification
  user -> dropdown: Click Accept
  dropdown -> dropdown: handleAccept(inviteId)
  note right: See Module 4 for details
end
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
entity "Notification" as notification {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  actorId : UUID? <<FK>>
  videoId : UUID? <<FK>>
  content : String
  type : NotificationType
  isRead : Boolean = false
  createdAt : DateTime
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  firstname : String?
  lastname : String?
  image : String?
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  source : String
}

entity "NotificationInvite" as notif_invite {
  * id : UUID <<PK>>
  --
  notificationId : UUID <<FK>>
  inviteId : UUID <<FK>>
}

note right of notification
  Types:
  - INVITE
  - VIDEO_VIEW
  - VIDEO_LIKE
  - VIDEO_UPLOAD
  
  isRead: false = unread
  Actor: who triggered
end note

user ||--o{ notification : "receives"
user ||--o{ notification : "triggers (Actor)"
video ||--o{ notification : "related to"
notification ||--o| notif_invite : "has invite"
@enduml
```

### Notification Type Icons

| Type | Icon | Color |
|------|------|-------|
| INVITE | UserPlus | Default |
| VIDEO_VIEW | Eye | Default |
| VIDEO_LIKE | Heart | Red |
| VIDEO_UPLOAD | Upload | Default |

### Unread Badge Logic

```typescript
// Calculate from notification list
const unreadCount = notificationList.filter(n => !n.isRead).length

// Badge displays when > 0
{badgeCount > 0 && (
  <span className="badge">{badgeCount}</span>
)}
```

