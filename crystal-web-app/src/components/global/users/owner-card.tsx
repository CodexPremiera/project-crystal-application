"use client";

import React from 'react';
import Image from "next/image";

interface Props {
  workspaceOwner: {
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

function OwnerCard({ workspaceOwner, user }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium overflow-hidden">
          {workspaceOwner?.User?.image ? (
            <Image
              src={workspaceOwner.User.image}
              alt={`${workspaceOwner.User.firstname} ${workspaceOwner.User.lastname}`}
              width={40}
              height={40}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-sm font-medium">
                      {workspaceOwner?.User?.firstname?.charAt(0)?.toUpperCase() ||
                        workspaceOwner?.User?.lastname?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </span>
          )}
        </div>
        <div>
          <p className="font-medium">
            {workspaceOwner?.User?.firstname} {workspaceOwner?.User?.lastname}
            {user?.id === workspaceOwner?.User?.clerkId && ' (you)'}
          </p>
          <p className="text-sm text-muted-foreground">Workspace Owner</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Owner
      </div>
    </div>
  );
}

export default OwnerCard;