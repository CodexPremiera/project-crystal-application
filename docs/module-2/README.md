# Module 2: Subscription and Billing

## Module Overview

This module handles subscription management and billing operations. Users can view their current subscription plan, upgrade to PRO via Stripe checkout, and manage their billing information. The system integrates with Stripe for secure payment processing.

---

## Features List

| #   | Feature                                                   | Actor  |
|-----|-----------------------------------------------------------|--------|
| 2.1 | User can view their subscription plan and billing information | User   |
| 2.2 | User can upgrade to PRO subscription via Stripe checkout  | User   |
| 2.3 | System stores Stripe customer ID for future billing       | System |
| 2.4 | User can cancel and return from payment page              | User   |

---

## Feature Groupings

Features are grouped by their logical flow and shared implementation.

| Group | Features | Name | Description |
|-------|----------|------|-------------|
| 1 | 2.1 | [View Subscription](./feature-2.1/) | Display current subscription plan and billing information |
| 2 | 2.2, 2.3, 2.4 | [Upgrade Subscription](./feature-2.2-2.4/) | Complete subscription upgrade flow including Stripe checkout, payment completion, and cancellation handling |

---

## Grouping Rationale

### Why group features 2.2, 2.3, and 2.4?

1. **Single User Flow**: Features 2.2, 2.3, and 2.4 represent different paths in the same user journey - initiating a subscription upgrade.

2. **Shared Components**: They share the same PaymentButton, useSubscription hook, and payment API route.

3. **Outcome Paths**: 
   - 2.2 initiates the flow
   - 2.3 executes on successful payment (automatic system action)
   - 2.4 handles the cancellation path

### Why 2.1 is standalone?

Feature 2.1 is a simple read operation with its own page (`/billing`) and doesn't interact with the payment flow.

---

## Folder Structure

```
module-2/
├── README.md                     ← This file
├── feature-2.1/
│   ├── documentation.md
│   └── *.png                     ← Diagram images
└── feature-2.2-2.4/
    ├── documentation.md
    └── *.png
```

---

## External Dependencies

| Service | Purpose |
|---------|---------|
| Stripe | Payment processing and subscription management |
| Clerk | User authentication for payment association |
| PostgreSQL | Store subscription data and customer IDs |

---

## Database Tables Used

- `User` - Links to subscription
- `Subscription` - Stores plan type (FREE/PRO) and Stripe customer ID

---

## Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| FREE | $0/month | Basic features, SD recording |
| PRO | $99/month | AI transcription, AI summaries, HD recording, public workspaces |

