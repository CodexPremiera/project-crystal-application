'use client'

import React from 'react';
import {cn} from "@/lib/utils";
import Folder from "@/components/global/folders/folder";
import {useQueryData} from "@/hooks/useQueryData";
import {getWorkspaceFolders} from "@/actions/workspace";
import {useMutationDataState} from "@/hooks/useMutationData";
import FolderDuotone from "@/components/icons/folder-duotone";
import {useDispatch} from "react-redux";
import {FOLDERS} from "@/redux/slices/folders";
import Videos from "@/components/global/videos/videos";
import CreateFolders from "@/components/global/create-folders";
import { VideoDragProvider } from "@/components/global/videos/video-drag-context";
import { FoldersProps } from "@/types/index.type";

type Props = {
  workspaceId: string;
}

function Folders({ workspaceId }: Props) {
  const dispatch = useDispatch()
  
  /**
   * Data Fetching with React Query (useQuery)
   * 
   * This component demonstrates the primary useQuery pattern for fetching
   * and caching workspace folders. The data is automatically cached and
   * shared across components that use the same query key.
   * 
   * How it works:
   * 1. Fetches workspace folders using the getWorkspaceFolders server action
   * 2. Caches the data with the 'workspace-folders' query key
   * 3. Provides loading states (isFetched) for UI feedback
   * 4. Automatically refetches when the query key changes
   * 5. Handles initial undefined state during progressive loading
   */
  const { data, isFetched } = useQueryData(
    ['workspace-folders'],
    () => getWorkspaceFolders(workspaceId),
  )
  
  /**
   * Optimistic Updates with useMutationState
   * 
   * This demonstrates how to access optimistic data from mutations in real-time.
   * When a user creates a new folder, this component immediately displays the
   * new folder before the server confirms the creation.
   * 
   * How it works:
   * 1. Tracks the 'create-folder' mutation state
   * 2. Accesses the latest mutation variables (optimistic data)
   * 3. Displays the optimistic folder immediately in the UI
   * 4. Replaces optimistic data with server response when available
   */
  const { latestVariables } = useMutationDataState(['create-folder'])
  
  const { status, data: folders } = (data || {
    status: 404,
    data: []
  }) as FoldersProps
  
  // Update Redux store with fetched folders for global state management
  if (isFetched && folders) {
    dispatch(FOLDERS({ folders: folders }))
  }
  
  return (
    <VideoDragProvider workspaceId={workspaceId}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderDuotone />
            <div className="flex items-center gap-1">
              <h2 className="text-[#BDBDBD] text-xl">Folders</h2>
              <CreateFolders workspaceId={workspaceId} />
            </div>
          </div>
        </div>
        <section className={cn(status !== 200 && 'justify-center', 'flex items-center gap-4 overflow-x-auto w-full')}>
          {status !== 200 ? (
            <p className="text-neutral-300">No folders in workspace</p>
          ) : (
            <>
              {/* 
                Optimistic UI Rendering
                
                This section demonstrates how to display optimistic data from mutations.
                When a user creates a new folder, it immediately appears in the UI
                with the optimistic data while the server request is pending.
                
                How it works:
                1. Checks if there's a pending mutation with optimistic data
                2. Displays the optimistic folder with temporary data
                3. Shows the folder with an "optimistic" flag for styling
                4. Replaces with real data when server responds
              */}
              {latestVariables && latestVariables.status === 'pending' && (
                <Folder
                  name={(latestVariables.variables as { name: string; id: string }).name}
                  id={(latestVariables.variables as { name: string; id: string }).id}
                  optimistic
                />
              )}
              {/* 
                Server Data Rendering
                
                This renders the actual folders from the server, including
                the newly created folder once the server confirms the creation.
              */}
              {folders.map((folder) => (
                <Folder
                  name={folder.name}
                  count={folder._count.videos}
                  id={folder.id}
                  key={folder.id}
                />
              ))}
            </>
          )}
        </section>
        <Videos
          workspaceId={workspaceId}
          folderId={workspaceId}
          videosKey="user-videos"
        />
      </div>
    </VideoDragProvider>
  )
}

export default Folders;