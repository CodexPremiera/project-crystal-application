# Features 7.1-7.2: Video Upload

## Features Covered
| #   | Feature/Transaction                                                         | Actor  |
|-----|-----------------------------------------------------------------------------|--------|
| 7.1 | User can upload a video file via the web app (validates file type and size) | User   |
| 7.2 | System shows upload progress during file upload                             | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Video Upload" {
  usecase "Open Upload Dialog" as UC1
  usecase "Select Video File" as UC2
  usecase "Enter Title & Description" as UC3
  usecase "Validate File Type" as UC4
  usecase "Validate File Size" as UC5
  usecase "Upload Video" as UC6
  usecase "Show Upload Progress" as UC7
  usecase "Show Processing State" as UC8
  usecase "Navigate to Video" as UC9
}

user --> UC1
user --> UC2
user --> UC3
user --> UC6
UC2 ..> UC4 : <<include>>
UC2 ..> UC5 : <<include>>
UC6 ..> UC7 : <<include>>
UC6 ..> UC8 : <<include>>
UC6 ..> UC9 : <<include>>
system --> UC4
system --> UC5
system --> UC7
system --> UC8
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-7.1-7.2 |
| **Use Case Name** | Upload Video via Web App |
| **Actor(s)** | User, System |
| **Description** | User uploads a video file through the web application with real-time progress tracking. The system validates the file and shows multi-phase progress. |
| **Preconditions** | 1. User is authenticated<br>2. User has a workspace |
| **Postconditions** | 1. Video file uploaded to server<br>2. User can navigate to video |
| **Main Flow** | 1. User opens upload dialog<br>2. User selects video file<br>3. System validates file type (MP4, WebM, MOV, AVI)<br>4. System validates file size (max 100MB)<br>5. User optionally enters title and description<br>6. User clicks upload<br>7. System shows upload progress (0-100%)<br>8. System shows "Processing..." state<br>9. System shows "Complete" with View Video button |
| **Alternative Flows** | A1: Invalid file type → Show error message<br>A2: File too large → Show error message |
| **Exceptions** | E1: Upload fails → Show error toast<br>E2: Server error → Display error message |

---

## Activity Diagram

```plantuml
@startuml
start

:User opens Upload Dialog;

:User clicks "Select File";

:User selects video file;

:Validate file type;

if (Type is MP4/WebM/MOV/AVI?) then (yes)
  :Validate file size;
  
  if (Size <= 100MB?) then (yes)
    :Display selected file info;
    
    :User enters title (optional);
    
    :User enters description (optional);
    
    :User clicks Upload;
    
    :Set phase = "uploading";
    
    :Get user profile for userId;
    
    :Create FormData with file + metadata;
    
    :Initialize XMLHttpRequest;
    
    repeat
      :XHR upload progress event;
      
      :Update progress bar percentage;
    repeat while (progress < 100%)
    
    :Set phase = "processing";
    
    :Show indeterminate progress bar;
    
    :Wait for server response;
    
    if (Upload successful?) then (yes)
      :Set phase = "complete";
      
      :Store videoId and workspaceId;
      
      :Show "View Video" button;
      
      if (User clicks View Video?) then (yes)
        :Navigate to video page;
        stop
      else (no)
        :Close dialog;
        stop
      endif
    else (no)
      :Show error message;
      
      :Reset to idle phase;
      stop
    endif
  else (no)
    :Show error "File too large (100MB limit)";
    stop
  endif
else (no)
  :Show error "Invalid file type";
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| UploadVideoDialog | `src/components/global/upload-video-dialog.tsx` | Main upload dialog with multi-phase UI | Dialog Component |
| Dialog | `src/components/ui/dialog.tsx` | Base dialog component | UI Component |
| Input | `src/components/ui/input.tsx` | Title input field | UI Component |
| Textarea | `src/components/ui/textarea.tsx` | Description input field | UI Component |
| Progress | `src/components/ui/progress.tsx` | Upload progress bar | UI Component |
| Button | `src/components/ui/button.tsx` | Upload and navigation buttons | UI Component |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| getUserProfile | `src/actions/user.ts` | Gets user ID for upload | Server Action |
| Express /upload | `crystal-express/server.js` | HTTP file upload endpoint | Express Route |
| multer | Express middleware | File upload handling | Middleware |

---

## Component/Module Diagram

```plantuml
@startuml
package "Web App Frontend" {
  [UploadVideoDialog] as UVD
  [Dialog] as DLG
  [Progress] as PRG
  [Input/Textarea] as INP
}

package "Hooks & Actions" {
  [getUserProfile] as GUP
}

package "Browser APIs" {
  [XMLHttpRequest] as XHR
  [FormData] as FD
}

package "Express Server" {
  [POST /upload] as UPL
  [multer middleware] as MLT
  [processVideo()] as PV
}

package "Storage" {
  [temp_upload/] as TMP
}

UVD --> DLG : uses
UVD --> PRG : shows progress
UVD --> INP : title/description

UVD --> GUP : get userId
UVD --> FD : create form data
UVD --> XHR : upload file

XHR --> UPL : POST multipart/form-data
UPL --> MLT : process upload
MLT --> TMP : save file
UPL --> PV : process video
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "UploadVideoDialog" as dialog
participant "getUserProfile" as profile
participant "XMLHttpRequest" as xhr
participant "Express /upload" as server
participant "multer" as multer
database "temp_upload/" as temp

user -> dialog: Opens upload dialog
activate dialog

user -> dialog: Selects video file
dialog -> dialog: validateFile(file)
dialog --> user: Show file info

user -> dialog: Clicks "Upload"
dialog -> dialog: setPhase("uploading")

dialog -> profile: getUserProfile()
activate profile
profile --> dialog: { userId }
deactivate profile

dialog -> dialog: Create FormData
note right: FormData contains:\n- video file\n- userId\n- title (optional)\n- description (optional)

dialog -> xhr: new XMLHttpRequest()
dialog -> xhr: xhr.upload.onprogress

xhr -> server: POST /upload (FormData)
activate server

server -> multer: Process file upload
multer -> temp: Save to temp_upload/

loop Every chunk uploaded
  xhr --> dialog: progress event
  dialog --> user: Update progress bar
end

dialog -> dialog: setPhase("processing")
dialog --> user: Show indeterminate progress

server -> server: processVideo()
note right: See Module 7.3\nfor processing details

server --> xhr: { success, videoId, workspaceId }
deactivate server

xhr --> dialog: Response received

dialog -> dialog: setPhase("complete")
dialog --> user: Show "View Video" button

user -> dialog: Clicks "View Video"
dialog -> dialog: router.push(video page)
deactivate dialog
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
entity "User" as user {
  * id : UUID <<PK>>
  --
  email : String
  clerkId : String
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  description : String?
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
  type : Type
  userId : UUID <<FK>>
}

note right of video
  source: Unique filename
  Format: {uuid}.{ext}
  
  processing: true while
  server is processing
end note

user ||--o{ video : "uploads"
workspace ||--o{ video : "contains"
@enduml
```

### Validation Rules

| Validation | Rule |
|------------|------|
| Allowed Types | `video/mp4`, `video/webm`, `video/quicktime`, `video/x-msvideo` |
| File Extensions | `.mp4`, `.webm`, `.mov`, `.avi` |
| Max File Size | 100MB (100 * 1024 * 1024 bytes) |

### Upload Phases

| Phase | Progress Bar | Description |
|-------|--------------|-------------|
| `idle` | None | File selection and metadata entry |
| `uploading` | Determinate (0-100%) | File being uploaded |
| `processing` | Indeterminate | Server processing video |
| `complete` | None | Success with navigation option |

