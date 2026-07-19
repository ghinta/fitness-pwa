# Roadmap

## Current phase: foundation

- Complete product, architecture, data, UI, security, and testing plans.
- Review assumptions and decisions below.
- Record approved technical choices as ADRs.

No application code or dependencies belong in this phase.

## Proposed implementation sequence

1. **Project initialization** — Vite/TypeScript structure, quality scripts, manifest shell, and first ADRs.
2. **Domain core** — entities, validation, recommendation policy, seeded Training A/B definitions, and unit tests.
3. **Persistence** — IndexedDB schema v1, repositories, migrations, recovery behavior, and tests.
4. **Workout vertical slice** — start/resume, step entry, transactional save, completion, and history.
5. **Configuration and backup** — template/exercise editing plus validated export/import.
6. **PWA hardening** — offline shell, update flow, accessibility, responsive polish, CSP, and mobile WebKit E2E tests.
7. **Release readiness** — physical iPhone verification, backup recovery drill, documentation, and production build review.

Each phase must pass linting, type checking, relevant tests, and production build before advancing.

## Decisions to review before implementation

- Whether custom exercises and persisted warm-up results are truly V1 requirements.
- Whether exercise substitution is saved to the template or applies only to one session.
- Exact 2–5% increase algorithm and rounding to available equipment increments.
- Below-60-second recommendation wording and any reduction calculation.
- Minimum supported iOS/Safari version and whether other browsers are release targets.
- Native IndexedDB versus a small wrapper; service-worker tooling versus a hand-written worker.
- Whether exercise names must be unique after case/whitespace normalization.
- Maximum import size, backup conflict strategy (V1 proposes full replacement), and pre-import backup UX.
- Deployment host, URL routing constraints, CSP headers, and update-release procedure.

## Recorded assumptions

V1 is single-user, German-only, kilogram-only, and device-time-zone based. There is at most one active workout. Templates contain five slots; each slot records at most one warm-up and one working set per session. Deactivation replaces deletion, recommendations are advisory, and backups are unencrypted versioned JSON. No network is required after installation.

## Later candidates, not commitments

Additional units/languages, richer trends, encrypted backups, timers, multiple working sets, health integrations, and synchronization require separate product decisions and are not part of V1.
