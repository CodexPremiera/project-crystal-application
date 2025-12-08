import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X, Bug, Minus } from "lucide-react";
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
        "bg-[#171717] border-neutral-700 rounded-2xl"
      )}>
      <div className="flex justify-between items-center p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>
        <div className="flex items-center gap-x-4 non-draggable">
          <div title="Open DevTools (Debug Console)">
            <Bug
              size={18}
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={() => window.ipcRenderer.send("open-devtools")}
            />
          </div>
          <Minus
            size={20}
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={() => window.ipcRenderer.send("minimize-window")}
          />
          <X
            size={20}
            className="text-gray-400 hover:text-white cursor-pointer"
            onClick={onCloseApp}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
      <div className="p-5 flex w-full mt-1">
        <div className="flex items-center gap-x-2">
          <img src="./crystal-logo.svg" alt="Crystal Logo" className="w-8 h-8"/>
          <p className="text-white text-lg font-semibold">Crystal</p>
        </div>
      </div>
    </div>
  );
};
