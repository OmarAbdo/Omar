---
title: "The Real Cost of Over-Engineering Your Frontend"
date: "2026-03-10"
description: "Why most frontend complexity is self-inflicted, and what I've learned about keeping React codebases simple after shipping products across fintech, AI, and logistics."
category: "frontend"
tags: ["React", "Architecture", "TypeScript", "Frontend"]
readTime: "9 min read"
---

## You're Probably Building a Spaceship for a Bike Ride

Here's a pattern I've seen in nearly every codebase I've inherited: a developer reads a blog post about clean architecture, gets inspired, and spends two weeks building an abstraction layer for a feature that could've been done in 40 lines of straightforward code.

I've been guilty of this myself. Early in my career, I'd reach for Redux when `useState` was fine. I'd build custom hook libraries for data fetching when React Query existed. I'd create barrel files, re-export layers, and "domain boundaries" in apps that had three pages.

After 8 years of shipping products — some to millions of users, some to a handful — the thing I regret most isn't the times I wrote "ugly" code. It's the time I wasted making code elegant for an audience that didn't exist.

## The Three Symptoms

There are three reliable signs that a frontend codebase is over-engineered. If you see any of these, something has gone sideways.

### 1. Premature Abstraction

```typescript
// This is three files, two interfaces, and a generic factory
// for a component used exactly once
const UserCard = withAnalytics(
  withPermissions(
    withTheme(
      BaseCard<UserCardProps>
    )
  )
);

// This is what you actually needed
function UserCard({ user }: { user: User }) {
  return (
    <div className="p-4 border rounded">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

The first version is "extensible." The second version is readable, testable, and deletable. When you need to extend it, you will — and you'll have context about *what* needs extending that you don't have today.

### 2. State Management Overreach

I've walked into codebases where every single piece of state lived in a global store. Dropdown open state? Redux. Form field value? Redux. Whether a tooltip is visible? Redux.

Global state exists for *shared* state — data that multiple unrelated components need. That's it. A modal's open/close state is local. A form's values are local (until submitted). The scroll position of a sidebar is local.

```typescript
// You do not need this
dispatch(toggleSidebarAction());
const isOpen = useSelector(selectSidebarOpen);

// You need this
const [isOpen, setIsOpen] = useState(false);
```

React's built-in state is not a limitation you're working around. It's the correct tool for most problems.

### 3. Configuration Over Convention

```typescript
// config/routes.ts — 200 lines of route config objects
// config/navigation.ts — 150 lines mapping routes to nav items
// config/permissions.ts — 100 lines mapping routes to roles
// lib/router.ts — custom router wrapper that reads all three

// What you needed: React Router's built-in nested routes
// with a layout component that checks auth
```

When the configuration layer becomes larger than the feature it configures, you have a net negative abstraction. You've traded one kind of complexity (repetition) for a worse kind (indirection).

## The Cost Nobody Measures

Over-engineering doesn't show up in sprint velocity. It shows up six months later when:

- **A new developer joins** and needs three days to understand how data flows through five abstraction layers instead of reading a component file top to bottom.
- **A simple feature request comes in** and you realize the abstraction you built doesn't actually accommodate this variation, so you either hack around it or rewrite the abstraction.
- **A bug appears** and the stack trace goes through eight wrapper functions before reaching the actual logic.

I've measured this informally on teams I've led. On over-abstracted codebases, the median time for a new developer to ship their first meaningful PR is 8-12 days. On straightforward codebases — where components are self-contained and you can read a feature from top to bottom — it's 2-3 days.

That's a 4x difference. Not in code quality. In *velocity*.

## What Actually Works at Scale

I've worked on codebases ranging from small prototypes to platforms handling real money (fintech at Simon Kucher, AI orchestration at LifeOS). Here's what I've landed on.

### Co-locate Everything

Put the component, its types, its styles, and its data-fetching logic in the same directory. Not in a `types/` folder. Not in a `hooks/` folder. Not in a `styles/` folder. Together.

```
features/
  checkout/
    Checkout.tsx
    CheckoutForm.tsx
    useCheckoutSubmit.ts
    checkout.types.ts
```

When you need to change checkout, you open one folder. When you need to delete checkout, you delete one folder. This is not a small thing — deletability is the most undervalued property of good code.

### Resist the Hook Extraction Reflex

Not every piece of logic needs to be a custom hook. A hook is justified when:

1. It's reused across multiple components, or
2. It encapsulates a genuinely complex lifecycle concern (subscriptions, observers, resize listeners)

A hook is *not* justified when it's extracting 10 lines of `useEffect` + `useState` that exist in exactly one component. You're just moving code from one place to another and adding a function call boundary.

### Use the Platform

Modern React + TypeScript + Tailwind is an extremely capable stack without any additions. Before installing a library, check:

- **Can React's built-in state handle this?** (Usually yes.)
- **Can CSS handle this animation?** (More often than you'd think.)
- **Can a `fetch` call handle this data loading?** (If you don't need caching, yes.)
- **Can TypeScript's type system handle this validation?** (For compile-time checks, almost always.)

I'm not against libraries. I use React Query, React Router, Framer Motion. But each one should earn its place by solving a problem you've actually encountered, not one you've imagined.

### Write Boring Code

The best frontend code I've ever written looks boring. Short components. Obvious prop names. Explicit conditionals instead of clever ternary chains. Flat data structures instead of nested objects.

```typescript
// Clever
const label = isAdmin ? (isPending ? "Review" : "Approve") : canView ? "View" : null;

// Boring
let label = null;
if (isAdmin && isPending) label = "Review";
else if (isAdmin) label = "Approve";
else if (canView) label = "View";
```

The boring version is longer. It's also immediately understandable, debuggable, and modifiable. When the product manager asks "what happens when a user is both admin and viewer?", you can point to a specific line.

## The Rule I Follow Now

Before adding any abstraction, any new pattern, any architectural layer, I ask one question:

**Would I be embarrassed to show this to a junior developer and explain why it exists?**

If the answer is "well, it's because we *might* need to..." — I don't build it. If the answer is "because we hit this specific problem and this solves it" — I build it.

Software engineering is the discipline of managing complexity. The best frontend engineers I know don't add complexity. They resist it, contain it, and when forced to accept it, they make it as local and obvious as possible.

The spaceship is impressive. But if you're going to the grocery store, take the bike.
