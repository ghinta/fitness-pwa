# Architecture

## Approach

The application is a static, client-only TypeScript/Vite PWA deployed initially to GitHub Pages. It uses semantic HTML and modern CSS without a frontend framework. Domain rules remain independent of the DOM, browser storage, and service worker. Application services coordinate use cases through repository interfaces; views render state and dispatch user actions.

```text
src/
  app/          initialization, routing, state
  components/   reusable UI controls
  domain/       entities, validation, recommendation rules
  services/     workout, history, import/export use cases
  storage/      IndexedDB schema, migrations, repositories
  styles/       tokens and global/layout styles
  views/        page-level screens
  main.ts       browser entry point
public/         manifest, icons, static offline assets
tests/          integration fixtures and Playwright tests
docs/decisions/ architecture decision records
```

Phase 1 creates this structure. Empty domain, service, and storage directories are reserved without implementing their behavior.

## Runtime flow

The Phase 1 shell resolves `#/`, `#/verlauf`, and `#/einstellungen` through a small hash router. Hash routing avoids GitHub Pages rewrite requirements. In a later persistence phase, startup will open and migrate IndexedDB through Dexie, restore an active session, and render the appropriate route. Views call services, services validate domain values and use repositories, and repositories perform atomic transactions. UI state may be held in memory; only non-critical preferences may use `localStorage`.

`vite-plugin-pwa` generates the manifest and Workbox service worker. It caches only versioned application-shell assets and does not cache JSON exports. Registration uses prompt mode so a future update UI can avoid disruption during an active workout.

## Boundaries and failure handling

Storage failures block writes visibly and preserve the entered form for retry. Completion writes the final result and session status in one transaction. Imports are parsed and fully validated before any replacement transaction begins. Existing data is exported or explicitly confirmed before destructive replacement.

## Approved decisions

- Use a small hash route table and no UI framework.
- Use Dexie for IndexedDB access; stores remain unimplemented in Phase 1.
- Use `vite-plugin-pwa` for manifest and service-worker integration.
- Support iOS 17+ Safari as the primary platform and GitHub Pages as the initial host.
- Keep recommendation calculation pure and deterministic.
- Treat exported JSON as a public, versioned interchange contract.

The first four technical choices are recorded in ADRs 0001–0004. The build uses a relative Vite base so repository Pages deployments resolve assets correctly.
