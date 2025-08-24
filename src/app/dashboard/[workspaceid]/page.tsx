import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

type Props = {
  params: { workspaceId: string }
}

export default function Page ({ params }: Props) {
  return (
    <div>
      <Tabs
        defaultValue="videos"
        className="mt-6"
      >
        <div className="flex w-full justify-between items-center">
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
              value="videos"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
              value="archive">Archive</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  )
}