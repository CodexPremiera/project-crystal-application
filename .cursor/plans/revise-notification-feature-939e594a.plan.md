<!-- 939e594a-f9df-4a2d-bc5a-058466b52e84 fc579f1d-c9e7-4f4e-aa56-6534d148d3d1 -->
# Revise Notification Feature

## Overview

Enhance the Notification model with a createdAt timestamp and update workspace invitation notifications to display the inviter's avatar and notification date.

## Changes Required

### 1. Update Notification Schema

**File:** `crystal-web-app/prisma/schema.prisma`

- Add `createdAt DateTime @default(now())` field to Notification model (lines 123-128)
- Add optional relation to Invite model to link workspace invitation notifications to their source invitation
- This allows fetching inviter information (avatar, name) when displaying notifications

### 2. Create Database Migration

- Generate Prisma migration for schema changes
- Migration will add createdAt column and optional inviteId relation

### 3. Update Notification Creation Logic

**File:** `crystal-web-app/src/actions/user.ts` (lines 604-615)

- Update `inviteMembers` function to:
  - Link notification to Invite record via new relation
  - Ensure createdAt is automatically set by Prisma default

**File:** `crystal-web-app/src/actions/workspace.ts` (lines 768-777)

- Update `sendEmailForFirstView` function to ensure createdAt is set (handled by default)

### 4. Update getNotifications Query

**File:** `crystal-web-app/src/actions/user.ts` (lines 161-181)

- Modify `getNotifications` to include:
  - Invite relation with sender information (image, firstname, lastname)
  - Order notifications by createdAt descending
  - Return createdAt field

### 5. Update Notifications Display Component

**File:** `crystal-web-app/src/app/dashboard/[workspaceid]/notifications/page.tsx`

- Update TypeScript types to include createdAt and optional Invite relation
- Display notification date (formatted, e.g., "2d ago" or full date)
- For workspace invitation notifications:
  - Show inviter's avatar using AvatarImage component
  - Show inviter's image from Invite.sender.image
  - Fallback to User icon if no image
- Update notification card layout to include date display

## Implementation Details

### Schema Changes

```prisma
model Notification {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  User      User?    @relation(fields: [userId], references: [id])
  userId    String?  @db.Uuid
  content   String
  createdAt DateTime @default(now())
  Invite    Invite?  @relation(fields: [inviteId], references: [id])
  inviteId  String?  @db.Uuid
}

model Invite {
  // ... existing fields ...
  notification Notification[]
}
```

### Query Updates

- Include Invite with sender relation when fetching notifications
- Sort by createdAt DESC for chronological display
- Return sender's image, firstname, lastname for avatar display

### UI Updates

- Add date formatting utility (similar to video card's "days ago" logic)
- Conditionally render AvatarImage for workspace invitations
- Display formatted date below or beside notification content

### To-dos

- [ ] Add createdAt field and Invite relation to Notification model in schema.prisma
- [ ] Generate and apply Prisma migration for schema changes
- [ ] Update inviteMembers function to link notification to Invite record
- [ ] Modify getNotifications to include Invite relation with sender info and createdAt, order by date
- [ ] Update notifications page component to display inviter avatar and formatted date