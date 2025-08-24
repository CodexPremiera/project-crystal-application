'use client'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import Loader from "@/components/global/loader/loader";
import { Folder as FolderIcon } from 'lucide-react';

type Props = {
  name: string
  id: string
  optimistic?: boolean
  count?: number
}

function Folder({ id, name, optimistic, count }: Props) {
  const pathName = usePathname()
  const router = useRouter()
  
  // TODO: Add loading state when navigating to folder
  
  return (
    <div
      className={cn(
        'flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]'
      )}
    >
      <Loader state={false}>
        <div className="flex flex-col gap-[1px]">
          <p className="text-neutral-300">{name}</p>
          <span className="text-sm text-neutral-500">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderIcon className="text-primary/50"/>
    </div>
  )
}

export default Folder;