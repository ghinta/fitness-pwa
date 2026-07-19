# Architecture

## Approach

The application will be a static, client-only PWA. Domain rules remain independent of the DOM, browser storage, and service worker. Application services coordinate use cases through repository interfaces; views render state and dispatch user actions.

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

No implementation directories are created during this planning phase.

## Runtime flow

At startup, the app opens and migrates IndexedDB, restores an active session, then renders the appropriate route. Views call services, services validate domain values and use repositories, and repositories perform atomic IndexedDB transactions. UI state may be held in memory; only non-critical preferences may use `localStorage`.

The service worker caches only versioned application-shell assets. It does not cache JSON exports. A newly installed worker waits; the UI prompts the user before activating it, avoiding disruption during an active workout.

## Boundaries and failure handling

Storage failures block writes visibly and preserve the entered form for retry. Completion writes the final result and session status in one transaction. Imports are parsed and fully validated before any replacement transaction begins. Existing data is exported or explicitly confirmed before destructive replacement.

## Proposed decisions

- Use simple History API routing with a small route table; no UI framework.
- Prefer platform APIs unless an IndexedDB wrapper materially simplifies migrations and transactions.
- Keep recommendation calculation pure and deterministic.
- Treat exported JSON as a public, versioned interchange contract.

Decisions involving dependencies, routing, storage wrappers, or service-worker tooling require an ADR before implementation.
