# Features 10.5-10.6: Like/Unlike

## Features Covered
| #    | Feature/Transaction                                                     | Actor  |
|------|-------------------------------------------------------------------------|--------|
| 10.5 | User can like or unlike a video                                         | User   |
| 10.6 | System creates notification for video owner on like (public workspaces) | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Like/Unlike" {
  usecase "View Video Preview" as UC1
  usecase "Click Like Button" as UC2
  usecase "Check Existing Like" as UC3
  usecase "Create Like Record" as UC4
  usecase "Delete Like Record" as UC5
  usecase "Update Like Counter" as UC6
  usecase "Create Like Notification" as UC7
  usecase "Update UI" as UC8
}

user --> UC1
user --> UC2
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<if not liked>>
UC3 ..> UC5 : <<if already liked>>
UC4 ..> UC6 : <<increment>>
UC5 ..> UC6 : <<decrement>>
UC4 ..> UC7 : <<if public>>
UC6 ..> UC8 : <<include>>
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
| **Use Case ID** | UC-10.5-10.6 |
| **Use Case Name** | Toggle Video Like |
| **Actor(s)** | User, System |
| **Description** | User toggles like status on a video. System creates/deletes like record, updates counter, and notifies owner for public workspaces. |
| **Preconditions** | 1. User is authenticated<br>2. Video exists |
| **Postconditions** | 1. Like status toggled<br>2. Counter updated<br>3. Notification sent (on like, public workspace) |
| **Main Flow** | 1. User clicks like button<br>2. System checks existing VideoLike record<br>3. If not liked: create record, increment counter<br>4. If public & not owner: create notification<br>5. Update UI with new count<br>6. If already liked: delete record, decrement counter |
| **Alternative Flows** | A1: Unlike → Delete like, decrement (no notification) |
| **Exceptions** | E1: Database error → Return error status |

---

## Activity Diagram

```plantuml
@startuml
start

:User clicks Like button;

:Call toggleVideoLike(videoId);

:Get current user from Clerk;

:Find user in database;

:Fetch video with workspace info;

:Check VideoLike table for existing like;

if (Already liked?) then (yes)
  :Delete VideoLike record;
  
  :Decrement Video.likes counter;
  
  note right
    $transaction:
    1. videoLike.delete
    2. video.update likes--
  end note
  
  :Return { likes: count, liked: false };
  
  :Update UI (unfilled heart);
  stop
else (no)
  :Create VideoLike record;
  
  :Increment Video.likes counter;
  
  note right
    $transaction:
    1. videoLike.create
    2. video.update likes++
  end note
  
  if (Public workspace?) then (yes)
    if (User is not video owner?) then (yes)
      :Create VIDEO_LIKE notification;
      
      note right
        Notification content:
        "{UserName} liked your
         video {title}"
      end note
    else (no)
    endif
  else (no)
  endif
  
  :Return { likes: count, liked: true };
  
  :Update UI (filled heart);
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Contains like button | Page Component |
| Like (icon) | `src/components/global/like.tsx` | Heart icon component | Icon Component |
| Button | `src/components/ui/button.tsx` | Like button wrapper | UI Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useMutationData | `src/hooks/useMutationData.ts` | Handles like mutation with cache invalidation |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| toggleVideoLike | `src/actions/workspace.ts` | Toggles like status | Server Action |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview" {
  [VideoPreview] as VP
  [Like Button] as LB
  [Like Icon] as LI
}

package "Hooks" {
  [useMutationData] as UMD
}

package "Server Actions" {
  [toggleVideoLike] as TVL
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video] as VT
    [VideoLike] as VLT
    [Notification] as NT
  }
}

VP --> LB : renders
LB --> LI : displays
LB --> UMD : onClick

UMD --> TVL : mutate

TVL --> PC : transaction
PC --> VLT : findUnique/CREATE/DELETE
PC --> VT : UPDATE likes
PC --> NT : CREATE (if public + like)
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "VideoPreview" as preview
participant "useMutationData" as mutation
participant "toggleVideoLike" as action
participant "Prisma" as prisma
database "PostgreSQL" as db

user -> preview: Click Like button
activate preview

preview -> mutation: mutate()
activate mutation

mutation -> action: toggleVideoLike(videoId)
activate action

action -> prisma: user.findUnique(clerkId)
prisma -> db: SELECT user
db --> prisma: user

action -> prisma: video.findUnique with WorkSpace
prisma -> db: SELECT video, workspace
db --> prisma: video

action -> prisma: videoLike.findUnique
prisma -> db: SELECT WHERE videoId AND userId
db --> prisma: existingLike or null

alt Not Liked (Like action)
  action -> prisma: $transaction
  prisma -> db: INSERT VideoLike
  prisma -> db: UPDATE Video likes++
  
  alt Public Workspace & Not Owner (10.6)
    action -> prisma: notification.create
    prisma -> db: INSERT Notification (VIDEO_LIKE)
  end
  
  action --> mutation: { likes: N, liked: true }
else Already Liked (Unlike action)
  action -> prisma: $transaction
  prisma -> db: DELETE VideoLike
  prisma -> db: UPDATE Video likes--
  
  action --> mutation: { likes: N, liked: false }
end

deactivate action

mutation -> mutation: Invalidate 'preview-video' query
mutation --> preview: Success

preview --> user: Update button UI + count

deactivate mutation
deactivate preview
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  likes : Int = 0
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
}

entity "VideoLike" as videolike {
  * id : UUID <<PK>>
  --
  videoId : UUID <<FK>>
  userId : UUID <<FK>>
  createdAt : DateTime
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  firstname : String?
  lastname : String?
}

entity "Notification" as notification {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  actorId : UUID? <<FK>>
  videoId : UUID? <<FK>>
  content : String
  type : VIDEO_LIKE
}

note right of videolike
  Unique constraint:
  @@unique([videoId, userId])
  
  One like per user per video
end note

video ||--o{ videolike : "has likes"
user ||--o{ videolike : "likes"
video ||--o{ notification : "triggers"
@enduml
```

### Like Toggle Logic

| Current State | Action | DB Operations | Notification |
|---------------|--------|---------------|--------------|
| Not liked | Like | CREATE VideoLike, likes++ | Yes (if public & not owner) |
| Liked | Unlike | DELETE VideoLike, likes-- | No |

