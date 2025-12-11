import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * POST /api/auth/desktop-ticket
 *
 * Generates a Clerk sign-in ticket for the desktop app authentication flow.
 * This ticket allows the desktop app to establish a session without requiring
 * the user to enter credentials again.
 *
 * Security considerations:
 * - Requires an authenticated user session
 * - Ticket is short-lived and single-use
 * - Only valid for the authenticated user
 *
 * @returns JSON response with the sign-in ticket or error
 */
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 }
      );
    }

    const client = await clerkClient();

    // Generate a sign-in token for the desktop app
    // This creates a short-lived ticket that can be exchanged for a session
    const ticket = await client.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: 60, // Short expiration for security
    });

    return NextResponse.json({ ticket: ticket.token });
  } catch (error) {
    console.error("[Desktop Ticket] Error generating sign-in ticket:", error);

    return NextResponse.json(
      { error: "Failed to generate sign-in ticket" },
      { status: 500 }
    );
  }
}

