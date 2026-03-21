---
title: "State Management in Flutter: A React Developer's Honest Look"
date: "2026-02-20"
description: "Provider, Riverpod, BLoC, GetX — Flutter's state management ecosystem is a battlefield. Here's what a React Native developer learned after building with all of them."
category: "mobile"
tags: ["Flutter", "Dart", "State Management", "Riverpod", "BLoC"]
readTime: "9 min read"
---

## Coming From React, Flutter State Feels Familiar — Then It Doesn't

When I first picked up Flutter after years of React and React Native, the pitch was appealing: declarative UI, widget trees that look like component trees, state flows down and events flow up. Same mental model, different language.

That illusion lasts about a week. Then you need to share state between two widgets, and someone tells you about Provider. Then someone else tells you Provider is legacy and you should use Riverpod. Then a third person insists BLoC is the only production-ready option. Then you find GetX, which promises to do everything and has the GitHub stars to back it up.

Flutter's state management ecosystem is more fragmented than React's ever was. And unlike React — where the community roughly converged on hooks + React Query + lightweight stores — Flutter's community is still fighting about fundamentals.

Here's what I've learned building with all of them.

## InheritedWidget: Flutter's Context

Everything in Flutter's state management is built on `InheritedWidget`. It's the equivalent of React's Context API — a way to pass data down the widget tree without explicitly threading it through every constructor.

```dart
class AuthScope extends InheritedWidget {
  final User? user;

  const AuthScope({
    required this.user,
    required super.child,
    super.key,
  });

  static AuthScope of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<AuthScope>()!;
  }

  @override
  bool updateShouldNotify(AuthScope oldWidget) => user != oldWidget.user;
}
```

Nobody uses `InheritedWidget` directly for the same reason nobody uses React's `createContext` with a manual value provider: it works, but the boilerplate-to-value ratio is painful. Every state management solution in Flutter is an abstraction over this mechanism.

Understanding that matters because it tells you something important: all Flutter state management has the same performance characteristics at the base layer. The differences are in developer experience and code organization, not runtime speed.

## Provider: The Pragmatic Default

Provider was created by Remi Rousselet (who later created Riverpod) and became Flutter's officially recommended state management solution. It wraps `InheritedWidget` with a sane API.

```dart
// Define a model
class CartModel extends ChangeNotifier {
  final List<Item> _items = [];

  List<Item> get items => UnmodifiableListView(_items);
  int get totalPrice => _items.fold(0, (sum, item) => sum + item.price);

  void add(Item item) {
    _items.add(item);
    notifyListeners();
  }

  void remove(Item item) {
    _items.remove(item);
    notifyListeners();
  }
}

// Provide it
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CartModel(),
      child: const MyApp(),
    ),
  );
}

// Consume it
class CartScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartModel>();

    return ListView.builder(
      itemCount: cart.items.length,
      itemBuilder: (_, i) => CartItemTile(item: cart.items[i]),
    );
  }
}
```

Provider is fine. Genuinely. For small to medium apps, it's straightforward, well-documented, and the learning curve is gentle. If you're coming from React and just want to get things done, Provider will feel natural.

The problems emerge at scale. Provider instances are scoped to the widget tree, which means you can't easily access a provider outside of `build()`. Testing requires wrapping widgets in provider scopes. And the `ChangeNotifier` pattern notifies *all* listeners on every change — there's no selector equivalent out of the box.

## Riverpod: The React Query of Flutter

Riverpod is Provider's successor, also by Remi Rousselet, and it fixes nearly every complaint I had with Provider. If I had to pick one Flutter state management solution today, it would be Riverpod.

The key insight: Riverpod providers are declared globally, not in the widget tree. This sounds wrong if you come from React (global state is bad!), but in practice it means providers are testable, composable, and accessible from anywhere.

```dart
// Declare providers globally — they're lazy by default
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(apiClientProvider));
});

final conversationsProvider = FutureProvider.autoDispose<List<Conversation>>((ref) async {
  final token = ref.watch(authProvider).token;
  if (token == null) return [];

  final api = ref.read(apiClientProvider);
  return api.getConversations(token);
});

// Consume in a widget
class ConversationsList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversations = ref.watch(conversationsProvider);

    return conversations.when(
      data: (list) => ListView.builder(
        itemCount: list.length,
        itemBuilder: (_, i) => ConversationTile(conversation: list[i]),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (err, stack) => ErrorDisplay(message: err.toString()),
    );
  }
}
```

The `.when()` pattern on async providers is beautiful — it forces you to handle loading, data, and error states explicitly. No more forgetting to show a loading spinner. No more uncaught errors silently breaking the UI.

Riverpod also gives you `autoDispose` (automatic cleanup when no widget is listening), `family` (parameterized providers, like query keys in React Query), and `ref.watch` for reactive dependencies between providers.

```dart
// Parameterized provider — like React Query's queryKey
final conversationProvider = FutureProvider.autoDispose
    .family<Conversation, String>((ref, conversationId) async {
  final api = ref.read(apiClientProvider);
  return api.getConversation(conversationId);
});

// Usage
final conversation = ref.watch(conversationProvider('conv_123'));
```

This is why I call it the React Query of Flutter. It's handling server cache, async states, caching, and lifecycle management with a coherent API.

## BLoC: The Enterprise Choice

BLoC (Business Logic Component) is the pattern that enterprise Flutter teams gravitate toward. It enforces a strict separation between UI and business logic through streams of events and states.

```dart
// Events
abstract class ChatEvent {}
class SendMessage extends ChatEvent {
  final String text;
  SendMessage(this.text);
}
class LoadMessages extends ChatEvent {
  final String conversationId;
  LoadMessages(this.conversationId);
}

// States
abstract class ChatState {}
class ChatInitial extends ChatState {}
class ChatLoading extends ChatState {}
class ChatLoaded extends ChatState {
  final List<Message> messages;
  ChatLoaded(this.messages);
}
class ChatError extends ChatState {
  final String message;
  ChatError(this.message);
}

// BLoC
class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final ApiClient api;

  ChatBloc(this.api) : super(ChatInitial()) {
    on<LoadMessages>(_onLoadMessages);
    on<SendMessage>(_onSendMessage);
  }

  Future<void> _onLoadMessages(
    LoadMessages event, Emitter<ChatState> emit,
  ) async {
    emit(ChatLoading());
    try {
      final messages = await api.getMessages(event.conversationId);
      emit(ChatLoaded(messages));
    } catch (e) {
      emit(ChatError(e.toString()));
    }
  }

  Future<void> _onSendMessage(
    SendMessage event, Emitter<ChatState> emit,
  ) async {
    // Handle sending...
  }
}
```

Look at that. For a chat screen that loads and sends messages, I needed three event classes, four state classes, and a bloc class with handler methods. That's about 60 lines of code before the widget even renders anything.

BLoC's strength is its predictability. Every state transition is explicit. Events go in, states come out. It's easy to test because you can emit events and assert on state sequences. For large teams where consistency matters more than velocity, this trade-off makes sense.

But for most apps? BLoC is over-engineering. I've written about this before — the cost of abstraction isn't just the code you write, it's the code everyone on your team has to read, understand, and maintain. When a junior developer needs to add a new feature, the distance between "I know what to build" and "the feature is working" should be as short as possible.

With Riverpod, adding a new data source is one provider declaration. With BLoC, it's an event class, a state class hierarchy, a bloc class, and a widget integration. That's not rigor — that's ceremony.

## GetX: The Temptation

GetX has more GitHub stars than any other Flutter state management library. It promises state management, dependency injection, and navigation in one package. The API is deceptively simple.

```dart
class CounterController extends GetxController {
  var count = 0.obs;
  void increment() => count++;
}

// Usage
final controller = Get.put(CounterController());
Obx(() => Text('${controller.count}'));
```

I'll be honest: GetX feels great for the first two days. Everything is concise. No boilerplate. Just works.

The problems are structural. GetX bypasses Flutter's widget lifecycle in ways that create hard-to-debug issues. The `Get.put` / `Get.find` service locator pattern makes dependencies implicit. Memory leaks from controllers not being disposed are a common production issue. And the library tries to do too many things — state, routing, HTTP, internationalization, storage — which means you're locked into its opinions across your entire app.

I wouldn't use GetX for anything I plan to maintain for more than six months. That's not a popular opinion, but it's an honest one.

## The Fragmentation Problem

Here's the cold truth: Flutter's state management ecosystem is more fragmented than React's, and there's no sign of convergence.

In React land, the community has roughly agreed:
- Local state → `useState` / `useReducer`
- Server cache → React Query / SWR
- Global state → Zustand / Jotai (lightweight, hooks-based)

In Flutter land, every team picks a different combination, and codebases built with different approaches are structurally incompatible. You can't easily mix BLoC and Riverpod in the same app — they have different state access patterns, different testing approaches, and different widget integration points.

This fragmentation has real costs. Hiring is harder because "Flutter experience" doesn't mean someone knows your state management stack. Open-source packages pick one approach and ignore the rest. Tutorials are fractured.

## What I Actually Recommend

For a new Flutter project in 2026, here's my stack:

| Need | Solution |
|---|---|
| Local widget state | `StatefulWidget` or hooks (`flutter_hooks`) |
| App-wide state | Riverpod `StateNotifier` or `Notifier` |
| Server data / async | Riverpod `FutureProvider` / `AsyncNotifier` |
| Navigation | GoRouter (Riverpod-compatible) |
| Persistence | Riverpod + Hive/SharedPreferences |

Riverpod handles enough of the state management surface that you don't need a second library. It's the closest thing Flutter has to a unified solution.

If you're on an existing BLoC codebase, don't rewrite it. BLoC works. It's verbose, but it's predictable and well-tested. The migration cost isn't worth the gains unless you're already refactoring for other reasons.

If you're evaluating Flutter from a React background, expect the state management story to feel messier than what you're used to. The widget framework itself is excellent. The ecosystem around state is still maturing. Riverpod is the closest thing to "just use this" that Flutter has, but it doesn't have the consensus that React Query has in the React world.

That's the honest picture. Build with it accordingly.
