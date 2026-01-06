import { useSearch } from '@/hooks/useSearch'
import React from 'react'
import {Skeleton} from "@/components/ui/skeleton";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";
import { Button } from '../ui/button';
import Loader from "@/components/global/loader/loader";
import {useMutationData} from "@/hooks/useMutationData";
import {inviteMembers} from "@/actions/user";
import { MutationFunction } from '@tanstack/react-query'

type Props = {
  workspaceId: string
}

/**
 * Search component for finding and inviting users to workspaces
 * 
 * This component provides a complete user search interface:
 * 1. Search input with real-time debounced API calls
 * 2. Loading states with skeleton placeholders
 * 3. User result display with avatars and subscription info
 * 4. Invite buttons for each found user (functionality pending)
 * 
 * @param workspaceId - ID of the current workspace for context
 * @returns JSX element containing the search interface
 */
const Search = ({ workspaceId }: Props) => {
  // Initialize search functionality with debouncing and user search
  const { query, onSearchQuery, isFetching, onUsers } = useSearch(
    'get-users',
    'USERS'
  )
  
  const { mutate, isPending } = useMutationData(
    ['invite-member'],
    ((data: { receiverId: string }) =>
      inviteMembers(workspaceId, data.receiverId)) as MutationFunction<unknown, unknown>
  )
  
  return (
    <div className="flex flex-col gap-y-5">
      {/* Search input field with real-time query handling */}
      <Input
        onChange={onSearchQuery}
        value={query}
        className="bg-transparent border-2 outline-none"
        placeholder="Search for your user..."
        type="text"
      />
      
      {/* Loading state: show skeleton while fetching results */}
      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-xl" />
        </div>
      ) : !onUsers ? (
        // No results state: show message when no users found
        <p className="text-center text-sm text-[#a4a4a4]">No Users Found</p>
      ) : (
        // Results state: display found users with invite options
        <div>
          {onUsers.map((user) => (
            <div key={user.id} className="flex gap-x-3 items-center border-2 w-full p-3 rounded-xl">
              {/* User avatar with fallback icon */}
              <Avatar>
                <AvatarImage src={user.image as string}/>
                <AvatarFallback>
                  <User/>
                </AvatarFallback>
              </Avatar>
              
              {/* User information display */}
              <div className="flex flex-col items-start">
                <h3 className="text-bold text-lg capitalize">
                  {user.firstname} {user.lastname}
                </h3>
                {/* Subscription plan badge */}
                <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                  {user.subscription?.plan}
                </p>
              </div>
              
              {/* Invite button (functionality to be implemented) */}
              <div className="flex-1 flex justify-end items-center">
                <Button
                  onClick={() =>
                    mutate({ receiverId: user.id })
                  }
                  variant={'default'}
                  className="w-5/12 font-bold"
                >
                  <Loader
                    state={isPending}
                    color="#000"
                  >
                    Invite
                  </Loader>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search