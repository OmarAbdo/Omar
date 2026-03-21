---
title: "CSS Has Won: @view-transition, Anchor Positioning, and the Death of JS Layout Hacks"
date: "2026-03-08"
description: "The CSS features shipping in 2025-2026 that replace entire JavaScript libraries. View transitions, anchor positioning, @starting-style — the platform is catching up."
category: "frontend"
tags: ["CSS", "View Transitions", "Frontend", "Web Platform", "Animation"]
readTime: "8 min read"
---

For the last decade, the frontend community's answer to every layout and animation problem has been "use a library." Tooltip positioning? Floating UI. Page transitions? Framer Motion. Animate an element appearing? React Transition Group plus a hundred lines of state management. We built an entire JavaScript ecosystem to compensate for what CSS couldn't do.

That era is ending. The CSS features that shipped in 2025 and are shipping in 2026 don't just improve styling — they replace entire categories of JavaScript libraries. And if you haven't been paying attention, you're probably still installing packages for problems the platform already solved.

## View Transitions: Framer Motion for Navigation Is Dead

The View Transitions API is the single biggest quality-of-life improvement to web development in years. It lets you animate between page states — including full page navigations — with CSS alone.

The basic idea: you tell the browser "I'm about to change the DOM," the browser snapshots the before state, you make your changes, and the browser animates between the two snapshots.

```css
/* Cross-document view transitions (MPA) */
@view-transition {
  navigation: auto;
}

/* Customize the transition */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

That's a smooth page transition for a multi-page application. No JavaScript. No router integration. No animation library.

But it gets better. You can tag specific elements to animate independently:

```css
.article-card {
  view-transition-name: article-card;
}

.article-hero {
  view-transition-name: article-card;
}

::view-transition-group(article-card) {
  animation-duration: 0.4s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Click an article card, navigate to the article page, and the card morphs into the hero image. The browser figures out the geometry interpolation. This is the kind of transition that used to require Framer Motion's `layoutId`, a shared layout animation system, and careful React component architecture. Now it's four lines of CSS and a matching `view-transition-name`.

For SPAs using the document.startViewTransition API:

```javascript
document.startViewTransition(() => {
  // Update the DOM however you want
  updateRoute(newPath);
});
```

One function call wraps your DOM update, and CSS handles the rest. I ripped out about 400 lines of animation code from a project last month replacing Framer Motion navigation transitions with this. The animations are smoother too — the browser optimizes them at the compositor level.

## Anchor Positioning: Floating UI Can Rest

Every developer who's built a tooltip, popover, or dropdown menu knows the pain. You need the floating element to position itself relative to a trigger, stay within the viewport, flip when there's not enough space, and shift to avoid clipping. That's why Floating UI (née Popper.js) exists and has millions of weekly downloads.

CSS anchor positioning solves this natively:

```css
.trigger {
  anchor-name: --menu-trigger;
}

.popover {
  position: fixed;
  position-anchor: --menu-trigger;

  /* Position below the trigger, centered horizontally */
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 8px;

  /* Auto-flip if not enough space below */
  position-try-fallbacks: flip-block;

  /* Constrain to viewport */
  inset-area: bottom;
  max-height: calc(100vh - anchor(bottom) - 16px);
}
```

The `position-try-fallbacks: flip-block` line is doing what Floating UI's `flip` middleware does — if there's not enough space below, try above. The browser handles the math. No resize observers, no scroll listeners, no JavaScript position calculations running on every frame.

You can define custom fallback positions too:

```css
.tooltip {
  position: fixed;
  position-anchor: --target;

  /* Try these positions in order */
  position-try-fallbacks:
    --top,
    --right,
    --left;

  /* Default: below */
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 4px;
}

@position-try --top {
  bottom: anchor(top);
  left: anchor(center);
  translate: -50% -4px;
}

@position-try --right {
  left: anchor(right);
  top: anchor(center);
  translate: 4px -50%;
}

@position-try --left {
  right: anchor(left);
  top: anchor(center);
  translate: -4px -50%;
}
```

This is a tooltip that tries below, above, right, then left — the exact behavior you'd configure with Floating UI's `autoPlacement`. Zero JavaScript. The browser recalculates on scroll and resize automatically.

## @starting-style: Animating display:none Without JS

This one fixes a problem that has annoyed frontend developers for over a decade. You cannot animate an element from `display: none` because there's no "starting state" to animate from — the element doesn't exist in the layout.

The workaround has always been JavaScript: use `visibility`, use `opacity` with `pointer-events`, manage a two-phase mount/unmount with React state, or use a library that handles the complexity. React Transition Group exists almost entirely because of this problem.

`@starting-style` solves it:

```css
.modal {
  display: none;
  opacity: 0;
  scale: 0.95;
  transition: opacity 0.3s, scale 0.3s,
              display 0.3s allow-discrete;

  @starting-style {
    opacity: 0;
    scale: 0.95;
  }
}

.modal.open {
  display: block;
  opacity: 1;
  scale: 1;
}
```

When the `.open` class is added, the browser reads the `@starting-style` values as the animation origin, then transitions to the final values. The `allow-discrete` keyword on the `display` transition tells the browser to handle the discrete property change (none → block) as part of the animation.

For closing, the element transitions from `opacity: 1` to `opacity: 0`, and *then* `display` flips to `none` at the end. Entry and exit animations, no JavaScript state management, no unmount delays.

Combine this with the Popover API and you get fully animated popovers for free:

```css
[popover] {
  opacity: 0;
  scale: 0.95;
  transition: opacity 0.2s, scale 0.2s,
              display 0.2s allow-discrete,
              overlay 0.2s allow-discrete;

  @starting-style {
    opacity: 0;
    scale: 0.95;
  }
}

[popover]:popover-open {
  opacity: 1;
  scale: 1;
}
```

```html
<button popovertarget="menu">Open Menu</button>
<div id="menu" popover>
  <p>This animates in and out. No JavaScript.</p>
</div>
```

That's an animated popover with click-outside-to-close, focus management, and top-layer stacking — all native. I would have needed a React portal, a click-outside hook, focus trap, and Framer Motion to do this two years ago.

## Container Queries in Production

Container queries have been available since late 2023, but I'm including them because I still see teams reaching for JavaScript resize observers to make responsive components. Stop.

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @container card (min-width: 400px) {
    grid-template-columns: 200px 1fr;
  }

  @container card (min-width: 700px) {
    grid-template-columns: 250px 1fr auto;
  }
}
```

Components that respond to their container's size, not the viewport. This is what every component library has wanted since the beginning — truly self-contained responsive components that work regardless of where you place them.

The practical impact is massive for design systems. A card component that stacks vertically in a sidebar and goes horizontal in a main content area — without the parent needing to pass a `variant` prop or the component needing a ResizeObserver.

## @property: Typed Custom Properties That Animate

CSS custom properties (variables) historically couldn't be animated because the browser treated them as strings. `@property` changes that:

```css
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  --gradient-angle: 0deg;
  border-image: conic-gradient(
    from var(--gradient-angle),
    #e66465, #9198e5, #e66465
  ) 1;
  transition: --gradient-angle 0.6s ease-in-out;
}

.gradient-border:hover {
  --gradient-angle: 180deg;
}
```

You can now animate gradients, individual color channels, percentages — anything you register with `@property`. Before this, animating a gradient required JavaScript updating the property on every frame.

Combined with `@starting-style`, you can create entry animations for elements that involve custom property interpolation:

```css
@property --reveal-progress {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}

.reveal-element {
  --reveal-progress: 100%;
  clip-path: inset(0 calc(100% - var(--reveal-progress)) 0 0);
  transition: --reveal-progress 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  @starting-style {
    --reveal-progress: 0%;
  }
}
```

A clip-path reveal animation driven entirely by CSS. No Intersection Observer callback, no GSAP timeline, no animation library.

## The Thesis: CSS Is Absorbing the JS UI Layer

Here's the pattern I'm seeing. Every few years, the CSS spec absorbs another category of "you need JavaScript for that":

- **Flexbox and Grid** killed JS layout engines
- **Scroll Snap** killed JS carousel positioning
- **`prefers-color-scheme`** killed JS theme detection
- **Container Queries** killed JS resize observers for responsive components
- **View Transitions** are killing JS page transition libraries
- **Anchor Positioning** is killing JS tooltip/popover positioning
- **`@starting-style`** is killing JS mount/unmount animation libraries
- **`@property`** is killing JS gradient and custom value animation

This isn't CSS "catching up." This is the platform absorbing the patterns that the JavaScript ecosystem validated. Framer Motion proved page transitions matter. Floating UI proved smart positioning matters. The CSS spec team watched, learned, and built native solutions that are faster (compositor-level), more reliable (no layout thrashing), and simpler (no dependency).

## The Honest Caveats

I'm bullish on these features, but I want to be straight about the trade-offs.

**Browser support is uneven.** View transitions for cross-document navigations landed in Chrome first and are still rolling out across browsers. Anchor positioning is in a similar boat. You need fallback strategies. `@supports` is your friend:

```css
@supports (anchor-name: --test) {
  /* Use anchor positioning */
}

@supports not (anchor-name: --test) {
  /* Fallback: fixed position with JS, or simpler CSS */
}
```

**Complex animation choreography still needs JS.** If you need scroll-driven animations with complex timelines, gesture-based interactions, or physics-based spring animations, CSS alone won't cover it. Motion libraries aren't dead — they're being pushed to higher-complexity use cases where they belong.

**DevX isn't there yet.** Debugging anchor positioning is harder than debugging Floating UI's middleware chain. Browser DevTools are catching up but aren't as mature as the JavaScript solutions they replace.

## What I'm Actually Doing

In my recent projects, my approach has shifted. CSS-first for layout, positioning, transitions, and simple animations. JavaScript only when I need complex choreography or gesture handling.

The result: smaller bundles, smoother animations, less code to maintain. The platform is finally good enough that "just use CSS" isn't naive advice anymore — it's the correct default. The burden of proof has shifted. You shouldn't reach for a JS animation or positioning library unless you can articulate what CSS can't do for your specific case.

CSS has won. Not because it's perfect, but because it's native, it's fast, and it now covers 90% of what we were shipping JavaScript to do. The remaining 10% is where libraries still earn their place — and that's exactly how it should be.
