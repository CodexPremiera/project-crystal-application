# Features 11.3-11.5: Comment Viewing

## Features Covered
| #    | Feature/Transaction                                      | Actor  |
|------|----------------------------------------------------------|--------|
| 11.3 | User can view all comments on a video                    | User   |
| 11.4 | User can view nested replies in a comment thread         | User   |
| 11.5 | System displays comment author information and timestamp | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Comment Viewing" {
  usecase "Open Comments Tab" as UC1
  usecase "Fetch Video Comments" as UC2
  usecase "Display Comments List" as UC3
  usecase "Display Nested Replies" as UC4
  usecase "Show Author Avatar" as UC5
  usecase "Show Author Name" as UC6
  usecase "Show Timestamp" as UC7
  usecase "Show Empty State" as UC8
}

user --> UC1
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>
UC3 ..> UC5 : <<include>>
UC3 ..> UC6 : <<include>>
UC3 ..> UC7 : <<include>>
system --> UC2
system --> UC4
system --> UC5
system --> UC6
system --> UC7
system --> UC8
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-11.3-11.5 |
| **Use Case Name** | View Video Comments |
| **Actor(s)** | User, System |
| **Description** | User views all comments on a video with nested replies, author information, and timestamps. |
| **Preconditions** | 1. User is on video preview page<br>2. Video exists |
| **Postconditions** | 1. Comments displayed with metadata |
| **Main Flow** | 1. User clicks Comments tab<br>2. System fetches comments via getVideoComments<br>3. System renders comment cards with author info (11.5)<br>4. System renders nested replies (11.4)<br>5. Each comment shows avatar, name, text, timestamp |
| **Alternative Flows** | A1: No comments → Show empty state with icon |

---

## Activity Diagram

```plantuml
@startuml
start

:User clicks Comments tab;

:Call getVideoComments(videoId);

:CommentService.getForVideo();

:Query comments with replies and User;

note right
  Query includes:
  - Top-level comments (commentId = null)
  - reply[] with User
  - User (author info)
end note

if (Comments exist?) then (yes)
  :Render comment list;
  
  partition "For each comment (11.3)" {
    :Create CommentCard;
    
    partition "Display Author Info (11.5)" {
      :Show author avatar (User.image);
      
      :Show author name (firstname + lastname);
      
      :Calculate days ago (getDaysAgo);
      
      :Format timestamp (formatDaysAgo);
      
      :Display formatted time;
    }
    
    :Display comment text;
    
    :Show Reply button;
    
    if (Has replies?) then (yes)
      partition "Display Nested Replies (11.4)" {
        :Render border-left container;
        
        :For each reply;
        
        :Render CommentCard (isReply=true);
        
        note right
          Reply styling:
          - Indented (pl-10)
          - No border
          - No Reply button
        end note
      }
    else (no)
    endif
  }
  stop
else (no)
  :Display empty state;
  
  note right
    Empty state shows:
    - Chat bubble icon
    - "No comments yet"
    - "Be the first to leave a comment"
  end note
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Comments | `src/components/global/video-tools/activities.tsx` | Comments tab container | Tab Component |
| CommentCard | `src/components/global/comment-card.tsx` | Individual comment display | Card Component |
| Avatar | `src/components/ui/avatar.tsx` | Author avatar | UI Component |
| Card | `src/components/ui/card.tsx` | Comment container | UI Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useQueryData | `src/hooks/useQueryData.ts` | Fetches comments with caching |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| getVideoComments | `src/actions/user.ts` | Fetches video comments | Server Action |
| CommentService.getForVideo | `src/services/comment.service.ts` | Database query | Service |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview" {
  [TabMenu] as TM
  [Comments] as CMT
}

package "Comment Display" {
  [CommentCard] as CC
  [Avatar] as AVT
  [Card] as CRD
}

package "Utilities" {
  [getDaysAgo] as GDA
  [formatDaysAgo] as FDA
}

package "Hooks" {
  [useQueryData] as UQD
}

package "Server Actions" {
  [getVideoComments] as GVC
}

package "Services" {
  [CommentService] as CS
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Comment] as CT
    [User] as UT
  }
}

TM --> CMT : Comments tab
CMT --> UQD : fetch comments
UQD --> GVC : calls

CMT --> CC : render each
CC --> AVT : author image
CC --> CRD : container
CC --> CC : nested replies

CC --> GDA : calculate
CC --> FDA : format

GVC --> CS : uses
CS --> PC : query
PC --> CT : SELECT with User
PC --> UT : JOIN
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "Comments Tab" as tab
participant "useQueryData" as query
participant "getVideoComments" as action
participant "CommentService" as service
participant "Prisma" as prisma
database "PostgreSQL" as db
participant "CommentCard" as card

user -> tab: Click Comments tab
activate tab

tab -> query: useQueryData(['video-comments'])
activate query

query -> action: getVideoComments(videoId)
activate action

action -> service: getForVideo(videoId)
service -> prisma: comment.findMany()
note right: WHERE commentId = null\nINCLUDE reply, User

prisma -> db: SELECT comments with users
db --> prisma: Comment[] with nested data

service --> action: comments
action --> query: { data: comments }
deactivate action

query --> tab: comments data
deactivate query

alt Has Comments (11.3)
  loop For each comment
    tab -> card: Render CommentCard
    activate card
    
    card --> user: Display author avatar (11.5)
    card --> user: Display author name (11.5)
    card --> user: Display timestamp (11.5)
    card --> user: Display comment text
    card --> user: Display Reply button
    
    alt Has Replies (11.4)
      loop For each reply
        card -> card: Render nested CommentCard
        note right: isReply = true\nIndented styling
        card --> user: Display reply with author
      end
    end
    
    deactivate card
  end
else No Comments
  tab --> user: Display empty state
end

deactivate tab
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
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

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
}

note right of comment
  Display fields:
  - comment (text content)
  - createdAt (for timestamp)
  
  Relations:
  - User (author info)
  - reply[] (nested comments)
end note

video ||--o{ comment : "has"
user ||--o{ comment : "writes"
comment ||--o{ comment : "reply"
@enduml
```

### Comment Query Structure

```typescript
// CommentService.getForVideo query
client.comment.findMany({
  where: {
    OR: [{ videoId }, { commentId: videoId }],
    commentId: null,  // Only top-level
  },
  include: {
    reply: {
      include: {
        User: true,  // Reply author
      },
    },
    User: true,  // Comment author
  },
})
```

### Timestamp Formatting

| Days Ago | Display |
|----------|---------|
| 0 | "Today" |
| 1 | "1d ago" |
| 7 | "7d ago" or "1w ago" |
| 30+ | "1mo ago" |

### CommentCard Props

| Prop | Type | Description |
|------|------|-------------|
| comment | string | Comment text content |
| author | { image, firstname, lastname } | Author info |
| videoId | string | Video reference |
| commentId | string? | Parent comment ID |
| reply | CommentRepliesProps[] | Nested replies |
| isReply | boolean | Styling flag |
| createdAt | Date | Timestamp |

