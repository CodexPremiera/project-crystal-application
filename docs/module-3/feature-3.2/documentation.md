# Feature 3.2: View and Access Workspaces

## Features Covered

| #   | Feature                                                     | Actor |
|-----|-------------------------------------------------------------|-------|
| 3.2 | User can view and access their workspaces (owned and member of) | User  |

## Overview

This feature allows users to view all workspaces they have access to - both workspaces they own and workspaces they've been invited to as members. The workspace list is displayed in the sidebar with easy navigation.

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "User" as user

rectangle "Crystal Application" {
  usecase "View Sidebar" as UC1
  usecase "Fetch User Workspaces" as UC2
  usecase "Display Owned Workspaces" as UC3
  usecase "Display Member Workspaces" as UC4
  usecase "Navigate to Workspace" as UC5
}

user --> UC1
UC1 --> UC2 : <<include>>
UC2 --> UC3 : <<include>>
UC2 --> UC4 : <<include>>
user --> UC5

@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-3.2 |
| **Use Case Name** | View and Access Workspaces |
| **Actor(s)** | User |
| **Description** | A user views all workspaces they have access to (owned and member) in the sidebar and can navigate to any of them. |
| **Preconditions** | User is authenticated |
| **Trigger** | User navigates to any dashboard page |
| **Main Flow** | 1. User navigates to dashboard<br>2. Sidebar component loads<br>3. System calls getWorkSpaces server action<br>4. System queries owned workspaces<br>5. System queries member workspaces<br>6. Sidebar renders current workspace prominently<br>7. Sidebar renders other workspaces in list<br>8. User clicks on a workspace<br>9. System navigates to workspace dashboard |
| **Postconditions** | User can see and navigate to all accessible workspaces |
| **Exceptions** | Database unavailable; User has no workspaces (shouldn't happen - all users get default) |

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

:Call getWorkSpaces();

:Get current user from Clerk;

:Query user's owned workspaces;

:Query user's member workspaces;

:Combine and return workspace data;

:Identify current workspace from URL;

:Display current workspace prominently;

:Display other workspaces in list;

if (User clicks workspace?) then (yes)
  :Navigate to /dashboard/{workspaceId};
  :Load new workspace dashboard;
endif

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `Sidebar` | Main navigation sidebar | Display workspace list | React Client Component |
| `SidebarItem` | Workspace navigation item | Individual workspace link | React Component |
| `WorkspacePlaceholder` | Workspace icon | Visual indicator for workspace type | React Component |

### Backend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `getWorkSpaces` | Workspace fetcher | Query owned and member workspaces | Server Action |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2

package "Frontend (Next.js)" {
  [DashboardLayout] as layout
  [Sidebar] as sidebar
  [SidebarItem] as item
  [WorkspacePlaceholder] as placeholder
}

package "State Management" {
  [React Query Cache] as cache
  [Redux Store] as redux
}

package "Backend (Server Actions)" {
  [getWorkSpaces] as getWS
}

package "Data Layer" {
  [Prisma Client] as prisma
  database "PostgreSQL" as db {
    [User]
    [WorkSpace]
    [Member]
  }
}

layout --> sidebar : contains
sidebar --> item : renders multiple
item --> placeholder : contains icon
sidebar --> cache : useQueryData
cache --> getWS : fetches
getWS --> prisma : queries
prisma --> db : SELECT
sidebar --> redux : dispatch WORKSPACES

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor User
participant "DashboardLayout" as Layout
participant "Sidebar" as Sidebar
participant "React Query" as RQ
participant "getWorkSpaces" as Action
participant "Prisma" as Prisma
database "PostgreSQL" as DB

User -> Layout : Navigate to /dashboard/{id}
Layout -> Sidebar : Render sidebar

Sidebar -> RQ : useQueryData('user-workspaces')

alt Data not cached
  RQ -> Action : getWorkSpaces()
  Action -> Action : Get Clerk user
  
  Action -> Prisma : findUnique({ clerkId })
  Prisma -> DB : SELECT * FROM User\nJOIN WorkSpace ON owner\nJOIN Member ON membership
  DB --> Prisma : User with workspaces and memberships
  Prisma --> Action : Complete user data
  
  Action --> RQ : { workspace[], members[], subscription }
  RQ -> RQ : Cache with 'user-workspaces'
end

RQ --> Sidebar : Workspace data

Sidebar -> Sidebar : Identify current workspace
Sidebar -> Sidebar : Render current workspace (highlighted)
Sidebar -> Sidebar : Render other workspaces

User -> Sidebar : Click different workspace
Sidebar -> User : Navigate to /dashboard/{newWorkspaceId}

@enduml
```

---

## ERD and Schema

```plantuml
@startuml
skinparam linetype ortho

entity "User" as user {
  * id : UUID <<PK>>
  --
  * clerkId : String
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  * name : String
  * type : Type
  userId : UUID <<FK>>
}

entity "Member" as member {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
  * member : Boolean
  * createdAt : DateTime
}

user ||--o{ workspace : "owns"
user ||--o{ member : "is member"
workspace ||--o{ member : "has members"

note right of member
  Member table links users
  to workspaces they're invited to
end note

@enduml
```

---

## Code References

### getWorkSpaces Server Action

**File:** `crystal-web-app/src/actions/workspace.ts`

```typescript
export const getWorkSpaces = async () => {
  return withAuth(async (clerkUser) => {
    const user = await client.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: {
        subscription: { select: { plan: true } },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })
    
    if (!user) throw new Error('User not found')
    return user
  })
}
```

### Sidebar Workspace Rendering

**File:** `crystal-web-app/src/components/global/sidebar/sidebar.tsx`

```typescript
// Current workspace (highlighted)
{currentWorkspace && (
  <SidebarItem
    href={`/dashboard/${currentWorkspace.id}`}
    selected={pathName === `/dashboard/${currentWorkspace.id}`}
    title={currentWorkspace.name}
    icon={
      <WorkspacePlaceholder type={currentWorkspace.type}>
        {currentWorkspace.name.charAt(0)}
      </WorkspacePlaceholder>
    }
  />
)}

// Other workspaces
{workspace.workspace.map((item) =>
  item !== currentWorkspace && (
    <SidebarItem
      href={`/dashboard/${item.id}`}
      selected={pathName === `/dashboard/${item.id}`}
      title={item.name}
      icon={
        <WorkspacePlaceholder type={item.type}>
          {item.name.charAt(0)}
        </WorkspacePlaceholder>
      }
    />
  )
)}
```

