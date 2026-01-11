# Feature 9.3: Video Editing

## Features Covered
| #   | Feature/Transaction                               | Actor        |
|-----|---------------------------------------------------|--------------|
| 9.3 | Video author can edit video title and description | Video Author |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "Video Author" as author
actor "System" as system

rectangle "Video Editing" {
  usecase "View Video Preview" as UC1
  usecase "Click Edit Button" as UC2
  usecase "Open Edit Dialog" as UC3
  usecase "Modify Title" as UC4
  usecase "Modify Description" as UC5
  usecase "Save Changes" as UC6
  usecase "Update Database" as UC7
  usecase "Verify Authorship" as UC8
}

author --> UC1
author --> UC2
author --> UC4
author --> UC5
author --> UC6
UC1 ..> UC8 : <<include>>
UC2 ..> UC3 : <<include>>
UC6 ..> UC7 : <<include>>
system --> UC7
system --> UC8
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.3 |
| **Use Case Name** | Edit Video Title and Description |
| **Actor(s)** | Video Author |
| **Description** | Video author modifies the title and/or description of their video. |
| **Preconditions** | 1. User is authenticated<br>2. User is the video author<br>3. Video exists |
| **Postconditions** | 1. Video title/description updated in database |
| **Main Flow** | 1. Author opens video preview<br>2. System verifies authorship (shows edit button)<br>3. Author clicks edit button<br>4. System opens edit dialog with current values<br>5. Author modifies title and/or description<br>6. Author clicks save<br>7. System calls editVideoInfo<br>8. System updates database and shows success toast |
| **Alternative Flows** | A1: Cancel → Close dialog without saving |
| **Exceptions** | E1: Update fails → Show error toast |

---

## Activity Diagram

```plantuml
@startuml
start

:User opens video preview page;

:System fetches video with author info;

:Compare current user with video author;

if (Is author?) then (yes)
  :Display Edit button next to title;
  
  :User clicks Edit button;
  
  :Open EditVideoTitle dialog;
  
  :Pre-fill form with current title;
  
  :Pre-fill form with current description;
  
  :User modifies title;
  
  :User modifies description;
  
  if (User clicks Save?) then (yes)
    :Call editVideoInfo action;
    
    :Update Video in database;
    
    if (Update successful?) then (yes)
      :Show success toast;
      
      :Close dialog;
      
      :Invalidate preview-video query;
      
      :UI reflects new values;
      stop
    else (no)
      :Show error toast;
      stop
    endif
  else (no)
    :Close dialog;
    
    :Discard changes;
    stop
  endif
else (no)
  :Hide Edit button;
  
  :User can only view;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| EditVideoTitle | `src/components/global/videos/edit-video-title.tsx` | Edit dialog component | Dialog Component |
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Parent page showing edit button | Page Component |
| Dialog | `src/components/ui/dialog.tsx` | Base dialog wrapper | UI Component |
| Input | `src/components/ui/input.tsx` | Title input field | UI Component |
| Textarea | `src/components/ui/textarea.tsx` | Description textarea | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| editVideoInfo | `src/actions/workspace.ts` | Updates video metadata | Server Action |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview Page" {
  [VideoPreview] as VP
  [EditVideoTitle] as EVT
}

package "UI Components" {
  [Dialog] as DLG
  [Input] as INP
  [Textarea] as TXT
  [Button] as BTN
}

package "Server Actions" {
  [editVideoInfo] as EVI
}

package "React Query" {
  [useMutationData] as UMD
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video] as VT
  }
}

VP --> EVT : renders (if author)
EVT --> DLG : uses
EVT --> INP : title input
EVT --> TXT : description input
EVT --> BTN : save/cancel

EVT --> UMD : mutation
UMD --> EVI : calls
EVI --> PC : update
PC --> VT : UPDATE
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "Video Author" as author
participant "VideoPreview" as preview
participant "EditVideoTitle" as edit
participant "useMutationData" as mutation
participant "editVideoInfo" as action
participant "Prisma" as prisma
database "PostgreSQL" as db

author -> preview: Open video preview
activate preview

preview -> preview: Check author flag
note right: author = true\n(from getPreviewVideo)

preview --> author: Show Edit button
deactivate preview

author -> edit: Click Edit button
activate edit

edit --> author: Open dialog with current values

author -> edit: Modify title
author -> edit: Modify description
author -> edit: Click Save

edit -> mutation: mutate({ title, description })
activate mutation

mutation -> action: editVideoInfo(videoId, title, description)
activate action

action -> prisma: video.update()
prisma -> db: UPDATE video SET title, description
db --> prisma: Updated video
prisma --> action: video

action --> mutation: { status: 200, data: "Video successfully updated" }
deactivate action

mutation -> mutation: Invalidate 'preview-video' query
mutation --> edit: Success
deactivate mutation

edit --> author: Show success toast
edit --> author: Close dialog

deactivate edit
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
  description : String?
  source : String
  userId : UUID <<FK>>
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  clerkId : String
}

note right of video
  Only the author
  (video.userId matches
  current user) can edit
  title and description
end note

user ||--o{ video : "creates/edits"
@enduml
```

### Authorization Check

```typescript
// In getPreviewVideo:
const author = user.id === video.User?.clerkId

// Edit button only shown when author === true
{author && (
  <EditVideoTitle
    videoId={videoId}
    title={video.title}
    description={video.description}
  />
)}
```

### Editable Fields

| Field | Max Length | Required | Notes |
|-------|------------|----------|-------|
| title | None | No | Falls back to "Untitled Video" |
| description | None | No | Falls back to "No Description" |

