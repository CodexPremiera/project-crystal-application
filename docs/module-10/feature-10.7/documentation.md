# Feature 10.7: Copy Link

## Features Covered
| #    | Feature/Transaction                             | Actor |
|------|-------------------------------------------------|-------|
| 10.7 | User can copy video preview link to clipboard   | User  |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Copy Link" {
  usecase "View Video Preview" as UC1
  usecase "Click Copy Link Button" as UC2
  usecase "Construct Preview URL" as UC3
  usecase "Copy to Clipboard" as UC4
  usecase "Show Success Toast" as UC5
}

user --> UC1
user --> UC2
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<include>>
system --> UC3
system --> UC4
system --> UC5
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-10.7 |
| **Use Case Name** | Copy Video Link |
| **Actor(s)** | User |
| **Description** | User copies the video preview URL to clipboard for sharing. |
| **Preconditions** | 1. User is on video preview page<br>2. Clipboard API available |
| **Postconditions** | 1. URL copied to clipboard<br>2. Success toast shown |
| **Main Flow** | 1. User views video preview page<br>2. User clicks Copy Link button<br>3. System constructs preview URL<br>4. System copies URL to clipboard<br>5. System shows success toast |
| **Exceptions** | E1: Clipboard API fails → Show error toast |

---

## Activity Diagram

```plantuml
@startuml
start

:User views video preview page;

:User clicks Copy Link button;

:Construct preview URL;

note right
  URL format:
  ${NEXT_PUBLIC_HOST_URL}/preview/${videoId}
end note

:Call navigator.clipboard.writeText(url);

if (Copy successful?) then (yes)
  :Show success toast;
  
  note right
    "Copied"
    "Link copied to clipboard"
  end note
  stop
else (no)
  :Show error toast;
  
  note right
    "Error"
    "Failed to copy link"
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
| CopyLink | `src/components/global/copy-link.tsx` | Copy link button | Button Component |
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Parent page | Page Component |
| Button | `src/components/ui/button.tsx` | Button wrapper | UI Component |
| Link Icon | lucide-react | Link icon | Icon |

### Browser APIs

| API | Purpose |
|-----|---------|
| navigator.clipboard.writeText | Copies text to clipboard |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Preview" {
  [VideoPreview] as VP
  [CopyLink] as CL
}

package "UI Components" {
  [Button] as BTN
  [Link Icon] as ICON
}

package "Browser APIs" {
  [Clipboard API] as CLIP
}

package "Notifications" {
  [toast] as TOAST
}

package "Environment" {
  [NEXT_PUBLIC_HOST_URL] as ENV
}

VP --> CL : renders
CL --> BTN : uses
CL --> ICON : displays

CL --> ENV : reads host URL
CL --> CLIP : writeText()
CL --> TOAST : show success/error
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "VideoPreview" as preview
participant "CopyLink" as copylink
participant "Clipboard API" as clipboard
participant "toast" as toast

user -> preview: View video page
activate preview

preview --> user: Display CopyLink button

user -> copylink: Click button
activate copylink

copylink -> copylink: Construct URL
note right: `${HOST_URL}/preview/${videoId}`

copylink -> clipboard: navigator.clipboard.writeText(url)
activate clipboard

alt Success
  clipboard --> copylink: Promise resolved
  deactivate clipboard
  
  copylink -> toast: toast("Copied", { description })
  toast --> user: Show success toast
else Failure
  clipboard --> copylink: Promise rejected
  
  copylink -> toast: toast.error("Failed to copy")
  toast --> user: Show error toast
end

deactivate copylink
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
  source : String
}

note right of video
  Copy Link uses only:
  - video.id (for URL)
  
  No database operations
  required for this feature
end note
@enduml
```

### URL Structure

```typescript
const url = `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`

// Example:
// https://crystal.app/preview/abc123-def456-ghi789
```

### CopyLink Component Props

| Prop | Type | Description |
|------|------|-------------|
| videoId | string | Video ID for URL construction |
| className | string? | Additional CSS classes |
| variant | string? | Button variant (e.g., "secondary") |

### Toast Messages

| Scenario | Title | Description |
|----------|-------|-------------|
| Success | "Copied" | "Link copied to clipboard" |
| Error | "Error" | "Failed to copy link" |

