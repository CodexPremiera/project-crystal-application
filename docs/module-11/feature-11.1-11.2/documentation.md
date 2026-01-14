# Features 11.1-11.2: Comment Creation

## Features Covered
| #    | Feature/Transaction                        | Actor |
|------|--------------------------------------------|-------|
| 11.1 | User can post a comment on a video         | User  |
| 11.2 | User can reply to an existing comment      | User  |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Comment Creation" {
  usecase "View Video Comments Tab" as UC1
  usecase "Enter Comment Text" as UC2
  usecase "Submit Comment" as UC3
  usecase "Click Reply Button" as UC4
  usecase "Enter Reply Text" as UC5
  usecase "Submit Reply" as UC6
  usecase "Validate Comment" as UC7
  usecase "Create Comment Record" as UC8
  usecase "Create Reply Record" as UC9
  usecase "Refresh Comments List" as UC10
}

user --> UC1
user --> UC2
user --> UC3
user --> UC4
user --> UC5
user --> UC6
UC3 ..> UC7 : <<include>>
UC6 ..> UC7 : <<include>>
UC7 ..> UC8 : <<for comment>>
UC7 ..> UC9 : <<for reply>>
UC8 ..> UC10 : <<include>>
UC9 ..> UC10 : <<include>>
system --> UC7
system --> UC8
system --> UC9
system --> UC10
@enduml
```

---

## Use Case Description

### UC-11.1: Post Comment

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-11.1 |
| **Use Case Name** | Post Comment on Video |
| **Actor(s)** | User |
| **Description** | User posts a new top-level comment on a video. |
| **Preconditions** | 1. User is authenticated<br>2. Video exists<br>3. User is on Comments tab |
| **Postconditions** | 1. Comment record created<br>2. Comment appears in list |
| **Main Flow** | 1. User opens Comments tab<br>2. User enters comment text<br>3. User clicks Submit<br>4. System validates comment<br>5. System creates comment via CommentService<br>6. System invalidates cache<br>7. Comment appears in list |

### UC-11.2: Reply to Comment

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-11.2 |
| **Use Case Name** | Reply to Existing Comment |
| **Actor(s)** | User |
| **Description** | User posts a reply to an existing comment. |
| **Preconditions** | 1. User is authenticated<br>2. Parent comment exists |
| **Postconditions** | 1. Reply record created<br>2. Reply appears under parent |
| **Main Flow** | 1. User clicks Reply button on comment<br>2. Reply form appears inline<br>3. User enters reply text<br>4. User clicks Submit<br>5. System creates reply via CommentService<br>6. Reply appears nested under parent |

---

## Activity Diagram

```plantuml
@startuml
start

:User opens Comments tab;

fork
  partition "Post Comment (11.1)" {
    :User enters comment in form;
    
    :User clicks Submit;
    
    :Validate comment text (Zod);
    
    if (Valid?) then (yes)
      :Get user profile (userId);
      
      :Call createCommentAndReply;
      
      note right
        Parameters:
        - userId
        - comment text
        - videoId
        - commentId = undefined
      end note
      
      :CommentService.createOnVideo();
      
      :video.update with Comment.create;
      
      :Reset form;
      
      :Invalidate 'video-comments' cache;
      
      :Comment appears in list;
      stop
    else (no)
      :Show validation error;
      stop
    endif
  }
fork again
  partition "Reply to Comment (11.2)" {
    :User clicks Reply button;
    
    :Reply form appears inline;
    
    :User enters reply text;
    
    :User clicks Submit;
    
    :Validate reply text (Zod);
    
    if (Valid?) then (yes)
      :Get user profile (userId);
      
      :Call createCommentAndReply;
      
      note right
        Parameters:
        - userId
        - comment text
        - videoId
        - commentId = parent ID
      end note
      
      :CommentService.createReply();
      
      :comment.update with reply.create;
      
      :Reset form;
      
      :Close reply form;
      
      :Invalidate 'video-comments' cache;
      
      :Reply appears nested;
      stop
    else (no)
      :Show validation error;
      stop
    endif
  }
end fork

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Comments | `src/components/global/video-tools/activities.tsx` | Comments tab container | Tab Component |
| CommentForm | `src/components/forms/comment-form/index.tsx` | Comment input form | Form Component |
| CommentCard | `src/components/global/comment-card.tsx` | Comment display with reply | Card Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useVideoComment | `src/hooks/useVideo.ts` | Comment form and mutation logic |
| useMutationData | `src/hooks/useMutationData.ts` | Handles mutation with cache |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| createCommentAndReply | `src/actions/user.ts` | Creates comment or reply | Server Action |
| CommentService | `src/services/comment.service.ts` | Database operations | Service |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview" {
  [TabMenu] as TM
  [Comments] as CMT
}

package "Comment Components" {
  [CommentForm] as CF
  [CommentCard] as CC
}

package "Hooks" {
  [useVideoComment] as UVC
  [useZodForm] as UZF
  [useMutationData] as UMD
}

package "Server Actions" {
  [createCommentAndReply] as CCA
}

package "Services" {
  [CommentService] as CS
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Comment] as CT
    [Video] as VT
  }
}

TM --> CMT : Comments tab
CMT --> CF : top-level form
CMT --> CC : render comments

CC --> CF : reply form

CF --> UVC : uses
UVC --> UZF : form validation
UVC --> UMD : mutation

UMD --> CCA : calls
CCA --> CS : uses

CS --> PC : queries
PC --> CT : CREATE
PC --> VT : UPDATE
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "CommentForm" as form
participant "useVideoComment" as hook
participant "createCommentAndReply" as action
participant "CommentService" as service
participant "Prisma" as prisma
database "PostgreSQL" as db

== Post Comment (11.1) ==

user -> form: Enter comment text
user -> form: Click Submit

form -> hook: onFormSubmit()
activate hook

hook -> hook: Validate with Zod
hook -> action: createCommentAndReply(userId, text, videoId)
activate action

action -> service: createOnVideo(videoId, userId, text)
service -> prisma: video.update({ Comment: { create } })
prisma -> db: UPDATE Video, INSERT Comment
db --> prisma: Success

action --> hook: { status: 200, data: "New comment added" }
deactivate action

hook -> hook: reset() form
hook -> hook: Invalidate 'video-comments'

hook --> form: Success
deactivate hook

form --> user: Comment appears in list

== Reply to Comment (11.2) ==

user -> form: Click Reply button
form --> user: Show inline reply form

user -> form: Enter reply text
user -> form: Click Submit

form -> hook: onFormSubmit()
activate hook

hook -> action: createCommentAndReply(userId, text, videoId, commentId)
activate action

action -> service: createReply(commentId, videoId, userId, text)
service -> prisma: comment.update({ reply: { create } })
prisma -> db: UPDATE Comment, INSERT Comment (reply)
db --> prisma: Success

action --> hook: { status: 200, data: "Reply posted" }
deactivate action

hook -> hook: reset() form
hook -> hook: Invalidate 'video-comments'

hook --> form: Success
deactivate hook

form --> user: Reply appears nested
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
}

entity "Comment" as comment {
  * id : UUID <<PK>>
  --
  comment : String
  createdAt : DateTime
  userId : UUID <<FK>>
  videoId : UUID? <<FK>>
  commentId : UUID? <<FK>>
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  firstname : String?
  lastname : String?
  image : String?
}

note right of comment
  Self-referencing relation:
  - commentId = null → top-level
  - commentId = parent → reply
  
  reply relation:
  comment.reply[] → children
end note

video ||--o{ comment : "has comments"
user ||--o{ comment : "writes"
comment ||--o{ comment : "has replies"
@enduml
```

### Prisma Schema

```prisma
model Comment {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  comment   String
  createdAt DateTime   @default(now())
  userId    String?    @db.Uuid
  videoId   String?    @db.Uuid
  commentId String?    @db.Uuid
  User      User?      @relation(fields: [userId], references: [id])
  Video     Video?     @relation(fields: [videoId], references: [id], onDelete: Cascade)
  Comment   Comment?   @relation("reply", fields: [commentId], references: [id], onDelete: Cascade)
  reply     Comment[]  @relation("reply")
}
```

### Comment Types

| Type | commentId | Description |
|------|-----------|-------------|
| Top-level | null | Direct comment on video |
| Reply | parent ID | Nested under parent comment |

