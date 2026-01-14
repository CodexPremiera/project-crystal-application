# OOP Analysis for Crystal Web Application

## Can OOP Be Applied? Yes, partially. Should it? **Not for most of this project.**

---

## Why OOP Doesn't Fit Well Here

### 1. Server Actions Constraint (Critical)

Next.js Server Actions **must be standalone async functions**. You cannot export class methods as server actions:

```typescript
// ❌ THIS WON'T WORK
class UserService {
  async getNotifications() { ... }
}
export const getNotifications = new UserService().getNotifications // Won't serialize!

// ✅ THIS IS REQUIRED
export async function getNotifications() { ... }
```

### 2. React's Functional Paradigm

React has moved entirely to functional components + hooks. Class components are legacy. The entire ecosystem (React Query, our hooks) is functional.

### 3. Prisma Already Provides OOP-like Benefits

Prisma's typed client already gives you:
- Type-safe queries
- Structured data access
- Relationship handling

---

## What Would ACTUALLY Help the Codebase

Instead of OOP, we recommend **functional composition patterns** that match the framework:

### 1. Extract Common Patterns into Helper Functions

There are repeated patterns in the actions. We can create helpers:

```typescript
// lib/server-helpers.ts
import { currentUser } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"

export type ActionResponse<T> = 
  | { status: 200 | 201; data: T }
  | { status: 400 | 403 | 404 | 500; error?: string }

export async function withAuth<T>(
  handler: (clerkUser: NonNullable<Awaited<ReturnType<typeof currentUser>>>) => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const user = await currentUser()
    if (!user) return { status: 403, error: 'Unauthorized' }
    
    const result = await handler(user)
    return { status: 200, data: result }
  } catch (error) {
    console.error(error)
    return { status: 500, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function getDbUser(clerkId: string) {
  return client.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
}
```

Then actions become cleaner:

```typescript
// actions/user.ts
export const getNotifications = async () => {
  return withAuth(async (clerkUser) => {
    const notifications = await client.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { notification: { ... } }
    })
    return notifications
  })
}
```

### 2. Response Factory Functions

```typescript
// lib/response.ts
export const success = <T>(data: T) => ({ status: 200 as const, data })
export const created = <T>(data: T) => ({ status: 201 as const, data })
export const notFound = (message = 'Not found') => ({ status: 404 as const, error: message })
export const forbidden = () => ({ status: 403 as const, error: 'Forbidden' })
```

### 3. Service Modules (Functional, Not Classes)

Group related functions into modules without using classes:

```typescript
// services/notification.service.ts
import { client } from "@/lib/prisma"

export const NotificationService = {
  async getAll(userId: string) {
    return client.notification.findMany({ where: { userId } })
  },
  
  async markAllRead(userId: string) {
    return client.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    })
  },
  
  async getUnreadCount(userId: string) {
    return client.notification.count({ where: { userId, isRead: false } })
  }
}
```

---

## Where OOP COULD Make Sense

There are a few places where classes might help:

### 1. Email Service (External Integration)

```typescript
// lib/email-service.ts
export class EmailService {
  private transporter: nodemailer.Transporter
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    })
  }
  
  async sendInvite(to: string, workspaceName: string, inviteLink: string) {
    return this.transporter.sendMail({
      to,
      subject: `You've been invited to ${workspaceName}`,
      html: this.buildInviteTemplate(workspaceName, inviteLink)
    })
  }
  
  private buildInviteTemplate(workspaceName: string, link: string): string {
    return `<html>...</html>`
  }
}

export const emailService = new EmailService() // Singleton
```

### 2. Value Objects for Complex Data

```typescript
// models/video-title.ts
export class VideoTitle {
  constructor(private readonly value: string) {
    if (!value || value.length > 100) {
      throw new Error('Invalid video title')
    }
  }
  
  toString() { return this.value }
  truncate(length: number) { return this.value.slice(0, length) + '...' }
}
```

---

## Summary

| Approach | Recommended? | Reason |
|----------|--------------|--------|
| OOP for Server Actions | ❌ No | Framework constraint |
| OOP for React Components | ❌ No | Hooks are the standard |
| OOP for External Services | ✅ Maybe | Encapsulation is useful |
| Functional Helpers | ✅ Yes | Matches the paradigm |
| Service Modules (object literals) | ✅ Yes | Good organization |
| Response Factories | ✅ Yes | Reduces duplication |

---

## Conclusion

The current functional approach is correct for Next.js. Focus on extracting common patterns into reusable helper functions rather than converting to OOP. The framework is designed around functions, and fighting against it will create friction.

**Key Takeaways:**
- Next.js Server Actions require standalone functions
- React ecosystem is functional (hooks, React Query)
- Use composition over inheritance
- Extract repeated patterns into helper functions
- Service modules (object literals) provide good organization without class overhead

