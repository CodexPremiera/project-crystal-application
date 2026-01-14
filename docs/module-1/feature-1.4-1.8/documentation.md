# Feature 1.4 & 1.8: User Sign In and Data Sync

## Features Covered

| #   | Feature                                                       | Actor  |
|-----|---------------------------------------------------------------|--------|
| 1.4 | User can sign in to the web application                       | User   |
| 1.8 | System validates and syncs user data between Clerk and database | System |

## Overview

This feature group covers the web application sign-in flow. When an existing user signs in through Clerk authentication, the system automatically validates their database record and synchronizes any profile changes (such as updated name or profile picture) from Clerk to the database.

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "User" as user
actor "Clerk" as clerk <<external>>
actor "Database" as db <<system>>

rectangle "Crystal Application" {
  usecase "Sign In to Web App" as UC1
  usecase "Authenticate with Clerk" as UC2
  usecase "Validate User Record" as UC3
  usecase "Sync User Data" as UC4
  usecase "Redirect to Dashboard" as UC5
}

user --> UC1
UC1 --> UC2 : <<include>>
UC2 --> clerk
UC2 --> UC3 : <<include>>
UC3 --> UC4 : <<include>>
UC3 --> db
UC4 --> UC5 : <<include>>

@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-1.4 |
| **Use Case Name** | User Sign In to Web Application |
| **Actor(s)** | User, Clerk (external), System |
| **Description** | An existing user signs into the web application using Clerk authentication, and the system validates and syncs their data. |
| **Preconditions** | User has an existing Clerk account |
| **Trigger** | User clicks "Sign In" and submits credentials |
| **Main Flow** | 1. User navigates to sign-in page<br>2. Clerk presents sign-in form<br>3. User enters email and password<br>4. Clerk validates credentials<br>5. Clerk creates session and redirects to callback<br>6. System calls `onAuthenticateUser`<br>7. System finds user by clerkId<br>8. System returns user data with workspaces<br>9. System redirects to first workspace dashboard |
| **Alternative Flows** | **A1: Invalid credentials**<br>4a. Clerk displays error message<br>4b. User retries or resets password<br><br>**A2: ClerkId mismatch (dev/prod migration)**<br>7a. User not found by clerkId<br>7b. System finds user by email<br>7c. System updates clerkId and profile data<br>7d. System returns updated user |
| **Postconditions** | User is authenticated; Session is established; User data is synced; User views dashboard |
| **Exceptions** | Invalid credentials; Account locked; Database unavailable |

---

## Activity Diagram

![Activity Diagram](./activity.png)

```plantuml
@startuml
skinparam ActivityBackgroundColor #f8f9fa
skinparam ActivityBorderColor #343a40

start

:User navigates to /auth/sign-in;

:Clerk displays sign-in form;

:User enters credentials;

if (Credentials valid?) then (yes)
  :Clerk creates session;
  :Redirect to /auth/callback;
else (no)
  :Display error message;
  stop
endif

:Call onAuthenticateUser();

:Get current user from Clerk;

if (User exists by clerkId?) then (yes)
  :Return user data;
else (no)
  if (User exists by email?) then (yes)
    :Update clerkId;
    :Update profile data (name, image);
    :Return updated user;
  else (no)
    :Create new user (first-time sign-in);
  endif
endif

:Redirect to /dashboard/{workspaceId};

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `SignInPage` | Renders Clerk's SignIn component | Display the sign-in form | Next.js Page Component |
| `AuthCallbackPage` | Post-authentication handler | Process auth and route user | Next.js Server Component |
| `ClerkProvider` | Authentication context wrapper | Provide Clerk context | React Context Provider |

### Backend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `onAuthenticateUser` | Authentication processor | Validate and sync user data | Server Action |
| `UserService.findByClerkId` | User lookup | Find user by Clerk ID | Service Function |
| `UserService.updateClerkId` | Sync handler | Update clerkId for migrations | Service Function |

### External Services

| Service | Description | Purpose | Type |
|---------|-------------|---------|------|
| `Clerk` | Authentication provider | Handle identity and sessions | External SaaS |
| `PostgreSQL` | Database | Store user data | Database |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2
skinparam packageStyle rectangle

package "Frontend (Next.js)" {
  [SignInPage] as signin
  [AuthCallbackPage] as callback
}

package "Backend (Server Actions)" {
  [onAuthenticateUser] as authAction
  [UserService] as userService
}

package "Data Layer" {
  [Prisma Client] as prisma
  database "PostgreSQL" as db
}

cloud "External Services" {
  [Clerk API] as clerk
}

signin --> clerk : authenticates
clerk --> callback : redirects
callback --> authAction : calls
authAction --> clerk : gets user data
authAction --> userService : validates/syncs
userService --> prisma : queries/updates
prisma --> db : read/write

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor User
participant "SignInPage" as SignIn
participant "Clerk" as Clerk
participant "AuthCallbackPage" as Callback
participant "onAuthenticateUser" as Auth
participant "Prisma Client" as Prisma
database "PostgreSQL" as DB

User -> SignIn : Navigate to /auth/sign-in
SignIn -> Clerk : Render SignIn component
Clerk -> User : Display sign-in form
User -> Clerk : Submit credentials
Clerk -> Clerk : Validate credentials

alt Valid credentials
  Clerk -> Callback : Redirect to /auth/callback
  Callback -> Auth : onAuthenticateUser()
  Auth -> Clerk : currentUser()
  Clerk --> Auth : Return Clerk user data
  
  Auth -> Prisma : findUnique({ clerkId })
  Prisma -> DB : SELECT * FROM User
  
  alt User found by clerkId
    DB --> Prisma : User record
    Prisma --> Auth : Existing user
  else User not found by clerkId (migration)
    Auth -> Prisma : findUnique({ email })
    Prisma -> DB : SELECT * FROM User WHERE email
    DB --> Prisma : User record
    Auth -> Prisma : update({ clerkId, profile })
    Prisma -> DB : UPDATE User SET clerkId, firstname, lastname, image
    DB --> Prisma : Updated user
    Prisma --> Auth : Synced user
  end
  
  Auth --> Callback : { status: 200, user }
  Callback -> User : Redirect to /dashboard/{workspaceId}
else Invalid credentials
  Clerk -> User : Display error message
end

@enduml
```

---

## ERD and Schema

*This feature uses the same User table as Feature 1.1-1.3. See that documentation for the complete ERD.*

### Relevant Fields for Data Sync

```prisma
model User {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  clerkId   String   @unique    // Updated during sync
  email     String   @unique    // Used as fallback lookup
  firstname String?             // Synced from Clerk
  lastname  String?             // Synced from Clerk
  image     String?             // Synced from Clerk
}
```

---

## Code References

### Data Sync Logic in onAuthenticateUser

**File:** `crystal-web-app/src/actions/user.ts`

```typescript
// If user exists with same email but different clerkId, update the clerkId
if (userByEmail) {
  const updatedUser = await client.user.update({
    where: { email: user.emailAddresses[0].emailAddress },
    data: {
      clerkId: user.id,           // Sync new clerkId
      firstname: user.firstName,   // Sync profile data
      lastname: user.lastName,
      image: user.imageUrl,
    },
    include: {
      workspace: true,
      subscription: { select: { plan: true } },
    },
  })
  return { status: 200, user: updatedUser }
}
```

