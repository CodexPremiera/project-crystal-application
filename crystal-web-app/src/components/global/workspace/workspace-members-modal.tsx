"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQueryData } from '@/hooks/useQueryData';
import { useMutationData } from '@/hooks/useMutationData';
import { getWorkspaceMembersOrdered, removeUserFromWorkspace } from '@/actions/workspace';
import { MutationFunction } from '@tanstack/react-query';
import { Users } from '@/components/icons/user';
import { Crown, User } from 'lucide-react';

interface Props {
  workspaceId: string;
  memberCount: number | string;
}

type MemberInfo = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  image: string | null;
  clerkId: string;
  role: 'owner' | 'you' | 'member';
  joinedAt: Date | string;
};

/**
 * WorkspaceMembersModal Component
 * 
 * Displays a popover with all workspace members when clicking the user count.
 * Positioned directly below the trigger button.
 * 
 * Features:
 * - Display ordered member list (owner first, then you, then alphabetical)
 * - Owner can remove other members (with confirmation)
 * - Shows role badges and join dates
 */
function WorkspaceMembersModal({ workspaceId, memberCount }: Props) {
  const [memberToRemove, setMemberToRemove] = useState<MemberInfo | null>(null);
  
  const { data: membersData } = useQueryData(
    ['workspace-members-ordered', workspaceId],
    () => getWorkspaceMembersOrdered(workspaceId)
  );
  
  const { mutate: removeMember, isPending: isRemoving } = useMutationData(
    ['remove-member'],
    ((memberClerkId: string) => removeUserFromWorkspace(workspaceId, memberClerkId)) as MutationFunction<unknown, unknown>,
    'workspace-members-ordered'
  );
  
  const members = (membersData as { status: number; data: MemberInfo[] })?.data || [];
  
  // Check if current user is the owner
  const isCurrentUserOwner = members.length > 0 && members[0]?.role === 'owner' && 
    members.some(m => m.role === 'you') === false;

  const handleRemoveConfirm = () => {
    if (memberToRemove) {
      removeMember(memberToRemove.clerkId);
      setMemberToRemove(null);
    }
  };

  const getMemberName = (member: MemberInfo) => {
    const name = [member.firstname, member.lastname].filter(Boolean).join(' ');
    return name || 'Unknown User';
  };

  const getInitials = (member: MemberInfo) => {
    const first = member.firstname?.charAt(0) || '';
    const last = member.lastname?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const formatJoinedDate = (date: Date | string) => {
    const joinDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - joinDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffDays < 1) return 'Joined today';
    if (diffDays === 1) return 'Joined yesterday';
    if (diffDays < 7) return `Joined ${diffDays} days ago`;
    if (diffWeeks === 1) return 'Joined 1 week ago';
    if (diffWeeks < 4) return `Joined ${diffWeeks} weeks ago`;
    if (diffMonths === 1) return 'Joined 1 month ago';
    if (diffMonths < 12) return `Joined ${diffMonths} months ago`;
    if (diffYears === 1) return 'Joined 1 year ago';
    return `Joined ${diffYears} years ago`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Users size={20} />
          <span>{memberCount}</span>
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[400px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="p-4 border-b">
          <h3 className="flex items-center gap-2 font-semibold">
            <User className="h-4 w-4" />
            Workspace Members ({members.length})
          </h3>
        </div>
        
        <ScrollArea className="max-h-[350px]">
          <div className="flex flex-col p-2">
            {members.map((member) => (
              <div 
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary/80 transition-colors"
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {member.image ? (
                    <AvatarImage src={member.image} alt={getMemberName(member)} />
                  ) : null}
                  <AvatarFallback className="bg-brand/10 text-brand text-sm">
                    {getInitials(member)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate max-w-[200px]">
                    {getMemberName(member)}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatJoinedDate(member.joinedAt)}
                  </p>
                </div>
                
                {member.role === 'owner' && (
                  <Badge variant="secondary" className="flex-shrink-0 flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs px-2 py-0.5">
                    <Crown className="h-3 w-3" />
                    Owner
                  </Badge>
                )}
                {member.role === 'you' && (
                  <Badge variant="secondary" className="flex-shrink-0 flex items-center gap-1 bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs px-2 py-0.5">
                    <User className="h-3 w-3" />
                    You
                  </Badge>
                )}
                {member.role === 'member' && isCurrentUserOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 h-7 text-xs text-red-500 border-red-500/30 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/50"
                    onClick={() => setMemberToRemove(member)}
                    disabled={isRemoving}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            
            {members.length === 0 && (
              <div className="text-center py-6 text-text-muted">
                <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No members found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
      
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToRemove ? getMemberName(memberToRemove) : ''}</strong> from this workspace?
              They will lose access to all workspace content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Popover>
  );
}

export default WorkspaceMembersModal;

