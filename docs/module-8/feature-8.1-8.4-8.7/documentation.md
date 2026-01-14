# Features 8.1-8.4, 8.7: AI Processing Pipeline

## Features Covered
| #     | Feature/Transaction                                                    | Actor  |
|-------|------------------------------------------------------------------------|--------|
| 8.1   | System generates AI transcript from video (PRO users)                  | System |
| 8.1.1 | System extracts audio from video                                       | System |
| 8.1.2 | System transcribes audio using OpenAI Whisper                          | System |
| 8.1.3 | System generates timestamped transcript segments                       | System |
| 8.2   | System generates AI-powered video title (PRO users)                    | System |
| 8.3   | System generates AI-powered video summary/description (PRO users)      | System |
| 8.4   | System updates Voiceflow knowledge base with video content (PRO users) | System |
| 8.7   | System skips AI processing for videos whose audio exceeds 25MB         | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "System" as system

rectangle "AI Processing Pipeline" {
  usecase "Check User Plan" as UC0
  usecase "Extract Audio from Video" as UC1
  usecase "Check Audio Size (<25MB)" as UC2
  usecase "Transcribe with Whisper" as UC3
  usecase "Generate Timestamps" as UC4
  usecase "Generate Title with GPT" as UC5
  usecase "Generate Summary with GPT" as UC6
  usecase "Update Voiceflow KB" as UC7
  usecase "Save to Database" as UC8
  usecase "Skip AI Processing" as UC9
}

system --> UC0
UC0 ..> UC1 : <<if PRO>>
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<if <25MB>>
UC2 ..> UC9 : <<if >=25MB>>
UC3 ..> UC4 : <<include>>
UC3 ..> UC5 : <<include>>
UC3 ..> UC6 : <<include>>
UC5 ..> UC8 : <<include>>
UC6 ..> UC8 : <<include>>
UC8 ..> UC7 : <<include>>
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-8.1-8.4-8.7 |
| **Use Case Name** | AI Video Processing Pipeline |
| **Actor(s)** | System |
| **Description** | System processes video content with AI to generate transcripts, titles, summaries, and update the Voiceflow knowledge base. Only available for PRO users. |
| **Preconditions** | 1. Video uploaded to S3<br>2. User has PRO subscription<br>3. Video file exists in temp_upload/ |
| **Postconditions** | 1. Transcript saved to video record<br>2. AI title and summary generated<br>3. Voiceflow KB updated |
| **Main Flow** | 1. System checks user plan is PRO<br>2. System extracts audio using FFmpeg (8.1.1)<br>3. System checks extracted audio size<br>4. If audio < 25MB: transcribe with Whisper (8.1.2)<br>5. System extracts timestamped segments (8.1.3)<br>6. System generates title/summary with GPT (8.2, 8.3)<br>7. System saves transcript and metadata to DB<br>8. System updates Voiceflow KB (8.4) |
| **Alternative Flows** | A1: Audio >= 25MB → Skip AI processing (8.7)<br>A2: Custom title/description provided → Skip GPT generation |
| **Exceptions** | E1: FFmpeg fails → Log error, skip AI<br>E2: Whisper fails → Log error, continue |

---

## Activity Diagram

```plantuml
@startuml
start

:Video uploaded to S3;

:Check user subscription plan;

if (Plan = PRO?) then (yes)
  :Extract audio from video using FFmpeg;
  
  note right
    FFmpeg settings:
    - No video (audio only)
    - MP3 format
    - 64kbps bitrate
    - Mono channel
  end note
  
  :Check extracted audio file size;
  
  if (Audio size < 25MB?) then (yes)
    :Call OpenAI Whisper API;
    
    note right
      Model: whisper-1
      Format: verbose_json
      Returns: text + segments
    end note
    
    :Extract timestamped segments;
    
    if (Custom title/description provided?) then (yes)
      :Use provided title and description;
    else (no)
      :Call GPT-3.5-turbo for title;
      
      :Call GPT-3.5-turbo for summary;
    endif
    
    :POST /recording/:id/transcribe;
    
    :Update Video record with:
    - title
    - description (summary)
    - transcript text
    - transcript segments;
    
    :POST to Voiceflow KB API;
    
    :Update knowledge base with
    video title and transcript;
    
    :Clean up temp audio file;
    stop
  else (no)
    :Log "Audio too large for AI processing";
    
    :Skip AI processing;
    stop
  endif
else (no)
  :Skip AI processing for FREE users;
  stop
endif

@enduml
```

---

## Component List

### Express Server Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| extractAudio() | `crystal-express/server.js` | FFmpeg audio extraction function | Function |
| processVideo() | `crystal-express/server.js` | Main processing with AI flow | Function |
| OpenAI Client | `crystal-express/server.js` | OpenAI API client | Client |

### External AI Services

| Service | API | Purpose |
|---------|-----|---------|
| OpenAI Whisper | `openai.audio.transcriptions.create()` | Speech-to-text transcription |
| GPT-3.5-turbo | `openai.chat.completions.create()` | Title and summary generation |
| Voiceflow | `VOICEFLOW_KNOWLEDGE_BASE_API` | AI agent knowledge base |

### Next.js API Routes

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| POST /recording/:id/transcribe | `src/app/api/recording/[id]/transcribe/route.ts` | Saves transcript and updates Voiceflow | API Route |

---

## Component/Module Diagram

```plantuml
@startuml
package "Express Server" {
  [processVideo()] as PV
  [extractAudio()] as EA
  [OpenAI Client] as OAI
}

package "FFmpeg" {
  [fluent-ffmpeg] as FF
}

package "OpenAI APIs" {
  [Whisper API] as WHISPER
  [GPT-3.5-turbo] as GPT
}

package "Next.js API" {
  [/recording/:id/transcribe] as TRANS
}

package "External Services" {
  [Voiceflow KB API] as VF
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [Video Table] as VT
  }
}

cloud "File System" {
  [temp_upload/*.webm] as VIDEO
  [temp_upload/*_audio.mp3] as AUDIO
}

PV --> EA : extract audio
EA --> FF : uses
FF --> VIDEO : reads video
FF --> AUDIO : writes audio

PV --> OAI : transcribe
OAI --> WHISPER : audio file
WHISPER --> OAI : transcript + segments

PV --> OAI : generate title/summary
OAI --> GPT : prompt with transcript
GPT --> OAI : JSON response

PV --> TRANS : POST results
TRANS --> PC : update video
PC --> VT : UPDATE

TRANS --> VF : POST to KB
VF --> VF : index content

PV --> AUDIO : delete temp file
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
participant "processVideo()" as process
participant "extractAudio()" as extract
participant "FFmpeg" as ffmpeg
participant "OpenAI\nWhisper" as whisper
participant "OpenAI\nGPT" as gpt
participant "Next.js API\n/transcribe" as api
participant "Prisma" as prisma
database "PostgreSQL" as db
participant "Voiceflow" as vf

== Audio Extraction (8.1.1) ==

process -> extract: extractAudio(videoPath)
activate extract

extract -> ffmpeg: Convert to MP3
note right: noVideo()\naudioCodec('libmp3lame')\naudioBitrate('64k')\naudioChannels(1)

ffmpeg --> extract: audio.mp3
deactivate extract

== Size Check (8.7) ==

process -> process: Check audio file size
alt Audio >= 25MB
  process -> process: Skip AI processing
else Audio < 25MB
  
  == Transcription (8.1.2, 8.1.3) ==
  
  process -> whisper: transcriptions.create()
  note right: model: "whisper-1"\nresponse_format: "verbose_json"
  
  whisper --> process: { text, segments[] }
  note right: segments contain:\n- start, end (timestamps)\n- text (content)
  
  == Title & Summary (8.2, 8.3) ==
  
  alt Custom title/description NOT provided
    process -> gpt: chat.completions.create()
    note right: "Generate title and summary\nfrom transcript..."
    
    gpt --> process: { title, summary }
  end
  
  == Save to Database ==
  
  process -> api: POST { content, transcript, segments }
  activate api
  
  api -> prisma: video.update()
  prisma -> db: UPDATE title, description, summary, transcriptSegments
  db --> prisma: Updated
  
  == Voiceflow KB Update (8.4) ==
  
  api -> vf: POST { name, items[] }
  note right: searchableFields:\n- title\n- transcript
  
  vf --> api: 200 OK
  
  api --> process: { status: 200 }
  deactivate api
end

process -> process: Delete temp audio file
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
  source : String <<unique>>
  summary : String?
  transcriptSegments : Json?
  userId : UUID <<FK>>
  processing : Boolean
}

entity "Subscription" as subscription {
  * id : UUID <<PK>>
  --
  plan : SUBSCRIPTION_PLAN
  userId : UUID <<FK>>
}

entity "User" as user {
  * id : UUID <<PK>>
  --
  clerkId : String
}

note right of video
  summary: Plain text transcript
  
  transcriptSegments: JSON array
  [
    { start: 0.0, end: 2.5, text: "..." },
    { start: 2.5, end: 5.0, text: "..." }
  ]
end note

user ||--o| subscription : "has"
user ||--o{ video : "creates"
@enduml
```

### Prisma Schema (Relevant Fields)

```prisma
model Video {
  id                 String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title              String?    @default("Untitled Video")
  description        String?    @default("No Description")
  summary            String?    // Plain text transcript
  transcriptSegments Json?      // Timestamped segments array
  // ... other fields
}

enum SUBSCRIPTION_PLAN {
  PRO
  FREE
}
```

### AI Processing Specifications

| Component | Specification |
|-----------|---------------|
| Audio Extraction | FFmpeg: MP3, 64kbps, mono |
| Max Audio Size | 25MB (Whisper limit) |
| Transcription Model | OpenAI whisper-1 |
| Response Format | verbose_json (includes timestamps) |
| Title/Summary Model | GPT-3.5-turbo with JSON response |
| Voiceflow Fields | title, transcript (searchable) |

