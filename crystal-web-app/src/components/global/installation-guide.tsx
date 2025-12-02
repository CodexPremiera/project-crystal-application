"use client";

import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, AlertCircle, Info } from "lucide-react";

export default function InstallationGuide() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[960px]">
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <ShieldCheck className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-sm">
          <strong>Security Notice:</strong> You may see browser and system warnings when downloading and installing Crystal. 
          This is normal for new applications without a digital certificate. Your download is safe.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#9D9D9D]" />
          <h3 className="text-2xl font-bold">Installation Instructions</h3>
        </div>
        <p className="text-[#9D9D9D] text-sm">
          Follow the steps below for your operating system to successfully install Crystal.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="windows" className="w-full">
        <AccordionItem value="windows" className="border border-white/5 rounded-lg px-4 mb-3">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Windows Installation (Windows 10+)
          </AccordionTrigger>
          <AccordionContent className="text-sm text-[#9D9D9D] space-y-4 pt-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p className="font-semibold text-white mb-1">Download the installer</p>
                  <p>Click the Windows download button above. The .exe file will begin downloading.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p className="font-semibold text-white mb-1">Bypass browser security warning</p>
                  <p className="mb-2">Your browser may block the download with a security warning. To proceed:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Chrome/Edge:</strong> Click the &quot;⋮&quot; (three dots) next to the blocked file → Click &quot;Keep&quot; → Click &quot;Keep anyway&quot;</li>
                    <li><strong>Firefox:</strong> Click the download arrow → Right-click the file → Select &quot;Allow download&quot;</li>
                  </ul>
                  <Alert className="mt-3 bg-yellow-500/10 border-yellow-500/50">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-xs text-yellow-200">
                      This warning appears because Crystal is a new app without a code signing certificate. Your download is safe.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p className="font-semibold text-white mb-1">Run the installer</p>
                  <p>Open the downloaded <code className="bg-white/5 px-1 rounded">Crystal-Windows-0.0.1-Setup.exe</code> file.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <p className="font-semibold text-white mb-1">Bypass Windows SmartScreen</p>
                  <p className="mb-2">Windows may show a &quot;Windows protected your PC&quot; warning. To proceed:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click <strong>&quot;More info&quot;</strong> on the SmartScreen dialog</li>
                    <li>Click <strong>&quot;Run anyway&quot;</strong> at the bottom</li>
                  </ol>
                  <Alert className="mt-3 bg-yellow-500/10 border-yellow-500/50">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-xs text-yellow-200">
                      SmartScreen warns about unsigned applications. Crystal is safe but doesn&apos;t have an Extended Validation certificate yet.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">5</span>
                <div>
                  <p className="font-semibold text-white mb-1">Complete installation</p>
                  <p>Follow the installation wizard. You can choose your installation location and preferences.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">6</span>
                <div>
                  <p className="font-semibold text-white mb-1">Launch Crystal</p>
                  <p>Once installed, launch the app and sign in with your Crystal account. You&apos;re ready to start recording!</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mac" className="border border-white/5 rounded-lg px-4 mb-3">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            macOS Installation (macOS 10.15+)
          </AccordionTrigger>
          <AccordionContent className="text-sm text-[#9D9D9D] space-y-4 pt-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p className="font-semibold text-white mb-1">Download the installer</p>
                  <p>Click the macOS download button above. The .dmg file will begin downloading.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p className="font-semibold text-white mb-1">Open the DMG file</p>
                  <p>Double-click the downloaded <code className="bg-white/5 px-1 rounded">Crystal-Mac-0.0.1-Installer.dmg</code> file to mount it.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p className="font-semibold text-white mb-1">Drag Crystal to Applications</p>
                  <p>In the opened window, drag the Crystal app icon to the Applications folder.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <p className="font-semibold text-white mb-1">Bypass Gatekeeper warning</p>
                  <p className="mb-2">When you first open Crystal, macOS may show &quot;Crystal cannot be opened&quot; warning. To proceed:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Go to <strong>System Preferences → Security &amp; Privacy</strong></li>
                    <li>Click the <strong>&quot;Open Anyway&quot;</strong> button next to the Crystal message</li>
                    <li>Confirm by clicking <strong>&quot;Open&quot;</strong> in the dialog</li>
                  </ol>
                  <Alert className="mt-3 bg-yellow-500/10 border-yellow-500/50">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-xs text-yellow-200">
                      Gatekeeper protects against unsigned apps. Crystal is safe but isn&apos;t notarized by Apple yet.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">5</span>
                <div>
                  <p className="font-semibold text-white mb-1">Launch Crystal</p>
                  <p>Open Crystal from your Applications folder and sign in with your account. You&apos;re ready to start recording!</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="linux" className="border border-white/5 rounded-lg px-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            Linux Installation (Ubuntu 18.04+)
          </AccordionTrigger>
          <AccordionContent className="text-sm text-[#9D9D9D] space-y-4 pt-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <p className="font-semibold text-white mb-1">Download the AppImage</p>
                  <p>Click the Linux download button above. The .AppImage file will begin downloading.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <p className="font-semibold text-white mb-1">Make it executable</p>
                  <p className="mb-2">Open a terminal and run:</p>
                  <code className="block bg-black/30 p-2 rounded text-xs font-mono">
                    chmod +x ~/Downloads/Crystal-Linux-0.0.1.AppImage
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <p className="font-semibold text-white mb-1">Run the application</p>
                  <p className="mb-2">Double-click the AppImage file or run from terminal:</p>
                  <code className="block bg-black/30 p-2 rounded text-xs font-mono">
                    ./Crystal-Linux-0.0.1.AppImage
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <p className="font-semibold text-white mb-1">Sign in and start recording</p>
                  <p>Launch Crystal and sign in with your account. You&apos;re ready to start recording!</p>
                </div>
              </div>

              <Alert className="mt-3 bg-blue-500/10 border-blue-500/50">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-xs">
                  <strong>Optional:</strong> You can move the AppImage to a permanent location like <code className="bg-white/5 px-1 rounded">~/Applications</code> or integrate it with your system using AppImageLauncher.
                </AlertDescription>
              </Alert>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Why am I seeing security warnings?
        </h4>
        <p className="text-sm text-[#9D9D9D]">
          Crystal is a new application that doesn&apos;t yet have a code signing certificate. 
          These certificates cost hundreds of dollars per year and require extensive verification. 
          We plan to obtain one in the future to eliminate these warnings.
        </p>
        <p className="text-sm text-[#9D9D9D]">
          <strong className="text-white">Your download is completely safe.</strong> The warnings are a standard 
          precaution that operating systems show for all new, unsigned software—even legitimate applications.
        </p>
      </div>

      <div className="flex flex-col gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
        <h4 className="font-semibold text-white">Need help?</h4>
        <p className="text-sm text-[#9D9D9D]">
          If you encounter any issues during installation, please contact our support team 
          or check our documentation for troubleshooting guides.
        </p>
      </div>
    </div>
  );
}
