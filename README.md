# Crystal - AI-Powered Video Sharing Platform

> Share AI-powered videos with your friends and collaborate seamlessly across workspaces.

Crystal is a modern video sharing platform that combines AI-powered features with collaborative workspace management, enabling users to create, organize, and share videos with advanced commenting, notification systems, and team collaboration tools.

## 🚀 Key Features

### 📹 Video Management & Organization
- **Smart Video Organization**: Create and manage folders within workspaces to organize your video content efficiently
- **Video Upload & Processing**: Upload videos with automatic processing and optimization
- **Video Metadata Management**: Edit video titles, descriptions, and other metadata with real-time updates
- **Video Preview & Playback**: Full-featured video player with playback controls and responsive design
- **Video Sharing**: Generate shareable links for videos with copy-to-clipboard functionality
- **Video Location Management**: Move videos between folders and workspaces with drag-and-drop interface

### 🏢 Workspace Collaboration
- **Multi-Workspace Support**: Create and manage multiple workspaces for different projects or teams
- **Workspace Types**: 
  - **Personal Workspaces**: Private spaces for individual use
  - **Public Workspaces**: Collaborative spaces for team projects
- **Team Invitations**: Invite users to workspaces via email with secure invitation links
- **Workspace Access Control**: Secure access management with ownership and membership verification
- **Workspace Switching**: Seamless navigation between different workspaces

### 💬 Interactive Communication
- **Advanced Commenting System**: 
  - Top-level comments on videos
  - Nested reply system for threaded conversations
  - Real-time comment updates
  - User attribution with profile integration
- **Notification Center**: 
  - Workspace invitation notifications
  - Video first-view alerts
  - System notifications and updates
  - Centralized notification management

### 🔔 Smart Notifications
- **First-View Notifications**: Get notified when your videos receive their first view
- **Email Integration**: Receive email notifications for important events
- **In-App Notifications**: Real-time notifications within the application
- **Notification Preferences**: Customize which notifications you want to receive
- **Client Outreach Tools**: Perfect for tracking video engagement during client presentations

### 🎨 User Experience & Customization
- **Theme System**: 
  - Dark Mode for comfortable viewing
  - Light Mode for bright environments
  - System Mode that follows your device preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean sidebar navigation with workspace context
- **Search Functionality**: Find users and content quickly with debounced search

### 💳 Subscription & Billing
- **Flexible Plans**:
  - **FREE Plan**: Basic features for individual users
  - **PRO Plan**: Advanced features for power users and teams
- **Secure Payment Processing**: Integrated with Stripe for secure subscription management
- **Billing Transparency**: Clear pricing display and payment history
- **Easy Upgrades**: Seamless upgrade process with immediate feature access

### 🔐 Security & Authentication
- **Secure Authentication**: Powered by Clerk for enterprise-grade security
- **User Profile Management**: Complete user profiles with avatars and preferences
- **Access Control**: Role-based access to workspaces and content
- **Data Protection**: Secure handling of user data and video content

## 🛠️ Technical Features

### ⚡ Performance & Reliability
- **Server-Side Rendering (SSR)**: Fast initial page loads with Next.js
- **Data Prefetching**: Intelligent data caching with React Query
- **Optimistic Updates**: Immediate UI feedback for better user experience
- **Database Health Monitoring**: Built-in database connection monitoring
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 🔄 Real-Time Features
- **Live Data Updates**: Real-time updates for comments, notifications, and workspace changes
- **Optimistic UI**: Immediate feedback for user actions
- **Cache Management**: Smart caching strategy for optimal performance
- **Background Sync**: Automatic data synchronization

## 📱 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Clerk account (for authentication)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd crystal-application

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Configure your environment variables

# Set up the database
npx prisma migrate dev
npx prisma generate

# Start the development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."

# Payments
STRIPE_CLIENT_SECRET="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."

# Email
MAILER_EMAIL="..."
MAILER_PASSWORD="..."

# Application
NEXT_PUBLIC_HOST_URL="http://localhost:3000"
```

## 🎯 Use Cases

### 👥 Team Collaboration
- **Project Management**: Organize project videos in dedicated workspaces
- **Client Presentations**: Share videos with clients and track engagement
- **Team Reviews**: Collaborate on video content with threaded comments
- **Knowledge Sharing**: Create video libraries for team knowledge

### 🎓 Content Creation
- **Video Organization**: Organize content by topic, project, or audience
- **Engagement Tracking**: Monitor video views and user interactions
- **Content Management**: Edit metadata and organize content efficiently
- **Sharing & Distribution**: Share videos with specific teams or individuals

### 💼 Business Applications
- **Client Outreach**: Track when clients view your videos
- **Training Materials**: Create organized video training libraries
- **Product Demos**: Share product demonstrations with prospects
- **Internal Communications**: Distribute company updates and announcements

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run dev:stable   # Start development server (stable)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:health    # Check database connection health
npm run db:reset     # Reset database connection pool

# Code Quality
npm run lint         # Run ESLint
```

## 🏗️ Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **React Query**: Server state management
- **Redux Toolkit**: Client state management

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Primary database
- **Clerk**: Authentication and user management
- **Stripe**: Payment processing
- **Nodemailer**: Email notifications

### Key Integrations
- **Clerk Authentication**: Secure user authentication and management
- **Stripe Payments**: Subscription and billing management
- **Email Notifications**: Automated email system for invitations and alerts
- **Database Monitoring**: Health checks and connection management

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:
- **Users**: User profiles, authentication, and preferences
- **Workspaces**: Collaborative spaces with access control
- **Folders**: Video organization within workspaces
- **Videos**: Video content with metadata and processing status
- **Comments**: Threaded commenting system with replies
- **Notifications**: User notification system
- **Subscriptions**: User subscription and billing information
- **Invitations**: Workspace invitation management

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on how to:
- Report bugs
- Suggest new features
- Submit pull requests
- Set up the development environment

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
- Check our documentation
- Open an issue on GitHub
- Contact our support team

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**