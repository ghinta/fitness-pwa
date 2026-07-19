# Testing Strategy

## Test layers

Vitest will cover pure domain rules, validation, application services, and repositories against a controllable IndexedDB implementation. Playwright will cover only essential browser journeys on a mobile-sized WebKit project. Manual checks remain necessary for installation and standalone behavior on a physical iPhone.

## Required coverage

Every domain rule needs boundary tests, especially durations of 59, 60, 90, and 91 seconds; percentage/rounding behavior; and recommendations never mutating records. Repository tests cover indexes, atomic completion, single-active-session enforcement, migrations, and failure behavior. Import tests cover valid backups, every rejected invariant, oversized input, duplicate IDs, dangling references, and transactional rollback.

Essential end-to-end scenarios are:

1. Start Training A, record five working sets, complete it, and see history.
2. Interrupt and resume an active session after reload while offline.
3. Switch to an alternative exercise without losing slot-related history.
4. Export data, validate and confirm import, then verify restored records.
5. Reject malformed import without changing existing data.
6. Receive and defer a service-worker update safely.

## Conventions

Unit files use `*.test.ts` beside the module or under a mirrored test directory; browser tests use `tests/e2e/*.spec.ts`. Test names describe observable behavior, for example `suggests an increase above 90 seconds`. Prefer factories with explicit overrides over large fixtures. Freeze time and identifiers when assertions depend on them.

## Commands

Phase 1 provides `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build`. Unit tests use jsdom for the DOM shell and route resolution. The Playwright project uses a mobile WebKit profile as the closest automated approximation of the primary iOS 17+ Safari platform. Physical-device PWA installation remains a release check.

No numeric coverage threshold is set initially; critical domain, migration, and import paths require complete behavioral coverage. Establish a threshold after the first implementation slice so it reflects meaningful code rather than encouraging shallow assertions.
