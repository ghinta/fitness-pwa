# Roadmap

## Version 1 implementation status

1. **Project initialization** — complete.
2. **Domain core** — complete: entities, strict validation, seeds, recommendation
   boundaries/rounding, and unit tests.
3. **Persistence** — complete: Dexie schema v1, population, repositories, atomic
   workflows, recovery errors, and fake-IndexedDB tests.
4. **Workout vertical slice** — complete: start/resume/discard, warm-up/working entry,
   alternatives, completion, previous results, and history.
5. **Configuration and backup** — complete: plan/slot/exercise configuration,
   deactivation, increments, versioned export, validated confirmed import, and
   pre-import backup.
6. **PWA hardening** — complete in automated scope: raster icons, offline shell,
   deferred update UI, CSP, accessibility, 320 px layout, and mobile WebKit journeys.
7. **Release readiness** — code and automated verification complete. A physical
   iPhone install/offline/update/backup recovery drill and final deployment URL/header
   verification remain manual release gates.

## Final decisions

V1 is German-only, kilogram-only, single-user, and device-time-zone based. Warm-ups
and custom exercises are included. Equipment increments default to 2.5 kg; the 2.5%
recommendation rounds to the nearest increment with exact halves upward. Normalized
exercise names are unique. Imports are limited to 5 MiB. ADRs 0001–0006 contain the
architectural rationale.

## Later candidates, not commitments

Additional units/languages, synchronization, encrypted backups, timers, repetitions,
multiple working sets, body measurements, health integrations, and richer statistics
remain outside Version 1 and require separate product decisions.
