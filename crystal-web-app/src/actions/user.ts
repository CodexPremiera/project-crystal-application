'use server'

import {currentUser} from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { withAuth, withDbUser } from "@/lib/server-helpers"
import { success, notFound, badRequest, serverError } from "@/lib/response"
import { UserService, NotificationService, CommentService } from "@/services"

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string)

/**
 * Email Service Utility
 * 
 * This file contains server actions for user-related operations including
 * authentication, profile management, notifications, comments, invitations,
 * and subscription handling. All functions are server-side only and handle
 * database operations, email sending, and Stripe integration.
 */

/**
 * Configures and prepares email sending functionality
 * 
 * This utility function sets up nodemailer with Gmail SMTP configuration
 * for sending emails throughout the application. It creates a transporter
 * and prepares mail options for various email types (invitations, notifications).
 * 
 * Purpose: Provide email infrastructure for user communications
 * 
 * How it works:
 * 1. Creates nodemailer transporter with Gmail SMTP settings
 * 2. Configures secure connection (port 465, SSL)
 * 3. Uses environment variables for authentication
 * 4. Returns transporter and mail options for sending
 * 
 * Integration:
 * - Used by invitation system for workspace invites
 * - Used by notification system for user alerts
 * - Used by first view notification system
 * - Handles all outbound email communications
 * 
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param text - Plain text email content
 * @param html - Optional HTML email content
 * @returns Object containing transporter and mail options
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  })
  
  const mailOptions = {
    to,
    subject,
    text,
    html,
  }
  return { transporter, mailOptions }
}


/**
 * Authenticates user and manages their database record
 *
 * Database Operation: GET + POST (SELECT + CREATE operations)
 * Tables: User (query + create), WorkSpace (create), Subscription (create), Media (create)
 * 
 * What it does:
 * - Queries existing user by clerkId
 * - Creates new user with complete profile if not exists
 * - Creates default subscription (FREE plan)
 * - Creates personal workspace for the user
 * - Creates default studio settings
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table by clerkId to check if user exists
 * 3. If user exists, returns their data with workspaces
 * 4. If user doesn't exist, creates new user with nested relations:
 *    - Basic profile information from Clerk
 *    - Default studio settings (Media)
 *    - Default subscription (FREE plan)
 *    - Personal workspace
 * 5. Returns user data with all related information
 *
 * @returns Promise with status and user data or error information
 */
export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }
    
    // Check if user exists in database by Clerk ID
    const userExist = await client.user.findUnique({
      where: { clerkId: user.id },
      include: {
        workspace: true,
      },
    })
    
    if (userExist) return { status: 200, user: userExist }
    
    // Fallback: Check if user exists by email (may have different clerkId from dev/prod switch)
    const userByEmail = await client.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
      include: {
        workspace: true,
      },
    })
    
    // If user exists with same email but different clerkId, update the clerkId
    if (userByEmail) {
      const updatedUser = await client.user.update({
        where: { email: user.emailAddresses[0].emailAddress },
        data: {
          clerkId: user.id,
          firstname: user.firstName,
          lastname: user.lastName,
          image: user.imageUrl,
        },
        include: {
          workspace: true,
          subscription: { select: { plan: true } },
        },
      })
      return { status: 200, user: updatedUser }
    }
    
    // Create new user with all associated data
    const newUser = await client.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: { create: {} },
        subscription: { create: {} },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: 'PERSONAL',
          },
        },
      },
      include: {
        workspace: true,
        subscription: { select: { plan: true } },
      },
    })
    
    return newUser ? { status: 201, user: newUser } : { status: 400, message: 'User creation failed' }
  } catch (error) {
    console.error('Auth error:', error)
    return { status: 500, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Retrieves user notifications and notification count
 *
 * Database Operation: GET (SELECT query)
 * Tables: User (primary), Notification, Video, Invite
 * 
 * What it retrieves:
 * - All notifications for the current user (all types)
 * - Notification count for UI display
 * - Actor (user who performed the action) for video notifications
 * - Video info for video-related notifications
 * - Invite data for workspace invitations
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table by clerkId
 * 3. Includes related notifications with type-specific data
 * 4. Uses _count aggregation to get notification count
 * 5. Returns notifications array or empty array if none found
 *
 * @returns Promise with notifications data or empty array
 */
export const getNotifications = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const notifications = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        notification: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            userId: true,
            content: true,
            type: true,
            isRead: true,
            createdAt: true,
            Actor: {
              select: {
                id: true,
                image: true,
                firstname: true,
                lastname: true,
              },
            },
            Video: {
              select: {
                id: true,
                title: true,
                source: true,
                workSpaceId: true,
              },
            },
            NotificationInvite: {
              select: {
                Invite: {
                  select: {
                    id: true,
                    senderId: true,
                    receiverId: true,
                    workSpaceId: true,
                    accepted: true,
                    isActive: true,
                    WorkSpace: {
                      select: {
                        name: true,
                      },
                    },
                    sender: {
                      select: {
                        image: true,
                        firstname: true,
                        lastname: true,
                      },
                    },
                    receiver: {
                      select: {
                        image: true,
                        firstname: true,
                        lastname: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        _count: { select: { notification: true } },
      },
    })
    
    return notifications && notifications.notification.length > 0
      ? { status: 200, data: notifications }
      : { status: 404, data: [] }
  } catch (error) {
    console.error(error)
    return { status: 400, data: [] }
  }
}

/**
 * Marks all unread notifications as read for the current user
 * 
 * Uses: withDbUser helper, NotificationService
 * 
 * @returns Promise with status indicating success or failure
 */
export const markAllNotificationsAsRead = async () => {
  return withDbUser(async (_clerkUser, dbUser) => {
    await NotificationService.markAllAsRead(dbUser.id)
    return 'Notifications marked as read'
  })
}

/**
 * Gets the count of unread notifications for the current user
 * 
 * Uses: withDbUser helper, NotificationService
 * 
 * @returns Promise with status and unread count
 */
export const getUnreadNotificationCount = async () => {
  const response = await withDbUser(async (_clerkUser, dbUser) => {
    return NotificationService.getUnreadCount(dbUser.id)
  })
  
  if (response.status === 200) {
    return { status: 200, count: response.data }
  }
  return { status: response.status, count: 0 }
}

/**
 * Searches for users in the database based on provided query
 *
 * Uses: withAuth helper, UserService
 *
 * @param query - Search string to match against usernames and emails
 * @returns Promise with array of matching users or empty result
 */
export const searchUsers = async (query: string, workspaceId?: string) => {
  return withAuth(async (clerkUser) => {
    const users = await UserService.search(query, clerkUser.id, workspaceId)
    return users.length > 0 ? users : []
  })
}

/**
 * Creates new comments or replies to existing comments on videos
 * 
 * Uses: CommentService
 * 
 * @param userId - ID of the user creating the comment
 * @param comment - The comment text content
 * @param videoId - ID of the video being commented on
 * @param commentId - Optional ID of parent comment for replies
 * @returns Promise with creation status and confirmation message
 */
export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      await CommentService.createReply(commentId, videoId, userId, comment)
      return success('Reply posted')
    }
    
    await CommentService.createOnVideo(videoId, userId, comment)
    return success('New comment added')
  } catch (error) {
    console.error('[createCommentAndReply Error]:', error)
    return badRequest('Failed to create comment')
  }
}

/**
 * Retrieves current user's profile information for comment attribution
 * 
 * Uses: withAuth helper, UserService
 * 
 * @returns Promise with user profile data (ID and image) or error status
 */
export const getUserProfile = async () => {
  return withAuth(async (clerkUser) => {
    const profile = await UserService.getProfile(clerkUser.id)
    if (!profile) throw new Error('Profile not found')
    return profile
  })
}

/**
 * Retrieves all comments and replies for a specific video
 * 
 * Uses: CommentService
 * 
 * @param Id - The video ID to fetch comments for
 * @returns Promise with complete comment thread data
 */
export const getVideoComments = async (Id: string) => {
  try {
    const comments = await CommentService.getForVideo(Id)
    return success(comments)
  } catch (error) {
    console.error('[getVideoComments Error]:', error)
    return badRequest('Failed to fetch comments')
  }
}

/**
 * Retrieves current user's subscription and payment information
 * 
 * Uses: withAuth helper, UserService
 * 
 * @returns Promise with user's subscription plan information
 */
export const getPaymentInfo = async () => {
  return withAuth(async (clerkUser) => {
    const payment = await UserService.getSubscription(clerkUser.id)
    if (!payment) throw new Error('Payment info not found')
    return payment
  })
}

/**
 * Updates user's first view notification preference
 * 
 * Uses: withAuth helper, UserService
 * 
 * @param state - Boolean value to enable (true) or disable (false) first view notifications
 * @returns Promise with update status and confirmation message
 */
export const enableFirstView = async (state: boolean) => {
  return withAuth(async (clerkUser) => {
    await UserService.updateFirstViewPreference(clerkUser.id, state)
    return 'Setting updated'
  })
}

/**
 * Retrieves user's first view notification preference setting
 * 
 * Uses: withAuth helper, UserService
 * 
 * @returns Promise with user's first view notification preference (boolean)
 */
export const getFirstView = async () => {
  return withAuth(async (clerkUser) => {
    const userData = await UserService.getFirstViewPreference(clerkUser.id)
    return userData?.firstView ?? false
  })
}

/**
 * Sends workspace invitation to another user
 * 
 * Database Operation: POST (CREATE operations)
 * Tables: Invite (create), User (query + update), WorkSpace (query), Member (query)
 * 
 * What it creates:
 * - Invitation record in the database
 * - Notification records for both inviter and invitee
 * 
 * Validation:
 * - Cannot invite if user already has a pending invitation
 * - Cannot invite if user is already a member of the workspace
 * 
 * @param workspaceId - ID of the workspace to invite user to
 * @param receiverId - ID of the user being invited
 * @returns Promise with invitation status and confirmation message
 */
export const inviteMembers = async (
  workspaceId: string,
  receiverId: string
) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const senderInfo = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    })
    
    if (!senderInfo?.id) {
      return { status: 404, data: 'Sender not found' }
    }
    
    const workspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        name: true,
        userId: true,
      },
    })
    
    if (!workspace) {
      return { status: 404, data: 'Workspace not found' }
    }
    
    // Check if user is already a member of the workspace
    const existingMember = await client.member.findFirst({
      where: {
        userId: receiverId,
        workSpaceId: workspaceId,
      },
    })
    
    if (existingMember) {
      return { status: 409, data: 'User is already a member of this workspace' }
    }
    
    // Check if user is the workspace owner
    const receiver = await client.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    })
    
    if (workspace.userId === receiverId) {
      return { status: 409, data: 'Cannot invite the workspace owner' }
    }
    
    // Check for pending invitation (only active, non-accepted invites)
    const existingPendingInvite = await client.invite.findFirst({
      where: {
        receiverId: receiverId,
        workSpaceId: workspaceId,
        accepted: false,
        isActive: true,
      },
    })
    
    if (existingPendingInvite) {
      return { status: 409, data: 'User already has a pending invitation to this workspace' }
    }
    
    const receiverInfo = await client.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        firstname: true,
        lastname: true,
      },
    })
    
    const invitation = await client.invite.create({
      data: {
        senderId: senderInfo.id,
        receiverId: receiverId,
        workSpaceId: workspaceId,
        content: `You are invited to join ${workspace.name} Workspace`,
      },
      select: {
        id: true,
      },
    })
    
    // Create notification for sender
    await client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        notification: {
          create: {
            content: `You invited ${receiverInfo?.firstname || ''} ${receiverInfo?.lastname || ''} into ${workspace.name}`,
            type: 'INVITE',
            NotificationInvite: {
              create: {
                inviteId: invitation.id,
              },
            },
          },
        },
      },
    })
    
    // Create notification for receiver
    await client.user.update({
      where: {
        id: receiverId,
      },
      data: {
        notification: {
          create: {
            content: `You are invited to join ${workspace.name} Workspace`,
            type: 'INVITE',
            NotificationInvite: {
              create: {
                inviteId: invitation.id,
              },
            },
          },
        },
      },
    })
    
    return { status: 200, data: 'Invite sent' }
  } catch (error) {
    console.log(error)
    return { status: 400, data: 'Oops! something went wrong' }
  }
}

/**
 * Accepts a workspace invitation and adds user to the workspace
 * 
 * Database Operation: PUT (UPDATE operations)
 * Tables: Invite (update), User (update)
 * 
 * What it updates:
 * - Invitation status to accepted
 * - User's workspace membership
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries Invite table to verify invitation ownership
 * 3. Updates Invite table to set accepted = true
 * 4. Updates User table to add workspace membership
 * 5. Uses database transaction for atomic operations
 * 6. Returns success status upon completion
 * 
 * Security Features:
 * - Verifies invitation ownership before processing
 * - Uses database transactions for data consistency
 * - Prevents unauthorized invitation acceptance
 * 
 * @param inviteId - ID of the invitation to accept
 * @returns Promise with acceptance status
 */
export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        isActive: true,
        receiver: {
          select: {
            clerkId: true,
          },
        },
      },
    })
    
    if (!invitation) return { status: 404, data: 'Invitation not found' }
    if (!invitation.isActive) return { status: 400, data: 'Invitation is no longer active' }
    if (user.id !== invitation?.receiver?.clerkId) return { status: 401 }
    
    const acceptInviteOp = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
        isActive: false,
      },
    })
    
    const updateMember = client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    })
    
    const membersTransaction = await client.$transaction([
      acceptInviteOp,
      updateMember,
    ])
    
    if (membersTransaction) {
      return { status: 200, data: 'Invitation accepted' }
    }
    return { status: 400 }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Declines a workspace invitation (by the receiver)
 * 
 * Database Operation: PUT (UPDATE operation)
 * Tables: Invite (update)
 * 
 * What it does:
 * - Sets the invite's isActive to false
 * - Does NOT add user to workspace
 * 
 * @param inviteId - ID of the invitation to decline
 * @returns Promise with status
 */
export const declineInvite = async (inviteId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const invitation = await client.invite.findUnique({
      where: { id: inviteId },
      select: {
        isActive: true,
        receiver: {
          select: { clerkId: true },
        },
      },
    })
    
    if (!invitation) return { status: 404, data: 'Invitation not found' }
    if (!invitation.isActive) return { status: 400, data: 'Invitation is no longer active' }
    if (user.id !== invitation.receiver?.clerkId) return { status: 401, data: 'Unauthorized' }
    
    await client.invite.update({
      where: { id: inviteId },
      data: { isActive: false },
    })
    
    return { status: 200, data: 'Invitation declined' }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Cancels a workspace invitation (by the sender)
 * 
 * Database Operation: PUT (UPDATE operation)
 * Tables: Invite (update)
 * 
 * What it does:
 * - Sets the invite's isActive to false
 * - Only the sender can cancel
 * 
 * @param inviteId - ID of the invitation to cancel
 * @returns Promise with status
 */
export const cancelInvite = async (inviteId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    })
    
    if (!dbUser) return { status: 404 }
    
    const invitation = await client.invite.findUnique({
      where: { id: inviteId },
      select: {
        senderId: true,
        isActive: true,
      },
    })
    
    if (!invitation) return { status: 404, data: 'Invitation not found' }
    if (!invitation.isActive) return { status: 400, data: 'Invitation is no longer active' }
    if (dbUser.id !== invitation.senderId) return { status: 401, data: 'Unauthorized' }
    
    await client.invite.update({
      where: { id: inviteId },
      data: { isActive: false },
    })
    
    return { status: 200, data: 'Invitation cancelled' }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Completes subscription upgrade after successful Stripe payment
 * 
 * Database Operation: PUT (UPDATE operation)
 * Tables: User (update), Subscription (update)
 * External: Stripe API
 * 
 * What it updates:
 * - User's subscription plan to PRO
 * - Stripe customer ID for future billing
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Retrieves Stripe checkout session using session ID
 * 3. Updates User table with nested subscription update
 * 4. Sets subscription plan to PRO and stores customer ID
 * 5. Returns success status upon completion
 * 
 * Stripe Integration:
 * - Retrieves checkout session details from Stripe
 * - Extracts customer ID for future billing operations
 * - Updates subscription plan based on successful payment
 * 
 * @param session_id - Stripe checkout session ID from successful payment
 * @returns Promise with subscription completion status
 */
export const completeSubscription = async (session_id: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const session = await stripe.checkout.sessions.retrieve(session_id)
    if (session) {
      const customer = await client.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: 'PRO',
              },
            },
          },
        },
      })
      if (customer) {
        return { status: 200 }
      }
    }
    return { status: 404 }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}
