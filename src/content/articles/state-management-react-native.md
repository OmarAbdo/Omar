---
title: "State Management in React Native: What Actually Works"
date: "2026-03-05"
description: "Redux is not the answer. Context is not the answer. Here's what actually works for state management in production React Native apps — from local state to server cache to navigation state."
category: "mobile"
tags: ["React Native", "State Management", "Zustand", "React Query", "Mobile"]
readTime: "10 min read"
---

## Stop Treating React Native Like Web React

The single biggest mistake React developers make when moving to React Native is assuming that state management works the same way. It doesn't. The mental model is different, the constraints are different, and the solutions that feel natural on the web will actively hurt you on mobile.

On the web, your app lives in a browser tab. The user navigates, and old pages get unmounted and garbage collected. State is ephemeral by default. On mobile, your app lives in memory for hours or days. Screens stay mounted in a navigation stack. The app backgrounding and foregrounding cycle introduces state transitions that don't exist on the web.

I learned this the hard way building Tafkeer — an Arabic-first AI platform on React Native. Every state management decision I'd internalized from years of web React had to be re-evaluated.

## Why Redux Became the Default (And Shouldn't Be)

Redux became the default for React Native for the same reason it became the default for web React in 2016: there wasn't a better option at the time, and the React Native community borrowed heavily from the web ecosystem.

But here's what Redux actually gives you on mobile:

- A global store (you rarely need everything global)
- A predictable update pattern (at the cost of boilerplate that makes you want to quit)
- Time-travel debugging (when's the last time you actually used this?)
- Middleware for async operations (which React Query now handles better)

And here's what it costs you:

- Actions, reducers, selectors, and thunks for every piece of state
- A mental model that encourages putting *everything* in the store
- Performance overhead from selectors re-running on every dispatch
- A massive dependency tree when you add Redux Toolkit, RTK Query, etc.

I've inherited three React Native codebases that used Redux. All three had the same problem: 70% of the Redux store was server cache (data fetched from an API) being manually managed with loading states, error states, and stale data bugs.

That's not application state. That's server state pretending to be application state. And there's a much better tool for it.

## The Real State Categories in React Native

Once I stopped thinking about state as one thing, everything clicked. In any production React Native app, you actually have four distinct categories:

### 1. Local Component State

State that belongs to a single component. A text input's value. Whether a modal is visible. An accordion's expanded/collapsed state.

```typescript
// This is fine. This was always fine.
const [query, setQuery] = useState('');
const [isExpanded, setIsExpanded] = useState(false);
```

Use `useState` and `useReducer`. Nothing else needed. If you're putting modal visibility in a global store, stop.

### 2. Shared Application State

State that multiple unrelated components need to access. The current user's profile. App-level settings. Theme preference. Authentication tokens.

This is where Zustand wins on React Native:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

Zustand's API is small enough to fit in your head. No providers wrapping your app. No dispatch/action/reducer ceremony. And the `persist` middleware with AsyncStorage gives you persistence out of the box — which on mobile is essential, not optional.

### 3. Server Cache State

Data that lives on a server and you're keeping a local copy. API responses. Paginated lists. User-generated content.

React Query owns this category completely:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.getConversations(),
    staleTime: 5 * 60 * 1000, // 5 minutes before refetch
    gcTime: 30 * 60 * 1000,   // keep in cache for 30 min
  });
}

function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { conversationId: string; text: string }) =>
      api.sendMessage(params),
    onSuccess: (_, variables) => {
      // Invalidate the conversation so it refetches
      queryClient.invalidateQueries({
        queryKey: ['conversation', variables.conversationId],
      });
    },
  });
}
```

In Tafkeer, switching from hand-rolled Redux async state to React Query eliminated about 400 lines of reducer code and fixed three stale-data bugs that had been open for weeks. React Query handles caching, deduplication, background refetching, optimistic updates, and retry logic. All the things you'd otherwise build yourself, badly.

### 4. Navigation State

This is the one nobody talks about, and it's the one that causes the most subtle bugs on mobile.

React Navigation maintains its own state tree that describes which screens are mounted, what params they received, and what the back stack looks like. This is *real* state that affects your UI, and it lives entirely outside React's state model.

```typescript
// Navigation params ARE state — treat them that way
type ChatScreenParams = {
  conversationId: string;
  initialMessage?: string;
};

function ChatScreen({ route }: ChatScreenProps) {
  const { conversationId, initialMessage } = route.params;

  // This is state derived from navigation, not from a store
  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => api.getConversation(conversationId),
  });

  // ...
}
```

The mistake I see constantly: duplicating navigation params into a global store. A screen receives a `conversationId` via navigation, then dispatches it to Redux, then reads it back from Redux. You've just created a synchronization problem for zero benefit.

**Rule: if data arrives via navigation params, consume it from navigation params.** Don't copy it somewhere else.

## AsyncStorage Is Persistence, Not State Management

This is a critical distinction that trips up React Native developers. AsyncStorage is a key-value persistence layer — it's the equivalent of `localStorage` on the web. It is not a state manager.

```typescript
// WRONG: using AsyncStorage as your state layer
async function getUser() {
  const userJson = await AsyncStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

// Every component that needs the user calls this async function,
// gets a stale snapshot, and has no way to react to changes.
```

```typescript
// RIGHT: AsyncStorage as a persistence layer behind Zustand
const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Now components subscribe to changes AND data persists across restarts
```

The `persist` middleware hydrates your Zustand store from AsyncStorage on app startup and writes back on every change. Reactive state with automatic persistence. This pattern handles 90% of what people try to do with AsyncStorage directly.

## The Tafkeer Stack

After iterating through multiple approaches, here's what Tafkeer settled on:

| State Category | Solution | Why |
|---|---|---|
| Local UI state | `useState` / `useReducer` | Built-in, zero overhead |
| Auth & preferences | Zustand + AsyncStorage persist | Reactive, persistent, tiny API |
| Server data (conversations, models) | React Query | Caching, refetch, optimistic updates |
| Navigation state | React Navigation params | Already managed, don't duplicate |

The total bundle size impact of Zustand + React Query is about 25KB gzipped. Redux Toolkit + RTK Query is about 40KB. The size difference isn't huge, but the complexity difference is enormous.

## Patterns That Saved Me

### Hydration-Aware Rendering

When your Zustand store hydrates from AsyncStorage, there's a brief moment where the store has its initial values (before persistence data loads). This causes flickers.

```typescript
import { useAuthStore } from './stores/auth';

function App() {
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) {
    return <SplashScreen />;
  }

  return <RootNavigator />;
}
```

### Query Key Conventions

In a React Native app with nested navigators, you'll have dozens of queries. Consistent key conventions prevent cache bugs:

```typescript
// Consistent key factory
export const queryKeys = {
  conversations: {
    all: ['conversations'] as const,
    list: (filters: Filters) => ['conversations', 'list', filters] as const,
    detail: (id: string) => ['conversations', 'detail', id] as const,
    messages: (id: string) => ['conversations', 'messages', id] as const,
  },
  models: {
    all: ['models'] as const,
    byCategory: (cat: string) => ['models', 'category', cat] as const,
  },
};
```

### Selective Zustand Subscriptions

Zustand re-renders components on any store change by default. Use selectors to prevent unnecessary renders — this matters more on mobile than web because re-renders directly impact scroll performance and animation frame rates:

```typescript
// BAD: re-renders on ANY store change
const store = useAppStore();

// GOOD: only re-renders when locale changes
const locale = useAppStore((s) => s.locale);

// GOOD: derived value with shallow equality
import { shallow } from 'zustand/shallow';
const { locale, theme } = useAppStore(
  (s) => ({ locale: s.locale, theme: s.theme }),
  shallow
);
```

## What About Jotai?

Jotai deserves an honorable mention. Its atomic model is elegant, and for apps with lots of independent state atoms (think a complex form builder or a dashboard with many widgets), it can be a better fit than Zustand.

But for most React Native apps, Zustand's single-store model is simpler to reason about, easier to persist, and more straightforward to debug. Jotai's power is in its composability — derived atoms, async atoms, atom families. If you don't need that composability, you don't need Jotai.

## The Bottom Line

State management in React Native is not one problem. It's four problems wearing a trench coat. The moment you stop treating it as "which library should I pick?" and start treating it as "which category does this state belong to?", the decisions become obvious.

Local state stays local. Server data goes through React Query. Shared app state goes in Zustand. Navigation state stays in the navigator.

Redux was the answer when it was the only answer. It's not the only answer anymore, and for most React Native apps, it's not the right one.
