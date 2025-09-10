import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css'
import {Toaster} from "sonner";
import {ControlLayout} from "@/layouts/control-layout.tsx";
import {AuthButton} from "@/components/global/auth-button.tsx";
import {Widget} from "@/components/global/widget/widget.tsx";

const client = new QueryClient();

/**
 * Main application component for the Crystal Desktop App control panel.
 * 
 * This component serves as the root of the main control window, providing:
 * - React Query client for server state management
 * - Control layout wrapper with window management
 * - User authentication interface
 * - Media configuration widget
 * - Toast notifications system
 * 
 * The app integrates with Electron's main process through IPC communication
 * and manages the primary user interface for screen recording configuration.
 */
function App() {
  return (
    <QueryClientProvider client={client}>
      <ControlLayout>
        <AuthButton />
        <Widget />
      </ControlLayout>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
