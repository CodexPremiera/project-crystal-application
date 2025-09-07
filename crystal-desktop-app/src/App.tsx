import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css'
import {Toaster} from "sonner";
import {ControlLayout} from "@/layouts/control-layout.tsx";
import {AuthButton} from "@/components/global/auth-button.tsx";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <ControlLayout>
        <AuthButton />
        {/*
        <Widget />*/}
      </ControlLayout>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
