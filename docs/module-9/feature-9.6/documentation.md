# Feature 9.6: Video Deletion

## Features Covered
| #     | Feature/Transaction                        | Actor        |
|-------|-------------------------------------------|--------------|
| 9.6   | Video author can delete their video       | Video Author |
| 9.6.1 | System cascades deletion of video comments | System       |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "Video Author" as author
actor "System" as system

rectangle "Video Deletion" {
  usecase "Open Video Menu" as UC1
  usecase "Click Delete Option" as UC2
  usecase "Show Confirmation Dialog" as UC3
  usecase "Confirm Deletion" as UC4
  usecase "Verify Ownership" as UC5
  usecase "Delete Video Record" as UC6
  usecase "Cascade Delete Comments" as UC7
  usecase "Navigate Away" as UC8
}

author --> UC1
author --> UC2
author --> UC4
UC2 ..> UC3 : <<include>>
UC4 ..> UC5 : <<include>>
UC5 ..> UC6 : <<include>>
UC6 ..> UC7 : <<include>>
UC6 ..> UC8 : <<include>>
system --> UC5
system --> UC6
system --> UC7
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.6 |
| **Use Case Name** | Delete Video |
| **Actor(s)** | Video Author, System |
| **Description** | Video author permanently deletes their video. System cascades deletion to related comments. |
| **Preconditions** | 1. User is authenticated<br>2. User is the video author<br>3. Video exists |
| **Postconditions** | 1. Video record deleted<br>2. All comments deleted<br>3. User navigated away |
| **Main Flow** | 1. Author opens video dropdown menu<br>2. Author clicks "Delete"<br>3. System shows confirmation dialog<br>4. Author confirms deletion<br>5. System verifies ownership (clerkId match)<br>6. System deletes video record<br>7. Prisma cascades to delete comments (9.6.1)<br>8. System navigates to workspace |
| **Alternative Flows** | A1: Cancel → Close dialog, no deletion |
| **Exceptions** | E1: Not owner → Return 403<br>E2: Video not found → Return 404 |

---

## Activity Diagram

```plantuml
@startuml
start

:User opens video options menu;

:User clicks "Delete Video";

:Show confirmation dialog;

note right
  "Are you sure?"
  "This action cannot be undone"
end note

if (User confirms?) then (yes)
  :Call deleteVideo action;
  
  :Get current user from Clerk;
  
  if (User authenticated?) then (yes)
    :Fetch video with owner info;
    
    if (Video exists?) then (yes)
      :Compare clerkId with video owner;
      
      if (Is video owner?) then (yes)
        :Delete Video record;
        
        note right
          Prisma cascade:
          onDelete: Cascade
          Deletes all Comment
          records automatically
        end note
        
        :Show success toast;
        
        :Navigate to workspace;
        
        :Invalidate video queries;
        stop
      else (no)
        :Return 403 Forbidden;
        
        :Show error toast;
        stop
      endif
    else (no)
      :Return 404 Not Found;
      
      :Show error toast;
      stop
    endif
  else (no)
    :Return 404 Unauthorized;
    stop
  endif
else (no)
  :Close dialog;
  
  :Cancel deletion;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Contains delete option | Page Component |
| DropdownMenu | `src/components/ui/dropdown-menu.tsx` | Options menu | UI Component |
| AlertDialog | `src/components/ui/alert-dialog.tsx` | Confirmation dialog | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| deleteVideo | `src/actions/workspace.ts` | Deletes video with auth check | Server Action |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview" {
  [VideoPreview] as VP
  [DropdownMenu] as DM
  [AlertDialog] as AD
}

package "Server Actions" {
  [deleteVideo] as DV
}

package "Authentication" {
  [Clerk currentUser] as CU
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video] as VT
    [Comment] as CT
  }
}

VP --> DM : renders
DM --> AD : triggers
AD --> DV : confirms

DV --> CU : verify auth
DV --> PC : findUnique
PC --> VT : SELECT with User

DV --> PC : delete
PC --> VT : DELETE Video
VT --> CT : CASCADE DELETE

note right of CT
  Prisma schema:
  Comment.Video
  onDelete: Cascade
end note
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "Video Author" as author
participant "VideoPreview" as preview
participant "DropdownMenu" as menu
participant "AlertDialog" as dialog
participant "deleteVideo" as action
participant "Clerk" as clerk
participant "Prisma" as prisma
database "PostgreSQL" as db

author -> preview: Open page
preview --> author: Show video with options

author -> menu: Click options dropdown
menu --> author: Show menu items

author -> menu: Click "Delete"
menu -> dialog: Open confirmation

dialog --> author: "Are you sure?"

author -> dialog: Click Confirm
activate dialog

dialog -> action: deleteVideo(videoId)
activate action

action -> clerk: currentUser()
clerk --> action: user

action -> prisma: video.findUnique({ id, include: User })
prisma -> db: SELECT video WITH user
db --> prisma: video

action -> action: Verify ownership
note right: video.User.clerkId === user.id

alt Not Owner
  action --> dialog: { status: 403, data: "You can only delete your own videos" }
else Owner
  action -> prisma: video.delete({ id })
  prisma -> db: DELETE FROM Video WHERE id = ?
  
  note right of db
    CASCADE triggered:
    DELETE FROM Comment
    WHERE videoId = ?
  end note
  
  db --> prisma: Deleted
  
  action --> dialog: { status: 200, data: "Video deleted successfully" }
end

deactivate action

dialog --> author: Show toast
dialog -> preview: Navigate to workspace

deactivate dialog
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
  source : String
  userId : UUID <<FK>>
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  clerkId : String
}

entity "Comment" as comment {
  * id : UUID <<PK>>
  --
  content : String
  videoId : UUID <<FK>>
  userId : UUID <<FK>>
  commentId : UUID? <<FK>>
}

note right of comment
  Cascade delete rule:
  When Video is deleted,
  all related Comments
  are automatically deleted
end note

user ||--o{ video : "creates"
video ||--o{ comment : "has (CASCADE)"
user ||--o{ comment : "writes"
comment ||--o{ comment : "replies to"
@enduml
```

### Prisma Schema (Cascade)

```prisma
model Comment {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  content   String
  videoId   String?    @db.Uuid
  Video     Video?     @relation(fields: [videoId], references: [id], onDelete: Cascade)
  // ... other fields
}
```

### Authorization Flow

| Step | Check | Response |
|------|-------|----------|
| 1 | User authenticated? | 404 if not |
| 2 | Video exists? | 404 if not |
| 3 | User owns video? | 403 if not |
| 4 | Delete video | 200 on success |

