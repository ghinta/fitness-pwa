# 0004: Use vite-plugin-pwa

## Status

Accepted

## Context

The app needs a generated manifest, versioned offline application shell, and controlled service-worker updates. Maintaining build asset lists manually is fragile.

## Decision

Use `vite-plugin-pwa` with generated Workbox service worker and prompt-style registration. Cache only build assets; user exports must never become runtime cache entries.

## Consequences

PWA assets follow Vite builds automatically. The plugin and Workbox increase
development dependencies and require update testing, especially on iOS 17+ Safari.
Raster icons, cache exclusions, and the final prompt policy are implemented in ADR 0006.

## Alternatives considered

A hand-written service worker offers maximum control but creates more cache-versioning and update risk. Manual manifest files provide no meaningful advantage here.
