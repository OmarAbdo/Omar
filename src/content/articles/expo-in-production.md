---
title: "Expo in Production: What No One Tells You"
date: "2026-02-28"
description: "From Expo Go to EAS Build to over-the-air updates — the gaps between Expo's marketing and the reality of shipping a production React Native app."
category: "frontend"
tags: ["React Native", "Expo", "EAS", "Mobile", "iOS", "Android"]
readTime: "10 min read"
---

## Expo Sold Me a Dream. Most of It Was Real.

When I started building Tafkeer — an Arabic-first AI platform — I chose Expo because I wanted to move fast with a small team. One codebase, both platforms, managed infrastructure. The promise is compelling: skip the Xcode/Gradle suffering and focus on product.

After shipping to both app stores and running in production for months, here's what I wish someone had told me.

## The Expo Ecosystem, Briefly

If you're evaluating Expo, the first thing to understand is that it's not one tool — it's a stack:

- **Expo SDK** — A curated set of React Native packages (camera, notifications, file system, etc.) that are guaranteed to work together.
- **Expo Go** — A pre-built app on your phone for instant development. You scan a QR code and your app is running. No build step.
- **EAS Build** — Cloud build service. Compiles your native iOS/Android binaries without you touching Xcode or Android Studio.
- **EAS Update** — Over-the-air JavaScript updates. Push code to production without going through App Store review.
- **EAS Submit** — Automated app store submission.

Each layer solves a real problem. But each layer also has sharp edges that only show up when you're past the tutorial stage.

## Expo Go: Great for Prototypes, Dangerous for Production

Expo Go is magical for the first two weeks. You write code, shake your phone, and it reloads. No waiting for native builds. No simulator janks.

The problems start when you need anything Expo Go doesn't bundle:

- A native module not in the Expo SDK (e.g., a custom Bluetooth library)
- A specific native configuration (custom URL schemes, background modes, App Groups)
- Anything that requires modifying `Info.plist` or `AndroidManifest.xml`

At that point, Expo Go becomes useless for development. You need **development builds** — a custom-compiled version of your app that includes your specific native modules. This is well-documented but rarely emphasized: Expo Go is a development convenience, not a development environment.

My advice: start with development builds from day one. Yes, it adds 5-10 minutes to your first build. But it means your dev environment matches production exactly, and you'll never hit the "works in Expo Go, crashes in production" cliff.

```bash
# Create a development build instead of using Expo Go
npx expo install expo-dev-client
eas build --profile development --platform ios
```

## EAS Build: The Good, The Bad, The Expensive

EAS Build replaces the need for a local Xcode/Gradle setup. You push your code, EAS compiles it in the cloud, and you get an `.ipa` or `.apk` back.

**The good:**
- You genuinely never need to open Xcode for most apps.
- iOS builds work from Linux/Windows machines.
- Build configurations are version-controlled in `eas.json`.
- The queue times have gotten much better — usually under 10 minutes.

**The bad:**
- Debugging build failures is painful. When a build fails on EAS, you're reading cloud logs without the ability to run commands interactively. Locally, you'd poke around Xcode and fix the issue in minutes. On EAS, it's a cycle of "change config, push, wait 8 minutes, read logs, repeat."
- Custom native modules require `app.json` config plugins, which are a whole abstraction layer with their own learning curve.

**The expensive:**
- The free tier gives you 30 builds/month (15 iOS + 15 Android). That sounds like a lot until you're debugging a native module issue and burning through 10 builds in an afternoon.
- The Production plan is $99/month. For a solo developer or small team, that's real money for a build service.

```json
// eas.json — you'll spend more time here than you expect
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### The Local Build Escape Hatch

What saved me: you can run EAS builds locally. This bypasses the cloud queue and lets you debug native issues interactively.

```bash
# Run the build locally — same config, no cloud queue
eas build --platform ios --local
```

This requires Xcode (for iOS) or Android SDK installed locally, which defeats part of EAS's value proposition. But for debugging native build failures, it's a lifesaver.

## EAS Update: The Killer Feature (With Caveats)

Over-the-air updates are genuinely transformative. Push a JavaScript bundle update, and users get the new code next time they open the app. No App Store review. No waiting for users to update.

I use this constantly for Tafkeer — copy changes, bug fixes, feature flags, and minor UI adjustments ship in minutes instead of days.

**The caveats:**

1. **You can only update JavaScript.** If your change involves native code (new native module, updated SDK version, changed app permissions), you need a full binary build and store submission. There's no shortcut.

2. **Rollbacks require thought.** If you push a broken update, you can roll back — but users who already received the bad update won't automatically get the rollback until they restart the app. In practice, critical bugs still need a store-submitted hotfix.

3. **Bundle size matters more.** Every OTA update downloads a JavaScript bundle. If your bundle is 15MB because you imported the entirety of `lodash`, every update downloads 15MB. Keep your bundle lean.

```bash
# Push an OTA update to production
eas update --branch production --message "Fix Arabic text alignment in chat"
```

## The Prebuild System

Expo's `prebuild` is where the framework becomes opinionated in ways that matter. When you run `npx expo prebuild`, Expo generates the `ios/` and `android/` directories from your `app.json` configuration. You don't maintain these directories — Expo does.

This is powerful and also the source of most "how do I...?" questions in the Expo community:

- *How do I add a custom font?* Config plugin.
- *How do I modify the splash screen behavior?* Config plugin.
- *How do I add an App Group for iOS widgets?* Config plugin.

Config plugins are JavaScript functions that modify the native project files during prebuild. Writing them is straightforward once you understand the pattern, but the documentation is thin for non-standard use cases.

```typescript
// A config plugin to add a custom iOS entitlement
const withAppGroup = (config) => {
  return withEntitlementsPlist(config, (mod) => {
    mod.modResults["com.apple.security.application-groups"] = [
      "group.com.tafkeer.shared",
    ];
    return mod;
  });
};
```

## When Expo Is the Right Choice

After living with Expo in production, here's my honest assessment:

**Use Expo when:**
- You're building a product-focused app (not a game or hardware-intensive tool)
- Your team is JavaScript/TypeScript-first and doesn't have dedicated iOS/Android engineers
- You want to move fast and ship frequently
- OTA updates are valuable to your workflow

**Consider bare React Native when:**
- You need deep native integration (Bluetooth, ARKit, custom video processing)
- Your team has strong native development experience
- You need fine-grained control over the build pipeline
- You're building a library that other apps will consume

**Avoid React Native entirely when:**
- Performance-critical apps (games, real-time video editing)
- Apps that are 90% native UI with platform-specific interactions
- Your team is already proficient in Swift/Kotlin

## The Honest Summary

Expo has earned its place as the default way to start a React Native project. The developer experience is genuinely excellent, EAS Update is a real competitive advantage, and the ecosystem keeps getting better.

But "excellent DX" and "production-ready" are different claims. The gap between them is filled with build debugging, config plugins, and understanding what's happening beneath the abstraction.

Know the abstraction's boundaries before you depend on it. That's the lesson, and it applies to a lot more than Expo.
