import { Menu, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";


const LandingPageNavBar = () => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Menu className="w-6 h-6"/>
        <Image
          alt="logo"
          src="/favicon.ico"
          width={32}
          height={32}
        />
        Opal
      </div>
      <div className="hidden gap-x-10 items-center lg:flex">
        <Link
          href="/crystal-web-app/public"
          className="bg-[#7320DD] py-2 px-5 font-semibold text-lg rounded-full hover:bg-[#7320DD]/80"
        >
          Home
        </Link>
        <Link href="/crystal-web-app/public">Pricing</Link>
        <Link href="/crystal-web-app/public">Contact</Link>
      </div>
      <Link href="/auth/sign-in">
        <Button className="text-base flex gap-x-2">
          <User fill="#000" />
          Login
        </Button>
      </Link>
    </div>
  )
}

export default LandingPageNavBar