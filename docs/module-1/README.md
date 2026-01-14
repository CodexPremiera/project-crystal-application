# Module 1: User Authentication and Account Management

## Module Overview

This module handles user authentication, account creation, and profile management for both the web application and desktop application. It integrates with Clerk for identity management and maintains user records in the PostgreSQL database via Prisma.

---

## Features List

| #   | Feature                                                                                                | Actor  |
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

## Feature Groupings

Features are grouped by their logical flow and shared implementation. Each group represents a cohesive user journey or system process.

| Group | Features | Name | Description |
|-------|----------|------|-------------|
| 1 | 1.1, 1.2, 1.3 | [Sign Up & Account Initialization](./feature-1.1-1.3/) | Complete user registration flow including account creation and default resource setup |
| 2 | 1.4, 1.8 | [Sign In & Data Sync](./feature-1.4-1.8/) | Web application sign-in with automatic data validation and synchronization |
| 3 | 1.5 | [Sign Out](./feature-1.5/) | User session termination |
| 4 | 1.6, 1.7 | [Desktop App Authentication](./feature-1.6-1.7/) | Browser-based authentication flow for the desktop application |
| 5 | 1.9 | [View Profile](./feature-1.9/) | User profile information display |

---

## Grouping Rationale

### Why group features?

1. **Single Transaction**: Features 1.1, 1.2, and 1.3 occur in a single atomic transaction - the user signs up once, and the system creates all resources in one database operation.

2. **Shared Code Path**: Features 1.4 and 1.8 share the same `onAuthenticateUser()` function - sign-in always triggers data validation/sync.

3. **Causal Dependency**: Features 1.6 and 1.7 are causally linked - the ticket generation (1.7) only happens as part of the desktop sign-in flow (1.6).

4. **Standalone Features**: Features 1.5 and 1.9 are independent actions with no sub-features, so they remain as individual groups.

---

## Folder Structure

```
module-1/
├── README.md                     ← This file
├── feature-1.1-1.3/
│   ├── documentation.md
│   └── *.png                     ← Diagram images
├── feature-1.4-1.8/
│   ├── documentation.md
│   └── *.png
├── feature-1.5/
│   ├── documentation.md
│   └── *.png
├── feature-1.6-1.7/
│   ├── documentation.md
│   └── *.png
└── feature-1.9/
    ├── documentation.md
    └── *.png
```

---

## External Dependencies

| Service | Purpose |
|---------|---------|
| Clerk | Identity and session management |
| PostgreSQL | Data persistence |
| Prisma | ORM and database client |

---

## Database Tables Used

- `User` - User account information
- `WorkSpace` - User workspaces
- `Subscription` - Subscription plans (FREE/PRO)
- `Media` - Studio settings for recording

