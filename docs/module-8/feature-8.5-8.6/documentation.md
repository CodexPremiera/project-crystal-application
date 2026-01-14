# Features 8.5-8.6: Transcript Viewer

## Features Covered
| #   | Feature/Transaction                                    | Actor    |
|-----|--------------------------------------------------------|----------|
| 8.5 | User can view AI-generated transcript with timestamps  | PRO User |
| 8.6 | User can click transcript timestamps to seek video     | PRO User |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "PRO User" as user
actor "System" as system

rectangle "Transcript Viewer" {
  usecase "View Video Page" as UC1
  usecase "View Transcript Tab" as UC2
  usecase "See Timestamped Segments" as UC3
  usecase "Track Active Segment" as UC4
  usecase "Click Timestamp to Seek" as UC5
  usecase "Auto-scroll to Active" as UC6
  usecase "Highlight Active Segment" as UC7
}

user --> UC1
user --> UC2
user --> UC5
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
system --> UC4
system --> UC6
system --> UC7
UC4 ..> UC6 : <<include>>
UC4 ..> UC7 : <<include>>
@enduml
```

---

## Use Case Description

### UC-8.5: View Transcript with Timestamps

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-8.5 |
| **Use Case Name** | View AI-Generated Transcript |
| **Actor(s)** | PRO User, System |
| **Description** | PRO user views the AI-generated transcript with timestamped segments that sync with video playback. |
| **Preconditions** | 1. Video has been processed with AI<br>2. Transcript segments exist<br>3. User is viewing video page |
| **Postconditions** | 1. Transcript displayed with timestamps |
| **Main Flow** | 1. User navigates to video page<br>2. User selects Transcript tab<br>3. System displays timestamped segments<br>4. System tracks video playback time<br>5. System highlights active segment<br>6. System auto-scrolls to keep active visible |
| **Alternative Flows** | A1: No transcript → Show empty state<br>A2: No segments → Show plain text |

### UC-8.6: Click to Seek

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-8.6 |
| **Use Case Name** | Seek Video via Transcript |
| **Actor(s)** | PRO User |
| **Description** | User clicks on a timestamp or segment to jump to that point in the video. |
| **Preconditions** | 1. Transcript with segments displayed<br>2. Video player loaded |
| **Postconditions** | 1. Video seeks to clicked time<br>2. Video starts playing |
| **Main Flow** | 1. User clicks on a segment row<br>2. System sets video.currentTime to segment.start<br>3. System starts video playback |

---

## Activity Diagram

```plantuml
@startuml
start

:User opens video page;

:Load video with transcript data;

if (Transcript exists?) then (yes)
  if (Segments exist?) then (yes)
    :Render timestamped segments;
    
    :Register video timeupdate listener;
    
    fork
      :Video plays;
      
      repeat
        :Video timeupdate event;
        
        :Update currentTime state;
        
        :Find active segment by time;
        
        :Highlight active segment;
        
        :Auto-scroll if needed;
      repeat while (Video playing?)
    fork again
      :User clicks segment row;
      
      :Get segment.start time;
      
      :Set video.currentTime;
      
      :Call video.play();
    end fork
  else (no)
    :Display plain text transcript;
    stop
  endif
else (no)
  :Display empty state;
  
  note right
    "No transcript available"
    "This video doesn't have
     a transcript yet"
  end note
  stop
endif

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| VideoTranscript | `src/components/global/video-tools/video-transcript.tsx` | Main transcript display component | Tab Component |
| VideoPreview | `src/components/global/videos/video-preview.tsx` | Video page with transcript tab | Page Component |
| TabMenu | `src/components/global/tabs/tab-menu.tsx` | Tab container for Transcript/Comments | Tab Component |
| TabsContent | `src/components/ui/tabs.tsx` | Tab content wrapper | UI Component |

### State Management

| Hook/State | Purpose |
|------------|---------|
| currentTime | Tracks video playback position |
| activeSegmentIndex | Index of currently active segment |
| videoRef | Reference to video element |
| containerRef | Reference for auto-scroll container |
| segmentRefs | References to each segment element |

---

## Component/Module Diagram

```plantuml
@startuml
package "Video Page" {
  [VideoPreview] as VP
  [TabMenu] as TM
  [VideoTranscript] as VT
  [Video Player] as VID
}

package "State" {
  [currentTime] as CT
  [activeSegmentIndex] as ASI
}

package "Events" {
  [timeupdate] as TU
  [click] as CLK
}

package "DOM" {
  [Segment Elements] as SE
  [Container (scrollable)] as CNT
}

VP --> VID : contains
VP --> TM : contains
TM --> VT : Transcript tab

VID --> TU : emits
TU --> CT : updates

VT --> CT : reads
VT --> ASI : calculates
VT --> SE : renders
VT --> CNT : contains

SE --> CLK : triggers
CLK --> VID : seek & play

ASI --> SE : highlights
ASI --> CNT : auto-scroll
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "PRO User" as user
participant "VideoPreview" as preview
participant "Video Player" as video
participant "VideoTranscript" as transcript

== Initial Load ==

user -> preview: Opens video page
activate preview

preview -> video: Load video
preview -> transcript: Pass videoRef, segments
activate transcript

transcript -> transcript: Initialize state\n(currentTime=0, activeIndex=-1)

transcript -> video: addEventListener('timeupdate')

transcript --> user: Display transcript segments

== Playback Tracking ==

user -> video: Play video
activate video

loop Every timeupdate
  video -> transcript: timeupdate event
  transcript -> transcript: setCurrentTime(video.currentTime)
  
  transcript -> transcript: Find active segment
  note right: segment where:\ncurrentTime >= start\nAND currentTime < nextStart
  
  transcript -> transcript: setActiveSegmentIndex(index)
  
  transcript -> transcript: Highlight active row
  
  alt Active segment changed
    transcript -> transcript: Check if in view
    alt Not in view
      transcript -> transcript: scrollIntoView({ block: 'center' })
    end
  end
end

== Click to Seek (8.6) ==

user -> transcript: Click segment row
transcript -> transcript: handleSeek(segment.start)

transcript -> video: video.currentTime = start
transcript -> video: video.play()

video --> user: Video seeks and plays

deactivate video
deactivate transcript
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
  summary : String?
  transcriptSegments : Json?
  userId : UUID <<FK>>
}

note right of video
  transcriptSegments structure:
  
  [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello everyone..."
    },
    {
      "start": 2.5,
      "end": 5.0,
      "text": "Today we'll talk..."
    }
  ]
end note

entity "TranscriptSegment (Virtual)" as segment {
  start : Float
  end : Float
  text : String
}

video ||--o{ segment : "contains (JSON)"
@enduml
```

### TypeScript Types

```typescript
// TranscriptSegment type definition
type TranscriptSegment = {
  start: number   // Start time in seconds
  end: number     // End time in seconds
  text: string    // Segment text content
}

// VideoTranscript props
type Props = {
  transcript: string                          // Plain text fallback
  segments?: TranscriptSegment[] | null       // Timestamped segments
  videoRef: React.RefObject<HTMLVideoElement> // Video element reference
}
```

### UI States

| State | Condition | Display |
|-------|-----------|---------|
| Empty | No transcript AND no segments | Icon + "No transcript available" |
| Plain Text | Transcript exists, no segments | Plain paragraph text |
| Segments | segments.length > 0 | Timestamped clickable rows |
| Active Segment | currentTime within segment range | Highlighted background + accent border |

### Timestamp Format

```typescript
const formatTimestamp = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  // Returns "1:23" or "1:05:30"
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
```

