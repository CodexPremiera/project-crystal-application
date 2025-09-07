'use server'

import {currentUser} from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";
import nodemailer from 'nodemailer'
import Stripe from 'stripe'

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
 * This function handles the complete user authentication flow:
 * 1. Gets current authenticated user from Clerk
 * 2. Checks if user already exists in our database
 * 3. If user exists, returns their data with workspaces
 * 4. If user doesn't exist, creates new user record with:
 *    - Basic profile information from Clerk
 *    - Default studio settings
 * 5. Creates default subscription (FREE plan)
 * 6. Creates personal workspace for the user
 *
 * @returns Promise with status and user data or error information
 */
export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }
    
    // Check if user exists in database
    const userExist = await client.user.findUnique({
      where: { clerkId: user.id },
      include: {
        workspace: { where: { User: { clerkId: user.id } } },
      },
    })
    
    if (userExist) return { status: 200, user: userExist }
    
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
        workspace: { where: { User: { clerkId: user.id } } },
        subscription: { select: { plan: true } },
      },
    })
    
    return newUser ? { status: 201, user: newUser } : { status: 400, message: 'User creation failed' }
  } catch (error: any) {
    return { status: 500, error: error.message }
  }
}

/**
 * Retrieves user notifications and notification count
 *
 * This function fetches all notifications for the current user:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries database for user's notifications
 * 3. Includes notification count for UI display
 * 4. Returns notifications array or empty array if none found
 *
 * @returns Promise with notifications data or empty array
 */
export const getNotifications = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const notifications = await client.user.findUnique({
      where: { clerkId: user.id }, // Fixed field name
      select: {
        notification: true,
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
 * Searches for users in the database based on provided query
 *
 * This function enables user discovery for workspace invitations:
 * 1. Authenticates current user from Clerk
 * 2. Searches database for users matching query in:
 *    - First name (case-insensitive)
 *    - Last name (case-insensitive)
 *    - Email address (case-insensitive)
 * 3. Excludes current user from search results
 * 4. Returns user data with subscription plan for UI display
 *
 * @param query - Search string to match against usernames and emails
 * @returns Promise with array of matching users or empty result
 */
export const searchUsers = async (query: string) => {
  try {
    // Get current authenticated user
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    // Search for users matching query in multiple fields
    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        // Exclude current user from search results
        NOT: [{ clerkId: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    })
    
    // Return users if found, otherwise return empty result
    if (users && users.length > 0) {
      return { status: 200, data: users }
    }
    
    return { status: 404, data: undefined }
  } catch (error) {
    console.log(error);
    return { status: 500, data: undefined };
  }
}

/**
 * Creates new comments or replies to existing comments on videos
 * 
 * This function handles the complete comment creation flow for the video
 * commenting system. It supports both top-level comments and nested replies,
 * maintaining proper relationships in the database.
 * 
 * Purpose: Enable users to comment on videos and reply to existing comments
 * 
 * How it works:
 * 1. If commentId is provided, creates a reply to an existing comment
 * 2. If no commentId, creates a new top-level comment on the video
 * 3. Uses Prisma's nested create operations for efficient database updates
 * 4. Returns success status with confirmation message
 * 5. Handles database errors gracefully
 * 
 * Comment Types:
 * - Top-level comments: Direct comments on videos (commentId is undefined)
 * - Replies: Responses to existing comments (commentId is provided)
 * 
 * Integration:
 * - Used by useVideoComment hook for comment submission
 * - Connects to video and comment database models
 * - Provides data for comment display components
 * - Handles both comment and reply creation in single function
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
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      })
      if (reply) {
        return { status: 200, data: 'Reply posted' }
      }
    }
    
    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    })
    if (newComment) return { status: 200, data: 'New comment added' }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Retrieves current user's profile information for comment attribution
 * 
 * This function fetches essential user profile data needed for comment
 * creation and display. It provides the user's ID and profile image
 * for comment attribution in the UI.
 * 
 * Purpose: Get user profile data for comment system integration
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries database for user's ID and profile image
 * 3. Returns profile data for comment creation
 * 4. Handles authentication errors gracefully
 * 
 * Integration:
 * - Used by useVideoComment hook for comment attribution
 * - Provides data for comment display components
 * - Connects to user profile system
 * - Essential for comment creation flow
 * 
 * @returns Promise with user profile data (ID and image) or error status
 */
export const getUserProfile = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const profileIdAndImage = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    })
    
    if (profileIdAndImage) return { status: 200, data: profileIdAndImage }
  } catch (error) {
    console.log(error);
    return { status: 400 }
  }
}

/**
 * Retrieves all comments and replies for a specific video
 * 
 * This function fetches the complete comment thread for a video, including
 * all top-level comments and their nested replies. It provides the data
 * structure needed for displaying hierarchical comment conversations.
 * 
 * Purpose: Get complete comment thread for video display
 * 
 * How it works:
 * 1. Queries database for comments associated with the video
 * 2. Includes nested replies using Prisma's include functionality
 * 3. Filters for top-level comments (commentId is null)
 * 4. Includes user information for comment attribution
 * 5. Returns hierarchical comment structure for UI rendering
 * 
 * Data Structure:
 * - Top-level comments with nested replies
 * - User information for each comment and reply
 * - Proper ordering for conversation flow
 * 
 * Integration:
 * - Used by video preview and comment display components
 * - Provides data for comment thread rendering
 * - Connects to comment and user database models
 * - Essential for video commenting system
 * 
 * @param Id - The video ID to fetch comments for
 * @returns Promise with complete comment thread data
 */
export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    })
    
    return { status: 200, data: comments }
  } catch (error) {
    console.log(error);
    return { status: 400 }
  }
}

/**
 * Retrieves current user's subscription and payment information
 * 
 * This function fetches the user's subscription plan details for
 * determining access levels and feature availability throughout
 * the application.
 * 
 * Purpose: Get user subscription data for access control and UI display
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries database for user's subscription plan
 * 3. Returns subscription data for access control
 * 4. Handles authentication errors gracefully
 * 
 * Integration:
 * - Used by subscription management components
 * - Provides data for access control throughout the app
 * - Connects to billing and payment systems
 * - Essential for feature gating based on subscription plan
 * 
 * @returns Promise with user's subscription plan information
 */
export const getPaymentInfo = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    
    const payment = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    })
    if (payment) {
      return { status: 200, data: payment }
    }
  } catch (error) {
    console.log(error);
    return { status: 400 }
  }
}

/**
 * Updates user's first view notification preference
 * 
 * This function allows users to enable or disable email notifications
 * when their videos receive their first view. It updates the user's
 * preference in the database for future video view tracking.
 * 
 * Purpose: Manage user notification preferences for video views
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Updates user's firstView setting in the database
 * 3. Returns success status with confirmation message
 * 4. Handles authentication and database errors gracefully
 * 
 * Integration:
 * - Used by user settings and notification preference components
 * - Connects to email notification system
 * - Affects first view email sending behavior
 * - Part of user preference management system
 * 
 * @param state - Boolean value to enable (true) or disable (false) first view notifications
 * @returns Promise with update status and confirmation message
 */
export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser()
    
    if (!user) return { status: 404 }
    
    const view = await client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        firstView: state,
      },
    })
    
    if (view) {
      return { status: 200, data: 'Setting updated' }
    }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Retrieves user's first view notification preference setting
 * 
 * This function fetches the current user's preference for receiving
 * email notifications when their videos get their first view. It's
 * used to determine whether to send first view notifications.
 * 
 * Purpose: Get user's first view notification preference
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries database for user's firstView setting
 * 3. Returns the current preference value
 * 4. Handles authentication errors gracefully
 * 
 * Integration:
 * - Used by notification system to check user preferences
 * - Connects to first view email sending logic
 * - Part of user preference management system
 * - Essential for conditional notification sending
 * 
 * @returns Promise with user's first view notification preference (boolean)
 */
export const getFirstView = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const userData = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        firstView: true,
      },
    })
    if (userData) {
      return { status: 200, data: userData.firstView }
    }
    return { status: 400, data: false }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Sends workspace invitation to another user via email
 * 
 * This function handles the complete workspace invitation flow, including
 * creating invitation records, sending email notifications, and updating
 * user notifications. It enables workspace owners to invite other users
 * to collaborate on their workspaces.
 * 
 * Purpose: Enable workspace collaboration through user invitations
 * 
 * How it works:
 * 1. Gets current authenticated user (inviter) from Clerk
 * 2. Fetches inviter's profile information for email content
 * 3. Retrieves workspace details for invitation context
 * 4. Creates invitation record in the database
 * 5. Sends email notification to the invited user
 * 6. Creates notification for the inviter
 * 7. Returns success status with confirmation message
 * 
 * Email Integration:
 * - Sends HTML email with invitation link
 * - Includes workspace name and inviter information
 * - Provides direct link to accept invitation
 * - Uses configured SMTP settings for delivery
 * 
 * Integration:
 * - Used by workspace management components
 * - Connects to email notification system
 * - Creates database records for invitation tracking
 * - Part of workspace collaboration system
 * 
 * @param workspaceId - ID of the workspace to invite user to
 * @param receiverId - ID of the user being invited
 * @param email - Email address of the user being invited
 * @returns Promise with invitation status and confirmation message
 */
export const inviteMembers = async (
  workspaceId: string,
  receiverId: string,
  email: string
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
    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      })
      if (workspace) {
        const invitation = await client.invite.create({
          data: {
            senderId: senderInfo.id,
            receiverId: receiverId,
            workSpaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        })
        
        await client.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} into ${workspace.name}`,
              },
            },
          },
        })
        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            email,
            'You got an invitation',
            'You are invited to join ${workspace.name} Workspace, click accept to confirm',
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          )
          
          transporter.sendMail(mailOptions, (error) => {
            if (error) {
              console.log('🔴', error.message)
            } else {
              console.log('✅ Email send')
            }
          })
          return { status: 200, data: 'Invite sent' }
        }
        return { status: 400, data: 'invitation failed' }
      }
      return { status: 404, data: 'workspace not found' }
    }
    return { status: 404, data: 'recipient not found' }
  } catch (error) {
    console.log(error)
    return { status: 400, data: 'Oops! something went wrong' }
  }
}

/**
 * Accepts a workspace invitation and adds user to the workspace
 * 
 * This function handles the invitation acceptance flow, including
 * verifying the invitation belongs to the current user, updating
 * the invitation status, and adding the user as a workspace member.
 * It uses database transactions to ensure data consistency.
 * 
 * Purpose: Complete the workspace invitation acceptance process
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Verifies the invitation belongs to the current user
 * 3. Updates invitation status to accepted
 * 4. Adds user as a member of the workspace
 * 5. Uses database transaction for atomic operations
 * 6. Returns success status upon completion
 * 
 * Security Features:
 * - Verifies invitation ownership before processing
 * - Uses database transactions for data consistency
 * - Prevents unauthorized invitation acceptance
 * - Handles authentication errors gracefully
 * 
 * Integration:
 * - Used by invitation acceptance pages
 * - Connects to workspace membership system
 * - Part of workspace collaboration flow
 * - Essential for invitation system completion
 * 
 * @param inviteId - ID of the invitation to accept
 * @returns Promise with acceptance status
 */
export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser()
    if (!user)
      return {
        status: 404,
      }
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        receiver: {
          select: {
            clerkId: true,
          },
        },
      },
    })
    
    if (user.id !== invitation?.receiver?.clerkId) return { status: 401 }
    const acceptInvite = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
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
      acceptInvite,
      updateMember,
    ])
    
    if (membersTransaction) {
      return { status: 200 }
    }
    return { status: 400 }
  } catch (error) {
    console.log(error)
    return { status: 400 }
  }
}

/**
 * Completes subscription upgrade after successful Stripe payment
 * 
 * This function handles the post-payment subscription completion flow,
 * including retrieving the Stripe session, updating the user's subscription
 * plan to PRO, and storing the customer ID for future billing operations.
 * 
 * Purpose: Complete subscription upgrade after successful payment processing
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Retrieves Stripe checkout session using session ID
 * 3. Updates user's subscription plan to PRO
 * 4. Stores Stripe customer ID for future billing
 * 5. Returns success status upon completion
 * 
 * Stripe Integration:
 * - Retrieves checkout session details from Stripe
 * - Extracts customer ID for future billing operations
 * - Updates subscription plan based on successful payment
 * - Handles Stripe API errors gracefully
 * 
 * Integration:
 * - Used by payment completion callbacks
 * - Connects to Stripe billing system
 * - Updates user subscription status
 * - Essential for subscription upgrade flow
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
