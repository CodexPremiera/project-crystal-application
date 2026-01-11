# Features 12.4-12.7: Notification Creation

## Features Covered
| #    | Feature/Transaction                                                      | Actor  |
|------|--------------------------------------------------------------------------|--------|
| 12.4 | System creates invitation notification when user is invited to workspace | System |
| 12.5 | System creates video view notification for video owner                   | System |
| 12.6 | System creates video like notification for video owner                   | System |
| 12.7 | System creates video upload notification for workspace members           | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "System" as system

rectangle "Notification Creation" {
  usecase "Invite User to Workspace" as UC1
  usecase "Create INVITE Notification" as UC2
  usecase "User Views Video" as UC3
  usecase "Create VIDEO_VIEW Notification" as UC4
  usecase "User Likes Video" as UC5
  usecase "Create VIDEO_LIKE Notification" as UC6
  usecase "Upload Video to Workspace" as UC7
  usecase "Create VIDEO_UPLOAD Notifications" as UC8
}

system --> UC1
system --> UC3
system --> UC5
system --> UC7
UC1 ..> UC2 : <<triggers>>
UC3 ..> UC4 : <<if public workspace>>
UC5 ..> UC6 : <<if public workspace>>
UC7 ..> UC8 : <<if public workspace>>
@enduml
```

---

## Use Case Description

### UC-12.4: Invitation Notification

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-12.4 |
| **Use Case Name** | Create Invitation Notification |
| **Trigger** | inviteMembers action |
| **Description** | When user invites another to workspace, notifications created for both sender and receiver. |

### UC-12.5: Video View Notification

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-12.5 |
| **Use Case Name** | Create Video View Notification |
| **Trigger** | recordVideoView action |
| **Condition** | Public workspace AND viewer is not owner |
| **Description** | When user views video in public workspace, owner is notified. |

### UC-12.6: Video Like Notification

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-12.6 |
| **Use Case Name** | Create Video Like Notification |
| **Trigger** | toggleVideoLike action (on like, not unlike) |
| **Condition** | Public workspace AND liker is not owner |
| **Description** | When user likes video in public workspace, owner is notified. |

### UC-12.7: Video Upload Notification

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-12.7 |
| **Use Case Name** | Create Video Upload Notification |
| **Trigger** | /recording/:id/processing API route |
| **Condition** | Public workspace |
| **Description** | When video uploaded to public workspace, all members are notified. |

---

## Activity Diagram

```plantuml
@startuml
start

fork
  partition "Invitation Notification (12.4)" {
    :inviteMembers called;
    
    :Create Invite record;
    
    :Create notification for sender;
    note right: "You invited {name} into {workspace}"
    
    :Create notification for receiver;
    note right: "You are invited to join {workspace}"
    
    :Link both to NotificationInvite;
    stop
  }
fork again
  partition "Video View Notification (12.5)" {
    :recordVideoView called;
    
    :Record unique view;
    
    if (Public workspace?) then (yes)
      if (Viewer != Owner?) then (yes)
        :Create VIDEO_VIEW notification;
        
        note right
          Content:
          "{ViewerName} viewed your
           video '{title}'"
        end note
      else (no)
      endif
    else (no)
    endif
    stop
  }
fork again
  partition "Video Like Notification (12.6)" {
    :toggleVideoLike called (like action);
    
    :Create VideoLike record;
    
    if (Public workspace?) then (yes)
      if (Liker != Owner?) then (yes)
        :Create VIDEO_LIKE notification;
        
        note right
          Content:
          "{LikerName} liked your
           video '{title}'"
        end note
      else (no)
      endif
    else (no)
    endif
    stop
  }
fork again
  partition "Video Upload Notification (12.7)" {
    :/recording/:id/processing called;
    
    :Create Video record;
    
    if (Public workspace?) then (yes)
      :Get all workspace members;
      
      :For each member (except uploader);
      
      :Create VIDEO_UPLOAD notification;
      
      note right
        Content:
        "New video uploaded:
         '{title}'"
      end note
    else (no)
    endif
    stop
  }
end fork

@enduml
```

---

## Component List

### Trigger Actions

| Notification Type | Trigger Location | File Path |
|-------------------|------------------|-----------|
| INVITE | inviteMembers | `src/actions/user.ts` |
| VIDEO_VIEW | recordVideoView | `src/actions/workspace.ts` |
| VIDEO_LIKE | toggleVideoLike | `src/actions/workspace.ts` |
| VIDEO_UPLOAD | POST /recording/:id/processing | `src/app/api/recording/[id]/processing/route.ts` |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| NotificationService.create | `src/services/notification.service.ts` | Creates notification | Service |
| Prisma notification.create | Direct Prisma calls | Database creation | ORM |

---

## Component/Module Diagram

```plantuml
@startuml
package "Invitation Flow" {
  [inviteMembers] as IM
}

package "Video View Flow" {
  [recordVideoView] as RVV
}

package "Video Like Flow" {
  [toggleVideoLike] as TVL
}

package "Video Upload Flow" {
  [POST /processing] as PROC
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Notification] as NT
    [NotificationInvite] as NI
    [User] as UT
    [Video] as VT
    [WorkSpace] as WS
  }
}

IM --> PC : create notification
IM --> NI : link to invite

RVV --> PC : create if public
TVL --> PC : create if public
PROC --> PC : create for members

PC --> NT : INSERT
NT --> UT : userId (recipient)
NT --> UT : actorId (trigger)
NT --> VT : videoId
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
participant "Trigger Action" as trigger
participant "Prisma" as prisma
database "PostgreSQL" as db

== Invitation Notification (12.4) ==

trigger -> trigger: inviteMembers(workspaceId, receiverId)
trigger -> prisma: invite.create()
prisma -> db: INSERT Invite

trigger -> prisma: user.update (sender notification)
prisma -> db: INSERT Notification (INVITE)
prisma -> db: INSERT NotificationInvite

trigger -> prisma: user.update (receiver notification)
prisma -> db: INSERT Notification (INVITE)
prisma -> db: INSERT NotificationInvite

== Video View Notification (12.5) ==

trigger -> trigger: recordVideoView(videoId)
trigger -> trigger: Check workspace type

alt Public Workspace AND Not Owner
  trigger -> prisma: notification.create()
  note right: type: 'VIDEO_VIEW'
  prisma -> db: INSERT Notification
end

== Video Like Notification (12.6) ==

trigger -> trigger: toggleVideoLike(videoId)
trigger -> trigger: Check workspace type

alt Public Workspace AND Not Owner AND Like (not unlike)
  trigger -> prisma: notification.create()
  note right: type: 'VIDEO_LIKE'
  prisma -> db: INSERT Notification
end

== Video Upload Notification (12.7) ==

trigger -> trigger: POST /recording/:id/processing
trigger -> trigger: Check workspace type

alt Public Workspace
  trigger -> prisma: Get workspace members
  prisma -> db: SELECT members
  
  loop For each member (except uploader)
    trigger -> prisma: notification.create()
    note right: type: 'VIDEO_UPLOAD'
    prisma -> db: INSERT Notification
  end
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

entity "NotificationInvite" as notif_invite {
  * id : UUID <<PK>>
  --
  notificationId : UUID <<FK>>
  inviteId : UUID <<FK>>
}

entity "Invite" as invite {
  * id : UUID <<PK>>
  --
  senderId : UUID <<FK>>
  receiverId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  accepted : Boolean = false
  isActive : Boolean = true
}

note right of notification
  NotificationType enum:
  - INVITE
  - VIDEO_VIEW
  - VIDEO_LIKE
  - VIDEO_UPLOAD
end note

notification ||--o| notif_invite : "linked to"
notif_invite ||--|| invite : "references"
@enduml
```

### Notification Content Templates

| Type | Content Template | Variables |
|------|------------------|-----------|
| INVITE (sender) | "You invited {name} into {workspace}" | receiver name, workspace name |
| INVITE (receiver) | "You are invited to join {workspace} Workspace" | workspace name |
| VIDEO_VIEW | "{name} viewed your video \"{title}\"" | viewer name, video title |
| VIDEO_LIKE | "{name} liked your video \"{title}\"" | liker name, video title |
| VIDEO_UPLOAD | "New video uploaded: \"{title}\"" | video title |

### Notification Creation Conditions

| Type | Condition |
|------|-----------|
| INVITE | Always created for both sender and receiver |
| VIDEO_VIEW | Public workspace AND viewer ≠ owner |
| VIDEO_LIKE | Public workspace AND liker ≠ owner AND action is like (not unlike) |
| VIDEO_UPLOAD | Public workspace → all members except uploader |

