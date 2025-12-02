"use client";

import InstallationGuide from "@/components/global/installation-guide";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Monitor, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DownloadPage() {
  const [platform, setPlatform] = useState<'windows' | 'mac' | 'linux'>('windows');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) setPlatform('windows');
    else if (userAgent.indexOf('mac') !== -1) setPlatform('mac');
    else if (userAgent.indexOf('linux') !== -1) setPlatform('linux');
  }, []);

  // GitHub Releases - always downloads the latest version
  const downloadLinks = {
    windows: 'https://github.com/CodexPremiera/project-crystal-application/releases/latest/download/Crystal-Windows-Setup.exe',
    mac: 'https://github.com/CodexPremiera/project-crystal-application/releases/latest/download/Crystal-Mac-Installer.dmg',
    linux: 'https://github.com/CodexPremiera/project-crystal-application/releases/latest/download/Crystal-Linux.AppImage'
  };

  return (
    <main className="flex flex-col mt-32 gap-16 items-center w-full px-4">
      <Link 
        href="/" 
        className="self-start ml-4 flex items-center gap-2 text-[#9D9D9D] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <section className="flex flex-col gap-8 w-full h-fit items-center">
        <div className="flex flex-col w-full gap-6 max-w-[960px]">
          <div className="gap-2 flex flex-col w-full items-center text-center">
            <h1 className="text-5xl font-extrabold">Download Crystal</h1>
            <p className="text-lg text-[#9D9D9D]">
              Choose your platform and start recording with AI-powered screen capture
            </p>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <ShieldAlert className="h-5 w-5 text-yellow-500" />
            <AlertDescription className="text-sm">
              <strong>Important:</strong> You may see security warnings during download and installation. 
              This is normal for new applications. See the installation instructions below for step-by-step guidance.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4 w-full flex-wrap justify-center mt-4">
            <a 
              href={downloadLinks.windows}
              download
              className={`flex flex-col gap-3 p-6 rounded-2xl flex-1 min-w-[200px] max-w-[280px] ${platform === 'windows' ? 'bg-blue-radial-gradient' : 'bg-dark-radial-gradient border border-white/5'} hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">Windows</span>
                  <span className="text-xs text-[#9D9D9D]">Windows 10+</span>
                </div>
              </div>
              <Button className="rounded-lg w-full" variant={platform === 'windows' ? 'default' : 'secondary'}>
                <Download className="w-4 h-4" />
                Download
              </Button>
              <div className="flex flex-col gap-1 text-xs text-[#9D9D9D] text-center">
                <span>Latest • ~90 MB</span>
              </div>
            </a>

            <a 
              href={downloadLinks.mac}
              download
              className={`flex flex-col gap-3 p-6 rounded-2xl flex-1 min-w-[200px] max-w-[280px] ${platform === 'mac' ? 'bg-blue-radial-gradient' : 'bg-dark-radial-gradient border border-white/5'} hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">macOS</span>
                  <span className="text-xs text-[#9D9D9D]">macOS 10.15+</span>
                </div>
              </div>
              <Button className="rounded-lg w-full" variant={platform === 'mac' ? 'default' : 'secondary'}>
                <Download className="w-4 h-4" />
                Download
              </Button>
              <div className="flex flex-col gap-1 text-xs text-[#9D9D9D] text-center">
                <span>Latest • ~95 MB</span>
              </div>
            </a>

            <a 
              href={downloadLinks.linux}
              download
              className={`flex flex-col gap-3 p-6 rounded-2xl flex-1 min-w-[200px] max-w-[280px] ${platform === 'linux' ? 'bg-blue-radial-gradient' : 'bg-dark-radial-gradient border border-white/5'} hover:scale-105 transition-transform`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">Linux</span>
                  <span className="text-xs text-[#9D9D9D]">Ubuntu 18.04+</span>
                </div>
              </div>
              <Button className="rounded-lg w-full" variant={platform === 'linux' ? 'default' : 'secondary'}>
                <Download className="w-4 h-4" />
                Download
              </Button>
              <div className="flex flex-col gap-1 text-xs text-[#9D9D9D] text-center">
                <span>Latest • ~90 MB</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8 w-full h-fit pb-20 items-center">
        <div className="flex flex-col w-full gap-2 max-w-[960px] text-center">
          <h2 className="text-4xl font-extrabold">How to Install Crystal</h2>
          <span className="text-[#9D9D9D]">Follow these simple steps to get Crystal up and running</span>
        </div>
        <InstallationGuide />
      </section>
    </main>
  );
}


