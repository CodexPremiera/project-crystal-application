import VoiceFlowAgent from "@/components/global/voice-flow-agent";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Website Landing Page
 * 
 * This is the main landing page for the Crystal application website.
 * Currently serves as a placeholder for the public-facing website
 * that users see before authentication.
 * 
 * Purpose: Provide public landing page for the Crystal application
 * 
 * Current Status:
 * - Placeholder implementation with minimal content
 * - Serves as entry point for unauthenticated users
 * - Part of the (website) route group for public pages
 * 
 * Features:
 * - Public access (no authentication required)
 * - Landing page for marketing and information
 * - Entry point for new users
 * 
 * TODO: Implement full landing page with:
 * - Application overview and features
 * - Call-to-action buttons for sign-up/sign-in
 * - Marketing content and testimonials
 * - Product demonstration
 * - Pricing information
 * 
 * Integration:
 * - Part of public website route group
 * - Accessible to unauthenticated users
 * - Entry point for user acquisition
 * - Separate from authenticated dashboard routes
 * 
 * @returns JSX element with landing page content
 */
export default function Home() {
  return <main className="flex flex-col mt-32 gap-16 items-center w-full">
    <section className="flex flex-col gap-16 w-full h-fit pt-5 pb-10 items-center">
      <div className="flex flex-col w-full h-fit items-center bg-blurred-eclipse">
        <div className="flex flex-col flex-1 gap-6 max-w-[960px] py-20 items-center">
          <span className="text-6xl font-extrabold text-center">AI-Driven Screen Recording for Next-Level Productivity</span>
          <p className="text-lg text-center">
            Let AI Capture and Analyze for Faster Decision Making. Record, Transcribe, and Analyze Screen Activity with AI, Saving Time and Boosting Efficiency, Cutting Your Recording Time in Half.
          </p>
          <Link href="/auth/sign-in">
            <Button className="rounded-full !pl-5">
              Get Started
              <ArrowRight/>
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex w-full h-fit justify-center items-center">
        <Image
          src="/crystal_home_page.png"
          alt="Crystal Home Page Screenshot"
          width="1440"
          height="960"
          className="w-full rounded-2xl border border-white/5 max-w-[1280px]"
        />
      </div>
    </section>
    
    <section className="flex flex-col gap-16 w-full h-fit pt-5 pb-10 items-center">
      <div className="flex flex-col w-full gap-6 max-w-[960px]">
        <div className="gap-1 flex flex-col w-full">
          <h2 className="text-4xl font-extrabold">Pricing</h2>
          <span className="text-[#9D9D9D]">Choose the plan that&apos;s right for you</span>
        </div>
        <div className="flex gap-6 w-full">
          <div className="flex flex-col gap-4 p-6 rounded-2xl flex-1 bg-dark-radial-gradient border border-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-lg text-[#9D9D9D] font-semibold">Free</span>
              <span className="text-4xl font-extrabold">$0<span className="text-xl font-normal">/month</span></span>
            </div>
            <Link href="/auth/sign-in" className="w-full">
              <Button className="rounded-lg !pl-5 w-full" variant="secondary">
                Get Started
                <ArrowRight/>
              </Button>
            </Link>
            <ul className="flex flex-col gap-2 list-disc list-inside text-sm text-[#9D9D9D]">
              <li>25 videos per month</li>
              <li>5 min per video</li>
              <li>1 Organization</li>
              <li>No team member</li>
              <li>1-time AI features test</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-2xl flex-1 bg-blue-radial-gradient">
            <div className="flex flex-col gap-1">
              <span className="text-lg text-[#EAEAEA] font-semibold">Professional Plan</span>
              <span className="text-4xl font-extrabold">$99<span className="text-xl font-normal">/month</span></span>
            </div>
            <Link href="/auth/sign-in" className="w-full">
              <Button className="rounded-lg !pl-5 w-full" variant="default">
                Get Started
                <ArrowRight/>
              </Button>
            </Link>
            <ul className="flex flex-col gap-2 list-disc list-inside text-sm text-[#EAEAEA]">
              <li>Unlimited videos</li>
              <li>Unlimited duration</li>
              <li>Unlimited organizations</li>
              <li>Unlimited team members</li>
              <li>All AI features</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <VoiceFlowAgent />
  </main>
}
