# Crystal Application - Features and Transactions by Module

This document provides a comprehensive list of all features and transactions in the Crystal application, organized by functional modules.

---

## Module 1: User Authentication and Account Management

| #   | Feature/Transaction                                                                                    | Actor  |
|-----|--------------------------------------------------------------------------------------------------------|--------|
| 1.1 | User can sign up for a new account                                                                     | User   |
| 1.2 | System creates user record in the database upon first sign-in                                          | System |
| 1.3 | System initializes new users with a default personal workspace, FREE subscription, and studio settings | System |
| 1.4 | User can sign in to the web application                                                                | User   |
| 1.5 | User can sign out of the web application                                                               | User   |
| 1.6 | User can sign in to the desktop app via browser-based authentication                                   | User   |
| 1.7 | System generates a sign-in ticket for desktop app authentication                                       | System |
| 1.8 | System validates and syncs user data between Clerk and database                                        | System |
| 1.9 | User can view their profile information                                                                | User   |

---

## Module 2: Subscription and Billing

| #   | Feature/Transaction                                        | Actor  |
|-----|------------------------------------------------------------|--------|
| 2.1 | User can view their subscription plan and billing information | User   |
| 2.2 | User can upgrade to PRO subscription via Stripe checkout   | User   |
| 2.3 | System stores Stripe customer ID for future billing        | System |
| 2.4 | User can cancel and return from payment page               | User   |

---

## Module 3: Workspace Creation and Management

| #   | Feature/Transaction                                                                | Actor           |
|-----|------------------------------------------------------------------------------------|-----------------|
| 3.1 | PRO user can create a new public workspace                                         | PRO User        |
| 3.2 | User can view and access their workspaces (owned and member of)                    | User            |
| 3.3 | Workspace owner can rename their workspace                                         | Workspace Owner |
| 3.4 | Workspace owner can delete their workspace                                         | Workspace Owner |
| 3.5 | System cascades deletion of workspace content (folders, videos, members, comments) | System          |
| 3.6 | User can view workspace members list and member count                              | User            |

---

## Module 4: Workspace Invitation and Membership

| #     | Feature/Transaction                                                              | Actor            |
|-------|----------------------------------------------------------------------------------|------------------|
| 4.1   | Public workspace owner can invite other users to their workspace                 | Workspace Owner  |
| 4.1.1 | System validates that user is not already a member before sending invite         | System           |
| 4.1.2 | System validates that user doesn't have pending invitation                       | System           |
| 4.1.3 | System creates notification for both sender and receiver when invitation is sent | System           |
| 4.2   | User can accept a workspace invitation, which adds them as a member              | Invited User     |
| 4.3   | User can decline a workspace invitation                                          | Invited User     |
| 4.4   | Workspace owner can cancel a pending workspace invitation                        | Workspace Owner  |
| 4.5   | Workspace owner can remove a member from the workspace                           | Workspace Owner  |
| 4.6   | Workspace member can leave a workspace                                           | Workspace Member |

---

## Module 5: Folder Management

| #   | Feature/Transaction                                          | Actor           |
|-----|--------------------------------------------------------------|-----------------|
| 5.1 | User can create a new folder in a workspace                  | User            |
| 5.2 | User can view all folders in a workspace                     | User            |
| 5.3 | User can view folder information (name, video count)         | User            |
| 5.4 | User can rename an existing folder                           | User            |
| 5.5 | Workspace owner can delete a folder and all its videos       | Workspace Owner |
| 5.6 | User can view videos within a specific folder                | User            |

---

## Module 6: Video Recording (Desktop App)

| #    | Feature/Transaction                                                | Actor  |
|------|--------------------------------------------------------------------|--------|
| 6.1  | User can view available screen capture sources                     | User   |
| 6.2  | User can select a screen source for recording                      | User   |
| 6.3  | User can select an audio input device for recording                | User   |
| 6.4  | Pro user can select recording quality preset (SD/HD)               | Pro User |
| 6.5   | System syncs studio settings between control panel and studio tray | System   |
| 6.6   | User can record their screen (start and stop)                      | User     |
| 6.6.1 | System streams video chunks to server during recording             | System   |
| 6.6.2 | System hides plugin window during recording to avoid capturing it  | System   |
| 6.7   | User can view webcam preview during recording                      | User     |
| 6.8   | System saves studio settings to the database                       | System   |

---

## Module 7: Video Upload and Processing

| #     | Feature/Transaction                                                                    | Actor  |
|-------|----------------------------------------------------------------------------------------|--------|
| 7.1   | User can upload a video file via the web app (validates file type and size)            | User   |
| 7.2   | System shows upload progress during file upload                                        | System |
| 7.3   | System processes the uploaded/recorded video                                           | System |
| 7.3.1 | System creates video record in database when processing begins                         | System |
| 7.3.2 | System uploads video to AWS S3 storage                                                 | System |
| 7.3.3 | System combines recorded video chunks into final video file                            | System |
| 7.3.4 | System creates notifications for workspace members (public workspaces)                 | System |
| 7.3.5 | System marks video processing as complete                                              | System |

---

## Module 8: Video AI Processing (PRO Feature)

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

---

## Module 9: Video Management

| #     | Feature/Transaction                                            | Actor           |
|-------|----------------------------------------------------------------|-----------------|
| 9.1   | User can view all unfiled videos in a workspace                | User            |
| 9.2   | User can view video details (title, description, views, likes) | User            |
| 9.3   | Video author can edit video title and description              | Video Author    |
| 9.4   | User can move a video to a different folder (drag and drop)    | User            |
| 9.5   | User can move a video to a different workspace                 | User            |
| 9.6   | Video author can delete their video                            | Video Author    |
| 9.6.1 | System cascades deletion of video comments                     | System          |
| 9.7   | User can download their own video                              | Video Author    |
| 9.8   | User can download all videos in a folder as ZIP                | Workspace Owner |

---

## Module 10: Video Viewing and Interaction

| #    | Feature/Transaction                                                     | Actor  |
|------|-------------------------------------------------------------------------|--------|
| 10.1 | User can view video preview page                                        | User   |
| 10.2 | System records unique video view per user and increments video view counter | System |
| 10.4 | System creates notification for video owner on view (public workspaces) | System |
| 10.5 | User can like or unlike a video                                         | User   |
| 10.6 | System creates notification for video owner on like (public workspaces) | System |
| 10.7 | User can copy video preview link to clipboard                           | User   |

---

## Module 11: Video Comments

| #    | Feature/Transaction                                      | Actor  |
|------|----------------------------------------------------------|--------|
| 11.1 | User can post a comment on a video                       | User   |
| 11.2 | User can reply to an existing comment                    | User   |
| 11.3 | User can view all comments on a video                    | User   |
| 11.4 | User can view nested replies in a comment thread         | User   |
| 11.5 | System displays comment author information and timestamp | System |

---

## Module 12: Notifications

| #    | Feature/Transaction                                                      | Actor  |
|------|--------------------------------------------------------------------------|--------|
| 12.1 | User can view all their notifications                                    | User   |
| 12.2 | User can view unread notification count                                  | User   |
| 12.3 | User can mark all notifications as read                                  | User   |
| 12.4 | System creates invitation notification when user is invited to workspace | System |
| 12.5 | System creates video view notification for video owner                   | System |
| 12.6 | System creates video like notification for video owner                   | System |
| 12.7 | System creates video upload notification for workspace members           | System |

---

## Module 13: Search and Discovery

| #    | Feature/Transaction                                               | Actor  |
|------|-------------------------------------------------------------------|--------|
| 13.1 | User can search across all content (workspaces, folders, videos)  | User   |
| 13.2 | User can search videos by title or description                    | User   |
| 13.3 | User can perform quick search with real-time dropdown suggestions | User   |
| 13.4 | System limits search results to user-accessible content           | System |
| 13.5 | User can search for other users to invite                         | User   |

---

## Module 14: Desktop App Management

| #    | Feature/Transaction                                     | Actor  |
|------|---------------------------------------------------------|--------|
| 14.1 | System checks for desktop app updates                   | System |
| 14.2 | System downloads and installs app updates automatically | System |
| 14.3 | User can open DevTools for debugging                    | User   |
| 14.4 | User can download the desktop app from the web app      | User   |

---

## Summary Statistics

| Category                        | Count |
|---------------------------------|-------|
| **Total Modules**               | 14    |
| **Total Features/Transactions** | ~65   |
| **User-initiated Actions**      | ~38   |
| **System-initiated Actions**    | ~27   |
| **PRO-only Features**           | ~8    |

---

## Actor Definitions

| Actor                | Description                                                         |
|----------------------|---------------------------------------------------------------------|
| **User**             | Any authenticated user of the application                           |
| **PRO User**         | User with an active PRO subscription                                |
| **Workspace Owner**  | User who created/owns a workspace                                   |
| **Workspace Member** | User who has been invited to and accepted membership in a workspace |
| **Invited User**     | User who has received a workspace invitation                        |
| **Video Author**     | User who uploaded/recorded a specific video                         |
| **System**           | Automated processes performed by the application                    |

