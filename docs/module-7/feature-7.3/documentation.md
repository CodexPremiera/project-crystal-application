# Feature 7.3: Video Processing

## Features Covered
| #     | Feature/Transaction                                                    | Actor  |
|-------|------------------------------------------------------------------------|--------|
| 7.3   | System processes the uploaded/recorded video                           | System |
| 7.3.1 | System creates video record in database when processing begins         | System |
| 7.3.2 | System uploads video to AWS S3 storage                                 | System |
| 7.3.3 | System combines recorded video chunks into final video file            | System |
| 7.3.4 | System creates notifications for workspace members (public workspaces) | System |
| 7.3.5 | System marks video processing as complete                              | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "System" as system

rectangle "Video Processing" {
  usecase "Receive Video Data" as UC1
  usecase "Combine Video Chunks (Desktop)" as UC2
  usecase "Create Video Record" as UC3
  usecase "Upload to AWS S3" as UC4
  usecase "Notify Workspace Members" as UC5
  usecase "Mark Processing Complete" as UC6
  usecase "Cleanup Temp Files" as UC7
}

system --> UC1
UC1 ..> UC2 : <<optional>>
UC1 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<include>>
UC4 ..> UC6 : <<include>>
UC6 ..> UC7 : <<include>>
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-7.3 |
| **Use Case Name** | Process Video |
| **Actor(s)** | System |
| **Description** | System processes an uploaded or recorded video by creating database records, uploading to S3, notifying members, and marking completion. |
| **Preconditions** | 1. Video file exists in temp_upload/<br>2. Valid userId provided |
| **Postconditions** | 1. Video record in database<br>2. Video file in AWS S3<br>3. Temp file cleaned up<br>4. processing = false |
| **Main Flow** | 1. System receives video data (upload or socket)<br>2. For desktop: combine chunks into file (7.3.3)<br>3. Call /recording/:id/processing API (7.3.1)<br>4. Upload file to AWS S3 (7.3.2)<br>5. For PUBLIC workspace: create notifications (7.3.4)<br>6. Call /recording/:id/complete API (7.3.5)<br>7. Delete temp file |
| **Alternative Flows** | A1: PRO user → Trigger AI processing (Module 8)<br>A2: PERSONAL workspace → Skip notifications |
| **Exceptions** | E1: S3 upload fails → Log error, abort<br>E2: Database error → Log error |

---

## Activity Diagram

```plantuml
@startuml
start

if (Source?) then (Desktop Recording)
  :Receive video chunks via Socket.IO;
  
  :Accumulate chunks in memory;
  
  :On "process-video" event;
  
  :Combine chunks into Blob;
  
  :Write complete file to temp_upload/;
else (Web Upload)
  :Receive file via HTTP POST;
  
  :multer saves to temp_upload/;
endif

:Read file from temp_upload/;

:POST /recording/:userId/processing;

:Create Video record in database;

note right
  Video record:
  - source = filename
  - title, description
  - processing = true
  - workSpaceId
end note

if (Workspace type?) then (PUBLIC)
  :Get workspace members;
  
  :Create notification for each member;
  
  note right
    Notification:
    - type = VIDEO_UPLOAD
    - content = "New video uploaded"
  end note
else (PERSONAL)
  :Skip notifications;
endif

:Determine content type from extension;

:Create S3 PutObjectCommand;

:Upload file to AWS S3;

if (S3 upload successful?) then (yes)
  if (User plan?) then (PRO)
    :Trigger AI processing;
    note right: See Module 8
  else (FREE)
    :Skip AI processing;
  endif
  
  :POST /recording/:userId/complete;
  
  :Update Video: processing = false;
  
  :Delete temp file;
  
  :Return success response;
  stop
else (no)
  :Log error;
  
  :Return error response;
  stop
endif

@enduml
```

---

## Component List

### Express Server Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| processVideo() | `crystal-express/server.js` | Main processing function | Function |
| Socket.IO handler | `crystal-express/server.js` | Handles desktop recording chunks | Event Handler |
| POST /upload | `crystal-express/server.js` | HTTP upload endpoint | Express Route |

### Next.js API Routes

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| POST /recording/:id/processing | `src/app/api/recording/[id]/processing/route.ts` | Creates video record | API Route |
| POST /recording/:id/complete | `src/app/api/recording/[id]/complete/route.ts` | Marks processing complete | API Route |

### External Services

| Service | Purpose | Type |
|---------|---------|------|
| AWS S3 | Video file storage | Cloud Storage |
| Socket.IO | Real-time chunk streaming | WebSocket |

---

## Component/Module Diagram

```plantuml
@startuml
package "Desktop App" {
  [Socket.IO Client] as SIO_C
}

package "Web App" {
  [UploadVideoDialog] as UVD
}

package "Express Server" {
  [POST /upload] as UPLOAD
  [Socket.IO Server] as SIO_S
  [processVideo()] as PV
  [video-chunks handler] as VCH
  [process-video handler] as PVH
}

package "Next.js API" {
  [/recording/:id/processing] as PROC
  [/recording/:id/complete] as COMP
}

package "AWS" {
  [S3 Bucket] as S3
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video Table] as VT
    [Notification Table] as NT
  }
}

cloud "File System" {
  [temp_upload/] as TMP
}

UVD --> UPLOAD : HTTP POST
UPLOAD --> TMP : save file
UPLOAD --> PV : process

SIO_C --> SIO_S : connect
SIO_C --> VCH : video-chunks
VCH --> VCH : accumulate
SIO_C --> PVH : process-video
PVH --> TMP : write file
PVH --> PV : process

PV --> PROC : POST
PROC --> PC : create video
PC --> VT : INSERT
PC --> NT : INSERT (if PUBLIC)

PV --> S3 : PutObjectCommand
S3 --> S3 : store file

PV --> COMP : POST
COMP --> PC : update
PC --> VT : UPDATE processing=false

PV --> TMP : delete file
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
participant "Express Server" as express
participant "processVideo()" as process
participant "Next.js API\n/processing" as procapi
participant "Next.js API\n/complete" as compapi
participant "Prisma Client" as prisma
database "PostgreSQL" as db
participant "AWS S3" as s3
database "temp_upload/" as temp

== Processing Phase (7.3.1) ==

express -> process: processVideo(filename, userId)
activate process

process -> temp: Read file
temp --> process: File buffer

process -> procapi: POST { filename, title, description }
activate procapi

procapi -> prisma: user.findUnique(userId)
prisma -> db: SELECT user with workspace
db --> prisma: User data

procapi -> prisma: video.create()
prisma -> db: INSERT INTO Video
db --> prisma: Created video

alt Workspace is PUBLIC (7.3.4)
  procapi -> prisma: Get workspace members
  loop For each member
    procapi -> prisma: Create notification
    prisma -> db: INSERT INTO Notification
  end
end

procapi --> process: { status: 200, videoId, plan }
deactivate procapi

== S3 Upload Phase (7.3.2) ==

process -> s3: PutObjectCommand(file)
s3 --> process: { httpStatusCode: 200 }

alt PRO Plan
  process -> process: Trigger AI Processing
  note right: See Module 8
end

== Completion Phase (7.3.5) ==

process -> compapi: POST { filename }
activate compapi

compapi -> prisma: video.update()
prisma -> db: UPDATE Video SET processing = false
db --> prisma: Updated

compapi --> process: { status: 200 }
deactivate compapi

== Cleanup ==

process -> temp: Delete file
temp --> process: File deleted

process --> express: { success: true, videoId }
deactivate process
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
entity "User" as user {
  * id : UUID <<PK>>
  --
  firstname : String?
  lastname : String?
  clerkId : String
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String? = "Untitled Video"
  description : String? = "No Description"
  source : String <<unique>>
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  processing : Boolean = true
  createdAt : DateTime
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  type : Type (PERSONAL|PUBLIC)
  userId : UUID <<FK>>
}

entity "Member" as member {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
}

entity "Notification" as notification {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  videoId : UUID? <<FK>>
  content : String
  type : NotificationType
  isRead : Boolean = false
}

user ||--o{ video : "creates"
workspace ||--o{ video : "contains"
workspace ||--o{ member : "has members"
user ||--o{ member : "is member of"
user ||--o{ notification : "receives"
video ||--o{ notification : "triggers"
@enduml
```

### Prisma Schema (Relevant Models)

```prisma
model Video {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title       String?    @default("Untitled Video")
  description String?    @default("No Description")
  source      String     @unique
  createdAt   DateTime   @default(now())
  userId      String?    @db.Uuid
  processing  Boolean    @default(true)
  workSpaceId String?    @db.Uuid
  User        User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  WorkSpace   WorkSpace? @relation(fields: [workSpaceId], references: [id], onDelete: Cascade)
  Notification Notification[]
}

model Notification {
  id        String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String?          @db.Uuid
  content   String
  type      NotificationType @default(INVITE)
  videoId   String?          @db.Uuid
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
  User      User?            @relation(fields: [userId], references: [id])
  Video     Video?           @relation(fields: [videoId], references: [id], onDelete: Cascade)
}

enum NotificationType {
  INVITE
  VIDEO_VIEW
  VIDEO_LIKE
  VIDEO_UPLOAD
}
```

### Processing Flow Summary

| Step | Action | Endpoint/Service |
|------|--------|------------------|
| 1 | Create video record | POST /recording/:id/processing |
| 2 | Upload to S3 | AWS S3 PutObjectCommand |
| 3 | (PRO) AI processing | OpenAI Whisper + GPT |
| 4 | Mark complete | POST /recording/:id/complete |
| 5 | Cleanup temp file | fs.unlink() |

