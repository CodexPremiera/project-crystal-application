# Crystal Application - Software Requirements Specification

---

## 1. Introduction

### 1.1. Purpose

The purpose of this document is to provide a detailed description of the Crystal system, a screen recording and video management platform with integrated AI-powered processing capabilities. This document serves as a reference for developers, project managers, and stakeholders to ensure alignment with functional and non-functional requirements. It outlines the system's scope, features, constraints, and technical specifications necessary for development and deployment.

### 1.2. Scope

Crystal is a web and desktop-based application that enables users to record, upload, manage, and share video content within organized workspaces. The system provides real-time video streaming, AI-powered transcription and summarization, and collaborative workspace features. The system includes the following core functionalities:

- **User Authentication and Account Management** – Secure sign-up, sign-in, and profile management via Clerk authentication
- **Workspace Management** – Personal and public workspace creation, organization, and member collaboration
- **Video Recording** – Desktop application for screen capture with audio recording
- **Video Upload and Processing** – Web-based video upload with cloud storage integration
- **AI-Powered Features** – Automatic transcription, title generation, and summary creation using OpenAI
- **Video Organization** – Folder-based video management with search and discovery
- **Subscription and Billing** – Freemium model with PRO subscription via Stripe integration
- **Notifications System** – Real-time notifications for workspace activities and video interactions
- **Desktop Application** – Cross-platform Electron app with automatic updates

### 1.3. Definitions, Acronyms and Abbreviations

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface – A set of protocols for building and integrating application software |
| **AWS** | Amazon Web Services – Cloud computing platform providing storage and content delivery |
| **CDN** | Content Delivery Network – Distributed network for delivering web content with high performance |
| **CRUD** | Create, Read, Update, Delete – Basic operations for persistent storage |
| **FFmpeg** | Free and open-source software for handling multimedia data |
| **GPT** | Generative Pre-trained Transformer – AI language model used for text generation |
| **HTTP** | Hypertext Transfer Protocol – Foundation protocol for data communication on the web |
| **JWT** | JSON Web Token – Compact, URL-safe means of representing claims between parties |
| **ORM** | Object-Relational Mapping – Technique for converting data between incompatible type systems |
| **PRO User** | Premium subscriber with access to advanced features |
| **REST** | Representational State Transfer – Architectural style for distributed systems |
| **S3** | Simple Storage Service – AWS object storage service |
| **SDK** | Software Development Kit – Collection of development tools |
| **SRS** | Software Requirements Specification – Document describing system requirements |
| **SSR** | Server-Side Rendering – Technique for rendering web pages on the server |
| **UI** | User Interface – Visual elements users interact with |
| **UX** | User Experience – Overall experience of a person using the application |
| **WebSocket** | Protocol providing full-duplex communication channels over TCP |
| **Whisper** | OpenAI's automatic speech recognition system |
| **Workspace** | A container for organizing videos and folders, either personal or shared |

### 1.4. References

| Reference | Description |
|-----------|-------------|
| IEEE Std 830-1998 | IEEE Recommended Practice for Software Requirements Specifications |
| Next.js 14 Documentation | https://nextjs.org/docs – Framework documentation |
| Electron Documentation | https://www.electronjs.org/docs – Desktop framework documentation |
| Clerk Documentation | https://clerk.com/docs – Authentication service documentation |
| Stripe API Reference | https://stripe.com/docs/api – Payment integration reference |
| OpenAI API Reference | https://platform.openai.com/docs/api-reference – AI services documentation |
| AWS S3 Documentation | https://docs.aws.amazon.com/s3 – Cloud storage documentation |
| Prisma ORM Documentation | https://www.prisma.io/docs – Database ORM documentation |
| Socket.IO Documentation | https://socket.io/docs – Real-time communication library |

---

## 2. Overall Description

### 2.1. Product Perspective

Crystal is a standalone application that integrates multiple external APIs and services to deliver a comprehensive video management platform. The system follows a multi-tier client-server architecture supporting both web and desktop applications.

**System Context:**

| Integration | Purpose |
|-------------|---------|
| **Clerk** | Third-party authentication and user management |
| **Stripe** | Payment processing for PRO subscriptions |
| **OpenAI** | AI-powered transcription (Whisper) and text generation (GPT-3.5) |
| **AWS S3** | Cloud object storage for video files |
| **CloudFront** | CDN for global video streaming distribution |
| **Voiceflow** | AI knowledge base for video content search |
| **GitHub Releases** | Desktop application distribution and updates |

**Product Position:**
Crystal serves as a self-contained video management ecosystem that bridges the gap between screen recording, video hosting, and collaborative content sharing. Unlike simple screen recorders, Crystal provides end-to-end video lifecycle management with AI-enhanced productivity features.

### 2.2. User Characteristics

| Actor | Description | Technical Expertise |
|-------|-------------|---------------------|
| **General User** | Authenticated users who can upload videos, create personal workspaces, and interact with content. They have access to basic features under the FREE subscription tier. | Basic computer literacy; familiarity with web applications |
| **PRO User** | Premium subscribers with access to advanced features including AI transcription, HD recording quality, and public workspace creation. | Basic to intermediate; comfortable with subscription services |
| **Workspace Owner** | Users who create and manage public workspaces. They can invite members, manage folders, and control workspace settings. | Intermediate; familiar with team collaboration tools |
| **Workspace Member** | Users invited to participate in a public workspace. They can view content, upload videos, and comment on videos within the workspace. | Basic to intermediate |
| **Video Author** | Users who upload or record videos. They have edit and delete permissions for their own content. | Basic; familiar with video recording concepts |
| **System Administrator** | Technical staff responsible for system maintenance, monitoring, and troubleshooting. | Advanced; proficient in cloud services and system administration |

### 2.3. Operating Environment

| Environment | Specification |
|-------------|---------------|
| **Web Application** | Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) with JavaScript enabled |
| **Desktop Application** | Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+, Fedora 34+) |
| **Server Environment** | Node.js 18+ runtime, PostgreSQL 14+ database |
| **Cloud Infrastructure** | AWS for storage and CDN, Vercel for web app deployment |
| **Network** | Stable internet connection (minimum 5 Mbps for HD streaming) |

### 2.4. Constraints

| Category | Constraint |
|----------|------------|
| **Regulatory** | Compliance with GDPR for user data protection; adherence to payment card industry (PCI) standards via Stripe |
| **Hardware Limitations** | Desktop screen recording requires sufficient CPU/GPU for real-time encoding; minimum 4GB RAM recommended |
| **Software Dependencies** | Requires FFmpeg installation on Express server for video processing; Node.js runtime environment |
| **Third-Party Services** | System functionality depends on availability of Clerk, Stripe, OpenAI, and AWS services |
| **File Size Limits** | Video uploads limited to 500MB per file; audio files exceeding 25MB skip AI transcription |
| **Browser Constraints** | MediaRecorder API required for desktop app; WebSocket support required for real-time streaming |
| **Subscription Model** | Public workspace creation, HD recording, and AI features restricted to PRO subscribers |
| **Authentication** | All authenticated features require valid Clerk session; desktop app uses browser-based OAuth flow |
| **Storage** | Video storage costs scale with usage; S3 bucket policies must allow public read access via CloudFront |

### 2.5. Assumptions and Dependencies

**Assumptions:**

| ID | Assumption |
|----|------------|
| A1 | Users have access to a stable internet connection for video upload and streaming |
| A2 | Users have modern browsers that support ES6+ JavaScript and WebSocket connections |
| A3 | Desktop users have sufficient system resources (CPU, RAM, storage) for screen recording |
| A4 | Third-party services (Clerk, Stripe, OpenAI, AWS) maintain their current API contracts |
| A5 | Users consent to video storage in cloud infrastructure and AI processing of their content |
| A6 | Email delivery for notifications and invitations works reliably |
| A7 | Users understand the freemium model and feature limitations of FREE vs PRO tiers |

**Dependencies:**

| ID | Dependency | Impact if Unavailable |
|----|------------|----------------------|
| D1 | **Clerk Authentication** | Users cannot sign in or access protected features |
| D2 | **PostgreSQL Database** | Complete system failure; no data persistence |
| D3 | **AWS S3 Storage** | Video upload and storage non-functional |
| D4 | **CloudFront CDN** | Video playback degraded or unavailable |
| D5 | **OpenAI API** | AI transcription and summarization features disabled |
| D6 | **Stripe Payment Gateway** | PRO subscription purchases impossible |
| D7 | **GitHub Releases** | Desktop app automatic updates unavailable |
| D8 | **FFmpeg** | Video processing fails; no audio extraction for transcription |
| D9 | **Socket.IO Server** | Real-time video streaming from desktop app fails |

---

## 3. Specific Requirements

### 3.1. External Interface Requirements

#### 3.1.1. User Interfaces

| Interface | Description |
|-----------|-------------|
| **Web Dashboard** | Responsive React-based interface with Shadcn UI components and Tailwind CSS styling. Supports desktop and mobile viewports. |
| **Video Player** | Custom video player with playback controls, timestamp navigation, and transcript synchronization |
| **Desktop Control Panel** | Electron-based floating panel for recording controls, source selection, and settings |
| **Desktop Studio Tray** | Minimized recording interface showing active recording status and quick controls |
| **Notification Panel** | Dropdown panel displaying user notifications with read/unread states |
| **Search Interface** | Real-time search with dropdown suggestions for workspaces, folders, and videos |
| **Comment Thread** | Nested comment display with reply functionality |

**UI Design Principles:**
- Consistent visual language using Tailwind CSS utility classes
- Dark/light mode support (system preference detection)
- Responsive layouts adapting to screen sizes
- Accessible components following WCAG 2.1 guidelines
- Loading states and skeleton screens for async operations

#### 3.1.2. Hardware Interfaces

| Interface | Specification |
|-----------|---------------|
| **Screen Capture** | Integration with operating system screen capture APIs via Electron's desktopCapturer module |
| **Audio Input** | Access to system microphone devices through MediaDevices API |
| **Webcam** | Optional camera access for picture-in-picture recording preview |
| **Local Storage** | Temporary file storage for video processing (minimum 2GB available space) |
| **Network Interface** | TCP/IP networking for HTTP and WebSocket communication |

**Desktop App Hardware Requirements:**

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Processor** | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ |
| **RAM** | 4 GB | 8 GB+ |
| **Storage** | 500 MB free | 2 GB+ free |
| **Display** | 1280x720 | 1920x1080+ |
| **Network** | 5 Mbps upload | 10 Mbps+ upload |

#### 3.1.3. Software Interfaces

| Interface | Description | Protocol |
|-----------|-------------|----------|
| **Clerk API** | User authentication, session management, and user metadata synchronization | REST/HTTPS |
| **Stripe API** | Checkout session creation, customer management, and webhook handling | REST/HTTPS |
| **OpenAI API** | Audio transcription (Whisper) and text generation (GPT-3.5-turbo) | REST/HTTPS |
| **AWS S3 API** | Video file upload, storage, and retrieval | REST/HTTPS with AWS SDK |
| **CloudFront** | Video content delivery with signed URLs | HTTPS |
| **Voiceflow API** | Knowledge base updates for AI-powered search | REST/HTTPS |
| **PostgreSQL** | Database operations via Prisma ORM | PostgreSQL wire protocol |
| **GitHub Releases API** | Desktop app version checking and update downloads | REST/HTTPS |

**Database Schema Integration:**

| Entity | External Sync |
|--------|---------------|
| **User** | Synced with Clerk user ID (clerkId field) |
| **Subscription** | References Stripe customer ID (customerId field) |
| **Video** | References S3 object key (source field) |

#### 3.1.4. Communications Interfaces

| Interface | Protocol | Purpose |
|-----------|----------|---------|
| **REST API** | HTTPS (TLS 1.2+) | Server Actions and API routes for CRUD operations |
| **WebSocket** | WSS (Socket.IO) | Real-time video chunk streaming from desktop app |
| **Deep Linking** | Custom URL Protocol (crystal://) | Desktop app authentication callback |
| **CDN Streaming** | HTTPS | Video playback via CloudFront distribution |
| **Webhook** | HTTPS POST | Stripe payment confirmation callbacks |
| **SMTP** | TLS | Email notifications for workspace invitations |

**Data Formats:**

| Format | Usage |
|--------|-------|
| **JSON** | API request/response payloads |
| **Binary (Blob)** | Video chunk transmission via WebSocket |
| **Multipart Form** | Video file upload via HTTP |
| **JWT** | Authentication tokens |

**Port Configuration:**

| Service | Default Port |
|---------|-------------|
| Next.js Web App | 3000 |
| Express Upload Server | 5001 |
| PostgreSQL Database | 5432 |

---

## 3.4. Non-Functional Requirements

### 3.4.1. Performance Requirements

| Requirement ID | Requirement | Metric |
|----------------|-------------|--------|
| **PERF-01** | Page load time for web dashboard | ≤ 3 seconds on standard broadband (10 Mbps) |
| **PERF-02** | Video playback start time | ≤ 2 seconds from click to first frame |
| **PERF-03** | Search results response time | ≤ 500 ms for queries returning up to 100 results |
| **PERF-04** | Video upload throughput | Support uploads at user's connection speed (up to 100 Mbps) |
| **PERF-05** | Desktop app recording frame rate | 30 FPS minimum at SD quality; 60 FPS at HD quality |
| **PERF-06** | WebSocket latency for video streaming | ≤ 200 ms round-trip time |
| **PERF-07** | API response time for CRUD operations | ≤ 300 ms for 95th percentile requests |
| **PERF-08** | AI transcription processing time | ≤ 5 minutes for 30-minute video |
| **PERF-09** | Concurrent user support | System shall support 1,000 concurrent active users |
| **PERF-10** | Database query performance | ≤ 100 ms for indexed queries |

**Scalability Targets:**

| Component | Scaling Strategy |
|-----------|------------------|
| Web Application | Horizontal scaling via Vercel edge deployment |
| Express Server | Load balancing with sticky sessions for WebSocket |
| Database | Connection pooling (max 100 connections), read replicas |
| Storage | AWS S3 automatic scaling, CloudFront edge caching |

### 3.4.2. Security Requirements

| Requirement ID | Requirement | Implementation |
|----------------|-------------|----------------|
| **SEC-01** | All data transmission shall be encrypted | TLS 1.2+ for all HTTPS and WSS connections |
| **SEC-02** | User passwords shall be securely managed | Delegated to Clerk (industry-standard hashing) |
| **SEC-03** | Authentication tokens shall expire | JWT tokens with configurable expiration (24 hours default) |
| **SEC-04** | API endpoints shall be protected | Clerk middleware authentication on protected routes |
| **SEC-05** | Database queries shall prevent SQL injection | Prisma ORM parameterized queries |
| **SEC-06** | File uploads shall be validated | File type whitelist (video/*), size limit (500MB) |
| **SEC-07** | Cross-origin requests shall be restricted | CORS configuration allowing only trusted origins |
| **SEC-08** | Workspace access shall be authorized | Server Actions verify membership before data access |
| **SEC-09** | Video deletion shall cascade properly | Database cascade delete for comments and related data |
| **SEC-10** | Payment data shall never be stored locally | Stripe handles all payment information; only customer ID stored |
| **SEC-11** | Desktop app shall authenticate securely | Browser-based OAuth with one-time sign-in tickets |
| **SEC-12** | Sensitive environment variables shall be protected | Server-side only; never exposed to client bundles |

**Access Control Matrix:**

| Resource | General User | Workspace Owner | Video Author |
|----------|--------------|-----------------|--------------|
| View workspace videos | Own workspaces | All in workspace | — |
| Upload videos | Own personal | All in workspace | — |
| Delete videos | — | All in workspace | Own videos |
| Invite members | — | Yes | — |
| Delete workspace | — | Yes | — |
| Edit video metadata | — | — | Own videos |

### 3.4.3. Reliability Requirements

| Requirement ID | Requirement | Target |
|----------------|-------------|--------|
| **REL-01** | System availability | 99.5% uptime (excluding scheduled maintenance) |
| **REL-02** | Mean Time Between Failures (MTBF) | ≥ 720 hours (30 days) |
| **REL-03** | Mean Time To Recovery (MTTR) | ≤ 4 hours for critical failures |
| **REL-04** | Data durability for stored videos | 99.999999999% (AWS S3 durability) |
| **REL-05** | Database backup frequency | Daily automated backups with 30-day retention |
| **REL-06** | Video processing failure handling | Automatic retry (3 attempts) with error notification |
| **REL-07** | Desktop app crash recovery | Auto-save recording chunks every 10 seconds |
| **REL-08** | Transaction atomicity | Database transactions for multi-step operations |
| **REL-09** | Graceful degradation | AI features fail gracefully without affecting core video playback |
| **REL-10** | Connection interruption handling | Resume capability for video uploads up to 24 hours |

**Fault Tolerance Measures:**

| Failure Scenario | Mitigation |
|------------------|------------|
| Database connection loss | Connection pooling with retry logic; read replica failover |
| S3 upload failure | Retry with exponential backoff; temporary local storage |
| AI service unavailable | Skip AI processing; flag video for later processing |
| Authentication service down | Cached sessions valid for configured duration |
| CDN outage | Direct S3 access as fallback (degraded performance) |

### 3.4.4. Maintainability Requirements

| Requirement ID | Requirement |
|----------------|-------------|
| **MAINT-01** | Code shall follow TypeScript strict mode for type safety |
| **MAINT-02** | Database schema changes shall use Prisma migrations |
| **MAINT-03** | Application shall use structured logging for debugging |
| **MAINT-04** | Desktop app shall support automatic updates via electron-updater |
| **MAINT-05** | Environment configuration shall be externalized via .env files |
| **MAINT-06** | API versioning shall be implemented for breaking changes |

### 3.4.5. Portability Requirements

| Requirement ID | Requirement |
|----------------|-------------|
| **PORT-01** | Web application shall function on all major modern browsers |
| **PORT-02** | Desktop application shall be available for Windows, macOS, and Linux |
| **PORT-03** | System shall be deployable on any Node.js 18+ compatible environment |
| **PORT-04** | Database shall be compatible with any PostgreSQL 14+ instance |

### 3.4.6. Usability Requirements

| Requirement ID | Requirement |
|----------------|-------------|
| **USE-01** | New users shall be able to upload their first video within 5 minutes of registration |
| **USE-02** | All primary actions shall be accessible within 3 clicks from dashboard |
| **USE-03** | Error messages shall be descriptive and suggest corrective actions |
| **USE-04** | System shall provide visual feedback for all async operations (loading states) |
| **USE-05** | Interface shall support keyboard navigation for accessibility |
| **USE-06** | Help documentation shall be accessible from within the application |

---

## Appendix A: System Architecture Reference

The Crystal application follows a multi-tier architecture:

| Tier | Components |
|------|------------|
| **Client Tier** | Next.js Web App, Electron Desktop App |
| **Backend Tier** | Next.js Server Actions/API, Express.js Upload Server |
| **External Services** | Clerk, Stripe, OpenAI, Voiceflow |
| **Data Tier** | PostgreSQL Database, AWS S3 Storage, CloudFront CDN |

For detailed architecture diagrams and data flow descriptions, refer to `architecture.md`.

---

## Appendix B: Feature Module Reference

| Module | Description |
|--------|-------------|
| Module 1 | User Authentication and Account Management |
| Module 2 | Subscription and Billing |
| Module 3 | Workspace Creation and Management |
| Module 4 | Workspace Invitation and Membership |
| Module 5 | Folder Management |
| Module 6 | Video Recording (Desktop App) |
| Module 7 | Video Upload and Processing |
| Module 8 | Video AI Processing (PRO Feature) |
| Module 9 | Video Management |
| Module 10 | Video Viewing and Interaction |
| Module 11 | Video Comments |
| Module 12 | Notifications |
| Module 13 | Search and Discovery |
| Module 14 | Desktop App Management |

For detailed feature specifications, refer to `features-list.md` and individual module documentation.

---

*Document Version: 1.0*
*Last Updated: January 2026*

