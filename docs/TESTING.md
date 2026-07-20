# Testing Strategy

## Automated layers

Vitest covers pure domain rules, seed integrity, import parsing, application services
(including timer persistence and current/default selections),
the update prompt, and Dexie repositories through the test-only `fake-indexeddb`
implementation. Playwright uses an iPhone 13-sized WebKit project against the built
preview server.

Domain coverage includes 59, 60, 90, and 91 seconds; 2.5%/increment rounding;
non-mutating recommendations; entity bounds; selections; duplicates; relationships;
and completed-session invariants. Repository/service tests cover schema/population,
single-active enforcement, active-configuration guards, unique sets, atomic
completion/reordering/replacement, rollback, resume, bodyweight/warm-up handling, and
editable increments. Backup tests cover valid full exports plus malformed, unknown,
oversized, duplicate, and dangling inputs.

## Essential browser journeys

Mobile WebKit tests cover:

1. Shell navigation.
2. Training A with an in-workout selected alternative, six timer-measured working
   sets, recommendation, completion, session detail, and exercise history.
3. Reloading a running timer and persisted warm-up, plus verification that
   HTML and JavaScript shell assets are precached.
4. Export, validated import summary, explicit confirmation, pre-import download,
   restore, and malformed-import rejection without data loss.
5. Adding, replacing, thumbnail-rendering, and removing a locally resized exercise
   image.

## Commands

```text
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

The browser suite needs permission to bind its local preview port. No numeric coverage
threshold is used; critical domain, transaction, and import paths have direct
behavioral tests.

## Manual release checks

On a physical iOS 17+ device: deploy through HTTPS, install from Safari, launch in
standalone mode, complete/reopen a workout in airplane mode, exercise the waiting
update before/during a workout, export to Files, restore that backup, verify safe-area
spacing/keyboard behavior, and confirm data survives a normal app/OS restart.
