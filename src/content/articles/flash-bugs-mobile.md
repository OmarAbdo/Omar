---
title: "The Flash Bug: Why Your Mobile App Flickers Between Screens"
date: "2026-01-18"
description: "That split-second flash of wrong content during navigation — white screens, stale data, layout snaps. Why it happens on both React Native and Flutter, and how to fix it."
category: "mobile"
tags: ["React Native", "Flutter", "Mobile", "Navigation", "UX"]
readTime: "8 min read"
---

## The Bug You Can't Reproduce in Slow Motion

You've seen it. Your user taps a button, the screen transitions, and for one frame — maybe two — the wrong thing appears. A white flash. The previous screen's data lingering where the new screen's data should be. A layout that snaps from one size to another. A loading spinner that appears and disappears so fast it looks like a glitch.

This is the flash bug. It's the most common UX defect in mobile apps, and it's the hardest to debug because it's a timing issue that depends on device speed, navigation animation duration, and async state resolution — all interacting at once.

I've fixed this bug in every mobile app I've worked on, including Tafkeer. It always comes back in new forms. Here's why it happens and how to actually fix it, on both React Native and Flutter.

## Why Mobile Is Different From Web

On the web, navigation is destructive. When you go from `/page-a` to `/page-b`, page A unmounts and page B mounts. There's no transition animation. There's no moment where both exist simultaneously. The browser handles the gap with a white screen that users have been conditioned to accept.

On mobile, navigation is animated. Screen A slides out while Screen B slides in. Both screens are rendered simultaneously during the ~300ms transition. This means Screen B's `build()` or `render()` is called before the user can see it, while the animation is still running.

If Screen B depends on async data (an API call, a database read, state hydration), it will render its initial state during the transition. That initial state — an empty list, a loading spinner, placeholder text, or nothing at all — is visible to the user for a fraction of a second before the real data arrives.

That's the flash.

## Root Cause #1: Async State Not Resolved Before Render

The most common cause. A screen mounts, kicks off a data fetch in `useEffect` (React Native) or `initState` (Flutter), and renders a loading state while waiting. The loading state is visible during the navigation animation.

### React Native

```typescript
// THE PROBLEM: This screen flashes a loading state during transition
function ConversationScreen({ route }) {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    api.getMessages(conversationId).then(setMessages);
  }, [conversationId]);

  if (!messages) return <LoadingSpinner />;  // This flashes

  return <MessageList messages={messages} />;
}
```

### Flutter

```dart
// THE PROBLEM: FutureBuilder shows loading during transition
class ConversationScreen extends StatelessWidget {
  final String conversationId;
  const ConversationScreen({required this.conversationId});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Message>>(
      future: api.getMessages(conversationId),  // fires on every build!
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const LoadingSpinner(); // flashes
        return MessageList(messages: snapshot.data!);
      },
    );
  }
}
```

The Flutter version has an extra problem: `FutureBuilder` recreates the future on every `build()` call. If the widget rebuilds during the transition animation, it restarts the fetch. This is a classic Flutter footgun.

## Root Cause #2: Navigation Mounts Before Data Is Ready

In both React Navigation and Flutter's Navigator, screens are mounted immediately when a navigation action occurs. The screen exists in the widget/component tree before the transition animation starts.

This means there's no built-in mechanism to say "don't start the transition until this screen's data is ready." The navigation library doesn't know or care about your data dependencies.

## Root Cause #3: Theme/Context Re-initialization

This one is subtle. In React Native, if your screen reads from a context that hasn't propagated yet, or if a theme provider re-renders during navigation, the screen briefly shows default styles before the correct theme applies.

In Flutter, this manifests when a screen uses `Theme.of(context)` or `MediaQuery.of(context)` before those inherited widgets have fully resolved in the new route's context.

## Fixes for React Native

### 1. Prefetch Data Before Navigating

The cleanest solution: fetch the data before you trigger navigation.

```typescript
function ConversationListItem({ conversation }) {
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const handlePress = async () => {
    // Prefetch data before navigating
    await queryClient.prefetchQuery({
      queryKey: ['conversation', conversation.id],
      queryFn: () => api.getMessages(conversation.id),
    });

    navigation.navigate('Conversation', {
      conversationId: conversation.id,
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <Text>{conversation.title}</Text>
    </Pressable>
  );
}
```

The target screen then reads from the already-warm cache:

```typescript
function ConversationScreen({ route }) {
  const { conversationId } = route.params;

  // Data is already cached from prefetch — no loading flash
  const { data: messages } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => api.getMessages(conversationId),
  });

  // messages is available immediately if prefetch completed
  return <MessageList messages={messages ?? []} />;
}
```

### 2. Delay Rendering Until After Transition

`InteractionManager` lets you defer work until after animations complete:

```typescript
function ConversationScreen({ route }) {
  const { conversationId } = route.params;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if (!isReady) {
    // Show a lightweight placeholder that matches the final layout
    return <ConversationSkeleton />;
  }

  return <ConversationContent conversationId={conversationId} />;
}
```

The key: the placeholder should match the final layout's structure. A skeleton screen that has the same dimensions as the real content won't feel like a flash — it feels like the content is loading naturally.

### 3. Use react-native-screens Properly

`react-native-screens` uses native screen containers instead of React Native views for each screen. This means the native OS handles screen transitions, which eliminates an entire class of flash bugs caused by React re-renders during JS-driven animations.

```typescript
import { enableScreens } from 'react-native-screens';
enableScreens(true);  // Call before any navigation setup

// In your navigator, use native stack
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
```

Native stack navigators don't render both screens in React simultaneously. The new screen is a native view that the OS animates in. This is the single biggest fix for flash bugs in React Native.

### 4. Freeze Inactive Screens

```typescript
import { enableFreeze } from 'react-native-screens';
enableFreeze(true);

// Screens that aren't visible stop re-rendering entirely
// This prevents stale re-renders from causing flashes
// when navigating back to a previous screen
```

## Fixes for Flutter

### 1. Don't Use FutureBuilder for Navigation-Dependent Data

`FutureBuilder` is designed for one-shot async operations, not for data that should persist across widget rebuilds. Use a state management solution instead:

```dart
// GOOD: Use Riverpod to manage async state
final conversationProvider = FutureProvider.autoDispose
    .family<List<Message>, String>((ref, conversationId) async {
  final api = ref.read(apiClientProvider);
  return api.getMessages(conversationId);
});

class ConversationScreen extends ConsumerWidget {
  final String conversationId;
  const ConversationScreen({required this.conversationId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final messages = ref.watch(conversationProvider(conversationId));

    return messages.when(
      data: (msgs) => MessageList(messages: msgs),
      loading: () => const ConversationSkeleton(),
      error: (e, _) => ErrorDisplay(message: e.toString()),
    );
  }
}
```

### 2. Custom Route Transitions That Hide the Flash

Build route transitions that naturally mask the loading period:

```dart
class FadePageRoute<T> extends PageRouteBuilder<T> {
  final WidgetBuilder builder;

  FadePageRoute({required this.builder})
      : super(
          transitionDuration: const Duration(milliseconds: 400),
          reverseTransitionDuration: const Duration(milliseconds: 300),
          pageBuilder: (context, animation, secondaryAnimation) =>
              builder(context),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(
              opacity: CurvedAnimation(
                parent: animation,
                curve: Curves.easeOut,
              ),
              child: child,
            );
          },
        );
}
```

Fade transitions are more forgiving than slide transitions because the new screen appears gradually. A loading skeleton that fades in looks intentional, while one that slides in looks broken.

### 3. AutomaticKeepAliveClientMixin

For screens in a `TabBarView` or `PageView` that flash when you switch back to them because they've been disposed and rebuilt:

```dart
class ChatTab extends StatefulWidget {
  @override
  State<ChatTab> createState() => _ChatTabState();
}

class _ChatTabState extends State<ChatTab>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;  // Keeps this tab alive

  @override
  Widget build(BuildContext context) {
    super.build(context);  // Required by the mixin
    return const ChatContent();
  }
}
```

### 4. Preload Data in the Route

```dart
GoRoute(
  path: '/conversation/:id',
  builder: (context, state) {
    final id = state.pathParameters['id']!;
    // Trigger the fetch before the widget builds
    ProviderScope.containerOf(context)
        .read(conversationProvider(id));
    return ConversationScreen(conversationId: id);
  },
),
```

## The Deeper Insight

The flash bug exists because mobile navigation is fundamentally stateful in a way that web routing isn't. A mobile app's navigation stack is a living data structure — screens have lifecycle, they persist in memory, they animate between states.

Web routing is declarative replacement: here's a URL, show the corresponding page. Mobile navigation is state machine management: here's a stack of screens with transition animations, back gestures, modal presentations, and shared element transitions, all running at 60fps.

Once you internalize that distinction, the flash bug stops being surprising. Of course the screen flashes — it was asked to render before it had data, during an animation it didn't control, on a device whose speed it can't predict.

The fix is always some form of the same principle: **control the moment when content becomes visible, independent of the moment when the screen mounts.** Whether that's prefetching data, using skeleton screens, leveraging native transitions, or deferring heavy work with InteractionManager — you're always solving the same timing mismatch.

Every mobile app has this bug. The good apps just hide it better.
