"use client";

import React from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Props {
  workspaceMember: {
    User: {
      firstname: string | null;
      lastname: string | null;
      image: string | null;
      clerkId: string | null;
    } | null;
  } | null;
  user: {
    id: string | null;
  } | null;
}

/**
 * UserCard Component for Workspace Members
 * 
 * Displays workspace member information with a remove button.
 * Similar to OwnerCard but includes member management functionality.
 * 
 * Features:
 * - Member profile display (name, image, role)
 * - Remove user button (currently design-only)
 * - Current user identification
 * 
 * @param workspaceMember - Member data from database
 * @param user - Current authenticated user data
 */
function UserCard({ workspaceMember, user }: Props) {
  const handleRemoveUser = () => {
    // TODO: Implement remove user functionality
    console.log('Remove user functionality not yet implemented');
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 bg-secondary/50 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium overflow-hidden">
          {workspaceMember?.User?.image ? (
            <Image
              src={workspaceMember.User.image}
              alt={`${workspaceMember.User.firstname} ${workspaceMember.User.lastname}`}
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-sm font-medium">
              {workspaceMember?.User?.firstname?.charAt(0)?.toUpperCase() ||
                workspaceMember?.User?.lastname?.charAt(0)?.toUpperCase() ||
                'U'}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1/2">
          <div>
            <span className="font-medium">
              {workspaceMember?.User?.firstname} {workspaceMember?.User?.lastname}
            </span>
            <span className="text-sm text-muted-foreground">
              {user?.id === workspaceMember?.User?.clerkId && ' (you)'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Workspace Member
          </p>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemoveUser}
        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
      >
        <Trash2 size={16} />
        <span className="ml-2">Remove</span>
      </Button>
    </div>
  );
}

export default UserCard;
