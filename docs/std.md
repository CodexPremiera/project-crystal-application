# CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY
## COLLEGE OF COMPUTER STUDIES

# Software Test Document
### for
# Crystal: A Screen Recording and Video Management Platform

---

## Change History

| Version | Date | Description |
| :--- | :--- | :--- |
| 1.0 | January 14, 2026 | Initial Draft |

---

## Table of Contents

**1. Introduction**
* 1.1. System Overview
* 1.2. Test Approach
* 1.3. Definitions and Acronyms

**2. Test Plan**
* 2.1 Features to be Tested
* 2.2 Features not to be Tested
* 2.3 Testing Tools and Environment

**3. Test Data Environment**

**4. Test Cases**
* 4.1 Module 1: User Authentication and Account Management
* 4.2 Module 2: Subscription and Billing
* 4.3 Module 3: Workspace Creation and Management
* 4.4 Module 4: Workspace Invitation and Membership
* 4.5 Module 5: Folder Management
* 4.6 Module 6: Video Recording (Desktop App)
* 4.7 Module 7: Video Upload and Processing
* 4.8 Module 8: Video AI Processing (PRO Feature)
* 4.9 Module 9: Video Management
* 4.10 Module 10: Video Viewing and Interaction
* 4.11 Module 11: Video Comments
* 4.12 Module 12: Notifications
* 4.13 Module 13: Search and Discovery
* 4.14 Module 14: Desktop App Management

**Appendix (Test Logs)**
* A.1 Test Execution Log
* A.2 Test Results Summary
* A.3 Incident Report

---

# 1. Introduction

This Software Test Document outlines the testing strategy, procedures, and validation process for **Crystal: A Screen Recording and Video Management Platform**.

Testing ensures that Crystal delivers functional accuracy across all modules including user authentication, workspace management, video recording/upload, AI-powered processing, and collaborative features. This document validates fourteen major system modules spanning both web and desktop application components.

## 1.1. System Overview

Crystal is a comprehensive screen recording and video management platform consisting of a Next.js web application and an Electron desktop application. Users can record their screens via the desktop app, upload videos through the web interface, and organize content within personal or shared workspaces. The platform offers AI-powered features for PRO subscribers including automatic transcription using OpenAI Whisper, AI-generated titles and summaries using GPT-3.5, and knowledge base integration via Voiceflow. Videos are stored in AWS S3 and delivered globally through CloudFront CDN. The system supports workspace collaboration with invitation management, folder organization, video comments, and a comprehensive notification system.

## 1.2. Test Approach

A black-box testing approach will be used. Testers will validate external behavior without inspecting source code.

**Testing Types**
* **Functional Testing** – Verifies all features meet specified requirements
* **Integration Testing** – Validates interactions between web app, desktop app, and external services
* **Usability Testing** – Ensures the user interface is intuitive and responsive
* **Authorization Testing** – Confirms role-based access control (Owner, Member, PRO User)

**Scope**
* **In Scope:** User authentication, workspace management, video recording/upload, AI processing, folder management, notifications, search, desktop app features
* **Out of Scope:** Server load/stress testing, source code analysis, third-party service internals (Clerk, Stripe, OpenAI), cross-platform testing (macOS, Linux), cross-browser testing (Firefox, Edge, Safari)

## 1.3. Definitions and Acronyms

| Term | Definition |
| :--- | :--- |
| **API** | Application Programming Interface |
| **AWS** | Amazon Web Services – Cloud computing platform |
| **CDN** | Content Delivery Network – Distributed content delivery |
| **Clerk** | Third-party authentication service |
| **CloudFront** | AWS CDN service for video streaming |
| **FFmpeg** | Multimedia processing framework |
| **FREE User** | User with basic subscription (no PRO features) |
| **GPT** | Generative Pre-trained Transformer – AI language model |
| **PRO User** | Premium subscriber with access to advanced features |
| **S3** | AWS Simple Storage Service |
| **Stripe** | Payment processing platform |
| **UI** | User Interface |
| **UX** | User Experience |
| **WebSocket** | Protocol for real-time bidirectional communication |
| **Whisper** | OpenAI's automatic speech recognition system |
| **Workspace** | Container for organizing videos and folders |
| **Workspace Owner** | User who created a workspace |
| **Workspace Member** | User invited to participate in a workspace |

---

# 2. Test Plan

## 2.1 Features to be Tested

* **Module 1: User Authentication and Account Management**
    * User sign-up and sign-in (web and desktop)
    * User sign-out and session management
    * Profile viewing
    * Desktop app browser-based authentication
    * User data synchronization between Clerk and database

* **Module 2: Subscription and Billing**
    * Subscription plan and billing information viewing
    * PRO subscription upgrade via Stripe
    * Payment cancellation handling
    * Stripe customer ID storage

* **Module 3: Workspace Creation and Management**
    * Public workspace creation (PRO users)
    * Workspace listing and access
    * Workspace renaming and deletion
    * Cascade deletion of workspace content
    * Member list viewing

* **Module 4: Workspace Invitation and Membership**
    * Member invitation to public workspaces
    * Invitation acceptance and decline
    * Pending invitation cancellation
    * Member removal by owner
    * Member leaving workspace
    * Duplicate invitation prevention

* **Module 5: Folder Management**
    * Folder creation, viewing, and renaming
    * Folder deletion with cascade video deletion
    * Video listing within folders

* **Module 6: Video Recording (Desktop App)**
    * Screen source selection
    * Audio input device selection
    * Quality preset selection (PRO feature)
    * Screen recording start/stop
    * Video chunk streaming
    * Webcam preview
    * Studio settings synchronization

* **Module 7: Video Upload and Processing**
    * Video file upload with validation
    * Upload progress display
    * Video processing pipeline
    * AWS S3 storage
    * Notification creation for workspace members

* **Module 8: Video AI Processing (PRO Feature)**
    * AI transcript generation
    * Audio extraction and transcription
    * AI-powered title and summary generation
    * Voiceflow knowledge base integration
    * Transcript viewing and timestamp navigation
    * Large audio file handling (>25MB skip)

* **Module 9: Video Management**
    * Unfiled video listing
    * Video details viewing
    * Video title/description editing
    * Video moving between folders/workspaces
    * Video deletion with cascade
    * Video download (single and batch)

* **Module 10: Video Viewing and Interaction**
    * Video preview page
    * View count tracking
    * Like/unlike functionality
    * Video link sharing
    * Notification on view/like

* **Module 11: Video Comments**
    * Comment posting
    * Reply to comments
    * Comment thread viewing
    * Author information display

* **Module 12: Notifications**
    * Notification listing
    * Unread count display
    * Mark all as read
    * Various notification types (invite, view, like, upload)

* **Module 13: Search and Discovery**
    * Global content search
    * Video search by title/description
    * Quick search with suggestions
    * User search for invitations
    * Access-controlled search results

* **Module 14: Desktop App Management**
    * Update checking
    * Automatic update installation
    * DevTools access
    * Desktop app download from web

## 2.2 Features not to be Tested

* Backend database stress testing and load balancing
* Source code structure or algorithmic efficiency
* Third-party service internals (Clerk authentication flow, Stripe payment processing, OpenAI model behavior)
* Cross-platform compatibility (macOS, Linux)
* Cross-browser compatibility (Firefox, Edge, Safari)
* Multi-language localization
* Mobile responsive layouts beyond standard breakpoints

## 2.3 Testing Tools and Environment

**1. Hardware Environment**
* **Test Machines (Client-Side):**
    * Desktop 1: Intel Core i7-12700, 16GB RAM, 512GB SSD, Windows 11
    * Laptop 1: Intel Core i5-1135G7, 8GB RAM, 256GB SSD, Windows 10

**2. Software Environment**
* **Operating Systems Tested:**
    * Windows 10/11
* **Web Browsers:**
    * Google Chrome 120+
* **Backend Framework:** Next.js 14, Express.js
* **Database:** PostgreSQL 14+
* **Desktop Framework:** Electron with Vite

**3. Network Environment**
* **Primary Testing:** Local development environment with localhost servers
* **Secondary Testing:** Deployed staging environment on Vercel (web) and AWS (Express server)
* **Internet Bandwidth:** 50 Mbps (download), 25 Mbps (upload)

**4. Testing Tools**
* **API Testing:**
    * Postman – For REST API endpoint testing
    * Browser DevTools – Network tab for request/response inspection
* **Functional Testing:**
    * Manual browser testing for web application
    * Manual desktop app testing for Electron features
* **Database Verification:**
    * Prisma Studio – For database state inspection
* **Version Control & Issue Tracking:**
    * GitHub – Repository hosting
    * GitHub Issues – Bug tracking and resolution

---

# 3. Test Data Environment

* **User Accounts:** Five (5) sample users
    * User1 (PRO subscription, workspace owner)
    * User2 (PRO subscription, workspace member)
    * User3 (FREE subscription)
    * User4 (FREE subscription)
    * User5 (New user for registration testing)

* **Workspaces:**
    * Personal workspace for each user (auto-created)
    * Public workspace "Team Alpha" owned by User1
    * Public workspace "Project Beta" owned by User2

* **Video Files:**
    * test-video-small.mp4 (10MB, valid format)
    * test-video-large.mp4 (100MB, valid format)
    * test-video-oversized.mp4 (600MB, exceeds limit)
    * test-file-invalid.txt (invalid format)
    * test-audio-large.mp4 (video with 30MB audio track)

* **Folder Structure:**
    * "Tutorials" folder in Team Alpha workspace
    * "Demos" folder in Team Alpha workspace
    * Empty folder for deletion testing

---

# 4. Test Cases

## 4.1 Module 1: User Authentication and Account Management

### TC-1.1: User Registration (Sign Up)

**Purpose:**
To verify that a new user can successfully create an account.

**Inputs:**
* Email: user5@test.com
* Password: SecurePass123!

**Expected Outputs & Pass/Fail Criteria:**
* User account is created via Clerk
* System creates user record in database with default personal workspace
* User is initialized with FREE subscription
* **Pass** if user can log in with new credentials. **Fail** if account creation fails or database record is not created.

**Test Procedure:**
1. Navigate to the registration page.
2. Enter valid email and password.
3. Complete registration flow.
4. Verify redirect to dashboard.
5. Check database for user record and personal workspace.

---

### TC-1.2: User Sign In (Valid Credentials)

**Purpose:**
To verify that an existing user can sign in with valid credentials.

**Inputs:**
* Email: user1@test.com
* Password: ValidPassword123!

**Expected Outputs & Pass/Fail Criteria:**
* User is authenticated and redirected to dashboard
* Session token is created
* User data is synced between Clerk and database
* **Pass** if user accesses protected pages. **Fail** if authentication fails.

**Test Procedure:**
1. Navigate to the login page.
2. Enter valid credentials.
3. Click Sign In.
4. Verify redirect to dashboard with user data displayed.

---

### TC-1.3: User Sign In (Invalid Credentials)

**Purpose:**
To ensure the system rejects login attempts with incorrect credentials.

**Inputs:**
* Email: user1@test.com
* Password: WrongPassword

**Expected Outputs & Pass/Fail Criteria:**
* Error message displayed indicating invalid credentials
* No session token created
* **Pass** if access is denied. **Fail** if login is allowed.

**Test Procedure:**
1. Navigate to the login page.
2. Enter invalid password.
3. Click Sign In.
4. Verify error message is displayed.
5. Attempt to access protected page and verify redirect to login.

---

### TC-1.4: User Sign Out

**Purpose:**
To confirm that user sessions are terminated properly.

**Inputs:**
* Logged-in user: User1

**Expected Outputs & Pass/Fail Criteria:**
* User is redirected to login/home page
* Session token is invalidated
* Protected pages are inaccessible
* **Pass** if session is properly terminated. **Fail** if user can still access protected content.

**Test Procedure:**
1. Log in as User1.
2. Navigate to account menu.
3. Click Sign Out.
4. Attempt to access dashboard directly via URL.
5. Verify redirect to login page.

---

### TC-1.5: Desktop App Sign In via Browser

**Purpose:**
To verify that desktop app can authenticate using browser-based OAuth flow.

**Inputs:**
* Desktop app launched
* Valid Clerk credentials

**Expected Outputs & Pass/Fail Criteria:**
* Browser opens for authentication
* Sign-in ticket is generated
* Desktop app receives authentication callback
* User session is established in desktop app
* **Pass** if desktop app shows authenticated state. **Fail** if authentication flow breaks.

**Test Procedure:**
1. Launch Crystal desktop application.
2. Click "Sign In" button.
3. Complete authentication in opened browser window.
4. Verify desktop app receives callback and shows user profile.
5. Verify recording features become available.

---

### TC-1.6: View User Profile

**Purpose:**
To verify that users can view their profile information.

**Inputs:**
* Logged-in user: User1

**Expected Outputs & Pass/Fail Criteria:**
* Profile page displays user information (name, email, avatar)
* Subscription status is shown
* **Pass** if correct information is displayed. **Fail** if data is missing or incorrect.

**Test Procedure:**
1. Log in as User1.
2. Navigate to profile page.
3. Verify displayed information matches database records.
4. Verify subscription tier is correctly shown (PRO).

---

### TC-1.7: Unauthorized Access Attempt

**Purpose:**
To verify that unauthenticated users cannot access protected routes.

**Inputs:**
* No authentication (logged out state)
* Direct URL to dashboard: /dashboard

**Expected Outputs & Pass/Fail Criteria:**
* User is redirected to login page
* Protected content is not displayed
* **Pass** if access is blocked. **Fail** if protected content is visible.

**Test Procedure:**
1. Clear all browser cookies/session.
2. Navigate directly to /dashboard.
3. Verify redirect to login page.
4. Attempt other protected routes (/workspaces, /notifications).
5. Verify consistent redirect behavior.

---

### TC-1.8: Session Persistence

**Purpose:**
To verify that user sessions persist across page reloads.

**Inputs:**
* Logged-in user: User1

**Expected Outputs & Pass/Fail Criteria:**
* User remains authenticated after page refresh
* Session token remains valid
* **Pass** if session persists. **Fail** if user is logged out unexpectedly.

**Test Procedure:**
1. Log in as User1.
2. Navigate to dashboard.
3. Refresh the page multiple times.
4. Close browser tab and reopen.
5. Verify user remains authenticated.

---

## 4.2 Module 2: Subscription and Billing

### TC-2.1: View Subscription Plan

**Purpose:**
To verify that users can view their current subscription plan and billing information.

**Inputs:**
* Logged-in user: User1 (PRO) and User3 (FREE)

**Expected Outputs & Pass/Fail Criteria:**
* Subscription tier is correctly displayed
* Billing information shown for PRO users
* Upgrade option shown for FREE users
* **Pass** if correct plan is displayed. **Fail** if information is incorrect.

**Test Procedure:**
1. Log in as User1 (PRO).
2. Navigate to subscription/billing page.
3. Verify PRO status and billing details are shown.
4. Log out and log in as User3 (FREE).
5. Verify FREE status and upgrade option are shown.

---

### TC-2.2: Upgrade to PRO Subscription

**Purpose:**
To verify that FREE users can upgrade to PRO subscription via Stripe.

**Inputs:**
* Logged-in user: User3 (FREE)
* Test Stripe card: 4242 4242 4242 4242

**Expected Outputs & Pass/Fail Criteria:**
* Stripe checkout session is created
* User is redirected to Stripe payment page
* After payment, user subscription is updated to PRO
* Stripe customer ID is stored
* **Pass** if subscription upgrade completes. **Fail** if payment flow breaks.

**Test Procedure:**
1. Log in as User3 (FREE).
2. Navigate to subscription page.
3. Click "Upgrade to PRO".
4. Complete Stripe checkout with test card.
5. Verify redirect back to application.
6. Verify subscription status changed to PRO.
7. Verify PRO features are now accessible.

---

### TC-2.3: Cancel Payment and Return

**Purpose:**
To verify that users can cancel from Stripe payment page and return safely.

**Inputs:**
* Logged-in user: User4 (FREE)
* Cancel during Stripe checkout

**Expected Outputs & Pass/Fail Criteria:**
* User is returned to application
* Subscription remains FREE
* No incomplete transactions in database
* **Pass** if cancellation is handled gracefully. **Fail** if errors occur.

**Test Procedure:**
1. Log in as User4 (FREE).
2. Click "Upgrade to PRO".
3. On Stripe checkout page, click cancel/back.
4. Verify return to application.
5. Verify subscription remains FREE.

---

### TC-2.4: FREE User Attempts PRO Feature

**Purpose:**
To verify that FREE users cannot access PRO-only features.

**Inputs:**
* Logged-in user: User3 (FREE)
* Attempt to create public workspace

**Expected Outputs & Pass/Fail Criteria:**
* Action is blocked or upgrade prompt is shown
* Feature remains inaccessible
* **Pass** if PRO feature is restricted. **Fail** if FREE user can use PRO feature.

**Test Procedure:**
1. Log in as User3 (FREE).
2. Navigate to workspace creation.
3. Attempt to create a public workspace.
4. Verify action is blocked with upgrade prompt.
5. Attempt to select HD quality in desktop app recording.
6. Verify HD option is disabled or prompts upgrade.

---

## 4.3 Module 3: Workspace Creation and Management

### TC-3.1: Create Public Workspace (PRO User)

**Purpose:**
To verify that PRO users can create public workspaces.

**Inputs:**
* Logged-in user: User1 (PRO)
* Workspace name: "New Project"

**Expected Outputs & Pass/Fail Criteria:**
* Public workspace is created
* User becomes workspace owner
* Workspace appears in user's workspace list
* **Pass** if workspace is created. **Fail** if creation fails.

**Test Procedure:**
1. Log in as User1 (PRO).
2. Navigate to workspace creation.
3. Enter workspace name "New Project".
4. Select "Public" workspace type.
5. Submit creation form.
6. Verify workspace appears in workspace list.
7. Verify user is listed as owner.

---

### TC-3.2: View Workspaces (Owned and Member)

**Purpose:**
To verify that users can view all workspaces they own or are members of.

**Inputs:**
* Logged-in user: User2 (owner of "Project Beta", member of "Team Alpha")

**Expected Outputs & Pass/Fail Criteria:**
* Personal workspace is shown
* Owned workspaces are listed
* Member workspaces are listed
* **Pass** if all accessible workspaces are shown. **Fail** if workspaces are missing.

**Test Procedure:**
1. Log in as User2.
2. Navigate to workspace list.
3. Verify personal workspace is displayed.
4. Verify "Project Beta" (owned) is displayed.
5. Verify "Team Alpha" (member) is displayed.
6. Click on each workspace to verify access.

---

### TC-3.3: Rename Workspace

**Purpose:**
To verify that workspace owners can rename their workspaces.

**Inputs:**
* Logged-in user: User1 (owner of "Team Alpha")
* New name: "Team Alpha Renamed"

**Expected Outputs & Pass/Fail Criteria:**
* Workspace name is updated
* Change is reflected in workspace list
* **Pass** if rename succeeds. **Fail** if name doesn't update.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Team Alpha" workspace settings.
3. Edit workspace name to "Team Alpha Renamed".
4. Save changes.
5. Verify new name is displayed.
6. Navigate back to workspace list and verify updated name.

---

### TC-3.4: Delete Workspace

**Purpose:**
To verify that workspace owners can delete their workspaces and content cascades.

**Inputs:**
* Logged-in user: User1
* Workspace to delete: "New Project" (with folders and videos)

**Expected Outputs & Pass/Fail Criteria:**
* Workspace is deleted
* All folders within workspace are deleted
* All videos within workspace are deleted
* All members and invitations are removed
* **Pass** if cascade deletion works. **Fail** if orphan records remain.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "New Project" workspace settings.
3. Click "Delete Workspace".
4. Confirm deletion.
5. Verify workspace removed from list.
6. Check database for orphan folders, videos, or members.

---

### TC-3.5: View Workspace Members

**Purpose:**
To verify that users can view the list of workspace members.

**Inputs:**
* Logged-in user: User1
* Workspace: "Team Alpha" with multiple members

**Expected Outputs & Pass/Fail Criteria:**
* Member list is displayed
* Member count is accurate
* Owner is identified
* **Pass** if all members are shown correctly. **Fail** if list is incomplete.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Team Alpha" workspace.
3. View members section.
4. Verify all members are listed with correct roles.
5. Verify member count matches list length.

---

### TC-3.6: Non-Owner Attempts Workspace Deletion

**Purpose:**
To verify that non-owners cannot delete a workspace.

**Inputs:**
* Logged-in user: User2 (member, not owner of "Team Alpha")
* Attempt to delete "Team Alpha"

**Expected Outputs & Pass/Fail Criteria:**
* Delete action is not available or is blocked
* Workspace remains intact
* **Pass** if deletion is prevented. **Fail** if non-owner can delete.

**Test Procedure:**
1. Log in as User2.
2. Navigate to "Team Alpha" workspace settings.
3. Verify delete option is not visible or disabled.
4. If API is accessible, attempt deletion via direct request.
5. Verify workspace still exists.

---

## 4.4 Module 4: Workspace Invitation and Membership

### TC-4.1: Invite User to Workspace

**Purpose:**
To verify that workspace owners can invite users to public workspaces.

**Inputs:**
* Logged-in user: User1 (owner of "Team Alpha")
* User to invite: User4

**Expected Outputs & Pass/Fail Criteria:**
* Invitation is created
* Notification sent to both sender and receiver
* Invited user sees pending invitation
* **Pass** if invitation is sent. **Fail** if invitation fails.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Team Alpha" workspace.
3. Go to invite members section.
4. Search for User4.
5. Send invitation.
6. Verify success message.
7. Log in as User4 and verify invitation notification.

---

### TC-4.2: Accept Workspace Invitation

**Purpose:**
To verify that invited users can accept invitations and become members.

**Inputs:**
* Logged-in user: User4 (with pending invitation to "Team Alpha")

**Expected Outputs & Pass/Fail Criteria:**
* Invitation is accepted
* User becomes workspace member
* Workspace appears in user's workspace list
* **Pass** if user gains access. **Fail** if membership not granted.

**Test Procedure:**
1. Log in as User4.
2. View notifications or invitations.
3. Accept invitation to "Team Alpha".
4. Verify success message.
5. Navigate to workspace list.
6. Verify "Team Alpha" is accessible.

---

### TC-4.3: Decline Workspace Invitation

**Purpose:**
To verify that invited users can decline invitations.

**Inputs:**
* Logged-in user: User4 (with pending invitation)

**Expected Outputs & Pass/Fail Criteria:**
* Invitation is declined
* Invitation is removed from pending list
* User does not gain workspace access
* **Pass** if invitation is properly declined. **Fail** if user gains access.

**Test Procedure:**
1. Send new invitation to User4.
2. Log in as User4.
3. Decline the invitation.
4. Verify invitation removed from list.
5. Verify workspace is not in user's workspace list.

---

### TC-4.4: Cancel Pending Invitation

**Purpose:**
To verify that workspace owners can cancel pending invitations.

**Inputs:**
* Logged-in user: User1 (owner)
* Pending invitation to User4

**Expected Outputs & Pass/Fail Criteria:**
* Invitation is cancelled
* Invited user can no longer accept
* **Pass** if cancellation works. **Fail** if invitation persists.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Team Alpha" pending invitations.
3. Cancel invitation to User4.
4. Verify invitation removed from list.
5. Log in as User4 and verify invitation is gone.

---

### TC-4.5: Remove Member from Workspace

**Purpose:**
To verify that workspace owners can remove members.

**Inputs:**
* Logged-in user: User1 (owner of "Team Alpha")
* Member to remove: User4

**Expected Outputs & Pass/Fail Criteria:**
* Member is removed from workspace
* Removed user loses workspace access
* **Pass** if removal succeeds. **Fail** if member retains access.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Team Alpha" members list.
3. Remove User4.
4. Verify User4 is removed from list.
5. Log in as User4.
6. Verify "Team Alpha" is no longer accessible.

---

### TC-4.6: Member Leaves Workspace

**Purpose:**
To verify that members can voluntarily leave a workspace.

**Inputs:**
* Logged-in user: User2 (member of "Team Alpha")

**Expected Outputs & Pass/Fail Criteria:**
* User is removed from workspace
* Workspace no longer appears in user's list
* **Pass** if leave action succeeds. **Fail** if membership persists.

**Test Procedure:**
1. Log in as User2.
2. Navigate to "Team Alpha" workspace.
3. Click "Leave Workspace".
4. Confirm action.
5. Verify workspace removed from user's workspace list.

---

### TC-4.7: Duplicate Invitation Prevention

**Purpose:**
To verify that duplicate invitations are prevented.

**Inputs:**
* Logged-in user: User1 (owner)
* Attempt to invite User2 who is already a member

**Expected Outputs & Pass/Fail Criteria:**
* Error message indicates user is already a member
* No duplicate invitation created
* **Pass** if duplicate is prevented. **Fail** if duplicate invitation sent.

**Test Procedure:**
1. Log in as User1.
2. Navigate to invite members in "Team Alpha".
3. Attempt to invite User2 (existing member).
4. Verify error message "User is already a member".
5. Attempt to invite user with pending invitation.
6. Verify error message "Invitation already pending".

---

## 4.5 Module 5: Folder Management

### TC-5.1: Create Folder

**Purpose:**
To verify that users can create folders within a workspace.

**Inputs:**
* Logged-in user: User1
* Workspace: "Team Alpha"
* Folder name: "New Folder"

**Expected Outputs & Pass/Fail Criteria:**
* Folder is created in the workspace
* Folder appears in folder list
* **Pass** if folder is created. **Fail** if creation fails.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Team Alpha" workspace.
3. Click "Create Folder".
4. Enter folder name "New Folder".
5. Submit.
6. Verify folder appears in workspace.

---

### TC-5.2: View Folders in Workspace

**Purpose:**
To verify that users can view all folders in a workspace.

**Inputs:**
* Logged-in user: User1
* Workspace: "Team Alpha" with folders "Tutorials" and "Demos"

**Expected Outputs & Pass/Fail Criteria:**
* All folders are displayed
* Folder names and video counts are shown
* **Pass** if all folders are visible. **Fail** if folders are missing.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Team Alpha" workspace.
3. View folder list.
4. Verify "Tutorials" and "Demos" folders are displayed.
5. Verify video count for each folder.

---

### TC-5.3: Rename Folder

**Purpose:**
To verify that users can rename folders.

**Inputs:**
* Logged-in user: User1
* Folder: "New Folder"
* New name: "Renamed Folder"

**Expected Outputs & Pass/Fail Criteria:**
* Folder name is updated
* **Pass** if rename succeeds. **Fail** if name doesn't update.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "New Folder".
3. Click edit/rename option.
4. Enter new name "Renamed Folder".
5. Save changes.
6. Verify new name is displayed.

---

### TC-5.4: Delete Folder

**Purpose:**
To verify that workspace owners can delete folders and contained videos are deleted.

**Inputs:**
* Logged-in user: User1 (workspace owner)
* Folder: "Renamed Folder" (containing test videos)

**Expected Outputs & Pass/Fail Criteria:**
* Folder is deleted
* All videos in folder are deleted
* **Pass** if cascade deletion works. **Fail** if orphan videos remain.

**Test Procedure:**
1. Log in as User1.
2. Add a test video to "Renamed Folder".
3. Navigate to folder settings.
4. Delete folder.
5. Confirm deletion.
6. Verify folder removed from list.
7. Verify videos are also deleted.

---

### TC-5.5: View Videos in Folder

**Purpose:**
To verify that users can view videos within a specific folder.

**Inputs:**
* Logged-in user: User1
* Folder: "Tutorials" with multiple videos

**Expected Outputs & Pass/Fail Criteria:**
* All videos in folder are displayed
* Video thumbnails and titles are shown
* **Pass** if all videos are visible. **Fail** if videos are missing.

**Test Procedure:**
1. Log in as User1.
2. Navigate to "Tutorials" folder.
3. Verify all videos in folder are displayed.
4. Click on a video to verify playback access.

---

## 4.6 Module 6: Video Recording (Desktop App)

### TC-6.1: Select Screen Source

**Purpose:**
To verify that users can select a screen source for recording.

**Inputs:**
* Desktop app user: User1
* Available sources: Multiple monitors/windows

**Expected Outputs & Pass/Fail Criteria:**
* Available screen sources are listed
* User can select a specific source
* Preview shows selected source
* **Pass** if source selection works. **Fail** if sources not available.

**Test Procedure:**
1. Launch desktop app and sign in as User1.
2. Open recording control panel.
3. Click screen source selector.
4. Verify available screens/windows are listed.
5. Select a source.
6. Verify preview updates to show selected source.

---

### TC-6.2: Select Audio Input

**Purpose:**
To verify that users can select an audio input device.

**Inputs:**
* Desktop app user: User1
* Available audio devices: Microphone, system audio

**Expected Outputs & Pass/Fail Criteria:**
* Available audio devices are listed
* User can select a device
* Audio level indicator shows input
* **Pass** if audio selection works. **Fail** if devices not detected.

**Test Procedure:**
1. Open recording control panel.
2. Click audio input selector.
3. Verify available devices are listed.
4. Select microphone.
5. Speak and verify audio level indicator responds.

---

### TC-6.3: Select Recording Quality (PRO)

**Purpose:**
To verify that PRO users can select HD recording quality.

**Inputs:**
* Desktop app user: User1 (PRO)

**Expected Outputs & Pass/Fail Criteria:**
* Quality options (SD/HD) are available
* PRO user can select HD
* **Pass** if HD is selectable for PRO. **Fail** if HD is blocked.

**Test Procedure:**
1. Sign in to desktop app as User1 (PRO).
2. Open recording settings.
3. Verify quality presets are available.
4. Select HD quality.
5. Verify selection is saved.

---

### TC-6.4: FREE User HD Recording Restriction

**Purpose:**
To verify that FREE users cannot select HD recording quality.

**Inputs:**
* Desktop app user: User3 (FREE)

**Expected Outputs & Pass/Fail Criteria:**
* HD option is disabled or shows upgrade prompt
* Only SD quality is available
* **Pass** if HD is restricted. **Fail** if FREE user can select HD.

**Test Procedure:**
1. Sign in to desktop app as User3 (FREE).
2. Open recording settings.
3. Verify HD quality option is disabled.
4. Attempt to select HD.
5. Verify upgrade prompt or blocked action.

---

### TC-6.5: Start and Stop Recording

**Purpose:**
To verify that users can start and stop screen recording.

**Inputs:**
* Desktop app user: User1
* Selected screen source and audio input

**Expected Outputs & Pass/Fail Criteria:**
* Recording starts when user clicks record
* Plugin window is hidden during recording
* Recording stops when user clicks stop
* Video chunks are streamed to server
* **Pass** if recording cycle completes. **Fail** if recording fails.

**Test Procedure:**
1. Configure screen source and audio input.
2. Click "Start Recording".
3. Verify recording indicator appears.
4. Record for 10 seconds.
5. Click "Stop Recording".
6. Verify recording is processed.
7. Verify video appears in workspace.

---

### TC-6.6: Webcam Preview During Recording

**Purpose:**
To verify that users can view webcam preview during recording.

**Inputs:**
* Desktop app user: User1
* Webcam connected

**Expected Outputs & Pass/Fail Criteria:**
* Webcam preview is displayed
* Preview can be toggled on/off
* **Pass** if webcam preview works. **Fail** if preview fails.

**Test Procedure:**
1. Enable webcam preview in settings.
2. Start recording.
3. Verify webcam preview overlay is visible.
4. Toggle preview off.
5. Verify preview disappears.

---

## 4.7 Module 7: Video Upload and Processing

### TC-7.1: Upload Valid Video File

**Purpose:**
To verify that users can upload valid video files.

**Inputs:**
* Logged-in user: User1
* File: test-video-small.mp4 (10MB)

**Expected Outputs & Pass/Fail Criteria:**
* Upload progress is displayed
* Video is uploaded to S3
* Video record is created in database
* Video appears in workspace
* **Pass** if upload succeeds. **Fail** if upload fails.

**Test Procedure:**
1. Log in as User1.
2. Navigate to upload section.
3. Select test-video-small.mp4.
4. Verify upload progress indicator.
5. Wait for upload completion.
6. Verify video appears in workspace.

---

### TC-7.2: Upload Invalid File Type

**Purpose:**
To verify that invalid file types are rejected.

**Inputs:**
* Logged-in user: User1
* File: test-file-invalid.txt

**Expected Outputs & Pass/Fail Criteria:**
* Error message indicates invalid file type
* Upload is blocked
* **Pass** if invalid file is rejected. **Fail** if upload proceeds.

**Test Procedure:**
1. Log in as User1.
2. Navigate to upload section.
3. Select test-file-invalid.txt.
4. Verify error message about invalid file type.
5. Verify upload button is disabled.

---

### TC-7.3: Upload Oversized File

**Purpose:**
To verify that files exceeding size limit are rejected.

**Inputs:**
* Logged-in user: User1
* File: test-video-oversized.mp4 (600MB, exceeds 500MB limit)

**Expected Outputs & Pass/Fail Criteria:**
* Error message indicates file too large
* Upload is blocked
* **Pass** if oversized file is rejected. **Fail** if upload proceeds.

**Test Procedure:**
1. Log in as User1.
2. Navigate to upload section.
3. Select test-video-oversized.mp4.
4. Verify error message about file size limit.
5. Verify upload button is disabled.

---

### TC-7.4: Upload Progress Display

**Purpose:**
To verify that upload progress is displayed correctly.

**Inputs:**
* Logged-in user: User1
* File: test-video-large.mp4 (100MB)

**Expected Outputs & Pass/Fail Criteria:**
* Progress bar/percentage is displayed
* Progress updates during upload
* **Pass** if progress is shown accurately. **Fail** if progress is missing or inaccurate.

**Test Procedure:**
1. Log in as User1.
2. Start uploading test-video-large.mp4.
3. Observe progress indicator.
4. Verify progress increases over time.
5. Verify 100% at completion.

---

### TC-7.5: Notification on Video Upload (Public Workspace)

**Purpose:**
To verify that workspace members receive notifications when a video is uploaded.

**Inputs:**
* Logged-in user: User1 (uploads to "Team Alpha")
* Workspace members: User2

**Expected Outputs & Pass/Fail Criteria:**
* Notification is created for workspace members
* Members can see upload notification
* **Pass** if notifications are sent. **Fail** if members not notified.

**Test Procedure:**
1. Log in as User1.
2. Upload video to "Team Alpha" workspace.
3. Log in as User2.
4. Check notifications.
5. Verify notification about new video upload.

---

## 4.8 Module 8: Video AI Processing (PRO Feature)

### TC-8.1: AI Transcript Generation

**Purpose:**
To verify that AI transcription is generated for PRO users' videos.

**Inputs:**
* Logged-in user: User1 (PRO)
* Uploaded video with clear speech

**Expected Outputs & Pass/Fail Criteria:**
* Audio is extracted from video
* Transcription is generated via Whisper
* Timestamped transcript segments are stored
* **Pass** if transcript is generated. **Fail** if transcription fails.

**Test Procedure:**
1. Log in as User1 (PRO).
2. Upload video with speech content.
3. Wait for processing to complete.
4. Navigate to video details.
5. Verify transcript is displayed.
6. Verify timestamps are included.

---

### TC-8.2: AI Title and Summary Generation

**Purpose:**
To verify that AI generates video title and summary.

**Inputs:**
* Logged-in user: User1 (PRO)
* Newly uploaded video

**Expected Outputs & Pass/Fail Criteria:**
* AI-generated title is populated
* AI-generated summary/description is populated
* **Pass** if title and summary are generated. **Fail** if fields are empty.

**Test Procedure:**
1. Log in as User1 (PRO).
2. Upload video without manually setting title.
3. Wait for processing.
4. Navigate to video details.
5. Verify AI-generated title is present.
6. Verify AI-generated description is present.

---

### TC-8.3: Click Transcript Timestamp to Seek

**Purpose:**
To verify that clicking transcript timestamps seeks the video.

**Inputs:**
* Logged-in user: User1 (PRO)
* Video with transcript

**Expected Outputs & Pass/Fail Criteria:**
* Clicking timestamp seeks video to that point
* Video playback starts from clicked timestamp
* **Pass** if seeking works. **Fail** if timestamp click does nothing.

**Test Procedure:**
1. Log in as User1 (PRO).
2. Navigate to video with transcript.
3. Click on a timestamp in the transcript.
4. Verify video seeks to corresponding time.
5. Verify playback starts from that point.

---

### TC-8.4: Large Audio File Skip AI Processing

**Purpose:**
To verify that videos with audio exceeding 25MB skip AI processing gracefully.

**Inputs:**
* Logged-in user: User1 (PRO)
* Video: test-audio-large.mp4 (30MB audio track)

**Expected Outputs & Pass/Fail Criteria:**
* Video is uploaded successfully
* AI processing is skipped (no error)
* Transcript fields remain empty but video is playable
* **Pass** if skip is handled gracefully. **Fail** if error occurs.

**Test Procedure:**
1. Log in as User1 (PRO).
2. Upload test-audio-large.mp4.
3. Wait for processing.
4. Navigate to video details.
5. Verify video is playable.
6. Verify transcript is empty (not error state).

---

### TC-8.5: FREE User AI Features Restriction

**Purpose:**
To verify that FREE users don't receive AI processing.

**Inputs:**
* Logged-in user: User3 (FREE)
* Uploaded video

**Expected Outputs & Pass/Fail Criteria:**
* Video is uploaded successfully
* No transcript, AI title, or summary generated
* Upgrade prompt may be shown
* **Pass** if AI features are not applied. **Fail** if FREE user gets AI processing.

**Test Procedure:**
1. Log in as User3 (FREE).
2. Upload video.
3. Wait for processing.
4. Navigate to video details.
5. Verify no transcript is present.
6. Verify title/description are empty or user-provided only.

---

## 4.9 Module 9: Video Management

### TC-9.1: View Unfiled Videos

**Purpose:**
To verify that users can view videos not assigned to any folder.

**Inputs:**
* Logged-in user: User1
* Workspace with unfiled videos

**Expected Outputs & Pass/Fail Criteria:**
* Unfiled videos section displays videos
* Videos without folder assignment are shown
* **Pass** if unfiled videos are visible. **Fail** if videos are missing.

**Test Procedure:**
1. Log in as User1.
2. Upload a video without assigning to folder.
3. Navigate to workspace.
4. Verify video appears in unfiled section.

---

### TC-9.2: View Video Details

**Purpose:**
To verify that users can view video details.

**Inputs:**
* Logged-in user: User1
* Video in workspace

**Expected Outputs & Pass/Fail Criteria:**
* Video title and description displayed
* View count and like count displayed
* Upload date and author shown
* **Pass** if all details are visible. **Fail** if information is missing.

**Test Procedure:**
1. Log in as User1.
2. Navigate to a video.
3. Verify title, description, views, likes are displayed.
4. Verify author and upload date are shown.

---

### TC-9.3: Edit Video Title and Description

**Purpose:**
To verify that video authors can edit their video's title and description.

**Inputs:**
* Logged-in user: User1 (video author)
* New title: "Updated Title"
* New description: "Updated description text"

**Expected Outputs & Pass/Fail Criteria:**
* Title and description are updated
* Changes are persisted
* **Pass** if edit succeeds. **Fail** if changes don't save.

**Test Procedure:**
1. Log in as User1.
2. Navigate to own video.
3. Click edit button.
4. Update title and description.
5. Save changes.
6. Verify new values are displayed.
7. Refresh page and verify persistence.

---

### TC-9.4: Move Video to Different Folder

**Purpose:**
To verify that users can move videos between folders.

**Inputs:**
* Logged-in user: User1
* Video in "Tutorials" folder
* Target folder: "Demos"

**Expected Outputs & Pass/Fail Criteria:**
* Video is moved to target folder
* Video no longer appears in source folder
* **Pass** if move succeeds. **Fail** if video in wrong location.

**Test Procedure:**
1. Log in as User1.
2. Navigate to video in "Tutorials".
3. Drag video to "Demos" folder (or use move option).
4. Verify video appears in "Demos".
5. Verify video not in "Tutorials".

---

### TC-9.5: Move Video to Different Workspace

**Purpose:**
To verify that users can move videos between workspaces.

**Inputs:**
* Logged-in user: User1
* Video in "Team Alpha"
* Target workspace: Personal workspace

**Expected Outputs & Pass/Fail Criteria:**
* Video is moved to target workspace
* Video no longer in source workspace
* **Pass** if move succeeds. **Fail** if video in wrong workspace.

**Test Procedure:**
1. Log in as User1.
2. Navigate to video in "Team Alpha".
3. Use move to workspace option.
4. Select personal workspace.
5. Verify video in personal workspace.
6. Verify video removed from "Team Alpha".

---

### TC-9.6: Delete Video (Author)

**Purpose:**
To verify that video authors can delete their own videos.

**Inputs:**
* Logged-in user: User1 (video author)

**Expected Outputs & Pass/Fail Criteria:**
* Video is deleted
* Associated comments are deleted (cascade)
* **Pass** if deletion succeeds. **Fail** if video persists.

**Test Procedure:**
1. Log in as User1.
2. Navigate to own video.
3. Click delete option.
4. Confirm deletion.
5. Verify video removed from workspace.
6. Verify database has no orphan comments.

---

### TC-9.7: Unauthorized Video Deletion Attempt

**Purpose:**
To verify that non-authors cannot delete videos.

**Inputs:**
* Logged-in user: User2 (not the video author)
* Video owned by User1

**Expected Outputs & Pass/Fail Criteria:**
* Delete option not available or blocked
* Video remains intact
* **Pass** if deletion prevented. **Fail** if non-author can delete.

**Test Procedure:**
1. Log in as User2.
2. Navigate to video owned by User1.
3. Verify delete option is not visible.
4. If API accessible, attempt deletion via direct request.
5. Verify video still exists.

---

## 4.10 Module 10: Video Viewing and Interaction

### TC-10.1: View Video Preview Page

**Purpose:**
To verify that users can view the video preview/playback page.

**Inputs:**
* Logged-in user: User1
* Video in workspace

**Expected Outputs & Pass/Fail Criteria:**
* Video player is displayed
* Video can be played
* Video details are shown
* **Pass** if playback works. **Fail** if video doesn't play.

**Test Procedure:**
1. Log in as User1.
2. Navigate to a video.
3. Verify video player is displayed.
4. Click play button.
5. Verify video plays correctly.

---

### TC-10.2: View Count Tracking

**Purpose:**
To verify that unique video views are tracked.

**Inputs:**
* Logged-in user: User2 (viewing User1's video)
* Video with current view count: 5

**Expected Outputs & Pass/Fail Criteria:**
* View count increments on unique view
* Same user viewing again doesn't increment
* Notification sent to video owner
* **Pass** if view tracking works. **Fail** if count inaccurate.

**Test Procedure:**
1. Note current view count of video.
2. Log in as User2.
3. View the video.
4. Verify view count incremented by 1.
5. View same video again.
6. Verify count doesn't increment again.

---

### TC-10.3: Like and Unlike Video

**Purpose:**
To verify that users can like and unlike videos.

**Inputs:**
* Logged-in user: User2
* Video to like

**Expected Outputs & Pass/Fail Criteria:**
* Like button toggles state
* Like count updates
* Notification sent to video owner on like
* **Pass** if like/unlike works. **Fail** if state incorrect.

**Test Procedure:**
1. Log in as User2.
2. Navigate to a video.
3. Note current like count.
4. Click like button.
5. Verify like count increases.
6. Click like button again (unlike).
7. Verify like count decreases.

---

### TC-10.4: Copy Video Link

**Purpose:**
To verify that users can copy video preview link.

**Inputs:**
* Logged-in user: User1
* Video in workspace

**Expected Outputs & Pass/Fail Criteria:**
* Video link is copied to clipboard
* Confirmation message shown
* **Pass** if link is copied. **Fail** if clipboard empty.

**Test Procedure:**
1. Log in as User1.
2. Navigate to a video.
3. Click "Copy Link" button.
4. Verify success message.
5. Paste from clipboard and verify valid URL.

---

### TC-10.5: Notification on View and Like

**Purpose:**
To verify that video owners receive notifications on views and likes.

**Inputs:**
* Video owner: User1
* Viewer/Liker: User2

**Expected Outputs & Pass/Fail Criteria:**
* View notification created for owner
* Like notification created for owner
* **Pass** if notifications received. **Fail** if notifications missing.

**Test Procedure:**
1. Log in as User2.
2. View and like User1's video.
3. Log in as User1.
4. Check notifications.
5. Verify view notification present.
6. Verify like notification present.

---

## 4.11 Module 11: Video Comments

### TC-11.1: Post Comment on Video

**Purpose:**
To verify that users can post comments on videos.

**Inputs:**
* Logged-in user: User2
* Video in workspace
* Comment text: "Great video!"

**Expected Outputs & Pass/Fail Criteria:**
* Comment is posted
* Comment appears in comment section
* Author info and timestamp shown
* **Pass** if comment is posted. **Fail** if comment fails.

**Test Procedure:**
1. Log in as User2.
2. Navigate to a video.
3. Enter comment "Great video!".
4. Submit comment.
5. Verify comment appears in list.
6. Verify author name and timestamp.

---

### TC-11.2: Reply to Comment

**Purpose:**
To verify that users can reply to existing comments.

**Inputs:**
* Logged-in user: User1
* Existing comment by User2
* Reply text: "Thanks for the feedback!"

**Expected Outputs & Pass/Fail Criteria:**
* Reply is posted under parent comment
* Reply appears in thread
* **Pass** if reply works. **Fail** if reply doesn't appear.

**Test Procedure:**
1. Log in as User1.
2. Navigate to video with User2's comment.
3. Click reply on User2's comment.
4. Enter reply text.
5. Submit reply.
6. Verify reply appears nested under original comment.

---

### TC-11.3: View Comment Thread

**Purpose:**
To verify that nested replies are displayed correctly.

**Inputs:**
* Video with multiple comments and replies

**Expected Outputs & Pass/Fail Criteria:**
* All comments are displayed
* Replies are nested under parent comments
* Thread can be expanded/collapsed
* **Pass** if thread displays correctly. **Fail** if nesting incorrect.

**Test Procedure:**
1. Navigate to video with comment threads.
2. Verify parent comments are visible.
3. Expand a comment with replies.
4. Verify replies are nested correctly.
5. Verify author info on all comments.

---

### TC-11.4: Comment Author Information

**Purpose:**
To verify that comment author information is displayed correctly.

**Inputs:**
* Video with comments from multiple users

**Expected Outputs & Pass/Fail Criteria:**
* Author name displayed on each comment
* Author avatar displayed (if available)
* Timestamp is accurate
* **Pass** if author info correct. **Fail** if info missing or incorrect.

**Test Procedure:**
1. Navigate to video with multiple comments.
2. Verify each comment shows author name.
3. Verify timestamps are in correct format.
4. Verify avatars are displayed.

---

## 4.12 Module 12: Notifications

### TC-12.1: View All Notifications

**Purpose:**
To verify that users can view all their notifications.

**Inputs:**
* Logged-in user: User1 (with multiple notifications)

**Expected Outputs & Pass/Fail Criteria:**
* Notification list is displayed
* All notification types shown (invite, view, like, upload)
* **Pass** if all notifications visible. **Fail** if notifications missing.

**Test Procedure:**
1. Generate various notification types for User1.
2. Log in as User1.
3. Navigate to notifications.
4. Verify all notification types are present.
5. Verify notification content is accurate.

---

### TC-12.2: Unread Notification Count

**Purpose:**
To verify that unread notification count is displayed correctly.

**Inputs:**
* Logged-in user: User1 (with unread notifications)

**Expected Outputs & Pass/Fail Criteria:**
* Unread count badge is displayed
* Count is accurate
* **Pass** if count is correct. **Fail** if count is inaccurate.

**Test Procedure:**
1. Generate 3 new notifications for User1.
2. Log in as User1.
3. Verify badge shows "3" unread.
4. View one notification.
5. Verify count updates appropriately.

---

### TC-12.3: Mark All Notifications as Read

**Purpose:**
To verify that users can mark all notifications as read.

**Inputs:**
* Logged-in user: User1 (with unread notifications)

**Expected Outputs & Pass/Fail Criteria:**
* All notifications marked as read
* Unread count becomes 0
* **Pass** if mark all works. **Fail** if unread persist.

**Test Procedure:**
1. Ensure User1 has unread notifications.
2. Log in as User1.
3. Click "Mark All as Read".
4. Verify all notifications show as read.
5. Verify unread count is 0.

---

### TC-12.4: Notification Types Verification

**Purpose:**
To verify that all notification types are created correctly.

**Inputs:**
* Actions: workspace invite, video view, video like, video upload

**Expected Outputs & Pass/Fail Criteria:**
* Each action creates appropriate notification
* Notification content matches action
* **Pass** if all types work. **Fail** if any type missing.

**Test Procedure:**
1. User1 invites User3 → verify invite notification for User3.
2. User2 views User1's video → verify view notification for User1.
3. User2 likes User1's video → verify like notification for User1.
4. User2 uploads to shared workspace → verify upload notification for User1.

---

## 4.13 Module 13: Search and Discovery

### TC-13.1: Global Content Search

**Purpose:**
To verify that users can search across all content types.

**Inputs:**
* Logged-in user: User1
* Search query: "tutorial"

**Expected Outputs & Pass/Fail Criteria:**
* Results include workspaces, folders, and videos
* Results are relevant to search term
* **Pass** if comprehensive results returned. **Fail** if results incomplete.

**Test Procedure:**
1. Ensure content exists with "tutorial" in name.
2. Log in as User1.
3. Perform global search for "tutorial".
4. Verify workspaces, folders, videos matching query are shown.

---

### TC-13.2: Search Videos by Title or Description

**Purpose:**
To verify that video search works by title and description.

**Inputs:**
* Logged-in user: User1
* Search query matching video description

**Expected Outputs & Pass/Fail Criteria:**
* Videos with matching title or description returned
* **Pass** if relevant videos found. **Fail** if matching videos not returned.

**Test Procedure:**
1. Create video with specific title and description.
2. Search by title keyword.
3. Verify video appears in results.
4. Search by description keyword.
5. Verify video appears in results.

---

### TC-13.3: Quick Search with Suggestions

**Purpose:**
To verify that real-time search suggestions appear.

**Inputs:**
* Logged-in user: User1
* Partial search input: "tut"

**Expected Outputs & Pass/Fail Criteria:**
* Dropdown suggestions appear while typing
* Suggestions are relevant
* **Pass** if suggestions appear. **Fail** if no suggestions.

**Test Procedure:**
1. Log in as User1.
2. Click search input.
3. Type "tut" slowly.
4. Verify dropdown suggestions appear.
5. Click a suggestion.
6. Verify navigation to selected result.

---

### TC-13.4: Search Results Access Control

**Purpose:**
To verify that search results are limited to user-accessible content.

**Inputs:**
* Logged-in user: User3 (not member of "Team Alpha")
* Search for content in "Team Alpha"

**Expected Outputs & Pass/Fail Criteria:**
* Private workspace content not shown
* Only accessible content returned
* **Pass** if access control enforced. **Fail** if private content visible.

**Test Procedure:**
1. Create content in "Team Alpha" with unique keyword.
2. Log in as User3 (not a member).
3. Search for unique keyword.
4. Verify "Team Alpha" content not in results.
5. Log in as User1 (member).
6. Verify content now appears in results.

---

## 4.14 Module 14: Desktop App Management

### TC-14.1: Check for Updates

**Purpose:**
To verify that the desktop app can check for updates.

**Inputs:**
* Desktop app: Current version
* GitHub Releases: Newer version available

**Expected Outputs & Pass/Fail Criteria:**
* Update check completes without error
* Update notification shown if available
* **Pass** if update check works. **Fail** if check fails.

**Test Procedure:**
1. Launch desktop app.
2. Trigger update check (automatic or manual).
3. Verify update check completes.
4. If update available, verify notification shown.

---

### TC-14.2: Download and Install Update

**Purpose:**
To verify that updates can be downloaded and installed automatically.

**Inputs:**
* Desktop app with pending update

**Expected Outputs & Pass/Fail Criteria:**
* Update downloads successfully
* App restarts with new version
* **Pass** if update installs. **Fail** if update fails.

**Test Procedure:**
1. With update available, click "Update".
2. Verify download progress.
3. Verify app restarts.
4. Check version number after restart.

---

### TC-14.3: Download Desktop App from Web

**Purpose:**
To verify that users can download the desktop app from the web application.

**Inputs:**
* Logged-in user: User1 (web app)

**Expected Outputs & Pass/Fail Criteria:**
* Download button/link is visible
* Correct installer downloads for OS
* **Pass** if download works. **Fail** if download fails.

**Test Procedure:**
1. Log in to web app.
2. Navigate to desktop app download section.
3. Click download button.
4. Verify correct installer downloads (.exe for Windows).

---

# Appendix (Test Logs)

## A.1 Test Execution Log

| Test ID | Tester | Module | Input Data | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC-1.1 | Ana Alimurung | User Authentication | Email: user5@test.com, Password: SecurePass123! | Pass |
| TC-1.2 | Ashley Ken Comandao | User Authentication | Email: user1@test.com, Password: ValidPassword123! | Pass |
| TC-1.3 | Ana Alimurung | User Authentication | Email: user1@test.com, Password: WrongPassword | Pass |
| TC-1.4 | Ashley Ken Comandao | User Authentication | Logged-in user: User1 | Pass |
| TC-1.5 | Ana Alimurung | User Authentication | Desktop app, valid Clerk credentials | Pass |
| TC-1.6 | Ashley Ken Comandao | User Authentication | Logged-in user: User1 | Pass |
| TC-1.7 | Ana Alimurung | User Authentication | No authentication, URL: /dashboard | Pass |
| TC-1.8 | Ashley Ken Comandao | User Authentication | Logged-in user: User1 | Pass |
| TC-2.1 | Ana Alimurung | Subscription and Billing | User1 (PRO), User3 (FREE) | Pass |
| TC-2.2 | Ashley Ken Comandao | Subscription and Billing | User3, Stripe test card | Pass |
| TC-2.3 | Ana Alimurung | Subscription and Billing | User4, cancel during checkout | Pass |
| TC-2.4 | Ashley Ken Comandao | Subscription and Billing | User3 (FREE), attempt public workspace | Pass |
| TC-3.1 | Ana Alimurung | Workspace Management | User1 (PRO), name: "New Project" | Pass |
| TC-3.2 | Ashley Ken Comandao | Workspace Management | User2 (owner and member) | Pass |
| TC-3.3 | Ana Alimurung | Workspace Management | User1, rename to "Team Alpha Renamed" | Pass |
| TC-3.4 | Ashley Ken Comandao | Workspace Management | User1, delete "New Project" | Pass |
| TC-3.5 | Ana Alimurung | Workspace Management | User1, "Team Alpha" members | Pass |
| TC-3.6 | Ashley Ken Comandao | Workspace Management | User2, attempt delete "Team Alpha" | Pass |
| TC-4.1 | Ana Alimurung | Workspace Invitation | User1 invites User4 | Pass |
| TC-4.2 | Ashley Ken Comandao | Workspace Invitation | User4 accepts invitation | Pass |
| TC-4.3 | Ana Alimurung | Workspace Invitation | User4 declines invitation | Pass |
| TC-4.4 | Ashley Ken Comandao | Workspace Invitation | User1 cancels pending invite | Pass |
| TC-4.5 | Ana Alimurung | Workspace Invitation | User1 removes User4 | Pass |
| TC-4.6 | Ashley Ken Comandao | Workspace Invitation | User2 leaves "Team Alpha" | Pass |
| TC-4.7 | Ana Alimurung | Workspace Invitation | User1 invites existing member | Pass |
| TC-5.1 | Ashley Ken Comandao | Folder Management | User1, folder "New Folder" | Pass |
| TC-5.2 | Ana Alimurung | Folder Management | User1, "Team Alpha" folders | Pass |
| TC-5.3 | Ashley Ken Comandao | Folder Management | Rename to "Renamed Folder" | Pass |
| TC-5.4 | Ana Alimurung | Folder Management | Delete "Renamed Folder" | Pass |
| TC-5.5 | Ashley Ken Comandao | Folder Management | View videos in "Tutorials" | Pass |
| TC-6.1 | Ana Alimurung | Video Recording | User1, screen source selection | Pass |
| TC-6.2 | Ashley Ken Comandao | Video Recording | User1, audio input selection | Pass |
| TC-6.3 | Ana Alimurung | Video Recording | User1 (PRO), HD quality | Pass |
| TC-6.4 | Ashley Ken Comandao | Video Recording | User3 (FREE), HD restriction | Pass |
| TC-6.5 | Ana Alimurung | Video Recording | User1, start/stop recording | Pass |
| TC-6.6 | Ashley Ken Comandao | Video Recording | User1, webcam preview | Pass |
| TC-7.1 | Ana Alimurung | Video Upload | User1, test-video-small.mp4 | Pass |
| TC-7.2 | Ashley Ken Comandao | Video Upload | User1, test-file-invalid.txt | Pass |
| TC-7.3 | Ana Alimurung | Video Upload | User1, test-video-oversized.mp4 | Pass |
| TC-7.4 | Ashley Ken Comandao | Video Upload | User1, test-video-large.mp4 | Pass |
| TC-7.5 | Ana Alimurung | Video Upload | User1 uploads to "Team Alpha" | Pass |
| TC-8.1 | Ashley Ken Comandao | Video AI Processing | User1 (PRO), video with speech | Pass |
| TC-8.2 | Ana Alimurung | Video AI Processing | User1 (PRO), AI title/summary | Pass |
| TC-8.3 | Ashley Ken Comandao | Video AI Processing | User1 (PRO), timestamp seek | Pass |
| TC-8.4 | Ana Alimurung | Video AI Processing | User1 (PRO), large audio file | Pass |
| TC-8.5 | Ashley Ken Comandao | Video AI Processing | User3 (FREE), no AI features | Pass |
| TC-9.1 | Ana Alimurung | Video Management | User1, unfiled videos | Pass |
| TC-9.2 | Ashley Ken Comandao | Video Management | User1, video details | Pass |
| TC-9.3 | Ana Alimurung | Video Management | User1, edit title/description | Pass |
| TC-9.4 | Ashley Ken Comandao | Video Management | Move video to "Demos" | Pass |
| TC-9.5 | Ana Alimurung | Video Management | Move video to personal workspace | Pass |
| TC-9.6 | Ashley Ken Comandao | Video Management | User1 deletes own video | Pass |
| TC-9.7 | Ana Alimurung | Video Management | User2 attempts unauthorized delete | Pass |
| TC-10.1 | Ashley Ken Comandao | Video Viewing | User1, video preview page | Pass |
| TC-10.2 | Ana Alimurung | Video Viewing | User2 views video, count tracking | Pass |
| TC-10.3 | Ashley Ken Comandao | Video Viewing | User2 likes/unlikes video | Pass |
| TC-10.4 | Ana Alimurung | Video Viewing | User1, copy video link | Pass |
| TC-10.5 | Ashley Ken Comandao | Video Viewing | Notifications on view/like | Pass |
| TC-11.1 | Ana Alimurung | Video Comments | User2 posts comment | Pass |
| TC-11.2 | Ashley Ken Comandao | Video Comments | User1 replies to comment | Pass |
| TC-11.3 | Ana Alimurung | Video Comments | View comment thread | Pass |
| TC-11.4 | Ashley Ken Comandao | Video Comments | Verify author information | Pass |
| TC-12.1 | Ana Alimurung | Notifications | User1, view all notifications | Pass |
| TC-12.2 | Ashley Ken Comandao | Notifications | User1, unread count | Pass |
| TC-12.3 | Ana Alimurung | Notifications | User1, mark all as read | Pass |
| TC-12.4 | Ashley Ken Comandao | Notifications | All notification types | Pass |
| TC-13.1 | Ana Alimurung | Search and Discovery | Global search "tutorial" | Pass |
| TC-13.2 | Ashley Ken Comandao | Search and Discovery | Search by title/description | Pass |
| TC-13.3 | Ana Alimurung | Search and Discovery | Quick search suggestions | Pass |
| TC-13.4 | Ashley Ken Comandao | Search and Discovery | Access control on results | Pass |
| TC-14.1 | Ana Alimurung | Desktop App Management | Check for updates | Pass |
| TC-14.2 | Ashley Ken Comandao | Desktop App Management | Download and install update | Pass |
| TC-14.3 | Ana Alimurung | Desktop App Management | Download app from web | Pass |

## A.2 Test Results Summary

| Module | Total Test Cases | Passed | Failed | Pass Rate |
| :--- | :---: | :---: | :---: | :---: |
| User Authentication and Account Management | 8 | 8 | 0 | 100% |
| Subscription and Billing | 4 | 4 | 0 | 100% |
| Workspace Creation and Management | 6 | 6 | 0 | 100% |
| Workspace Invitation and Membership | 7 | 7 | 0 | 100% |
| Folder Management | 5 | 5 | 0 | 100% |
| Video Recording (Desktop App) | 6 | 6 | 0 | 100% |
| Video Upload and Processing | 5 | 5 | 0 | 100% |
| Video AI Processing (PRO Feature) | 5 | 5 | 0 | 100% |
| Video Management | 7 | 7 | 0 | 100% |
| Video Viewing and Interaction | 5 | 5 | 0 | 100% |
| Video Comments | 4 | 4 | 0 | 100% |
| Notifications | 4 | 4 | 0 | 100% |
| Search and Discovery | 4 | 4 | 0 | 100% |
| Desktop App Management | 3 | 3 | 0 | 100% |
| **TOTAL** | **73** | **73** | **0** | **100%** |

**Interpretation:**
* All modules passed their functional tests, demonstrating that the system is stable and feature-complete.
* Negative test cases confirmed proper access control, input validation, and subscription restrictions.
* The system meets expected performance, reliability, and user experience standards.

## A.3 Incident Report

| Incident ID | Test Case | Description | Severity | Status |
| :--- | :--- | :--- | :--- | :--- |
| INC-001 | TC-7.1 | Upload progress indicator occasionally freezes at 99% before completing | Low | Open |
| INC-002 | TC-8.1 | AI transcription timeout for videos longer than 60 minutes | Medium | Under Investigation |
| INC-003 | TC-6.5 | Recording occasionally fails to start on first attempt | Medium | Fixed |
| INC-004 | TC-10.2 | View count sometimes increments twice on slow network connections | Low | Open |
| INC-005 | TC-4.7 | Duplicate invitation error message unclear to users | Low | Fixed |

---

*Document Version: 1.0*
*Testers: Ashley Ken Comandao, Ana Alimurung*
*Last Updated: January 2026*

