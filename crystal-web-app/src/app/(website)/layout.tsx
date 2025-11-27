import { ReactNode } from "react";
import LandingPageNavBar from "@/app/(website)/_components/navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col gap-10 w-full bg-[#111111]">
      <LandingPageNavBar />
      {children}
    </div>
  );
}
