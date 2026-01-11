# Feature 1.6 & 1.7: Desktop App Authentication

## Features Covered

| #   | Feature                                                     | Actor  |
|-----|-------------------------------------------------------------|--------|
| 1.6 | User can sign in to the desktop app via browser-based authentication | User   |
| 1.7 | System generates a sign-in ticket for desktop app authentication | System |

## Overview

This feature group covers the desktop application authentication flow. Since the Electron desktop app cannot directly handle OAuth flows, users authenticate through their web browser. The system generates a short-lived sign-in ticket that the desktop app uses to establish a session via a custom protocol handler (`crystalapp://`).

---

## Use Case Diagram

![Use Case Diagram](./usecase.png)

```plantuml
@startuml
skinparam actorStyle awesome

left to right direction

actor "User" as user
actor "Clerk" as clerk <<external>>
actor "Desktop App" as desktop

rectangle "Crystal Web Application" {
  usecase "Click Sign In in Desktop" as UC0
  usecase "Sign In via Browser" as UC1
  usecase "Authenticate with Clerk" as UC2
  usecase "Authorize Desktop App" as UC3
  usecase "Generate Sign-In Ticket" as UC4
  usecase "Return Ticket to Desktop" as UC5
}

user --> UC0
UC0 --> UC1 : opens browser
UC1 --> UC2 : <<include>>
UC2 --> clerk
user --> UC3
UC3 --> UC4 : <<include>>
UC4 --> UC5 : <<include>>
UC5 --> desktop

@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-1.6 |
| **Use Case Name** | Desktop App Authentication via Browser |
| **Actor(s)** | User, Desktop App, Clerk (external), System |
| **Description** | A user authenticates the desktop application through a browser-based flow, receiving a sign-in ticket that the desktop app uses to establish a session. |
| **Preconditions** | Desktop app is installed; User has a Clerk account |
| **Trigger** | User clicks "Sign In" in the desktop app |
| **Main Flow** | 1. User clicks "Sign In" in desktop app<br>2. Desktop app opens browser to /auth/desktop-signin<br>3. If not signed in, redirect to Clerk sign-in<br>4. User signs in through Clerk<br>5. User sees authorization confirmation page<br>6. User clicks "Allow Sign In"<br>7. System calls /api/auth/desktop-ticket<br>8. System generates short-lived sign-in token via Clerk (60 seconds)<br>9. System redirects to crystalapp://auth/callback?ticket=...<br>10. Desktop app receives ticket and establishes session |
| **Alternative Flows** | **A1: User already signed in**<br>3a. Skip Clerk sign-in<br>3b. Show authorization confirmation directly<br><br>**A2: User cancels**<br>6a. User closes browser window<br>6b. Desktop app remains signed out |
| **Postconditions** | Desktop app has valid session; User can access recording features |
| **Exceptions** | Ticket generation fails; Ticket expires before use; Protocol handler not registered |

---

## Activity Diagram

![Activity Diagram](./activity.png)

```plantuml
@startuml
skinparam ActivityBackgroundColor #f8f9fa
skinparam ActivityBorderColor #343a40

start

:User clicks "Sign In" in Desktop App;

:Desktop app opens default browser;
:Navigate to /auth/desktop-signin;

if (User signed in to Clerk?) then (no)
  :Redirect to Clerk sign-in;
  :User enters credentials;
  :Clerk authenticates user;
  :Redirect back to desktop-signin;
else (yes)
endif

:Display authorization card;
:Show user info and app permissions;

if (User clicks "Allow Sign In"?) then (yes)
  :Set status to "loading";
  :POST /api/auth/desktop-ticket;
  
  if (Ticket generated successfully?) then (yes)
    :Set status to "success";
    :Wait 1 second for user feedback;
    :Redirect to crystalapp://auth/callback?ticket=...;
    :Desktop app protocol handler receives URL;
    :Desktop app exchanges ticket for session;
  else (no)
    :Set status to "error";
    :Display error message;
    stop
  endif
else (no)
  :User closes browser;
  stop
endif

stop

@enduml
```

---

## Component List

### Frontend Components (Web App)

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `DesktopSignInPage` | Authorization confirmation page | Display user info and authorize button | Next.js Client Component |
| `Card` | UI container | Display authorization prompt | Shadcn UI Component |
| `Button` | Action button | Trigger authorization flow | Shadcn UI Component |
| `SignedIn` / `SignedOut` | Clerk conditionals | Show/hide content based on auth state | Clerk React Components |
| `RedirectToSignIn` | Clerk redirect | Send unauthenticated users to sign-in | Clerk React Component |

### Backend Components (Web App)

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `POST /api/auth/desktop-ticket` | API route | Generate sign-in ticket | Next.js API Route |
| `clerkClient.signInTokens.createSignInToken` | Clerk SDK method | Create short-lived token | Clerk SDK |
| `auth()` | Clerk helper | Get current user ID | Clerk Next.js Helper |

### Desktop App Components

| Component | Description | Purpose | Type |
|-----------|-------------|---------|------|
| `ClerkProvider` | Auth context | Provide Clerk context to desktop app | Clerk React Component |
| Protocol Handler | System registration | Handle crystalapp:// URLs | Electron Main Process |

### External Services

| Service | Description | Purpose | Type |
|---------|-------------|---------|------|
| `Clerk` | Authentication provider | Generate and validate tokens | External SaaS |

---

## Component/Module Diagram

![Component Diagram](./component.png)

```plantuml
@startuml
skinparam componentStyle uml2

package "Desktop App (Electron)" {
  [Sign In Button] as desktopBtn
  [Protocol Handler] as protocol
  [ClerkProvider] as desktopClerk
}

package "Web App (Next.js)" {
  [DesktopSignInPage] as desktopPage
  [desktop-ticket API] as ticketApi
}

cloud "Clerk" {
  [Authentication] as clerkAuth
  [Token Service] as tokenService
}

cloud "Browser" {
  [Browser Window] as browser
}

desktopBtn --> browser : shell.openExternal()
browser --> desktopPage : navigates to /auth/desktop-signin
desktopPage --> clerkAuth : check authentication
desktopPage --> ticketApi : POST request
ticketApi --> tokenService : createSignInToken()
tokenService --> ticketApi : { token }
ticketApi --> browser : redirect to crystalapp://
browser --> protocol : protocol handler invoked
protocol --> desktopClerk : signIn with ticket

@enduml
```

---

## Sequence Diagram

![Sequence Diagram](./sequence.png)

```plantuml
@startuml
skinparam sequenceArrowThickness 2

actor User
participant "Desktop App" as Desktop
participant "Browser" as Browser
participant "DesktopSignInPage" as Page
participant "Clerk" as Clerk
participant "desktop-ticket API" as API

User -> Desktop : Click "Sign In"
Desktop -> Browser : Open /auth/desktop-signin

Browser -> Page : Load page
Page -> Clerk : Check authentication

alt Not signed in
  Clerk -> Browser : Redirect to /auth/sign-in
  User -> Clerk : Enter credentials
  Clerk -> Clerk : Validate and create session
  Clerk -> Browser : Redirect back to /auth/desktop-signin
  Browser -> Page : Reload with session
end

Page -> Page : Render authorization card
Page -> User : Display user info and "Allow Sign In" button

User -> Page : Click "Allow Sign In"
Page -> Page : setStatus("loading")

Page -> API : POST /api/auth/desktop-ticket
API -> Clerk : auth()
Clerk --> API : { userId }

API -> Clerk : createSignInToken({ userId, expiresInSeconds: 60 })
Clerk --> API : { token }

API --> Page : { ticket: token }
Page -> Page : setStatus("success")

Page -> Page : setTimeout(1000)
Page -> Browser : window.location.href = crystalapp://auth/callback?ticket=...

Browser -> Desktop : Protocol handler receives URL
Desktop -> Desktop : Extract ticket from URL
Desktop -> Clerk : Exchange ticket for session
Clerk --> Desktop : Session established

Desktop -> User : Show authenticated UI

@enduml
```

---

## ERD and Schema

*This feature does not directly interact with the database. The sign-in ticket is managed entirely by Clerk and stored temporarily in their infrastructure.*

---

## Code References

### Desktop Sign-In Page

**File:** `crystal-web-app/src/app/auth/desktop-signin/page.tsx`

```typescript
export default function DesktopSignInPage() {
  const { user, isLoaded } = useUser();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleAuthorize = async () => {
    setStatus("loading");

    try {
      const response = await fetch("/api/auth/desktop-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to generate ticket");

      const { ticket } = await response.json();
      setStatus("success");

      setTimeout(() => {
        window.location.href = `crystalapp://auth/callback?ticket=${encodeURIComponent(ticket)}`;
      }, 1000);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <Card>
          <CardHeader>
            <CardTitle>Sign in to Crystal Desktop</CardTitle>
          </CardHeader>
          <CardContent>
            {/* User info display */}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAuthorize}>
              Allow Sign In
            </Button>
          </CardFooter>
        </Card>
      </SignedIn>
    </>
  );
}
```

### Desktop Ticket API Route

**File:** `crystal-web-app/src/app/api/auth/desktop-ticket/route.ts`

```typescript
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const ticket = await client.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: 60,  // Short-lived for security
    });

    return NextResponse.json({ ticket: ticket.token });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate ticket" }, { status: 500 });
  }
}
```

