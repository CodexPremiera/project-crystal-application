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
    let userExist = await client.user.findUnique({
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
 * Tables: User (primary), Notification
 * 
 * What it retrieves:
 * - All notifications for the current user
 * - Notification count for UI display
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table by clerkId
 * 3. Includes related notifications via Prisma relations
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
            createdAt: true,
            NotificationInvite: {
              select: {
                Invite: {
                  select: {
                    senderId: true,
                    receiverId: true,
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
 * Searches for users in the database based on provided query
 *
 * Database Operation: GET (SELECT query)
 * Tables: User (primary), Subscription
 * 
 * What it retrieves:
 * - Users matching search query in name or email fields
 * - User data with subscription plan information
 * - Excludes current user from results
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table with OR condition for:
 *    - First name (case-insensitive contains)
 *    - Last name (case-insensitive contains)
 *    - Email address (case-insensitive contains)
 * 3. Excludes current user using NOT clause
 * 4. Includes subscription plan data via Prisma relations
 * 5. Returns matching users with subscription information
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
 * Database Operation: POST (CREATE operation)
 * Tables: Comment (create), Video (update)
 * 
 * What it creates:
 * - New top-level comments on videos
 * - Nested replies to existing comments
 * 
 * How it works:
 * 1. If commentId is provided, creates a reply to existing comment:
 *    - Updates Comment table with nested reply creation
 * 2. If no commentId, creates new top-level comment:
 *    - Updates Video table with nested comment creation
 * 3. Uses Prisma's nested create operations for efficient database updates
 * 4. Returns success status with confirmation message
 * 5. Handles database errors gracefully
 * 
 * Comment Types:
 * - Top-level comments: Direct comments on videos (commentId is undefined)
 * - Replies: Responses to existing comments (commentId is provided)
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
 * Database Operation: GET (SELECT query)
 * Table: User
 * 
 * What it retrieves:
 * - User ID and profile image for comment attribution
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table by clerkId
 * 3. Selects only id and image fields for efficiency
 * 4. Returns profile data for comment creation
 * 5. Handles authentication errors gracefully
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
 * Database Operation: GET (SELECT query)
 * Tables: Comment (primary), User
 * 
 * What it retrieves:
 * - All top-level comments for the video
 * - Nested replies for each comment
 * - User information for comment attribution
 * 
 * How it works:
 * 1. Queries Comment table with OR condition:
 *    - Comments directly on video (videoId = videoId)
 *    - Comments on comments (commentId = videoId)
 * 2. Filters for top-level comments (commentId is null)
 * 3. Includes nested replies using Prisma's include functionality
 * 4. Includes user information for each comment and reply
 * 5. Returns hierarchical comment structure for UI rendering
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
 * Database Operation: GET (SELECT query)
 * Tables: User (primary), Subscription
 * 
 * What it retrieves:
 * - User's subscription plan (PRO/FREE)
 * - Payment information for access control
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table by clerkId
 * 3. Includes related subscription data via Prisma relations
 * 4. Returns subscription plan for access control
 * 5. Handles authentication errors gracefully
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
 * Database Operation: PUT (UPDATE operation)
 * Table: User
 * 
 * What it updates:
 * - User's firstView notification preference
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Updates User table by clerkId
 * 3. Sets firstView field to provided boolean value
 * 4. Returns success status with confirmation message
 * 5. Handles authentication and database errors gracefully
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
 * Database Operation: GET (SELECT query)
 * Table: User
 * 
 * What it retrieves:
 * - User's firstView notification preference (boolean)
 * 
 * How it works:
 * 1. Gets current authenticated user from Clerk
 * 2. Queries User table by clerkId
 * 3. Selects only firstView field for efficiency
 * 4. Returns the current preference value
 * 5. Handles authentication errors gracefully
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
 * Database Operation: POST (CREATE operations)
 * Tables: Invite (create), User (query + update), WorkSpace (query)
 * External: Email sending
 * 
 * What it creates:
 * - Invitation record in the database
 * - Notification record for the inviter
 * - Sends email notification to invited user
 * 
 * How it works:
 * 1. Gets current authenticated user (inviter) from Clerk
 * 2. Queries User table for inviter's profile information
 * 3. Queries WorkSpace table for workspace details
 * 4. Creates invitation record in Invite table
 * 5. Updates User table with notification for inviter
 * 6. Sends email notification to the invited user
 * 7. Returns success status with confirmation message
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
                content: `You invited ${receiverInfo?.firstname || ''} ${receiverInfo?.lastname || ''} into ${workspace.name}`,
                NotificationInvite: {
                  create: {
                    inviteId: invitation.id,
                  },
                },
              },
            },
          },
        })
        
        await client.user.update({
          where: {
            id: receiverId,
          },
          data: {
            notification: {
              create: {
                content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
                NotificationInvite: {
                  create: {
                    inviteId: invitation.id,
                  },
                },
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
