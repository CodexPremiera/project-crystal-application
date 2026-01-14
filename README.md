<div align="center">

<img src="crystal-web-app/public/crystal-logo.svg" alt="Crystal Logo" width="120" height="120">

# Crystal

### AI-Powered Screen Recording & Video Management Platform

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?style=for-the-badge)](https://github.com/CodexPremiera/project-crystal-application)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

<p align="center">
  <strong>Record • Upload • Transcribe • Collaborate</strong>
</p>

<p align="center">
  A comprehensive platform for screen recording, video management, and team collaboration<br/>
  with AI-powered transcription and smart content generation.
</p>

---

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📖 About

**Crystal** is a full-stack video management platform that combines a powerful **Next.js web application** with an **Electron desktop recorder** and an **Express video processing server**. It enables users to record their screens, upload videos, and organize content within personal or collaborative workspaces—all enhanced by AI-powered transcription and summarization.

Whether you're a content creator, educator, or team collaborating on projects, Crystal streamlines the entire video workflow from capture to sharing.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎬 Screen Recording
- Cross-platform desktop app (Windows)
- Screen & audio capture
- Quality presets (SD/HD for PRO)
- Real-time chunk streaming
- Webcam overlay preview

</td>
<td width="50%">

### 📤 Video Upload & Processing
- Drag-and-drop web upload
- Progress tracking
- Automatic cloud storage (AWS S3)
- Global CDN delivery (CloudFront)
- Background processing pipeline

</td>
</tr>
<tr>
<td width="50%">

### 🤖 AI-Powered Features (PRO)
- Automatic transcription (OpenAI Whisper)
- AI-generated titles & summaries (GPT-3.5)
- Timestamped transcript navigation
- Voiceflow knowledge base integration
- Smart content tagging

</td>
<td width="50%">

### 👥 Workspace Collaboration
- Personal & public workspaces
- Team invitations & member management
- Folder-based organization
- Role-based access control
- Real-time notifications

</td>
</tr>
<tr>
<td width="50%">

### 💬 Video Interaction
- View & like tracking
- Nested comment threads
- Video sharing with link copy
- Engagement notifications
- Author attribution

</td>
<td width="50%">

### 🔍 Search & Discovery
- Global content search
- Real-time suggestions
- Filter by workspace/folder
- Access-controlled results
- User search for invitations

</td>
</tr>
</table>

---

## 🛠 Tech Stack

### Frontend (Web Application)

![Next.js](https://img.shields.io/badge/Next.js-15.4.8-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.14.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 15.4.8 | React framework with App Router & Server Actions |
| React | 19.1.0 | UI component library |
| TypeScript | 5.x | Type-safe development |
| Tailwind CSS | 4.x | Utility-first styling |
| Prisma | 6.14.0 | Type-safe database ORM |
| TanStack Query | 5.85.5 | Server state management |
| Redux Toolkit | 2.8.2 | Client state management |
| Zod | 4.0.17 | Schema validation |
| Radix UI | Latest | Accessible component primitives |

### Desktop Application

![Electron](https://img.shields.io/badge/Electron-30.0.1-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)

| Package | Version | Purpose |
|---------|---------|---------|
| Electron | 30.0.1 | Cross-platform desktop framework |
| Vite | 5.1.6 | Fast development & bundling |
| React | 18.2.0 | UI components |
| Socket.IO Client | 4.8.1 | Real-time video chunk streaming |
| electron-updater | 6.6.2 | Automatic app updates |

### Backend (Express Server)

![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-5.20.0-412991?style=for-the-badge&logo=openai&logoColor=white)

| Package | Version | Purpose |
|---------|---------|---------|
| Express | 5.1.0 | HTTP server framework |
| Socket.IO | 4.8.1 | WebSocket server for streaming |
| OpenAI | 5.20.0 | Whisper & GPT API integration |
| AWS SDK | 3.884.0 | S3 storage operations |
| FFmpeg | 1.1.0 | Audio extraction from video |
| Multer | 2.0.2 | File upload handling |

### External Services

![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-S3%20%2B%20CloudFront-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

| Service | Purpose |
|---------|---------|
| **Clerk** | Authentication (Google OAuth) |
| **Stripe** | Subscription & payment processing |
| **AWS S3** | Video file storage |
| **AWS CloudFront** | Global CDN for video delivery |
| **PostgreSQL** | Primary database |
| **OpenAI Whisper** | Audio transcription |
| **OpenAI GPT-3.5** | Title & summary generation |
| **Voiceflow** | AI knowledge base |

---

## 📁 Project Structure

```
crystal-application/
├── crystal-web-app/          # 🌐 Next.js 15 Web Application
│   ├── src/
│   │   ├── app/              # App Router pages & API routes
│   │   ├── components/       # React components (170+)
│   │   ├── actions/          # Server Actions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities & configurations
│   │   ├── redux/            # Redux store & slices
│   │   └── services/         # API service functions
│   ├── prisma/               # Database schema & migrations
│   └── public/               # Static assets
│
├── crystal-desktop-app/      # 🖥️ Electron Desktop Recorder
│   ├── electron/             # Main process (Electron)
│   ├── src/                  # Renderer process (React)
│   │   ├── components/       # Desktop UI components
│   │   └── hooks/            # Desktop-specific hooks
│   └── release/              # Built installers
│
├── crystal-express/          # ⚡ Express Video Processing Server
│   ├── server.js             # Main server entry
│   └── temp_upload/          # Temporary video storage
│
└── docs/                     # 📚 Documentation
    ├── architecture.md       # System architecture
    ├── features-list.md      # Feature specifications
    ├── srs-sections.md       # Software Requirements Spec
    ├── spmp.md               # Project Management Plan
    ├── std.md                # Software Test Document
    └── module-*/             # Module-specific docs
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed/configured:

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | 18+ | Required for all applications |
| **npm** | 9+ | Package manager |
| **PostgreSQL** | 14+ | Database (or use Neon/Supabase) |
| **FFmpeg** | Latest | For video/audio processing |
| **Git** | Latest | Version control |

### External Accounts Required

| Service | Purpose | Sign Up |
|---------|---------|---------|
| **Clerk** | Authentication | [clerk.com](https://clerk.com) |
| **Stripe** | Payments | [stripe.com](https://stripe.com) |
| **AWS** | S3 + CloudFront | [aws.amazon.com](https://aws.amazon.com) |
| **OpenAI** | AI APIs | [platform.openai.com](https://platform.openai.com) |

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/CodexPremiera/project-crystal-application.git
cd crystal-application
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install web app dependencies
cd crystal-web-app
npm install

# Install desktop app dependencies
cd ../crystal-desktop-app
npm install

# Install express server dependencies
cd ../crystal-express
npm install
```

### 3. Configure Environment Variables

#### Web Application (`crystal-web-app/.env.local`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crystal"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Stripe Payments
STRIPE_CLIENT_SECRET="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AWS Configuration
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET_NAME="crystal-videos"
AWS_REGION="us-east-1"
CLOUDFRONT_DOMAIN="d123.cloudfront.net"

# OpenAI
OPENAI_API_KEY="sk-..."

# Application URLs
NEXT_PUBLIC_HOST_URL="http://localhost:3000"
EXPRESS_SERVER_URL="http://localhost:5001"

# Email (Nodemailer)
MAILER_EMAIL="your-email@gmail.com"
MAILER_PASSWORD="app-specific-password"
```

#### Desktop Application (`crystal-desktop-app/.env`)

```env
VITE_HOST_URL="http://localhost:3000"
VITE_EXPRESS_URL="http://localhost:5001"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

#### Express Server (`crystal-express/.env`)

```env
PORT=5001
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET_NAME="crystal-videos"
AWS_REGION="us-east-1"
OPENAI_API_KEY="sk-..."
NEXT_APP_URL="http://localhost:3000"
```

### 4. Set Up Database

```bash
cd crystal-web-app

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio
npx prisma studio
```

### 5. Start Development Servers

Open **3 terminal windows**:

```bash
# Terminal 1: Web Application (http://localhost:3000)
cd crystal-web-app
npm run dev

# Terminal 2: Express Server (http://localhost:5001)
cd crystal-express
npm run dev

# Terminal 3: Desktop Application
cd crystal-desktop-app
npm run dev
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com) and import your GitHub repository
   - Select `crystal-web-app` as the root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: prisma generate && next build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Set Environment Variables**
   - Add all variables from `.env.local` to Vercel's Environment Variables section
   - Use production values (Clerk production keys, production database URL, etc.)

4. **Deploy**
   - Click Deploy and wait for the build to complete
   - Your app will be available at `your-project.vercel.app`

### Backend Deployment (AWS EC2 / Railway / Render)

#### Option A: AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS, t3.small or larger
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install FFmpeg
   sudo apt install -y ffmpeg
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone and Configure**
   ```bash
   git clone https://github.com/CodexPremiera/project-crystal-application.git
   cd crystal-application/crystal-express
   npm install
   
   # Create .env file with production values
   nano .env
   ```

3. **Start with PM2**
   ```bash
   pm2 start server.js --name crystal-express
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### Option B: Railway

1. Create new project on [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set root directory to `crystal-express`
4. Add environment variables
5. Deploy

### Desktop App Release (GitHub Releases)

1. **Update Version** in `crystal-desktop-app/package.json`

2. **Build Installers**
   ```bash
   cd crystal-desktop-app
   npm run build
   ```

3. **Publish to GitHub Releases**
   - Built files will be in `crystal-desktop-app/release/`
   - Upload `.exe` (Windows), `.dmg` (macOS), `.AppImage` (Linux) to GitHub Releases
   - electron-updater will automatically detect new releases

---

## 🏗️ Architecture

Crystal follows a **multi-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                               │
│  ┌─────────────────┐              ┌─────────────────────────┐   │
│  │   Web App       │              │     Desktop App          │   │
│  │   (Next.js)     │              │     (Electron)           │   │
│  └────────┬────────┘              └────────────┬─────────────┘   │
└───────────┼────────────────────────────────────┼─────────────────┘
            │                                    │
            ▼                                    ▼
┌───────────────────────────────────────────────────────────────────┐
│                       BACKEND TIER                                 │
│  ┌─────────────────────────┐    ┌─────────────────────────────┐   │
│  │   Next.js API           │    │   Express Server             │   │
│  │   (Server Actions)      │    │   (Video Processing)         │   │
│  │   • Auth middleware     │    │   • Socket.IO streaming      │   │
│  │   • Business logic      │    │   • FFmpeg processing        │   │
│  │   • Prisma ORM          │    │   • S3 upload                │   │
│  └────────────┬────────────┘    └──────────────┬──────────────┘   │
└───────────────┼─────────────────────────────────┼─────────────────┘
                │                                 │
                ▼                                 ▼
┌───────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────────┐   │
│  │ Clerk  │ │ Stripe │ │   S3   │ │  CDN   │ │    OpenAI      │   │
│  │ (Auth) │ │ (Pay)  │ │(Store) │ │(Serve) │ │ (AI Process)   │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│                        DATA TIER                                   │
│              ┌─────────────────────────────┐                       │
│              │       PostgreSQL            │                       │
│              │   (Users, Videos, etc.)     │                       │
│              └─────────────────────────────┘                       │
└───────────────────────────────────────────────────────────────────┘
```

For detailed architecture documentation, see [`docs/architecture.md`](docs/architecture.md).

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📋 Software Requirements Specification](docs/srs-sections.md) | Functional & non-functional requirements |
| [🏗️ Architecture Design](docs/architecture.md) | System architecture & component design |
| [📊 Project Management Plan](docs/spmp.md) | Schedule, resources, risk management |
| [🧪 Software Test Document](docs/std.md) | Test cases for all 14 modules |
| [📝 Features List](docs/features-list.md) | Complete feature specifications |

### Module Documentation

Detailed documentation for each module is available in `docs/module-*/`:

- Module 1: User Authentication & Account Management
- Module 2: Subscription & Billing
- Module 3: Workspace Creation & Management
- Module 4: Workspace Invitation & Membership
- Module 5: Folder Management
- Module 6: Video Recording (Desktop App)
- Module 7: Video Upload & Processing
- Module 8: Video AI Processing (PRO Feature)
- Module 9: Video Management
- Module 10: Video Viewing & Interaction
- Module 11: Video Comments
- Module 12: Notifications
- Module 13: Search & Discovery
- Module 14: Desktop App Management

---

## 🧑‍💻 Authors

<table>
<tr>
<td align="center">
<strong>Ashley Ken Comandao</strong><br/>
Project Lead • Full-stack Developer • DevOps
</td>
<td align="center">
<strong>Ana Alimurung</strong><br/>
Documentation • UI/UX Designer • Developer
</td>
</tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ using Next.js, Electron, and modern web technologies**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-blue?style=flat-square&logo=react)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)

</div>
