import { ReactNode } from "react";
import LandingPageNavBar from "@/app/(website)/_components/navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col py-10 px-10 w-full">
        <LandingPageNavBar />
      {children}
    </div>
  );
}
