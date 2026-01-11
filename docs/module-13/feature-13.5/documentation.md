# Feature 13.5: User Search

## Features Covered
| #    | Feature/Transaction                        | Actor |
|------|--------------------------------------------|-------|
| 13.5 | User can search for other users to invite  | User  |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "User Search" {
  usecase "Open Invite Dialog" as UC1
  usecase "Type User Name/Email" as UC2
  usecase "Debounce Input" as UC3
  usecase "Call Search Users API" as UC4
  usecase "Display User Results" as UC5
  usecase "Select User to Invite" as UC6
  usecase "Send Invitation" as UC7
}

user --> UC1
user --> UC2
user --> UC6
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<include>>
UC6 ..> UC7 : <<include>>
system --> UC3
system --> UC4
system --> UC5
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-13.5 |
| **Use Case Name** | Search Users for Invitation |
| **Actor(s)** | User |
| **Description** | User searches for other users by name or email to invite them to a workspace. |
| **Preconditions** | 1. User is authenticated<br>2. User owns a public workspace<br>3. User has invite dialog open |
| **Postconditions** | 1. Matching users displayed<br>2. User can select and invite |
| **Main Flow** | 1. User opens invite members dialog<br>2. User types name or email in search<br>3. System debounces input<br>4. System calls searchUsers API<br>5. System displays matching users<br>6. User clicks on user to invite<br>7. System sends invitation |
| **Alternative Flows** | A1: No results → Show "No users found" |
| **Exceptions** | E1: User already member → Prevent invite |

---

## Activity Diagram

```plantuml
@startuml
start

:User opens Invite Members dialog;

:User types in search field;

:Debounce input;

if (Query length > 0?) then (yes)
  :Call searchUsers API;
  
  :Authenticate current user;
  
  :Query users by name or email;
  
  note right
    Search fields:
    - firstname
    - lastname
    - email
    
    Excludes:
    - Current user
  end note
  
  if (Users found?) then (yes)
    :Display user list;
    
    :Show avatar, name, email;
    
    if (User clicks on result?) then (yes)
      :Call inviteMembers;
      
      :Create invitation;
      
      :Show success toast;
      stop
    else (no)
      :Continue searching;
      stop
    endif
  else (no)
    :Show "No users found";
    stop
  endif
else (no)
  :Clear results;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| Invite Dialog | `src/components/global/invite/index.tsx` | Invite members dialog | Dialog Component |
| Search Input | `src/components/ui/input.tsx` | User search input | UI Component |
| User List | Inline | Displays search results | List Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useSearch | `src/hooks/useSearch.ts` | Manages user search with debounce |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| searchUsers | `src/actions/user.ts` | Searches users | Server Action |
| UserService.search | `src/services/user.service.ts` | Database query | Service |

---

## Component/Module Diagram

```plantuml
@startuml
package "Invite Dialog" {
  [Invite Component] as IC
  [Search Input] as SI
  [User Results List] as URL
}

package "Hooks" {
  [useSearch] as US
  [useDebounce] as UD
}

package "Server Actions" {
  [searchUsers] as SU
  [inviteMembers] as IM
}

package "Services" {
  [UserService] as URS
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [User] as UT
  }
}

IC --> SI : contains
IC --> URL : displays
SI --> US : triggers

US --> UD : debounces
US --> SU : calls

SU --> URS : uses
URS --> PC : query
PC --> UT : SELECT

URL --> IM : on select
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "Invite Dialog" as dialog
participant "useSearch" as hook
participant "searchUsers" as action
participant "UserService" as service
participant "Prisma" as prisma
database "PostgreSQL" as db
participant "inviteMembers" as invite

user -> dialog: Open dialog
dialog --> user: Show search input

user -> dialog: Type "john"
dialog -> hook: onSearchQuery("john")

hook -> hook: Debounce input
hook -> action: searchUsers("john")
activate action

action -> service: search("john", currentUserId)
service -> prisma: user.findMany()
note right: WHERE firstname ILIKE '%john%'\nOR lastname ILIKE '%john%'\nOR email ILIKE '%john%'\nAND id != currentUserId

prisma -> db: SELECT users
db --> prisma: User[]

service --> action: users
action --> hook: { status: 200, data: users }
deactivate action

hook --> dialog: setOnUsers(users)
dialog --> user: Display user results

user -> dialog: Click on "John Doe"
dialog -> invite: inviteMembers(workspaceId, userId)

invite --> dialog: { status: 200 }
dialog --> user: Show success toast
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
entity "User" as user {
  * id : UUID <<PK>>
  --
  firstname : String?
  lastname : String?
  email : String
  image : String?
  clerkId : String
}

note right of user
  Search fields:
  - firstname (ILIKE)
  - lastname (ILIKE)
  - email (ILIKE)
  
  Display fields:
  - firstname + lastname
  - email
  - image (avatar)
end note
@enduml
```

### useSearch Hook

```typescript
export const useSearch = (key: string, type: 'USERS') => {
  const [query, setQuery] = useState('')
  const [debounce, setDebounce] = useState('')
  const [onUsers, setOnUsers] = useState<User[] | undefined>()

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => setDebounce(query), 500)
    return () => clearTimeout(timer)
  }, [query])

  // Fetch when debounce changes
  useEffect(() => {
    if (debounce) {
      searchUsers(debounce).then(res => {
        if (res.status === 200) setOnUsers(res.data)
      })
    } else {
      setOnUsers(undefined)
    }
  }, [debounce])

  return { query, setQuery, onUsers }
}
```

### User Search Exclusions

| Exclusion | Reason |
|-----------|--------|
| Current user | Can't invite yourself |
| Existing members | Already in workspace (checked at invite time) |
| Pending invites | Already invited (checked at invite time) |

