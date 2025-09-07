import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './App.css'
import {Toaster} from "sonner";
import {ControlLayout} from "@/layouts/control-layout.tsx";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <ControlLayout>
        <></>
        {/*<AuthButton />
        <Widget />*/}
      </ControlLayout>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
