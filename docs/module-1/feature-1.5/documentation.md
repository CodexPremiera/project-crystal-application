# Feature 1.5: User Sign Out

## Features Covered

| #   | Feature                              | Actor |
|-----|--------------------------------------|-------|
| 1.5 | User can sign out of the web application | User  |

## Overview

This feature allows authenticated users to sign out of the web application. The sign-out process terminates the user's session and clears authentication cookies, returning them to a public state.

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "User" as user
actor "Clerk" as clerk <<external>>

rectangle "Crystal Application" {
  usecase "Sign Out of Web App" as UC1
  usecase "Terminate Session" as UC2
  usecase "Clear Cookies" as UC3
  usecase "Redirect to Home" as UC4
}

user --> UC1
UC1 --> UC2 : <<include>>
UC2 --> clerk
UC2 --> UC3 : <<include>>
UC3 --> UC4 : <<include>>

@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-1.5 |
| **Use Case Name** | User Sign Out of Web Application |
| **Actor(s)** | User, Clerk (external) |
| **Description** | An authenticated user signs out of the web application, terminating their session. |
| **Preconditions** | User is currently authenticated |
| **Trigger** | User clicks the sign-out option in the UserButton menu |
| **Main Flow** | 1. User clicks UserButton in the header<br>2. User selects "Sign Out" from dropdown<br>3. Clerk terminates the user session<br>4. Clerk clears authentication cookies<br>5. User is redirected to home/sign-in page |
| **Postconditions** | User session terminated; Authentication cookies cleared; User on public page |
| **Exceptions** | Network error during sign-out (session may remain on server) |

---

## Activity Diagram

![Activity Diagram](./activity.png)

```plantuml
@startuml
skinparam ActivityBackgroundColor #f8f9fa
skinparam ActivityBorderColor #343a40

start

:User clicks UserButton;

:UserButton dropdown opens;

:User clicks "Sign Out";

:Clerk terminates session;

:Clear authentication cookies;

:Redirect to home page;

stop

@enduml
```

---

## Component List

### Frontend Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `UserButton` | Clerk's user menu component | Display user avatar with sign-out option | Clerk React Component |
| `Infobar` | Top navigation bar | Contains the UserButton | React Client Component |

### External Services

| Service | Description | Purpose | Type |
|---------|-------------|---------|------|
| `Clerk` | Authentication provider | Handle session termination | External SaaS |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2

package "Frontend (Next.js)" {
  [Infobar] as infobar
  [UserButton] as userBtn
}

cloud "Clerk" {
  [Session Manager] as session
  [Cookie Manager] as cookies
}

cloud "Browser" {
  [Session Storage] as storage
}

infobar --> userBtn : contains
userBtn --> session : signOut()
session --> cookies : clear auth cookies
cookies --> storage : remove tokens

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor User
participant "Infobar" as Infobar
participant "UserButton" as UserBtn
participant "Clerk" as Clerk
participant "Browser" as Browser

User -> Infobar : View header
Infobar -> UserBtn : Render UserButton
User -> UserBtn : Click avatar
UserBtn -> User : Show dropdown menu
User -> UserBtn : Click "Sign Out"
UserBtn -> Clerk : signOut()
Clerk -> Browser : Clear session cookies
Clerk -> Browser : Clear local storage tokens
Clerk --> UserBtn : Sign out complete
UserBtn -> Browser : Redirect to /
Browser -> User : Display home page

@enduml
```

---

## ERD and Schema

*This feature does not interact with the database. Session management is handled entirely by Clerk.*

---

## Code References

### Infobar with UserButton

**File:** `crystal-web-app/src/components/global/infobar.tsx`

```typescript
import { UserButton } from "@clerk/nextjs";

function Infobar() {
  return (
    <header className="...">
      <div className="flex items-center gap-4">
        {/* Other buttons */}
        <UserButton />  {/* Sign-out is built into this component */}
      </div>
    </header>
  )
}
```

The `UserButton` component from Clerk automatically provides:
- User avatar display
- Dropdown menu with account options
- "Sign Out" action that handles session termination
- Redirect after sign-out

