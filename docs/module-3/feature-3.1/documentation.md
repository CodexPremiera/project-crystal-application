# Feature 3.1: Create New Public Workspace

## Features Covered

| #   | Feature                                    | Actor    |
|-----|--------------------------------------------|----------|
| 3.1 | PRO user can create a new public workspace | PRO User |

## Overview

This feature allows PRO subscription users to create additional public workspaces for team collaboration. FREE users only have their default personal workspace. The create workspace button is only visible to PRO users.

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "PRO User" as user
actor "System" as system <<system>>

rectangle "Crystal Application" {
  usecase "Click Create Workspace" as UC1
  usecase "Validate PRO Subscription" as UC2
  usecase "Open Workspace Modal" as UC3
  usecase "Enter Workspace Name" as UC4
  usecase "Create PUBLIC Workspace" as UC5
}

user --> UC1
UC1 --> UC2 : <<include>>
UC2 --> system
UC2 --> UC3 : if PRO
UC3 --> UC4 : <<include>>
UC4 --> UC5 : <<include>>

@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-3.1 |
| **Use Case Name** | Create New Public Workspace |
| **Actor(s)** | PRO User, System |
| **Description** | A PRO user creates a new public workspace for team collaboration. |
| **Preconditions** | User is authenticated; User has PRO subscription |
| **Trigger** | User clicks "Create Workspace" button in sidebar |
| **Main Flow** | 1. User views sidebar<br>2. System checks subscription (PRO)<br>3. System shows "Create Workspace" button<br>4. User clicks button<br>5. Modal opens with workspace form<br>6. User enters workspace name<br>7. User submits form<br>8. System validates PRO subscription<br>9. System creates PUBLIC workspace<br>10. Modal closes, workspace appears in sidebar |
| **Alternative Flows** | **A1: FREE user**<br>2a. System detects FREE subscription<br>2b. Create button not rendered<br>2c. User cannot create workspace |
| **Postconditions** | New PUBLIC workspace created and associated with user |
| **Exceptions** | Subscription validation fails; Database error; Invalid workspace name |

---

## Activity Diagram

![Activity Diagram](./activity.png)

```plantuml
@startuml
skinparam ActivityBackgroundColor #f8f9fa
skinparam ActivityBorderColor #343a40

start

:User views sidebar;

:Fetch user workspaces with subscription;

if (Subscription is PRO?) then (yes)
  :Render "Create Workspace" button;
  
  :User clicks button;
  
  :Open modal with WorkspaceForm;
  
  :User enters workspace name;
  
  :User submits form;
  
  :Call createWorkspace(name);
  
  :Get current user from Clerk;
  
  :Query user subscription;
  
  if (Subscription is PRO?) then (yes)
    :Create PUBLIC workspace;
    :Associate with user;
    :Return success;
    :Close modal;
    :Refresh workspace list;
  else (no)
    :Return 401 unauthorized;
    :Show error message;
  endif
else (no)
  :Hide "Create Workspace" button;
  :Show "Upgrade to create workspaces" message;
endif

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `CreateWorkspace` | Create workspace button + modal trigger | Show create button for PRO users | React Client Component |
| `Modal` | Modal container | Display workspace creation form | React Component |
| `WorkspaceForm` | Workspace creation form | Input for workspace name | React Form Component |
| `Sidebar` | Navigation sidebar | Contains create button | React Client Component |

### Backend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `createWorkspace` | Workspace creator | Validate PRO and create workspace | Server Action |
| `getWorkSpaces` | Workspace fetcher | Fetch subscription for conditional render | Server Action |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2

package "Frontend (Next.js)" {
  [Sidebar] as sidebar
  [CreateWorkspace] as createBtn
  [Modal] as modal
  [WorkspaceForm] as form
}

package "Backend (Server Actions)" {
  [createWorkspace] as createAction
  [getWorkSpaces] as getAction
}

package "Data Layer" {
  [Prisma Client] as prisma
  database "PostgreSQL" as db {
    [User]
    [WorkSpace]
    [Subscription]
  }
}

sidebar --> createBtn : contains (PRO only)
createBtn --> getAction : check subscription
createBtn --> modal : opens
modal --> form : contains
form --> createAction : submits
createAction --> prisma : validates & creates
prisma --> db : INSERT

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor "PRO User" as User
participant "Sidebar" as Sidebar
participant "CreateWorkspace" as Create
participant "Modal" as Modal
participant "WorkspaceForm" as Form
participant "createWorkspace" as Action
participant "Prisma" as Prisma
database "PostgreSQL" as DB

User -> Sidebar : View sidebar
Sidebar -> Create : Render (if PRO)

User -> Create : Click "Create Workspace"
Create -> Modal : Open modal

Modal -> Form : Render form
User -> Form : Enter workspace name
User -> Form : Submit

Form -> Action : createWorkspace(name)
Action -> Action : Get Clerk user

Action -> Prisma : findUnique({ clerkId, subscription })
Prisma -> DB : SELECT subscription.plan
DB --> Prisma : { plan: 'PRO' }
Prisma --> Action : User with subscription

alt Subscription is PRO
  Action -> Prisma : user.update({ workspace: { create } })
  Prisma -> DB : INSERT INTO WorkSpace (name, type='PUBLIC', userId)
  DB --> Prisma : Created workspace
  Prisma --> Action : Updated user
  Action --> Form : { status: 201, data: 'Workspace Created' }
  Form -> Modal : Close modal
  Modal --> User : Show success, refresh list
else Subscription is FREE
  Action --> Form : { status: 401, data: 'Not authorized' }
  Form --> User : Show error message
end

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
  * clerkId : String <<unique>>
}

entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  * name : String
  * type : Type (PERSONAL|PUBLIC)
  userId : UUID <<FK>>
  * createdAt : DateTime
}

entity "Subscription" as subscription {
  * id : UUID <<PK>>
  --
  * plan : SUBSCRIPTION_PLAN
  userId : UUID <<FK>>
}

user ||--o{ workspace : "owns"
user ||--o| subscription : "has"

note right of workspace
  PRO users create PUBLIC workspaces
  All users get one PERSONAL workspace
end note

@enduml
```

---

## Code References

### CreateWorkspace Component

**File:** `crystal-web-app/src/components/global/create-workspace.tsx`

```typescript
function CreateWorkspace() {
  const { data } = useQueryData(['user-workspaces'], getWorkSpaces)
  const { data: plan } = data as { data: { subscription: { plan: SubscriptionPlan } } }

  // Only render for PRO users
  if (plan?.subscription?.plan !== 'PRO') {
    return null
  }

  return (
    <Modal
      trigger={<Button><Add /> Create Workspace</Button>}
      title="Create Workspace"
      description="Create a new workspace for your team"
    >
      <WorkspaceForm />
    </Modal>
  )
}
```

### createWorkspace Server Action

**File:** `crystal-web-app/src/actions/workspace.ts`

```typescript
export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const authorized = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { subscription: { select: { plan: true } } },
    })
    
    if (authorized?.subscription?.plan === 'PRO') {
      const workspace = await client.user.update({
        where: { clerkId: user.id },
        data: {
          workspace: {
            create: { name, type: 'PUBLIC' },
          },
        },
      })
      if (workspace) return { status: 201, data: 'Workspace Created' }
    }
    
    return { status: 401, data: 'You are not authorized to create a workspace.' }
  } catch (error) {
    return { status: 400 }
  }
}
```

