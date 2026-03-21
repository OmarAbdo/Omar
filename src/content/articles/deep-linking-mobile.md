---
title: "Deep Linking Is Harder Than Your Backend Thinks"
date: "2026-01-05"
description: "Universal Links, App Links, deferred deep links, and the silent failures that make mobile deep linking one of the most underestimated problems in app development."
category: "mobile"
tags: ["Deep Linking", "iOS", "Android", "React Native", "Mobile"]
readTime: "9 min read"
---

## The Feature That Breaks in Silence

Deep linking is one of those features where the happy path demo takes 20 minutes and production-ready implementation takes two weeks. Your backend engineer will tell you it's just a URL. Your product manager will tell you "just make links open the app." And you'll spend the next month debugging silent failures across two platforms, three iOS versions, and a verification file that caches for 24 hours.

I've implemented deep linking twice in production — once in Tafkeer for sharing AI conversations, and once in a fintech app at Simon Kucher. Both times, the initial implementation worked in about a day. Both times, making it reliable took much longer.

Here's everything nobody told me up front.

## Universal Links (iOS) and App Links (Android)

Before we get into the weeds, let's clarify the terminology because it's confusing:

- **URL Schemes** (`myapp://conversation/123`) — The old way. Any app can claim any scheme. No verification. iOS and Android both support them, but they're not secure and don't work if the app isn't installed.
- **Universal Links** (iOS) — An HTTPS URL (`https://tafkeer-ai.com/chat/abc`) that opens your app if installed, or the website if not. Verified via a file hosted on your domain.
- **App Links** (Android) — Same concept. An HTTPS URL that opens your app if installed. Verified via a file hosted on your domain.

Universal Links and App Links are the correct approach for production apps. URL schemes are a fallback for development.

## The Verification Files Nobody Gets Right

Both platforms require a verification file hosted on your domain to prove you own the association between the URL and the app.

### iOS: apple-app-site-association

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.tafkeer.app",
        "paths": [
          "/chat/*",
          "/share/*",
          "/invite/*"
        ]
      }
    ]
  }
}
```

This file must be served at `https://yourdomain.com/.well-known/apple-app-site-association`. No file extension. `Content-Type: application/json`. Must be HTTPS — no self-signed certs. Must return a 200 with valid JSON.

Here's where it gets painful:

1. **Apple caches this file aggressively.** When a user installs your app, iOS fetches the AASA file from Apple's CDN, not directly from your server. Apple's CDN refreshes on its own schedule — historically every 24 hours, though in newer iOS versions it's faster. If you deploy a fix to your AASA file, users who install the app in the next few hours might get the old version.

2. **There is no error.** If the AASA file is invalid, missing, or returns a non-200, Universal Links silently fall back to opening Safari. No error log. No crash. No indication that anything is wrong. The link just opens in the browser instead of the app, and you have to figure out why.

3. **Wildcards are limited.** The `paths` array supports `*` and `?` but not full regex. If you need complex path matching, you'll need multiple entries.

### Android: assetlinks.json

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.tafkeer.app",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    ]
  }
}]
```

Served at `https://yourdomain.com/.well-known/assetlinks.json`.

The Android-specific gotcha: **the SHA-256 fingerprint must match your signing certificate.** If you're building with EAS Build, the certificate fingerprint for your development build is different from your production build. If you use Google Play App Signing (which you should), the fingerprint is the one from Google Play's console, not the one from your local keystore. I've seen teams debug this for days.

```bash
# Get the fingerprint from your keystore
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias

# Or from Google Play Console:
# Setup > App Signing > App signing key certificate > SHA-256
```

### Hosting the Verification Files

If you're using Netlify, Vercel, or a static host, you need to configure routing so that `/.well-known/apple-app-site-association` returns the JSON file without an extension.

For Netlify:

```toml
# netlify.toml
[[headers]]
  for = "/.well-known/apple-app-site-association"
  [headers.values]
    Content-Type = "application/json"

[[headers]]
  for = "/.well-known/assetlinks.json"
  [headers.values]
    Content-Type = "application/json"
```

For Nginx:

```nginx
location /.well-known/apple-app-site-association {
    default_type application/json;
}
```

## Deep Linking in React Native

In Tafkeer, I use React Navigation's deep linking integration. The configuration maps URL patterns to navigation routes:

```typescript
const linking: LinkingConfiguration = {
  prefixes: [
    'https://tafkeer-ai.com',
    'tafkeer://',  // fallback URL scheme for dev
  ],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Chat: {
            screens: {
              Conversation: 'chat/:conversationId',
            },
          },
        },
      },
      Share: 'share/:shareToken',
      Invite: 'invite/:code',
    },
  },
};

function App() {
  return (
    <NavigationContainer linking={linking} fallback={<SplashScreen />}>
      <RootNavigator />
    </NavigationContainer>
  );
}
```

This looks clean. The reality is messier.

### The Navigation State Reconstruction Problem

When a user taps `https://tafkeer-ai.com/chat/conv_abc123`, the app needs to open the Conversation screen for that conversation. But the Conversation screen is nested inside a Chat tab, which is inside the Main tab navigator.

React Navigation handles this by reconstructing the full navigation state needed to reach the deep screen. It creates the Main → Chat → Conversation stack automatically.

The problem: **the back button.** When the user presses back from the deep-linked Conversation screen, where should they go? React Navigation pushes them to the Chat tab's root — which might be an empty conversation list they've never seen before. The back stack is synthetic, not based on actual user navigation.

```typescript
// Handle deep link with explicit initial route setup
const linking: LinkingConfiguration = {
  prefixes: ['https://tafkeer-ai.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Chat: {
            initialRouteName: 'ConversationList',
            screens: {
              ConversationList: 'chat',
              Conversation: 'chat/:conversationId',
            },
          },
        },
      },
    },
  },
};
```

Setting `initialRouteName` ensures that when the user navigates back from a deep-linked screen, they land on a sensible parent screen instead of a blank default.

### Auth Guards on Deep Links

What happens when a deep link arrives and the user isn't logged in? They need to authenticate first, then be redirected to the intended screen.

```typescript
function useDeepLinkAuth() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (!user) {
        // Save the deep link and show auth
        setPendingLink(url);
        navigation.navigate('Auth');
      }
      // If user exists, React Navigation handles it automatically
    });

    return () => subscription.remove();
  }, [user]);

  // After auth succeeds, process the pending link
  useEffect(() => {
    if (user && pendingLink) {
      Linking.openURL(pendingLink);
      setPendingLink(null);
    }
  }, [user, pendingLink]);
}
```

This is one of those patterns that's easy to describe and annoying to get right. Edge cases include: the auth screen is already showing, the pending link has expired, the user logs in with a different account than expected, the app was cold-started from the link vs. already running.

## Deferred Deep Linking

The hardest deep linking problem: the user taps a link, but the app isn't installed yet.

The flow is:
1. User taps `https://tafkeer-ai.com/share/token_xyz`
2. App not installed → opens in browser
3. Website shows "Get the app" → user goes to App Store
4. User installs and opens the app
5. App should navigate to the shared conversation

Steps 1-3 are straightforward. Step 5 is where deferred deep linking lives. The original URL is lost after the App Store redirect. You need to recover it.

### Platform-Level Solutions

**iOS:** The system clipboard used to be the common hack (copy the URL before redirecting to the App Store, read it on first launch). Apple killed this with clipboard permission prompts in iOS 16. The official solution is SKAdNetwork and App Clips, neither of which solves the general case well.

**Android:** Google Play Install Referrer API can pass a referrer URL through the install process.

### The Practical Solution

For Tafkeer, I use a server-side approach:

```typescript
// Server: when a share link is created, store the mapping
app.post('/api/share', async (req, res) => {
  const { conversationId, userId } = req.body;
  const token = generateToken();

  await db.shareLinks.create({
    token,
    conversationId,
    createdBy: userId,
    expiresAt: addDays(new Date(), 7),
  });

  return res.json({ url: `https://tafkeer-ai.com/share/${token}` });
});

// Web landing page: store the token in a cookie/fingerprint
// and show an "Open in App" / "Get the App" button

// Mobile: on first launch, check for pending share tokens
```

```typescript
// React Native: check for deferred deep link on first launch
async function checkDeferredDeepLink() {
  const isFirstLaunch = await AsyncStorage.getItem('hasLaunched') === null;
  if (!isFirstLaunch) return null;

  await AsyncStorage.setItem('hasLaunched', 'true');

  // Check server for pending deep link associated with this device
  try {
    const response = await api.checkPendingDeepLink({
      deviceId: getDeviceId(),
      installTime: new Date().toISOString(),
    });

    if (response.pendingLink) {
      return response.pendingLink;  // e.g., '/chat/conv_abc123'
    }
  } catch (e) {
    // Fail silently — deferred deep links are best-effort
  }

  return null;
}
```

The honest caveat: deferred deep linking without a third-party service (Branch, AppsFlyer, Firebase Dynamic Links) is approximate at best. Device fingerprinting is unreliable. The time window between web visit and app install can be hours or days. There's no guaranteed 1:1 mapping between the web session and the app install.

For Tafkeer, we accept roughly 70-80% accuracy on deferred deep links. The remaining 20% of users land on the home screen and find the shared content through other paths. For most apps, that trade-off is acceptable. For apps where the install-to-specific-content flow is critical (e.g., invitation-only apps), invest in a service like Branch.

## Testing Deep Links

Testing is where deep linking goes from "I think it works" to "I know it works." And it's painful on both platforms.

```bash
# iOS simulator — test Universal Links
xcrun simctl openurl booted "https://tafkeer-ai.com/chat/conv_123"

# Android emulator — test App Links
adb shell am start -W -a android.intent.action.VIEW \
  -d "https://tafkeer-ai.com/chat/conv_123" com.tafkeer.app

# Verify Android App Links setup
adb shell pm get-app-links com.tafkeer.app
```

```bash
# Validate Apple's AASA file (use Apple's CDN URL)
curl -v "https://app-site-association.cdn-apple.com/a/v1/tafkeer-ai.com"

# Validate Android's assetlinks
curl -v "https://tafkeer-ai.com/.well-known/assetlinks.json"
```

On iOS, the most frustrating debugging step: Universal Links only work when the user **taps** a link in Safari or another app. They don't work when you type the URL into Safari's address bar. This is by design but will confuse you during testing.

## The Checklist

After implementing deep linking multiple times, here's the checklist I run through:

1. AASA file hosted at `/.well-known/apple-app-site-association` with correct `Content-Type`
2. `assetlinks.json` hosted at `/.well-known/assetlinks.json` with correct SHA-256 fingerprint
3. Both files return 200 over HTTPS (no redirects — Apple doesn't follow them)
4. iOS `Associated Domains` entitlement configured: `applinks:yourdomain.com`
5. Android `intent-filter` with `autoVerify="true"` in manifest
6. Deep links work on cold start (app not running)
7. Deep links work when app is backgrounded (already running)
8. Auth guard handles unauthenticated deep links
9. Back navigation from deep-linked screens is sensible
10. Deferred deep linking has a fallback for when matching fails

## Deep Linking Is Infrastructure

The biggest mistake teams make with deep linking is treating it as a feature. It's not. It's infrastructure — like authentication or push notifications. It touches your server config, your mobile app, your web landing pages, your app store configuration, and your navigation architecture.

Your backend engineer is right that it's "just a URL" in the same way that authentication is "just a token." Technically true. Practically misleading.

Plan for it early, test it obsessively, and expect the verification files to break at least once in production. Every app that handles links gets this wrong the first time. The goal is to get it right by the second.
