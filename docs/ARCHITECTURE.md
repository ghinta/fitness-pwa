# Architecture

## Approach

The application is a static, client-only TypeScript/Vite PWA intended for GitHub
Pages. It uses semantic DOM APIs and modern CSS without a frontend framework.
Domain rules are independent from rendering, IndexedDB, and the service worker.

```text
src/app/          initialization, routing, update registration
src/components/   safe DOM and navigation helpers
src/domain/       entities, seeds, validation, recommendation rules
src/services/     workout/configuration and backup use cases
src/storage/      Dexie schema, transactions, repositories, visible errors
src/styles/       mobile-first layout and controls
src/views/        Start, active workout, history, and settings screens
tests/e2e/        essential mobile WebKit journeys
public/icons/     local install icons
```

## Runtime flow

Startup opens schema version 1, seeds defaults only on first population, restores an
active session, and renders `#/`, `#/training`, `#/verlauf`, or `#/einstellungen`.
Views dispatch to `FitnessService` and `BackupService`; services validate domain
values and use repository interfaces; repositories enforce references and atomic
transactions. Hash routing keeps deep links compatible with GitHub Pages.

The active session stores an exercise choice for every active slot. Results are
persisted immediately after a successful save, so reload selects the first slot
without a working result. Entered but unsaved form values remain visible after a
recoverable write failure.

## Failure and update behavior

Storage errors are translated into visible German messages and never trigger an
automatic reset. Completion and two-slot reordering are atomic. Imports are parsed,
size-limited, and fully validated before the replacement transaction; the UI
downloads a current backup immediately before replacement.

`vite-plugin-pwa` precaches only the versioned application shell. Registration uses
prompt mode. A waiting worker is activated only after explicit action and is blocked
while an active or dirty workout could be interrupted. JSON backup URLs are excluded
from caching and navigation fallback.

## Approved decisions

ADRs 0001–0007 record the framework-free UI, Dexie, hash routing, PWA generation,
final V1 data rules, service-worker/security policy, and GitHub Pages deployment.

## Deployment

The production origin is `https://ghinta.github.io` and the application base and
service-worker scope are explicitly `/fitness-pwa/`. Manifest identity, start URL,
icons, generated assets, and service-worker registration all use that repository
path. Application routes remain hash-based, so direct access such as
`https://ghinta.github.io/fitness-pwa/#/verlauf` never requires a server rewrite.

`.github/workflows/deploy-pages.yml` is the only deployment path. On pushes to
`main`, or a manual dispatch, it verifies and builds the application, uploads only
`dist/` as the Pages artifact, and deploys through the protected `github-pages`
environment with official GitHub actions. Concurrency queues deployments instead
of allowing overlapping releases. Pull requests do not trigger deployment.
