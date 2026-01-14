# Features 9.7-9.8: Video Download

## Features Covered
| #   | Feature/Transaction                              | Actor           |
|-----|--------------------------------------------------|-----------------|
| 9.7 | User can download their own video                | Video Author    |
| 9.8 | User can download all videos in a folder as ZIP  | Workspace Owner |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "Video Author" as author
actor "Workspace Owner" as owner
actor "System" as system

rectangle "Video Download" {
  usecase "View Video Preview" as UC1
  usecase "Click Download Button" as UC2
  usecase "Fetch Video from S3" as UC3
  usecase "Download Video File" as UC4
  
  usecase "View Folder" as UC5
  usecase "Click Download Folder" as UC6
  usecase "Create ZIP Archive" as UC7
  usecase "Stream Videos to ZIP" as UC8
  usecase "Download ZIP File" as UC9
}

author --> UC1
author --> UC2
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>

owner --> UC5
owner --> UC6
UC6 ..> UC7 : <<include>>
UC7 ..> UC8 : <<include>>
UC8 ..> UC9 : <<include>>
system --> UC3
system --> UC7
system --> UC8
@enduml
```

---

## Use Case Description

### UC-9.7: Download Single Video

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.7 |
| **Use Case Name** | Download Video |
| **Actor(s)** | Video Author |
| **Description** | Video author downloads their video file. |
| **Preconditions** | 1. User is video author<br>2. Video exists in S3 |
| **Postconditions** | 1. Video file downloaded to device |
| **Main Flow** | 1. Author views video preview<br>2. Author clicks download button<br>3. System shows loading toast<br>4. System fetches video via download API<br>5. System triggers browser download<br>6. System shows success toast |

### UC-9.8: Download Folder as ZIP

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-9.8 |
| **Use Case Name** | Download Folder as ZIP |
| **Actor(s)** | Workspace Owner |
| **Description** | Workspace owner downloads all videos in a folder as a ZIP archive. |
| **Preconditions** | 1. User is workspace owner<br>2. Folder has videos |
| **Postconditions** | 1. ZIP file downloaded to device |
| **Main Flow** | 1. Owner views folder<br>2. Owner clicks download option<br>3. System creates ZIP archive<br>4. System streams each video to ZIP<br>5. System downloads ZIP to device |

---

## Activity Diagram

```plantuml
@startuml
start

fork
  partition "Download Single Video (9.7)" {
    :User clicks Download button;
    
    :Set isDownloading = true;
    
    :Show loading toast;
    
    :Call downloadVideoFile();
    
    :Fetch from /api/video/download;
    
    :Pass videoSource to API;
    
    :API constructs S3 URL;
    
    :Fetch video from CloudFront;
    
    :Create blob from response;
    
    :Generate filename from title;
    
    :Create invisible anchor element;
    
    :Set href to blob URL;
    
    :Trigger click to download;
    
    :Revoke blob URL;
    
    :Show success toast;
    
    :Set isDownloading = false;
    stop
  }
fork again
  partition "Download Folder as ZIP (9.8)" {
    :Owner clicks Download Folder;
    
    :Set isDownloading = true;
    
    :Show loading toast;
    
    :Call /api/folder/:id/download;
    
    :API fetches folder videos;
    
    :Create archiver ZIP stream;
    
    :For each video in folder;
    
    repeat
      :Fetch video from CloudFront;
      
      :Add to ZIP with title as filename;
    repeat while (More videos?)
    
    :Finalize ZIP;
    
    :Return ZIP as blob;
    
    :Create blob URL;
    
    :Trigger download;
    
    :Revoke blob URL;
    
    :Show success toast;
    
    :Set isDownloading = false;
    stop
  }
end fork

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Contains download button | Page Component |
| Folder | `src/components/global/folders/folder.tsx` | Contains folder download option | Card Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useDownloadVideo | `src/hooks/useDownloadVideo.ts` | Single video download state |
| useDownloadFolder | `src/hooks/useDownloadFolder.ts` | Folder ZIP download state |

### API Routes

| Route | File Path | Description |
|-------|-----------|-------------|
| GET /api/video/download | `src/app/api/video/download/route.ts` | Proxies video download |
| GET /api/folder/:id/download | `src/app/api/folder/[id]/download/route.ts` | Creates folder ZIP |

### Utilities

| Utility | File Path | Description |
|---------|-----------|-------------|
| downloadVideoFile | `src/lib/download-utils.ts` | Client-side download helper |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview" {
  [VideoPreview] as VP
  [Download Button] as DB
}

package "Folder View" {
  [Folder] as FL
  [Download Folder Option] as DFO
}

package "Hooks" {
  [useDownloadVideo] as UDV
  [useDownloadFolder] as UDF
}

package "API Routes" {
  [GET /api/video/download] as VDA
  [GET /api/folder/:id/download] as FDA
}

package "External Services" {
  [CloudFront CDN] as CF
  [AWS S3] as S3
}

package "Libraries" {
  [archiver] as ARC
}

VP --> DB : renders
DB --> UDV : uses

FL --> DFO : renders
DFO --> UDF : uses

UDV --> VDA : calls
VDA --> CF : fetch video
CF --> S3 : origin

UDF --> FDA : calls
FDA --> CF : fetch videos
FDA --> ARC : create ZIP
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "VideoPreview/Folder" as ui
participant "useDownloadVideo/Folder" as hook
participant "API Route" as api
participant "CloudFront" as cf
database "S3" as s3

== Single Video Download (9.7) ==

user -> ui: Click Download
ui -> hook: downloadVideo()
activate hook

hook -> hook: setIsDownloading(true)
hook --> user: Show loading toast

hook -> api: GET /api/video/download?source=xxx
activate api

api -> cf: Fetch video file
cf -> s3: Get object
s3 --> cf: Video stream
cf --> api: Video data

api --> hook: Video blob
deactivate api

hook -> hook: Create blob URL
hook -> hook: Create anchor element
hook -> hook: Trigger click download

hook --> user: Browser downloads file
hook --> user: Show success toast
hook -> hook: setIsDownloading(false)

deactivate hook

== Folder ZIP Download (9.8) ==

user -> ui: Click Download Folder
ui -> hook: downloadFolder()
activate hook

hook -> hook: setIsDownloading(true)
hook --> user: Show loading toast

hook -> api: GET /api/folder/:id/download
activate api

api -> api: Fetch folder videos list

loop Each video
  api -> cf: Fetch video
  cf -> s3: Get object
  s3 --> cf: Video stream
  api -> api: Add to ZIP archive
end

api -> api: Finalize ZIP
api --> hook: ZIP blob
deactivate api

hook -> hook: Create blob URL
hook -> hook: Trigger download

hook --> user: Browser downloads ZIP
hook --> user: Show success toast
hook -> hook: setIsDownloading(false)

deactivate hook
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
  folderId : UUID? <<FK>>
}

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  name : String
  workSpaceId : UUID <<FK>>
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
}

note right of video
  source: S3 filename
  Used to construct
  CloudFront URL for
  download
end note

folder ||--o{ video : "contains"
workspace ||--o{ folder : "has"
@enduml
```

### Download URLs

| Type | URL Pattern |
|------|-------------|
| Single Video | `${CLOUD_FRONT_URL}/${video.source}` |
| Folder ZIP | `/api/folder/${folderId}/download` |

### ZIP File Structure

```
folder-name.zip
├── Video Title 1.webm
├── Video Title 2.mp4
├── Video Title 3.webm
└── ...
```

### File Naming

```typescript
// Single video
const filename = videoTitle
  ? `${videoTitle.replace(/[^a-zA-Z0-9\s-_]/g, '')}.webm`
  : `video-${videoId}.webm`

// ZIP file
const filename = folderName
  ? `${folderName.replace(/[^a-zA-Z0-9\s-_]/g, '')}.zip`
  : `folder-${folderId}.zip`
```

