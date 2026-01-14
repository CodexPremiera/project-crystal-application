# Module 8: Video AI Processing (PRO Feature)

This module handles AI-powered video processing for PRO users, including audio extraction, transcription with OpenAI Whisper, AI-generated titles and summaries with GPT, and integration with Voiceflow knowledge base.

## Features Overview

| #     | Feature/Transaction                                                    | Actor    |
|-------|------------------------------------------------------------------------|----------|
| 8.1   | System generates AI transcript from video (PRO users)                  | System   |
| 8.1.1 | System extracts audio from video                                       | System   |
| 8.1.2 | System transcribes audio using OpenAI Whisper                          | System   |
| 8.1.3 | System generates timestamped transcript segments                       | System   |
| 8.2   | System generates AI-powered video title (PRO users)                    | System   |
| 8.3   | System generates AI-powered video summary/description (PRO users)      | System   |
| 8.4   | System updates Voiceflow knowledge base with video content (PRO users) | System   |
| 8.5   | User can view AI-generated transcript with timestamps                  | PRO User |
| 8.6   | User can click transcript timestamps to seek video                     | PRO User |
| 8.7   | System skips AI processing for videos whose audio exceeds 25MB         | System   |

## Feature Groups

### [Features 8.1-8.4, 8.7: AI Processing Pipeline](./feature-8.1-8.4-8.7/documentation.md)
Covers the complete server-side AI processing flow.
- 8.1: Transcript generation (with 8.1.1-8.1.3)
- 8.2: AI title generation with GPT-3.5-turbo
- 8.3: AI summary/description generation
- 8.4: Voiceflow knowledge base integration
- 8.7: 25MB audio limit handling

### [Features 8.5-8.6: Transcript Viewer](./feature-8.5-8.6/documentation.md)
Covers the frontend transcript viewing and navigation.
- 8.5: Display timestamped transcript segments
- 8.6: Click-to-seek functionality

