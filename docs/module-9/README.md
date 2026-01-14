# Module 9: Video Management

This module handles video viewing, editing, moving, deletion, and download functionalities. It provides comprehensive video lifecycle management within the workspace structure.

## Features Overview

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

## Feature Groups

### [Features 9.1-9.2: Video Viewing](./feature-9.1-9.2/documentation.md)
Covers viewing unfiled videos and video details.
- 9.1: View unfiled videos in workspace
- 9.2: View video metadata (title, description, views, likes)

### [Feature 9.3: Video Editing](./feature-9.3/documentation.md)
Covers editing video title and description.
- 9.3: Edit video title and description (author only)

### [Features 9.4-9.5: Video Moving](./feature-9.4-9.5/documentation.md)
Covers moving videos between folders and workspaces.
- 9.4: Drag and drop to folder
- 9.5: Move to different workspace

### [Feature 9.6: Video Deletion](./feature-9.6/documentation.md)
Covers video deletion with cascade.
- 9.6: Delete video (author only)
- 9.6.1: Cascade delete comments

### [Features 9.7-9.8: Video Download](./feature-9.7-9.8/documentation.md)
Covers individual and bulk video downloads.
- 9.7: Download individual video
- 9.8: Download folder as ZIP

