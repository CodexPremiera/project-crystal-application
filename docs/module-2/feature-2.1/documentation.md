# Feature 2.1: View Subscription Plan and Billing Information

## Features Covered

| #   | Feature                                                       | Actor |
|-----|---------------------------------------------------------------|-------|
| 2.1 | User can view their subscription plan and billing information | User  |

## Overview

This feature allows authenticated users to view their current subscription plan and billing information. The billing page displays the subscription type (FREE or PRO) and the associated monthly cost.

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "User" as user

rectangle "Crystal Application" {
  usecase "View Billing Page" as UC1
  usecase "Display Subscription Plan" as UC2
  usecase "Display Monthly Cost" as UC3
  usecase "Fetch Payment Info" as UC4
}

user --> UC1
UC1 --> UC4 : <<include>>
UC4 --> UC2 : <<include>>
UC4 --> UC3 : <<include>>

@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-2.1 |
| **Use Case Name** | View Subscription Plan and Billing Information |
| **Actor(s)** | User |
| **Description** | An authenticated user views their current subscription plan and billing details on the billing page. |
| **Preconditions** | User is authenticated and has a subscription record |
| **Trigger** | User clicks "Billing" in the sidebar navigation |
| **Main Flow** | 1. User clicks "Billing" in sidebar menu<br>2. System navigates to /dashboard/{workspaceId}/billing<br>3. System calls getPaymentInfo server action<br>4. System queries user's subscription data<br>5. Page renders with subscription plan and monthly cost<br>6. User sees their plan (FREE or PRO) and price ($0 or $99) |
| **Alternative Flows** | **A1: No subscription found**<br>4a. System returns error<br>4b. Page shows error or default state |
| **Postconditions** | User sees their current subscription status |
| **Exceptions** | Database unavailable; User not authenticated |

---

## Activity Diagram

![Activity Diagram](./activity.png)

```plantuml
@startuml
skinparam ActivityBackgroundColor #f8f9fa
skinparam ActivityBorderColor #343a40

start

:User clicks "Billing" in sidebar;

:Navigate to /dashboard/{workspaceId}/billing;

:BillingPage component loads;

:Call getPaymentInfo();

:Get current user from Clerk;

if (User authenticated?) then (yes)
  :Query Subscription table;
  
  if (Subscription found?) then (yes)
    :Return subscription data;
    :Render billing page;
    
    if (Plan is PRO?) then (yes)
      :Display "$99/Month";
      :Display "PRO" label;
    else (no)
      :Display "$0/Month";
      :Display "FREE" label;
    endif
  else (no)
    :Return error;
    :Show error state;
  endif
else (no)
  :Redirect to sign-in;
  stop
endif

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `BillingPage` | Billing information page | Display subscription and pricing | Next.js Server Component |
| `Sidebar` | Navigation sidebar | Provides link to billing page | React Client Component |
| `SidebarItem` | Navigation menu item | Billing menu entry | React Component |

### Backend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `getPaymentInfo` | Payment info fetcher | Query user's subscription | Server Action |
| `UserService.getSubscription` | Subscription query | Get subscription plan from DB | Service Function |

### External Services

| Service | Description | Purpose | Type |
|---------|-------------|---------|------|
| `PostgreSQL` | Database | Store subscription data | Database |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2

package "Frontend (Next.js)" {
  [Sidebar] as sidebar
  [SidebarItem] as sidebarItem
  [BillingPage] as billingPage
}

package "Backend (Server Actions)" {
  [getPaymentInfo] as getPayment
  [UserService] as userService
}

package "Data Layer" {
  [Prisma Client] as prisma
  database "PostgreSQL" as db {
    [User]
    [Subscription]
  }
}

sidebar --> sidebarItem : contains
sidebarItem --> billingPage : navigates to
billingPage --> getPayment : calls
getPayment --> userService : delegates
userService --> prisma : queries
prisma --> db : SELECT

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor User
participant "Sidebar" as Sidebar
participant "BillingPage" as Billing
participant "getPaymentInfo" as Action
participant "UserService" as Service
participant "Prisma" as Prisma
database "PostgreSQL" as DB

User -> Sidebar : Click "Billing"
Sidebar -> Billing : Navigate to /billing

Billing -> Action : getPaymentInfo()
Action -> Action : withAuth(handler)
Action -> Action : Get Clerk user

Action -> Service : getSubscription(clerkId)
Service -> Prisma : findUnique({ clerkId })

Prisma -> DB : SELECT subscription.plan\nFROM User u\nJOIN Subscription s ON u.id = s.userId\nWHERE u.clerkId = ?

DB --> Prisma : { plan: 'FREE' | 'PRO' }
Prisma --> Service : Subscription data
Service --> Action : { subscription: { plan } }
Action --> Billing : { data: { subscription } }

Billing -> Billing : Render billing info
Billing -> User : Display plan and price

@enduml
```

---

## ERD and Schema

### Relevant Tables

```plantuml
@startuml
skinparam linetype ortho

entity "User" as user {
  * id : UUID <<PK>>
  --
  * clerkId : String <<unique>>
  * email : String
}

entity "Subscription" as subscription {
  * id : UUID <<PK>>
  --
  * plan : SUBSCRIPTION_PLAN
  userId : UUID <<FK>> <<unique>>
  customerId : String?
  * createdAt : DateTime
  * updatedAt : DateTime
}

user ||--o| subscription : "has"

@enduml
```

### Prisma Schema

```prisma
model Subscription {
  id         String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  User       User?             @relation(fields: [userId], references: [id])
  userId     String?           @unique @db.Uuid
  createdAt  DateTime          @default(now())
  plan       SUBSCRIPTION_PLAN @default(FREE)
  updatedAt  DateTime          @default(now())
  customerId String?           @unique
}

enum SUBSCRIPTION_PLAN {
  PRO
  FREE
}
```

---

## Code References

### Billing Page

**File:** `crystal-web-app/src/app/dashboard/[workspaceid]/billing/page.tsx`

```typescript
const BillingPage = async () => {
  const payment = await getPaymentInfo()

  return (
    <div className="bg-[#1D1D1D] flex flex-col gap-y-8 p-5 rounded-xl">
      <div>
        <h2 className="text-2xl">Current Plan</h2>
        <p className="text-[#9D9D9D]">Your Payment History</p>
      </div>
      <div>
        <h2 className="text-2xl">
          ${payment?.data?.subscription?.plan === 'PRO' ? '99' : '0'}/Month
        </h2>
        <p className="text-[#9D9D9D]">{payment?.data?.subscription?.plan}</p>
      </div>
    </div>
  )
}
```

### getPaymentInfo Server Action

**File:** `crystal-web-app/src/actions/user.ts`

```typescript
export const getPaymentInfo = async () => {
  return withAuth(async (clerkUser) => {
    const payment = await UserService.getSubscription(clerkUser.id)
    if (!payment) throw new Error('Payment info not found')
    return payment
  })
}
```

### UserService.getSubscription

**File:** `crystal-web-app/src/services/user.service.ts`

```typescript
async getSubscription(clerkId: string) {
  return client.user.findUnique({
    where: { clerkId },
    select: {
      subscription: {
        select: { plan: true },
      },
    },
  })
}
```

