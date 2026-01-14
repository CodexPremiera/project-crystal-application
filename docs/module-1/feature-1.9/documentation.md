# Feature 1.9: View Profile Information

## Features Covered

| #   | Feature                                | Actor |
|-----|----------------------------------------|-------|
| 1.9 | User can view their profile information | User  |

## Overview

This feature allows authenticated users to view their profile information within the application. Profile data is displayed in the sidebar (user avatar, name, subscription status) and through the Clerk UserButton component which provides access to detailed account settings.

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "User" as user

rectangle "Crystal Application" {
  usecase "View Profile Information" as UC1
  usecase "Display User Avatar" as UC2
  usecase "Display User Name" as UC3
  usecase "Display Subscription Status" as UC4
  usecase "Access Account Settings" as UC5
}

user --> UC1
UC1 --> UC2 : <<include>>
UC1 --> UC3 : <<include>>
UC1 --> UC4 : <<include>>
UC1 ..> UC5 : <<extend>>

@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-1.9 |
| **Use Case Name** | View Profile Information |
| **Actor(s)** | User |
| **Description** | An authenticated user views their profile information displayed in the sidebar, including their avatar, name, and subscription status. |
| **Preconditions** | User is authenticated and on a dashboard page |
| **Trigger** | User views the sidebar or clicks on UserButton |
| **Main Flow** | 1. User navigates to any dashboard page<br>2. Sidebar component loads<br>3. System fetches user workspaces (includes subscription data)<br>4. Sidebar displays user information section<br>5. User sees their avatar (via UserButton) and subscription plan<br>6. If FREE plan, upgrade prompt is shown |
| **Alternative Flows** | **A1: User clicks UserButton**<br>5a. Clerk account modal opens<br>5b. User can view/edit profile details |
| **Postconditions** | User profile information displayed in sidebar |
| **Exceptions** | Data fetch failure (cached data may be shown) |

---

## Activity Diagram

![Activity Diagram](./activity.png)

```plantuml
@startuml
skinparam ActivityBackgroundColor #f8f9fa
skinparam ActivityBorderColor #343a40

start

:User navigates to dashboard;

:Sidebar component mounts;

:React Query checks cache for user-workspaces;

if (Data cached and fresh?) then (yes)
  :Use cached data;
else (no)
  :Fetch user workspaces via getWorkSpaces();
  :Cache response;
endif

:Extract subscription plan from response;

:Render sidebar with user info;

fork
  :Display UserButton with avatar;
fork again
  if (Subscription is FREE?) then (yes)
    :Display "Upgrade to Pro" card;
    :Show PaymentButton;
  else (no)
    :Display PRO status;
  endif
end fork

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `Sidebar` | Main navigation sidebar | Display workspaces and user info | React Client Component |
| `UserButton` | Clerk user menu | Show avatar and account options | Clerk React Component |
| `GlobalCard` | Upgrade prompt card | Display upgrade CTA for FREE users | React Component |
| `PaymentButton` | Stripe checkout trigger | Initiate subscription upgrade | React Component |
| `Infobar` | Top navigation bar | Contains UserButton for quick access | React Client Component |

### Backend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `getWorkSpaces` | Workspace fetcher | Return user workspaces with subscription | Server Action |
| `getUserProfile` | Profile data fetcher | Return user profile for comments | Server Action |
| `UserService.getProfile` | Profile service | Query minimal profile data | Service Function |

### External Services

| Service | Description | Purpose | Type |
|---------|-------------|---------|------|
| `Clerk` | Authentication provider | Provide user avatar and account UI | External SaaS |
| `PostgreSQL` | Database | Store subscription data | Database |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2

package "Frontend (Next.js)" {
  [Sidebar] as sidebar
  [Infobar] as infobar
  [UserButton] as userBtn
  [GlobalCard] as upgradeCard
  [PaymentButton] as payBtn
}

package "State Management" {
  [React Query Cache] as cache
  [Redux Store] as redux
}

package "Backend (Server Actions)" {
  [getWorkSpaces] as getWS
  [getUserProfile] as getProfile
}

package "Data Layer" {
  [Prisma Client] as prisma
  database "PostgreSQL" as db
}

sidebar --> userBtn : contains
infobar --> userBtn : contains
sidebar --> upgradeCard : conditionally shows
upgradeCard --> payBtn : contains

sidebar --> cache : useQueryData
cache --> getWS : fetches on miss
getWS --> prisma : queries
prisma --> db : SELECT

sidebar --> redux : dispatch workspaces

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor User
participant "Dashboard Layout" as Layout
participant "Sidebar" as Sidebar
participant "React Query" as RQ
participant "getWorkSpaces" as Action
participant "Prisma" as Prisma
database "PostgreSQL" as DB

User -> Layout : Navigate to /dashboard/{id}
Layout -> Sidebar : Render sidebar

Sidebar -> RQ : useQueryData('user-workspaces')

alt Data not in cache
  RQ -> Action : getWorkSpaces()
  Action -> Prisma : findUnique({ clerkId })
  
  Prisma -> DB : SELECT u.*, s.plan FROM User u\nLEFT JOIN Subscription s ON u.id = s.userId\nLEFT JOIN WorkSpace w ON u.id = w.userId
  
  DB --> Prisma : User with subscription and workspaces
  Prisma --> Action : Complete user data
  Action --> RQ : { workspace, subscription, members }
  
  RQ -> RQ : Cache response with 'user-workspaces' key
end

RQ --> Sidebar : Return cached/fresh data

Sidebar -> Sidebar : Extract subscription.plan
Sidebar -> Sidebar : Render user info section

alt plan === 'FREE'
  Sidebar -> User : Display GlobalCard with upgrade prompt
else plan === 'PRO'
  Sidebar -> User : Display PRO badge
end

Sidebar -> User : Display UserButton with avatar

@enduml
```

---

## ERD and Schema

*This feature reads from the User and Subscription tables. See Feature 1.1-1.3 for the complete ERD.*

### Relevant Query

```prisma
// Query used by getWorkSpaces to fetch profile data
const user = await client.user.findUnique({
  where: { clerkId: clerkUser.id },
  select: {
    workspace: true,
    subscription: {
      select: { plan: true }
    },
    members: {
      select: {
        WorkSpace: true
      }
    }
  }
})
```

---

## Code References

### Sidebar Profile Display

**File:** `crystal-web-app/src/components/global/sidebar/sidebar.tsx`

```typescript
export default function Sidebar({ activeWorkspaceId }: Props) {
  const { data: workspace } = useQueryData(['user-workspaces'], getWorkSpaces);
  
  const SidebarSection = (
    <div className="...">
      {/* Navigation items */}
      
      <Separator />
      
      {/* Upgrade card for FREE users */}
      {workspace.subscription?.plan === 'FREE' && (
        <GlobalCard
          title="Upgrade to Pro"
          description="Unlock AI features like transcription, AI summary, and more."
          footer={<PaymentButton />}
        />
      )}
    </div>
  );
  
  return (
    <div>
      <Infobar />  {/* Contains UserButton */}
      {SidebarSection}
    </div>
  );
}
```

### UserButton in Infobar

**File:** `crystal-web-app/src/components/global/infobar.tsx`

```typescript
import { UserButton } from "@clerk/nextjs";

function Infobar() {
  return (
    <header className="...">
      <div className="flex items-center gap-4">
        {/* Action buttons */}
        <UserButton />  {/* Displays avatar and provides profile access */}
      </div>
    </header>
  );
}
```

### getUserProfile Server Action

**File:** `crystal-web-app/src/actions/user.ts`

```typescript
export const getUserProfile = async () => {
  return withAuth(async (clerkUser) => {
    const profile = await UserService.getProfile(clerkUser.id)
    if (!profile) throw new Error('Profile not found')
    return profile
  })
}
```

