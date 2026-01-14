# CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY
## COLLEGE OF COMPUTER STUDIES

# Software Project Management Plan
### for
# Crystal: A Screen Recording and Video Management Platform

---

## Table of Contents

**1. Overview**
*   1.1. Project Summary
    *   1.1.1. Purpose, scope, and objectives
    *   1.1.2. Assumptions and constraints
    *   1.1.3. Project deliverables
    *   1.1.4. Schedule and budget summary
*   1.2. Evolution of plan

**2. References**

**3. Definitions**

**4. Project organization**
*   4.1. External structure
*   4.2. Internal structure
*   4.3. Roles and responsibilities

**5. Managerial process plans**
*   5.1. Start-up plan
    *   5.1.1. Estimation plan
    *   5.1.2. Staffing plan
    *   5.1.3. Resource acquisition plan
*   5.2. Work plan
    *   5.2.1. Work activities
    *   5.2.2. Schedule allocation
    *   5.2.3. Resource allocation
    *   5.2.4. Budget allocation
*   5.3. Control plan
    *   5.3.1. Requirements control plan
    *   5.3.2. Schedule control plan
    *   5.3.3. Budget control plan
    *   5.3.4. Quality control plan
    *   5.3.5. Reporting plan
    *   5.3.6. Metrics collection plan
    *   5.3.7. Risk management plan
    *   5.3.8. Project closeout plan

**6. Technical process plan**
*   6.1. Process Model
*   6.2. Methods, tools, and techniques
*   6.3. Infrastructure Plan
*   6.4. Product Acceptance Plan

**7. Supporting Process Plans**
*   7.1. Configuration management plan
*   7.2. Verification and Validation Plan
*   7.3. Documentation plan
*   7.4. Quality assurance plan
*   7.5. Reviews and Audits
*   7.6. Problem resolution plan
*   7.7. Subcontractor management plan
*   7.8. Process improvement plan

**8. Additional Plans**
*   8.1. Accessibility Plan
*   8.2. Security and Data Privacy Plan
*   8.3. Sustainability and Maintenance Plan
*   8.4. Scalability Plan
*   8.5. Disaster Recovery and Business Continuity Plan

**9. Plan Annexes**
*   Annex A: Module Summary Table
*   Annex B: Documentation Index

**10. Index**

---

# 1. Overview

## 1.1. Project Summary

### 1.1.1. Purpose, scope, and objectives

**Purpose**

The purpose of **Crystal** is to provide a comprehensive screen recording and video management platform that enables users to capture, upload, organize, and share video content within personal and collaborative workspaces. By combining desktop screen recording capabilities with cloud-based storage and AI-powered processing, the system aims to streamline video creation and management workflows. Crystal is designed to help content creators, educators, and teams efficiently produce, organize, and collaborate on video content while leveraging AI for automatic transcription, title generation, and content summarization.

**Scope**

Crystal is a **multi-platform application** consisting of a web application and a desktop application that work together to provide a complete video management solution. The platform caters primarily to **content creators, educators, and collaborative teams** who need to record, manage, and share video content. Its scope includes:

*   **User Authentication and Account Management:** Secure account registration, login via Clerk authentication, and personalized user profiles with subscription management.
*   **Workspace Management:** Personal and public workspace creation, member invitation and collaboration, folder-based video organization.
*   **Video Recording (Desktop App):** Cross-platform Electron application for screen capture with audio recording, quality presets, and real-time streaming to server.
*   **Video Upload and Processing:** Web-based video upload with progress tracking, cloud storage via AWS S3, and CDN delivery via CloudFront.
*   **AI-Powered Features (PRO):** Automatic transcription using OpenAI Whisper, AI-generated titles and summaries using GPT-3.5, and knowledge base integration via Voiceflow.
*   **Video Interaction:** View tracking, likes, comments with nested replies, and notification system for engagement.
*   **Search and Discovery:** Global content search across workspaces, folders, and videos with access-controlled results.

The system is intended for individual content creators, educational institutions, and team collaboration environments.

**Objectives**

Crystal's primary objectives are to:

1.  **Streamline Video Workflow** – Provide an integrated solution for recording, uploading, processing, and organizing video content in a single platform.
2.  **Enable Collaboration** – Facilitate team collaboration through shared workspaces, member management, and real-time notifications.
3.  **Leverage AI for Productivity** – Automate time-consuming tasks like transcription and content summarization using AI, allowing users to focus on content creation.
4.  **Ensure Accessibility** – Deliver video content globally through CDN distribution with optimized playback performance.

In summary, Crystal aims to bridge the gap between screen recording tools and video management platforms, creating an all-in-one solution that enhances productivity for video content creation and collaboration.

### 1.1.2. Assumptions and constraints

**Assumptions**

*   **User Access to Technology** – Users will have access to a stable internet connection and modern web browsers (Chrome, Firefox, Edge, Safari) to use the web application effectively.
*   **Desktop Requirements** – Desktop app users have systems meeting minimum requirements: Windows 10/11 or macOS 10.15+, 4GB RAM, dual-core processor.
*   **Third-Party Service Availability** – External services (Clerk, Stripe, OpenAI, AWS) will maintain uptime and API compatibility throughout the project lifecycle.
*   **Cloud Infrastructure** – The platform will be hosted on reliable cloud infrastructure (Vercel, AWS) capable of supporting expected user load.
*   **Data Privacy Compliance** – Users will provide accurate information upon registration, and the system will securely store and process data in compliance with privacy regulations.

**Constraints**

*   The platform must be developed and delivered within the defined academic schedule (September - December 2025).
*   Initial release targets Windows for desktop app; macOS and Linux support are secondary priorities.
*   AI processing features are limited by OpenAI API rate limits and file size constraints (25MB audio limit).
*   Video file uploads are limited to 500MB per file to manage storage costs and upload times.
*   PRO features require Stripe payment integration, which must comply with PCI-DSS standards.
*   Real-time video streaming requires WebSocket connectivity, which may be affected by corporate firewalls.

### 1.1.3. Project deliverables

The following documents constitute the core technical and managerial documentation for the Crystal project:

*   **Software Requirements Specification (SRS)** – This document outlines the detailed functional and non-functional requirements of Crystal, including all 14 modules, user roles, and system performance expectations.
*   **Software Design Description (SDD)** – This document presents the technical design and architecture of Crystal, including system architecture diagrams, database schema, API specifications, and component designs.
*   **Software Project Management Plan (SPMP)** – This document provides the management framework for the Crystal project, detailing the project's purpose, scope, objectives, timeline, resources, risk management, and development strategy.
*   **Software Test Document (STD)** – This document outlines the testing strategy, test cases for all 14 modules, and validation procedures.

As part of the incremental development approach, the following core modules will be delivered in phases:

*   **Phase 1: Foundation (Weeks 1-5)**
    *   **User Authentication & Account Management** – Clerk integration, sign-up/sign-in, profile management.
    *   **Subscription and Billing** – Stripe integration, PRO subscription management.
    *   **Workspace Management** – Personal and public workspace creation, member management.

*   **Phase 2: Core Features (Weeks 6-10)**
    *   **Workspace Invitation & Membership** – Invitation system, member roles, access control.
    *   **Folder Management** – Folder CRUD operations, video organization.
    *   **Video Recording (Desktop App)** – Electron app, screen capture, audio recording, chunk streaming.
    *   **Video Upload & Processing** – Web upload, S3 storage, processing pipeline.

*   **Phase 3: Advanced Features (Weeks 11-14)**
    *   **Video AI Processing** – Whisper transcription, GPT summarization, Voiceflow integration.
    *   **Video Management** – Edit, move, delete operations, batch download.
    *   **Video Viewing & Interaction** – Player, view tracking, likes, sharing.
    *   **Video Comments** – Comment posting, nested replies, threading.
    *   **Notifications** – Real-time notification system, mark as read.
    *   **Search & Discovery** – Global search, quick suggestions, access control.
    *   **Desktop App Management** – Auto-updates, version management.

*   **Phase 4: Testing & Deployment (Weeks 15-16)**
    *   **System Testing** – Functional, integration, and user acceptance testing.
    *   **Bug Fixes & Optimization** – Performance tuning, issue resolution.
    *   **Final Deployment** – Production deployment, documentation finalization.

### 1.1.4. Schedule and budget summary

**Schedule Summary**

| WEEK(S) | MODULE / ACTIVITY | DESCRIPTION |
| :--- | :--- | :--- |
| Week 1-3 | Project Planning & Requirements | Define goals, features, finalize scope, create SRS documentation, design UI/UX prototypes. |
| Week 4-5 | Module 1-2: Authentication & Billing | Implement Clerk authentication, Stripe subscription integration. |
| Week 6-7 | Module 3-4: Workspace Management | Develop workspace CRUD, invitation system, member management. |
| Week 8-9 | Module 5-6: Folders & Recording | Implement folder management, develop Electron desktop app with recording. |
| Week 10-11 | Module 7-8: Upload & AI Processing | Build upload pipeline, integrate OpenAI for transcription and summarization. |
| Week 12-13 | Module 9-12: Video & Notifications | Implement video management, viewing, comments, and notification system. |
| Week 14 | Module 13-14: Search & Desktop Updates | Develop search functionality, implement auto-update for desktop app. |
| Week 15-16 | Testing and Deployment | Conduct system testing, fix bugs, optimize performance, final deployment. |

*Table 1.1. Project Development Schedule*

**Budget Summary**

The Crystal project utilizes a minimal budget approach, leveraging free tiers where possible and paid cloud services for production requirements.

| ITEM | DESCRIPTION | MONTHLY COST |
| :--- | :--- | :--- |
| Vercel Hosting | Web application deployment (Pro tier) | $20/month or Free tier |
| AWS S3 | Video file storage | ~$23/100GB |
| AWS CloudFront | CDN for video delivery | ~$8.50/100GB transfer |
| AWS EC2 | Express server for video processing | ~$15-30/month (t3.small) |
| PostgreSQL (Neon/Supabase) | Database hosting | Free tier or ~$25/month |
| Clerk Authentication | User authentication service | Free tier (up to 10K MAU) |
| Stripe | Payment processing | 2.9% + $0.30 per transaction |
| OpenAI API | Whisper transcription, GPT summarization | ~$0.006/minute (Whisper) |
| Domain Name | Custom domain (optional) | ~$12/year |
| **Development Tools** | VS Code, Git, Node.js, etc. | **Free** |

*Table 1.2. Budget Allocation Summary*

**Estimated Monthly Operating Cost:** $50-150/month (depending on usage)

## 1.2. Evolution of plan

This section outlines the evolution of the Crystal project plan, listing key development stages, contributors, and projected delivery timelines.

| VERSION | DESCRIPTION OF CHANGES / PROGRESS | CONTRIBUTORS | DATE FINALIZED |
| :--- | :--- | :--- | :--- |
| Version 1.0 | Finalization of project concept and validation of target user needs. | Team | September 5, 2025 |
| Version 1.1 | Drafted and reviewed Software Requirements Specification (SRS). | Team | September 15, 2025 |
| Version 1.2 | Created Software Design Description (SDD) with architecture diagrams. | Team | September 25, 2025 |
| Version 1.3 | Developed Software Project Management Plan (SPMP). | Team | October 1, 2025 |
| Version 2.0 | Completed Phase 1: Authentication, Billing, Workspace modules. | Team | October 20, 2025 |
| Version 2.1 | Completed Phase 2: Core features including desktop app and upload. | Team | November 15, 2025 |
| Version 3.0 | Completed Phase 3: AI processing, notifications, search features. | Team | December 1, 2025 |
| Version 3.1 | Final testing, bug fixes, and production deployment. | Team | December 20, 2025 |

*Table 1.3. Evolution of the Project Plan*

---

# 2. References

*   IEEE Std 830-1998, "IEEE Recommended Practice for Software Requirements Specifications," Institute of Electrical and Electronics Engineers.
*   IEEE Std 1016-2009, "IEEE Standard for Information Technology—Systems Design—Software Design Descriptions."
*   Next.js 14 Documentation, Vercel Inc. [Online]. Available: https://nextjs.org/docs
*   Electron Documentation, OpenJS Foundation. [Online]. Available: https://www.electronjs.org/docs
*   Prisma ORM Documentation. [Online]. Available: https://www.prisma.io/docs
*   Clerk Authentication Documentation. [Online]. Available: https://clerk.com/docs
*   Stripe API Reference. [Online]. Available: https://stripe.com/docs/api
*   OpenAI API Reference. [Online]. Available: https://platform.openai.com/docs/api-reference
*   AWS S3 Documentation. [Online]. Available: https://docs.aws.amazon.com/s3
*   AWS CloudFront Documentation. [Online]. Available: https://docs.aws.amazon.com/cloudfront
*   Socket.IO Documentation. [Online]. Available: https://socket.io/docs
*   FFmpeg Documentation. [Online]. Available: https://ffmpeg.org/documentation.html
*   Republic Act 10173 - Data Privacy Act of 2012, National Privacy Commission, Philippines. [Online]. Available: https://www.privacy.gov.ph

---

# 3. Definitions

The core technical concepts that underpin the design and functionality of the Crystal system are defined below.

*   **Screen Recording:** The process of capturing video output from a computer display, optionally including audio from microphone or system sources.
*   **Workspace:** A container for organizing videos and folders. Personal workspaces are private; public workspaces can be shared with invited members.
*   **Chunk Streaming:** The technique of transmitting video data in small segments during recording, enabling real-time upload without waiting for recording completion.
*   **Transcription:** The process of converting spoken audio into written text, performed automatically using AI speech recognition.
*   **CDN (Content Delivery Network):** A distributed network of servers that delivers video content to users from geographically proximate locations for improved performance.

The following table presents the standardized acronyms and abbreviations referenced in the Crystal documentation.

| ACRONYM | DEFINITION |
| :--- | :--- |
| API | Application Programming Interface – A set of protocols for building and interacting with software components |
| AWS | Amazon Web Services – Cloud computing platform providing storage, CDN, and compute services |
| CDN | Content Delivery Network – Distributed servers for efficient content delivery |
| CRUD | Create, Read, Update, Delete – Basic operations for data management |
| FFmpeg | Free multimedia framework for audio/video processing |
| GPT | Generative Pre-trained Transformer – AI language model for text generation |
| HD | High Definition – Video quality preset (1080p) |
| JWT | JSON Web Token – Compact token for secure data transmission and authentication |
| ORM | Object-Relational Mapping – Technique for database interaction using objects |
| PRO | Premium subscription tier with advanced features |
| REST | Representational State Transfer – Architectural style for web APIs |
| S3 | Simple Storage Service – AWS object storage service |
| SD | Standard Definition – Video quality preset (720p) |
| SDD | Software Design Description |
| SPMP | Software Project Management Plan |
| SRS | Software Requirements Specification |
| SSR | Server-Side Rendering – Rendering web pages on the server |
| STD | Software Test Document |
| UI/UX | User Interface / User Experience |
| WebSocket | Protocol for full-duplex real-time communication |
| Whisper | OpenAI's automatic speech recognition system |

*Table 3.1. List of Acronyms*

---

# 4. Project organization

## 4.1. External structure

The external structure outlines third-party tools, platforms, and services that support the development, integration, and deployment of Crystal.

| EXTERNAL COMPONENT | ROLE IN CRYSTAL |
| :--- | :--- |
| Clerk | Third-party authentication service for user sign-up, sign-in, and session management |
| Stripe | Payment processing platform for PRO subscription management |
| OpenAI | AI services for audio transcription (Whisper) and text generation (GPT-3.5) |
| AWS S3 | Cloud object storage for video files |
| AWS CloudFront | CDN for global video content delivery |
| AWS EC2 | Cloud compute for Express.js video processing server |
| Vercel | Hosting platform for Next.js web application |
| PostgreSQL | Relational database for application data |
| GitHub | Source code repository, version control, and CI/CD |
| Voiceflow | AI knowledge base for video content search |

*Table 4.1. External Structure of the Project*

## 4.2. Internal structure

The internal structure defines the organizational roles, responsibilities, and collaboration framework of the development team.

| ROLE | RESPONSIBILITY |
| :--- | :--- |
| Project Manager | Oversees project timeline, team coordination, and documentation (SPMP, SRS, etc.) |
| Full-stack Developer | Implements both frontend (React/Next.js) and backend (Server Actions, Express) components |
| Frontend Developer | Develops user interface components using React, Tailwind CSS, and Shadcn UI |
| Backend Developer | Manages server logic, database operations, and API integrations |
| DevOps Engineer | Handles deployment, CI/CD pipelines, and infrastructure management |
| UI/UX Designer | Designs wireframes, user flows, and ensures intuitive user experience |

*Table 4.2. Internal Structure of the Project*

## 4.3. Roles and responsibilities

| TEAM MEMBER | ROLES AND RESPONSIBILITIES |
| :--- | :--- |
| Ashley Ken Comandao | Project Lead – Oversees timeline, coordinates tasks, leads development<br>Full-stack Developer – Develops backend services, API integrations, frontend components, database operations<br>DevOps Engineer – Manages Vercel/AWS deployment, CI/CD pipelines, desktop app development |
| Ana Alimurung | Documentation Lead – Writes SRS, SDD, SPMP, STD documentation<br>UI/UX Designer – Designs user interfaces, creates prototypes, ensures UX quality<br>Developer – Supports frontend and feature development |

*Table 4.3. Roles and Responsibilities of Each Team Member*

---

# 5. Managerial process plans

## 5.1. Start-up plan

### 5.1.1. Estimation plan

Effort and schedule estimates were derived using a combination of historical data, analogy-based estimation, and work breakdown structures. The project followed Agile estimation techniques:

*   **Story Points:** Used during sprint planning to estimate task complexity based on effort, risk, and uncertainty.
*   **T-Shirt Sizing:** Applied for initial feature estimation (S, M, L, XL) before breaking down into detailed tasks.
*   **Velocity Tracking:** Historical velocity data used to predict sprint capacity and adjust timelines.

**Key Milestones:**
*   Requirements Analysis & Design: 3 weeks
*   Core Development (Modules 1-7): 6 weeks
*   Advanced Features (Modules 8-14): 4 weeks
*   Testing and Deployment: 3 weeks

### 5.1.2. Staffing plan

The project is staffed with a two-person development team with complementary skill sets, ensuring balanced task ownership across frontend, backend, and infrastructure concerns.

| NAME | AFFILIATION TO PROJECT |
| :--- | :--- |
| Ashley Ken Comandao | Project Lead, Lead Developer |
| Ana Alimurung | Team Member, Documentation Lead |

*Table 5.1. Staffing Plan of the Project*

### 5.1.3. Resource acquisition plan

The following resources were acquired or utilized through academic, open-source, and cloud service channels:

**Hardware**
*   Development workstations with minimum Intel i5/AMD Ryzen 5, 8GB RAM, SSD storage
*   Test devices for desktop app validation (Windows 10/11)

**Software Platforms**
*   Frontend: Next.js 14, React 18, Tailwind CSS, Shadcn UI
*   Backend: Next.js Server Actions, Express.js, Prisma ORM
*   Desktop: Electron, Vite, React
*   Version Control: Git, GitHub
*   Database: PostgreSQL

**Cloud Services**
*   Vercel (Web hosting)
*   AWS S3, CloudFront, EC2 (Storage, CDN, Compute)
*   Clerk (Authentication)
*   Stripe (Payments)

**Productivity Tools**
*   Visual Studio Code
*   Figma (UI/UX Design)
*   Postman (API Testing)
*   GitHub Issues (Task Tracking)

## 5.2. Work plan

### 5.2.1. Work activities

The following table presents the breakdown of major work activities for the Crystal project:

| MODULE / ACTIVITY | DESCRIPTION |
| :--- | :--- |
| Project Planning & Requirements | Define project scope, features, goals, create SRS, SDD, SPMP documentation |
| Module 1: User Authentication | Implement Clerk integration, sign-up, sign-in, sign-out, profile management |
| Module 2: Subscription & Billing | Integrate Stripe checkout, manage PRO subscriptions, handle webhooks |
| Module 3: Workspace Management | Develop workspace CRUD, personal/public workspaces, member listing |
| Module 4: Workspace Invitation | Build invitation system, accept/decline flows, member removal |
| Module 5: Folder Management | Implement folder CRUD, video organization within folders |
| Module 6: Video Recording | Develop Electron app, screen capture, audio input, chunk streaming |
| Module 7: Video Upload & Processing | Build upload pipeline, S3 integration, FFmpeg processing |
| Module 8: Video AI Processing | Integrate OpenAI Whisper/GPT, implement transcription and summarization |
| Module 9: Video Management | Develop video CRUD, move operations, batch download |
| Module 10: Video Viewing | Build video player, view tracking, like/unlike functionality |
| Module 11: Video Comments | Implement comment posting, nested replies, threading |
| Module 12: Notifications | Develop notification system, mark as read, notification types |
| Module 13: Search & Discovery | Build global search, quick suggestions, access-controlled results |
| Module 14: Desktop App Management | Implement auto-update, version checking, app distribution |
| Testing and Deployment | Conduct functional/integration testing, bug fixes, production deployment |

*Table 5.2. Work Activities for the Project*

### 5.2.2. Schedule allocation

The project follows a 16-week timeline from September to December 2025.

| TASK | DURATION | START DATE | END DATE |
| :--- | :--- | :--- | :--- |
| Project Planning & Documentation | 3 weeks | September 1 | September 21 |
| Module 1-2: Authentication & Billing | 2 weeks | September 22 | October 5 |
| Module 3-4: Workspace Management | 2 weeks | October 6 | October 19 |
| Module 5-6: Folders & Recording | 2 weeks | October 20 | November 2 |
| Module 7-8: Upload & AI Processing | 2 weeks | November 3 | November 16 |
| Module 9-12: Video & Notifications | 2 weeks | November 17 | November 30 |
| Module 13-14: Search & Desktop | 1 week | December 1 | December 7 |
| Testing and Optimization | 1 week | December 8 | December 14 |
| Final Deployment and Presentation | 1 week | December 15 | December 20 |

*Table 5.3. Schedule Allocation for the Project*

### 5.2.3. Resource allocation

**Human Resource Allocation**

| TEAM MEMBER | ROLE(S) | PRIMARY RESPONSIBILITY |
| :--- | :--- | :--- |
| Ashley Ken Comandao | Project Lead, Full-stack, DevOps | Backend & frontend development, API integrations, deployment, project coordination, desktop app |
| Ana Alimurung | Documentation, UI/UX, Developer | Documentation, UI design, frontend support |

*Table 5.4. Human Resource Allocation*

**Tool Resource Allocation**

| CATEGORY | TECHNOLOGY / TOOL | PURPOSE |
| :--- | :--- | :--- |
| Frontend Framework | Next.js 14, React 18 | Server-side rendering, React components |
| UI Components | Shadcn UI, Tailwind CSS | Pre-built components, utility-first styling |
| State Management | Redux Toolkit, TanStack Query | Global state, server state caching |
| Backend Framework | Next.js Server Actions, Express.js | API routes, video processing server |
| Database ORM | Prisma | Type-safe database queries |
| Database | PostgreSQL | Relational data storage |
| Desktop Framework | Electron, Vite | Cross-platform desktop application |
| Authentication | Clerk | User authentication and session management |
| Payments | Stripe | Subscription billing |
| AI Services | OpenAI (Whisper, GPT-3.5) | Transcription, summarization |
| Storage | AWS S3 | Video file storage |
| CDN | AWS CloudFront | Video content delivery |
| Hosting | Vercel, AWS EC2 | Web app and processing server hosting |
| Version Control | GitHub | Code repository and collaboration |

*Table 5.5. Tool Resource Allocation*

### 5.2.4. Budget allocation

Crystal operates with a minimal budget, utilizing free tiers where possible and paid cloud services for production.

| ITEM | DESCRIPTION | ESTIMATED COST |
| :--- | :--- | :--- |
| Vercel Hosting | Next.js web application (Pro tier) | $20/month |
| AWS S3 Storage | Video file storage (~100GB) | $23/month |
| AWS CloudFront | CDN bandwidth (~100GB transfer) | $8.50/month |
| AWS EC2 | Express server (t3.small) | $15/month |
| PostgreSQL | Database hosting (Neon free tier) | $0/month |
| Clerk | Authentication (free tier, <10K MAU) | $0/month |
| OpenAI API | Whisper + GPT usage | ~$20/month (usage-based) |
| Domain | Custom domain registration | $12/year |
| Development Tools | VS Code, Git, Node.js | $0 (Free) |
| **TOTAL ESTIMATED** | | **~$90/month** |

*Table 5.6. Budget Allocation*

## 5.3. Control plan

### 5.3.1. Requirements control plan

To ensure requirement stability and traceability throughout Crystal's development:

*   All functional and non-functional requirements are documented in the SRS and tracked via GitHub Issues.
*   Any changes to requirements require documentation of rationale and impact assessment.
*   Version control (GitHub) tracks all requirement modifications with descriptive commit messages.
*   Pull requests require review before merging to ensure requirement alignment.

### 5.3.2. Schedule control plan

The project timeline is monitored weekly through GitHub project boards and team sync meetings. If schedule deviations are detected:

*   Reallocate tasks between team members based on current workload.
*   Prioritize critical path items and defer non-essential features.
*   Extend work hours for time-sensitive deliverables.
*   Communicate delays early and adjust dependent tasks accordingly.

### 5.3.3. Budget control plan

Budget control focuses on optimizing cloud resource usage:

*   Monitor AWS billing dashboard weekly to track usage against estimates.
*   Utilize free tiers (Clerk, Neon) wherever possible.
*   Implement S3 lifecycle policies to archive or delete old videos.
*   Use CloudFront caching to reduce origin requests and bandwidth costs.
*   Alert thresholds set at 80% of monthly budget estimate.

### 5.3.4. Quality control plan

Quality assurance practices implemented throughout development:

*   Code reviews required for every pull request before merging.
*   TypeScript strict mode enabled for type safety.
*   ESLint and Prettier for code style consistency.
*   Unit tests for critical business logic.
*   Integration tests for API endpoints.
*   Manual testing for UI/UX flows.
*   Staging environment for pre-production validation.

### 5.3.5. Reporting plan

Weekly progress reports summarizing:

*   Completed tasks and merged pull requests.
*   Issues encountered and blockers.
*   Schedule adjustments and task redistribution.
*   Upcoming priorities for the next week.
*   Budget utilization updates.

Reports shared via GitHub Discussions and team meetings.

### 5.3.6. Metrics collection plan

| METRIC | PURPOSE | COLLECTION FREQUENCY |
| :--- | :--- | :--- |
| Task Completion Rate | Measure sprint velocity and team efficiency | Weekly |
| Bug Count and Resolution Time | Track code quality and maintenance effort | Weekly |
| Code Review Turnaround | Ensure timely feedback and prevent bottlenecks | Per PR |
| Test Coverage | Monitor automated test completeness | Per release |
| API Response Time | Track backend performance | Continuous |
| Build Success Rate | Monitor CI/CD pipeline health | Per commit |

*Table 5.7. Project Metrics*

### 5.3.7. Risk management plan

| RISK | LIKELIHOOD | IMPACT | MITIGATION STRATEGY |
| :--- | :--- | :--- | :--- |
| Third-party service outage (Clerk, Stripe, OpenAI) | Medium | High | Implement graceful degradation; cache critical data; monitor service status |
| Scope creep and feature expansion | Medium | Medium | Strict change control; prioritize MVP features; defer nice-to-haves |
| Technical complexity underestimation | Medium | High | Buffer time in schedule; early prototyping for complex features |
| Team member unavailability | Low | High | Cross-training on all modules; documented processes |
| AWS cost overrun | Low | Medium | Budget alerts; resource optimization; usage monitoring |
| Security vulnerability | Low | High | Regular dependency updates; code reviews; security testing |
| Desktop app platform issues | Medium | Medium | Focus on Windows first; defer macOS/Linux; extensive testing |

*Table 5.8. Risk Management Plan*

### 5.3.8. Project closeout plan

The project closeout phase ensures all objectives are met and deliverables are complete:

*   **Final System Testing** – Validate functionality across all 14 modules with 73 test cases.
*   **Documentation Finalization** – Complete SRS, SDD, SPMP, STD documents.
*   **Production Deployment** – Deploy web app to Vercel, Express server to AWS EC2.
*   **Desktop App Release** – Publish Electron app to GitHub Releases.
*   **Knowledge Transfer** – Document deployment procedures, environment configurations.
*   **Postmortem Meeting** – Reflect on outcomes, challenges, and lessons learned.
*   **Repository Archiving** – Tag final release, update README, archive project.

---

# 6. Technical process plan

## 6.1. Process Model

Crystal follows an **Agile/Incremental development model** with two-week sprints:

*   **Sprint Planning** – Define sprint goals, select backlog items, estimate effort.
*   **Daily Standups** – Brief sync on progress, blockers, and plans (async via GitHub).
*   **Development** – Implement features in feature branches, continuous integration.
*   **Code Review** – Peer review via pull requests before merging.
*   **Sprint Review** – Demo completed features, gather feedback.
*   **Sprint Retrospective** – Reflect on process improvements.

The incremental approach allows for early delivery of core features, continuous user feedback, and flexibility to adapt to changing requirements.

## 6.2. Methods, tools, and techniques

| CATEGORY | METHOD / TOOL / TECHNIQUE | DESCRIPTION |
| :--- | :--- | :--- |
| Development Methodology | Agile (Scrum-inspired) | Iterative development with sprints and continuous feedback |
| Version Control | Git, GitHub | Distributed version control with branching strategy |
| Frontend Development | Next.js 14, React 18, TypeScript | Modern React framework with server components |
| UI Framework | Tailwind CSS, Shadcn UI | Utility-first CSS with accessible component library |
| Backend Development | Next.js Server Actions, Express.js | Type-safe server functions and REST API |
| Database | PostgreSQL, Prisma ORM | Relational database with type-safe queries |
| Desktop Development | Electron, Vite | Cross-platform desktop app with fast bundling |
| Real-time Communication | Socket.IO | WebSocket-based video chunk streaming |
| Testing | Manual Testing, Postman | Functional and API testing |
| Code Quality | ESLint, Prettier, TypeScript | Linting, formatting, type checking |
| CI/CD | GitHub Actions, Vercel | Automated builds and deployments |

*Table 6.1. Methods, Tools, and Techniques*

## 6.3. Infrastructure Plan

**Development Infrastructure**

*   **Local Development:** Node.js 18+, PostgreSQL, VS Code with extensions
*   **Version Control:** GitHub repository with branch protection rules
*   **CI/CD:** GitHub Actions for automated testing and deployment

**Staging Infrastructure**

*   **Web Application:** Vercel preview deployments for each pull request
*   **Database:** Neon PostgreSQL branch for testing
*   **Storage:** AWS S3 staging bucket

**Production Infrastructure**

*   **Web Hosting:** Vercel production deployment with custom domain
*   **API Server:** AWS EC2 instance (t3.small) running Express.js
*   **Database:** Neon PostgreSQL production instance
*   **Storage:** AWS S3 production bucket with versioning
*   **CDN:** AWS CloudFront distribution for video delivery

**Backup and Recovery**

*   **Database Backups:** Automated daily backups via Neon
*   **S3 Versioning:** Object versioning enabled for video recovery
*   **Code Backup:** GitHub repository with multiple team members as collaborators

## 6.4. Product Acceptance Plan

The project is considered successful when meeting the following criteria:

**Functional Requirements**
*   All 14 modules implemented and operational
*   73 test cases passing with 100% pass rate
*   No critical or high-severity bugs remaining

**Non-Functional Requirements**
*   Page load time < 3 seconds
*   API response time < 300ms (95th percentile)
*   Video playback start < 2 seconds
*   System uptime > 99.5%

**User Acceptance**
*   Successful end-to-end user workflows verified
*   UI/UX review completed with no major issues
*   Desktop app installs and functions correctly on Windows

**Documentation**
*   Complete SRS, SDD, SPMP, STD documents
*   README with setup instructions
*   API documentation

---

# 7. Supporting Process Plans

## 7.1. Configuration management plan

Configuration management ensures consistency and control of source code, documents, and deployment artifacts.

**Key Practices:**

*   **Version Control:** Git/GitHub with branch naming conventions:
    *   `main` – Production-ready code
    *   `develop` – Integration branch for features
    *   `feature/*` – New features
    *   `bugfix/*` – Bug fixes
    *   `release/*` – Release preparation
*   **Change Tracking:** GitHub Issues for bugs and features, Pull Requests for code changes
*   **Configuration Items:** Source code, documentation, environment variables, database migrations
*   **Access Control:** GitHub team permissions, environment variable secrets in Vercel/AWS

## 7.2. Verification and Validation Plan

**Verification Activities**
*   Peer code reviews for all pull requests
*   TypeScript compilation checks
*   ESLint static analysis
*   Automated CI checks on every push

**Validation Activities**
*   Functional testing against SRS requirements
*   Integration testing for module interactions
*   User acceptance testing with sample workflows
*   Manual testing on target platforms (Windows, Chrome)

## 7.3. Documentation plan

**Produced Artifacts:**
*   Software Requirements Specification (SRS)
*   Software Design Description (SDD)
*   Software Project Management Plan (SPMP)
*   Software Test Document (STD)
*   README and setup guides
*   API documentation

**Tools Used:** Markdown files in repository, GitHub wiki

## 7.4. Quality assurance plan

**QA Activities:**
*   Code reviews for every merge
*   TypeScript strict mode for type safety
*   Consistent code style via ESLint/Prettier
*   Test case execution for all modules
*   Performance monitoring in production

**Roles:** All team members participate in QA activities

## 7.5. Reviews and Audits

| REVIEW TYPE | FREQUENCY | PURPOSE |
| :--- | :--- | :--- |
| Code Review | Every PR | Maintain code quality, catch bugs early |
| Sprint Review | Bi-weekly | Demo features, gather feedback |
| Architecture Review | Monthly | Ensure design integrity and scalability |
| Documentation Review | At milestones | Verify completeness and accuracy |
| Security Review | Before release | Check for vulnerabilities |

*Table 7.1. Reviews and Audits*

## 7.6. Problem resolution plan

**Resolution Workflow:**

1.  **Issue Logging:** Bugs and problems tracked via GitHub Issues with labels (bug, priority, module)
2.  **Triage:** Weekly review to prioritize issues by severity and impact
3.  **Assignment:** Issues assigned to appropriate team member
4.  **Resolution:** Fix implemented in bugfix branch, tested, reviewed
5.  **Verification:** Tester confirms fix resolves the issue
6.  **Closure:** Issue closed with reference to fixing PR

## 7.7. Subcontractor management plan

Crystal integrates multiple third-party services. Management practices:

*   **API Contracts:** Monitor for deprecation notices and breaking changes
*   **Rate Limits:** Implement rate limiting and backoff for external APIs
*   **Fallback Handling:** Graceful degradation when services are unavailable
*   **Dependency Updates:** Monthly review of npm dependencies via Dependabot
*   **License Compliance:** Verify open-source licenses are compatible

## 7.8. Process improvement plan

**Improvement Actions:**

*   Sprint retrospectives capture process improvements
*   Automate repetitive tasks (testing, deployment)
*   Document lessons learned for future reference
*   Adopt new tools/practices based on team feedback
*   Regular refactoring sessions to reduce technical debt

---

# 8. Additional Plans

## 8.1. Accessibility Plan

**Implemented Accessibility Features:**

*   Semantic HTML structure for screen reader compatibility
*   Keyboard navigation support throughout web application
*   ARIA labels on interactive elements
*   Sufficient color contrast ratios (WCAG 2.1 AA)
*   Focus indicators on interactive elements
*   Alt text for images and icons

**Future Enhancements:**
*   Video caption support for transcribed content
*   High contrast theme option
*   Screen reader announcements for dynamic content

## 8.2. Security and Data Privacy Plan

**Security Measures:**

*   **Authentication:** Clerk-managed secure authentication with MFA support
*   **Authorization:** Server-side permission checks on all protected operations
*   **Data Encryption:** TLS 1.2+ for all data in transit; S3 encryption at rest
*   **Input Validation:** Zod schema validation for all user inputs
*   **SQL Injection Prevention:** Prisma parameterized queries
*   **CORS:** Restricted to trusted origins only
*   **Secrets Management:** Environment variables, never committed to repository

**Data Privacy Compliance:**

*   Complies with Data Privacy Act of 2012 (Philippines)
*   User consent obtained during registration
*   Data deletion available upon user request
*   Minimal data collection principle applied

## 8.3. Sustainability and Maintenance Plan

**Sustainability Strategies:**

*   **Open Source Consideration:** MIT license for community contributions
*   **Modular Architecture:** Independent modules enable easy updates
*   **Documentation:** Comprehensive setup and deployment guides
*   **Dependency Management:** Regular updates, Dependabot alerts

**Maintenance Plan:**

*   Monthly dependency updates
*   Quarterly security audits
*   Bug fixes within 1 week of discovery (critical within 24 hours)
*   Feature updates based on user feedback

## 8.4. Scalability Plan

**Layer Scalability:**

| LAYER | SCALABILITY STRATEGY |
| :--- | :--- |
| Frontend | Vercel edge deployment, automatic scaling |
| Backend (Next.js) | Vercel serverless functions, auto-scaling |
| Backend (Express) | AWS EC2 with load balancer, horizontal scaling |
| Database | PostgreSQL connection pooling, read replicas |
| Storage | AWS S3 unlimited scaling |
| CDN | CloudFront global edge locations |
| Real-time | Socket.IO with Redis adapter for multiple instances |

*Table 8.1. Scalability Plan*

**Capacity Targets:**
*   1,000+ concurrent users
*   10,000+ stored videos
*   100GB+ monthly video uploads

## 8.5. Disaster Recovery and Business Continuity Plan

**Backup Strategy:**

*   **Database:** Daily automated backups, 30-day retention
*   **S3 Storage:** Versioning enabled, cross-region replication (optional)
*   **Code:** GitHub repository with multiple collaborators

**Recovery Procedures:**

*   **Database Recovery:** Restore from Neon backup, RTO < 1 hour
*   **S3 Recovery:** Retrieve versioned objects, RPO < 1 day
*   **Application Recovery:** Redeploy from GitHub, RTO < 30 minutes

**Incident Response:**

*   Monitor uptime via Vercel/AWS dashboards
*   Alert notifications for service degradation
*   Documented runbooks for common failure scenarios

**Targets:**
*   RTO (Recovery Time Objective): < 2 hours
*   RPO (Recovery Point Objective): < 24 hours

---

# 9. Plan Annexes

## Annex A: Module Summary Table

| MODULE | FEATURES | PRIMARY ACTOR | BRIEF DESCRIPTION |
| :--- | :--- | :--- | :--- |
| Module 1 | User Authentication | User | Sign-up, sign-in, sign-out, profile management |
| Module 2 | Subscription & Billing | User | View plan, upgrade to PRO via Stripe |
| Module 3 | Workspace Management | User, PRO User | Create/manage workspaces, view members |
| Module 4 | Workspace Invitation | Workspace Owner | Invite members, accept/decline, remove members |
| Module 5 | Folder Management | User | Create/rename/delete folders, organize videos |
| Module 6 | Video Recording | User | Desktop screen capture, audio recording |
| Module 7 | Video Upload | User | Web upload, processing pipeline |
| Module 8 | Video AI Processing | PRO User | Transcription, title/summary generation |
| Module 9 | Video Management | User, Author | Edit, move, delete, download videos |
| Module 10 | Video Viewing | User | Playback, view tracking, likes |
| Module 11 | Video Comments | User | Post comments, nested replies |
| Module 12 | Notifications | User | View/manage notifications |
| Module 13 | Search & Discovery | User | Global search, quick suggestions |
| Module 14 | Desktop App Management | User | Auto-updates, version management |

*Table 9.1. Module Summary*

## Annex B: Documentation Index

| DOCUMENT | VERSION | LOCATION |
| :--- | :--- | :--- |
| Software Requirements Specification (SRS) | 1.0 | `/docs/srs-sections.md` |
| Software Design Description (SDD) | 1.0 | `/docs/architecture.md` |
| Software Project Management Plan (SPMP) | 1.0 | `/docs/project-management.md` |
| Software Test Document (STD) | 1.0 | `/docs/test-document.md` |
| Features List | 1.0 | `/docs/features-list.md` |
| Module Documentation | 1.0 | `/docs/module-*/` |

*Table 9.2. Documentation Index*

---

# 10. Index

| TERM | SECTION |
| :--- | :--- |
| Accessibility Plan | 8.1 |
| Assumptions and Constraints | 1.1.2 |
| Budget Allocation | 5.2.4 |
| Configuration Management | 7.1 |
| Control Plan | 5.3 |
| Definitions | 3 |
| Disaster Recovery | 8.5 |
| Documentation Plan | 7.3 |
| Evolution of Plan | 1.2 |
| External Structure | 4.1 |
| Infrastructure Plan | 6.3 |
| Internal Structure | 4.2 |
| Metrics Collection | 5.3.6 |
| Problem Resolution | 7.6 |
| Process Model | 6.1 |
| Product Acceptance | 6.4 |
| Project Deliverables | 1.1.3 |
| Quality Assurance | 7.4 |
| References | 2 |
| Requirements Control | 5.3.1 |
| Resource Allocation | 5.2.3 |
| Risk Management | 5.3.7 |
| Roles and Responsibilities | 4.3 |
| Scalability Plan | 8.4 |
| Schedule Allocation | 5.2.2 |
| Scope | 1.1.1 |
| Security Plan | 8.2 |
| Staffing Plan | 5.1.2 |
| Subcontractor Management | 7.7 |
| Technical Process Plan | 6 |
| Verification and Validation | 7.2 |
| Work Activities | 5.2.1 |

*Table 10.1. Alphabetical Index of Key Terms*

---

*Document Version: 1.0*
*Authors: Ashley Ken Comandao, Ana Alimurung*
*Last Updated: January 2026*

