# 0006: Harden PWA caching, security, and updates

## Status

Accepted

## Context

The application must remain usable offline without caching user-generated
exports, and a service-worker update must not silently interrupt an active
workout. GitHub Pages is the initial static host and does not provide custom
response headers. iPhone installation also requires production raster and
Apple touch icons rather than SVG placeholders alone.

## Decision

Generate the service worker with Workbox through `vite-plugin-pwa`. Precache
only versioned build assets used by the application shell, configure no
runtime caching routes, and exclude export or backup JSON names and navigation
fallbacks. Keep `skipWaiting` and `clientsClaim` disabled and use prompt-style
registration, so the UI controls when a waiting worker is activated.

Ship 192 px and 512 px raster icons, separate maskable variants with safe-zone
padding, and a 180 px Apple touch icon. Apply the documented restrictive
Content Security Policy in `index.html` as a meta policy for the static host.
When hosting supports response headers, send the same policy as an HTTP header
so `frame-ancestors 'none'` is enforced; browsers do not enforce that directive
from a meta policy.

## Consequences

The installed shell works offline and old precaches are removed, while exports
are never added through service-worker routing. New versions wait until the
user accepts the update; the update UI must defer activation while workout
input is active or unsaved. The meta policy protects script, style, connection,
image, object, form, and worker sources on GitHub Pages, but clickjacking
protection remains incomplete there until the host can emit a CSP header.

## Alternatives considered

Immediate service-worker activation was rejected because it can reload or mix
application versions during a workout. Runtime network caching was rejected
because the app has no remote API and it risks capturing exports. A handwritten
service worker was rejected because the existing Workbox integration provides
deterministic build-asset revisioning with less maintenance.
