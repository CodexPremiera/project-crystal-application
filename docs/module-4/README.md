# Module 4: Workspace Invitation and Membership

This module handles workspace invitations, membership management, and the associated workflows for inviting, accepting, declining, and removing members from workspaces.

## Features Overview

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

## Feature Groups

### [Feature 4.1: Workspace Invitation](./feature-4.1/documentation.md)
Covers the invitation sending process including validation and notifications.
- 4.1: Workspace owner invites users
- 4.1.1: Member validation
- 4.1.2: Pending invitation validation
- 4.1.3: Notification creation

### [Features 4.2-4.4: Invitation Responses](./feature-4.2-4.4/documentation.md)
Covers all actions related to responding to invitations.
- 4.2: Accepting an invitation
- 4.3: Declining an invitation
- 4.4: Cancelling an invitation (by sender)

### [Feature 4.5: Member Removal](./feature-4.5/documentation.md)
Covers workspace owner removing members from their workspace.
- 4.5: Remove member from workspace

### [Feature 4.6: Leave Workspace](./feature-4.6/documentation.md)
Covers workspace members voluntarily leaving a workspace.
- 4.6: Leave workspace

