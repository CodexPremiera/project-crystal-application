# Module 6: Video Recording (Desktop App)

This module handles screen recording functionality in the Crystal Desktop App (Electron). It covers media source selection, recording controls, settings synchronization, and webcam preview.

## Features Overview

| #     | Feature/Transaction                                                | Actor    |
|-------|--------------------------------------------------------------------|----------|
| 6.1   | User can view available screen capture sources                     | User     |
| 6.2   | User can select a screen source for recording                      | User     |
| 6.3   | User can select an audio input device for recording                | User     |
| 6.4   | PRO user can select recording quality preset (SD/HD)               | PRO User |
| 6.5   | System syncs studio settings between control panel and studio tray | System   |
| 6.6   | User can record their screen (start and stop)                      | User     |
| 6.6.1 | System streams video chunks to server during recording             | System   |
| 6.6.2 | System hides plugin window during recording to avoid capturing it  | System   |
| 6.7   | User can view webcam preview during recording                      | User     |
| 6.8   | System saves studio settings to the database                       | System   |

## Feature Groups

### [Features 6.1-6.5, 6.8: Media Configuration](./feature-6.1-6.5-6.8/documentation.md)
Covers media source detection, selection, and settings management.
- 6.1: View available screen sources
- 6.2: Select screen source
- 6.3: Select audio input device
- 6.4: Select quality preset (PRO only for HD)
- 6.5: Sync settings between windows via IPC
- 6.8: Save settings to database

### [Feature 6.6: Screen Recording](./feature-6.6/documentation.md)
Covers the recording process including start, stop, and streaming.
- 6.6: Start and stop recording
- 6.6.1: Stream video chunks to server
- 6.6.2: Hide plugin window during recording

### [Feature 6.7: Webcam Preview](./feature-6.7/documentation.md)
Covers the webcam preview window functionality.
- 6.7: View webcam preview in floating window

