import React from 'react';
import {ArrowRight, Folders as FoldersIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import Folder from "@/components/global/folders/folder";

type Props = {
  workspaceId: string;
}

function Folders({ workspaceId }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FoldersIcon className="text-primary/64" />
          <h2 className="text-[#BDBDBD] text-xl">Folders</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[#BDBDBD]">See all</p>
          <ArrowRight color="#707070" />
        </div>
      </div>
      <section className={cn('flex items-center gap-4 overflow-x-auto w-full scrollbar-minimal pb-2')}>
        <Folder name="Folder Title"/>
      </section>
    </div>
  )
}

export default Folders;