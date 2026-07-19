# Roadmap

## Current phase: project initialization

- Initialize the Vite/TypeScript shell and agreed source structure.
- Configure formatting, linting, type checking, tests, build, and PWA generation.
- Provide the German hash-routed placeholder views and mobile navigation.
- Record the framework, Dexie, routing, and PWA decisions as ADRs.

No domain model implementation, IndexedDB stores, workout logic, history, or import/export belongs in this phase.

## Proposed implementation sequence

1. **Project initialization** — Vite/TypeScript structure, quality scripts, manifest shell, and first ADRs. **Complete.**
2. **Domain core** — entities, validation, recommendation policy, seeded Training A/B definitions, and unit tests.
3. **Persistence** — IndexedDB schema v1, repositories, migrations, recovery behavior, and tests.
4. **Workout vertical slice** — start/resume, step entry, transactional save, completion, and history.
5. **Configuration and backup** — template/exercise editing plus validated export/import.
6. **PWA hardening** — offline shell, update flow, accessibility, responsive polish, CSP, and mobile WebKit E2E tests.
7. **Release readiness** — physical iPhone verification, backup recovery drill, documentation, and production build review.

Each phase must pass linting, type checking, relevant tests, and production build before advancing.

## Approved decisions

- Vite and TypeScript; semantic HTML and modern CSS without a UI framework.
- Hash routing for compatibility with GitHub Pages, the initial deployment target.
- Dexie for IndexedDB and `vite-plugin-pwa` for manifest/service-worker integration.
- Vitest unit tests and essential Playwright mobile WebKit tests.
- iOS 17+ Safari as the primary supported platform.
- Kilograms only; above 90 seconds adds 2.5%, rounded to a configurable equipment increment. Below 60 seconds does not automatically suggest a reduction.
- Exercise substitutions are session-local by default, with an explicit future action to save a template default.
- Import validates, creates a pre-import backup, confirms, and then fully replaces the database.

## Remaining decisions

- Whether custom exercises and persisted warm-up results are V1 requirements.
- The default equipment increment and tie-breaking rule when rounding.
- Whether exercise names must be unique after case/whitespace normalization.
- Maximum accepted import size and exact pre-import backup interaction.
- GitHub Pages repository URL, CSP delivery limitations, and release/update procedure.

## Recorded assumptions

V1 is single-user, German-only, kilogram-only, and device-time-zone based. There is at most one active workout. Templates contain five slots; each slot records at most one warm-up and one working set per session. Deactivation replaces deletion, recommendations are advisory, and backups are unencrypted versioned JSON. No network is required after installation.

## Later candidates, not commitments

Additional units/languages, richer trends, encrypted backups, timers, multiple working sets, health integrations, and synchronization require separate product decisions and are not part of V1.
