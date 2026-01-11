# Module 3: Workspace Creation and Management

## Module Overview

This module handles workspace creation, viewing, and management. PRO users can create additional public workspaces, while all users can view their owned and member workspaces. Workspace owners can rename and delete workspaces, with cascade deletion handling all related content.

---

## Features List

| #   | Feature                                                                            | Actor           |
|-----|------------------------------------------------------------------------------------|-----------------|
| 3.1 | PRO user can create a new public workspace                                         | PRO User        |
| 3.2 | User can view and access their workspaces (owned and member of)                    | User            |
| 3.3 | Workspace owner can rename their workspace                                         | Workspace Owner |
| 3.4 | Workspace owner can delete their workspace                                         | Workspace Owner |
| 3.5 | System cascades deletion of workspace content (folders, videos, members, comments) | System          |
| 3.6 | User can view workspace members list and member count                              | User            |

---

## Feature Groupings

| Group | Features | Name | Description |
|-------|----------|------|-------------|
| 1 | 3.1 | [Create Workspace](./feature-3.1/) | PRO users can create additional public workspaces |
| 2 | 3.2 | [View Workspaces](./feature-3.2/) | View and navigate owned and member workspaces |
| 3 | 3.3, 3.4, 3.5 | [Manage Workspace](./feature-3.3-3.5/) | Rename and delete workspaces with cascade deletion |
| 4 | 3.6 | [View Members](./feature-3.6/) | View workspace members list and count |

---

## Grouping Rationale

### Why group features 3.3, 3.4, and 3.5?

1. **Owner-only Actions**: Both rename (3.3) and delete (3.4) are restricted to workspace owners
2. **Shared UI Component**: Both actions are accessible from the same `WorkspaceActions` dropdown
3. **Cascade is Part of Delete**: Feature 3.5 (cascade deletion) is automatically triggered by 3.4

### Why other features are standalone?

- **3.1**: Create workspace is a distinct PRO-only action with its own modal
- **3.2**: Viewing workspaces is a fundamental navigation feature
- **3.6**: Viewing members has its own UI component (members popover)

---

## Folder Structure

```
module-3/
├── README.md                     ← This file
├── feature-3.1/
│   ├── documentation.md
│   └── *.png
├── feature-3.2/
│   ├── documentation.md
│   └── *.png
├── feature-3.3-3.5/
│   ├── documentation.md
│   └── *.png
└── feature-3.6/
    ├── documentation.md
    └── *.png
```

---

## External Dependencies

| Service | Purpose |
|---------|---------|
| Clerk | User authentication and authorization |
| PostgreSQL | Store workspace and member data |

---

## Database Tables Used

- `User` - Workspace owner reference
- `WorkSpace` - Workspace records (PERSONAL or PUBLIC)
- `Member` - Workspace membership records
- `Folder` - Folders within workspaces (cascade deleted)
- `Video` - Videos within workspaces (cascade deleted)
- `Subscription` - For PRO validation

---

## Workspace Types

| Type | Description | Who Can Create |
|------|-------------|----------------|
| PERSONAL | Default workspace for each user | System (on sign-up) |
| PUBLIC | Additional workspaces for collaboration | PRO users only |

