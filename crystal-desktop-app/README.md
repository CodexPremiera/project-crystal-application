# Crystal Desktop App

A professional screen recording desktop application built with Electron, React, and TypeScript. Crystal provides seamless screen capture with audio recording, real-time preview, and cloud-based video processing.

## 🎯 Overview

Crystal Desktop App is a multi-window Electron application that enables users to record their screen with audio, manage recording settings, and process videos through a cloud-based backend. The application features three main windows:

1. **Control Panel** - Main configuration interface
2. **Studio Tray** - Recording controls and preview
3. **Webcam Window** - Optional camera feed

## 🏗️ Architecture

### Application Structure

```
crystal-desktop-app/
├── electron/           # Electron main process
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and core logic
│   ├── layouts/        # Layout components
│   └── schemas/        # Zod validation schemas
├── public/             # Static assets
└── dist-electron/      # Built Electron files
```

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop**: Electron 30
- **State Management**: React Query, React Hooks
- **Authentication**: Clerk
- **Validation**: Zod
- **UI Components**: Radix UI, Lucide React
- **Real-time Communication**: Socket.IO
- **Build Tools**: Vite, Electron Builder

## 🚀 Features

### Core Functionality

1. **Screen Recording**
   - Multi-monitor support
   - HD (1080p) and SD (720p) recording presets
   - Real-time preview
   - Audio capture from system and microphones

2. **User Management**
   - Clerk-based authentication
   - User profile management
   - Subscription plans (FREE/PRO)

3. **Media Configuration**
   - Display source selection
   - Audio input device selection
   - Recording quality presets
   - Settings persistence

4. **Recording Controls**
   - Start/stop recording
   - Real-time timer
   - Preview toggle
   - Automatic recording limits (5 minutes for FREE plan)

5. **Cloud Processing**
   - Real-time video chunk upload
   - Server-side video processing
   - WebSocket-based communication

## 🪟 Window Management

### Main Control Window
- **Purpose**: Primary configuration interface
- **Size**: 600x600px (minimum 300x600px)
- **Features**: Always on top, frameless, transparent
- **Content**: User authentication, media configuration

### Studio Tray Window
- **Purpose**: Recording controls and preview
- **Size**: 400x50px (expandable to 400x400px)
- **Features**: Draggable, resizable, always on top
- **Content**: Recording buttons, timer, preview video

### Webcam Window
- **Purpose**: Optional camera feed
- **Size**: 400x200px (expandable to 400x400px)
- **Features**: Draggable, always on top
- **Content**: Live camera stream

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Environment Variables

Create a `.env` file with:

```env
VITE_HOST_URL=your_backend_url
VITE_SOCKET_URL=your_socket_url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

## 📱 Usage

### Getting Started

1. **Launch Application**: The app opens with three windows
2. **Authenticate**: Sign in using Clerk authentication
3. **Configure Media**: Select display and audio sources
4. **Start Recording**: Use the studio tray controls
5. **Monitor Progress**: Watch the timer and preview
6. **Stop Recording**: Click stop to process the video

### Recording Workflow

1. **Media Selection**: Choose display source and audio input
2. **Quality Setting**: Select HD (PRO) or SD (FREE) preset
3. **Preview**: Toggle preview to see recording area
4. **Record**: Click record button to start
5. **Monitor**: Watch timer and recording status
6. **Stop**: Click stop to end recording and process

### Subscription Plans

- **FREE**: 720p recording, 5-minute limit
- **PRO**: 1080p recording, unlimited duration

## 🔌 API Integration

### Backend Communication

- **User Profile**: `GET /auth/{clerkId}`
- **Studio Settings**: `POST /studio/{id}`
- **Video Processing**: WebSocket events

### IPC Communication

- **Media Sources**: `getSources` - Get available displays
- **Window Control**: `closeApp`, `resize-studio`, `hide-plugin`
- **Media Sync**: `media-sources` - Sync settings between windows

## 🎨 UI Components

### Key Components

- **Widget**: Main configuration interface
- **MediaConfiguration**: Source selection forms
- **StudioTray**: Recording controls
- **WebCam**: Camera feed display
- **ControlLayout**: Window layout wrapper

### Styling

- **Framework**: Tailwind CSS
- **Theme**: Dark mode with custom color palette
- **Icons**: Lucide React
- **Components**: Radix UI primitives

## 🔒 Security

- **Context Isolation**: Enabled in Electron
- **Node Integration**: Disabled for renderer processes
- **Preload Scripts**: Secure IPC communication
- **Authentication**: Clerk-based user management

## 📊 Performance

### Optimization Features

- **Lazy Loading**: Components load on demand
- **Efficient State**: React Query for server state
- **Memory Management**: Proper cleanup of media streams
- **Chunked Upload**: Real-time video chunk processing

## 🐛 Troubleshooting

### Common Issues

1. **Media Access**: Ensure proper permissions for screen/audio
2. **Window Visibility**: Check always-on-top settings
3. **Recording Quality**: Verify display resolution and preset
4. **Network Issues**: Check WebSocket connection

### Debug Mode

Enable developer tools in Electron for debugging:
- Main process: Built-in DevTools
- Renderer process: Chrome DevTools

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

---

For detailed component documentation, see the individual component files in the `src/components/` directory.