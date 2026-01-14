# Features 13.1-13.4: Content Search

## Features Covered
| #    | Feature/Transaction                                               | Actor  |
|------|-------------------------------------------------------------------|--------|
| 13.1 | User can search across all content (workspaces, folders, videos)  | User   |
| 13.2 | User can search videos by title or description                    | User   |
| 13.3 | User can perform quick search with real-time dropdown suggestions | User   |
| 13.4 | System limits search results to user-accessible content           | System |

---

## Use Case Diagram

```plantuml
@startuml
left to right direction

actor "User" as user
actor "System" as system

rectangle "Content Search" {
  usecase "Focus Search Input" as UC1
  usecase "Type Search Query" as UC2
  usecase "Debounce Input" as UC3
  usecase "Call Quick Search API" as UC4
  usecase "Get Accessible Workspaces" as UC5
  usecase "Search Workspaces" as UC6
  usecase "Search Folders" as UC7
  usecase "Search Videos" as UC8
  usecase "Apply Fuzzy Matching" as UC9
  usecase "Display Dropdown Results" as UC10
  usecase "Navigate to Result" as UC11
  usecase "Show Recent Searches" as UC12
}

user --> UC1
user --> UC2
user --> UC11
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<include>>
UC5 ..> UC6 : <<include>>
UC5 ..> UC7 : <<include>>
UC5 ..> UC8 : <<include>>
UC8 ..> UC9 : <<include>>
UC9 ..> UC10 : <<include>>
UC1 ..> UC12 : <<include>>
system --> UC3
system --> UC4
system --> UC5
system --> UC9
@enduml
```

---

## Use Case Description

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-13.1-13.4 |
| **Use Case Name** | Content Search with Access Control |
| **Actor(s)** | User, System |
| **Description** | User searches across workspaces, folders, and videos. System limits results to user-accessible content and provides real-time suggestions. |
| **Preconditions** | 1. User is authenticated<br>2. User has workspaces/content |
| **Postconditions** | 1. Relevant results displayed<br>2. User can navigate to result |
| **Main Flow** | 1. User focuses search input<br>2. System shows recent searches<br>3. User types query (min 2 chars)<br>4. System debounces input (300ms)<br>5. System calls quickSearch API (13.3)<br>6. System gets user's accessible workspaces (13.4)<br>7. System searches workspaces, folders, videos (13.1)<br>8. System applies Fuse.js fuzzy matching<br>9. System displays dropdown with results<br>10. User clicks result to navigate |
| **Alternative Flows** | A1: Query < 2 chars → Show recent searches<br>A2: No results → Show empty state |

---

## Activity Diagram

```plantuml
@startuml
start

:User focuses search input;

if (Query empty?) then (yes)
  :Show recent searches;
else (no)
endif

:User types search query;

:Debounce input (300ms);

if (Query length >= 2?) then (yes)
  :Set loading state;
  
  :Call quickSearch API;
  
  :Authenticate user;
  
  :Get user's accessible workspaces;
  
  note right
    Accessible = owned OR
    member of workspace
  end note
  
  :Extract workspace IDs;
  
  fork
    :Search videos (13.2);
    note right: title OR description
  fork again
    :Search folders;
    note right: name
  fork again
    :Search workspaces;
    note right: name
  end fork
  
  :Combine results (max 8 for quick);
  
  :Apply Fuse.js fuzzy ranking;
  
  :Display dropdown results (13.3);
  
  if (User clicks result?) then (yes)
    :Save to recent searches;
    
    :Navigate to result page;
    stop
  else (no)
    :Continue typing or close;
    stop
  endif
else (no)
  :Clear results;
  
  :Show recent searches;
  stop
endif

@enduml
```

---

## Component List

### Frontend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| SearchDropdown | `src/components/global/search/search-dropdown.tsx` | Search input with dropdown | Search Component |
| Input | `src/components/ui/input.tsx` | Text input | UI Component |

### Hooks

| Hook | File Path | Description |
|------|-----------|-------------|
| useDebounce | `src/hooks/useDebounce.ts` | Debounces search input |
| useRecentSearches | `src/hooks/useRecentSearches.ts` | Manages recent search history |

### Backend Components

| Component | File Path | Description | Type |
|-----------|-----------|-------------|------|
| quickSearch | `src/actions/search.ts` | Fast search with limit | Server Action |
| searchContent | `src/actions/search.ts` | Full content search | Server Action |
| searchVideos | `src/actions/search.ts` | Video-only search | Server Action |
| searchFolders | `src/actions/search.ts` | Folder-only search | Server Action |
| searchWorkspaces | `src/actions/search.ts` | Workspace-only search | Server Action |

---

## Component/Module Diagram

```plantuml
@startuml
package "Header" {
  [SearchDropdown] as SD
  [Input] as INP
}

package "Dropdown Content" {
  [Recent Searches] as RS
  [Search Results] as SR
  [Result Icons] as RI
}

package "Hooks" {
  [useDebounce] as UD
  [useRecentSearches] as URS
}

package "Libraries" {
  [Fuse.js] as FUSE
}

package "Server Actions" {
  [quickSearch] as QS
  [searchContent] as SC
  [searchVideos] as SV
  [searchFolders] as SF
}

package "Database" {
  [Prisma Client] as PC
  database "PostgreSQL" {
    [WorkSpace] as WS
    [Folder] as FD
    [Video] as VD
  }
}

SD --> INP : contains
SD --> RS : shows on focus
SD --> SR : shows results
SR --> RI : type icons

SD --> UD : debounce query
SD --> URS : manage history
SD --> FUSE : fuzzy ranking

SD --> QS : calls
QS --> PC : queries
SC --> PC : queries
SV --> PC : queries
SF --> PC : queries

PC --> WS : SELECT
PC --> FD : SELECT
PC --> VD : SELECT
@enduml
```

---

## Sequence Diagram

```plantuml
@startuml
actor "User" as user
participant "SearchDropdown" as search
participant "useDebounce" as debounce
participant "quickSearch" as api
participant "Prisma" as prisma
database "PostgreSQL" as db
participant "Fuse.js" as fuse

user -> search: Focus input
search --> user: Show recent searches

user -> search: Type "demo"
search -> debounce: setQuery("demo")
debounce -> debounce: Wait 300ms
debounce --> search: debouncedQuery = "demo"

search -> api: quickSearch("demo")
activate api

api -> api: Authenticate user
api -> prisma: Get accessible workspaces
note right: WHERE userId = X\nOR member of
prisma -> db: SELECT workspaces
db --> prisma: workspace IDs

api -> prisma: Search videos (13.2)
note right: title ILIKE '%demo%'\nOR description ILIKE '%demo%'
prisma -> db: SELECT videos LIMIT 5
db --> prisma: videos

api -> prisma: Search folders
prisma -> db: SELECT folders LIMIT 3
db --> prisma: folders

api --> search: { data: results[] }
deactivate api

search -> fuse: Fuzzy rank results
fuse --> search: Sorted by relevance

search --> user: Display dropdown (13.3)

user -> search: Click result
search -> search: addRecentSearch()
search --> user: Navigate to page
@enduml
```

---

## ERD and Schema

```plantuml
@startuml
entity "WorkSpace" as workspace {
  * id : UUID <<PK>>
  --
  name : String
  userId : UUID <<FK>>
}

entity "Folder" as folder {
  * id : UUID <<PK>>
  --
  name : String
  workSpaceId : UUID <<FK>>
}

entity "Video" as video {
  * id : UUID <<PK>>
  --
  title : String?
  description : String?
  source : String
  workSpaceId : UUID <<FK>>
  folderId : UUID? <<FK>>
}

entity "Member" as member {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK>>
  workSpaceId : UUID <<FK>>
}

note right of video
  Search fields:
  - title (ILIKE)
  - description (ILIKE)
  
  Access control (13.4):
  workSpaceId IN
  (owned OR member of)
end note

workspace ||--o{ folder : "contains"
workspace ||--o{ video : "contains"
workspace ||--o{ member : "has"
folder ||--o{ video : "contains"
@enduml
```

### Search Result Types

| Type | Icon | Fields Searched |
|------|------|-----------------|
| workspace | Building2 | name |
| folder | Folder | name |
| video | Video | title, description |

### Quick Search Limits

| Type | Max Results |
|------|-------------|
| Videos | 5 |
| Folders | 3 |
| Workspaces | 3 |
| **Total** | **8** |

### Access Control Logic (13.4)

```typescript
// Get user's accessible workspaces
const userWorkspaces = await client.workSpace.findMany({
  where: {
    OR: [
      { userId: auth.user.id },  // Owned
      { 
        members: {
          some: {
            userId: auth.user.id,
            member: true           // Member of
          }
        }
      }
    ]
  }
})
```

