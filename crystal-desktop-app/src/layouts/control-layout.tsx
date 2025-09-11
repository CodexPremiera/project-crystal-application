import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X, Bug } from "lucide-react";
import React, { useState } from "react";

type ControlLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const ControlLayout = ({ children, className }: ControlLayoutProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    console.log(event);
    setIsVisible(payload.state);
  });
  return (
    <div
      className={cn(
        className,
        isVisible && "invisible",
        "bg-[#171717] border-neutral-700"
      )}>
      <div className="flex justify-between items-center p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>
        <div className="flex items-center gap-2 non-draggable">
          <Bug
            size={20}
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={() => window.ipcRenderer.send("open-devtools")}
            title="Open DevTools (Debug Console)"
          />
          <X
            size={20}
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={onCloseApp}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
      <div className="p-5 flex w-full">
        <div className="flex items-center gap-x-2">
          <img src="/crystal-logo.svg" alt="Crystal Logo"/>
          <p className="text-white text-2xl">Crystal</p>
        </div>
      </div>
    </div>
  );
};
