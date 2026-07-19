# Product Definition

## Purpose

Fitness PWA lets one person record HIT-style strength workouts quickly, without an account or network connection. It prioritizes reliability and low interaction during a workout over broad fitness features.

## Version 1 scope

Version 1 includes exactly:

- Two active templates, **Training A** and **Training B**, each containing five ordered movement slots.
- Selecting one primary exercise per slot from configured alternatives; exercises and templates can be activated, deactivated, and reordered.
- Starting, resuming, completing, or discarding one in-progress session.
- For each slot, recording an optional warm-up set and exactly one working set. A result stores exercise, weight in kilograms, time under tension in whole seconds, and optional notes.
- Viewing previous working-set results for the current exercise, newest first.
- A non-binding next-weight suggestion: above 90 seconds suggests a 2–5% increase; 60–90 seconds suggests retaining weight; below 60 seconds suggests retaining or reducing it. Recommendations never alter stored values.
- On-device IndexedDB persistence, an offline application shell, installability, and safe update notification.
- Exporting and importing all durable application data in one versioned JSON file. Import is validated and requires explicit confirmation before replacement.
- German UI copy, accessible touch interaction, and narrow-screen support.

## Explicit exclusions

No accounts, login, backend, cloud sync, multi-user support, social features, subscriptions, health-platform integration, external APIs, analytics, advertising, AI features, complex charts, or automatic training-plan generation. V1 does not track repetitions, body measurements, rest timers, multiple working sets, or plates.

## Success criteria

A user can install the app, finish Training A or B offline with minimal typing, reopen an interrupted workout, inspect prior results, understand the recommendation, and export/import a complete backup without silent data loss.

## Assumptions and open questions

Assumptions: kilograms are the only V1 unit; dates use the device time zone; one active session is sufficient; configuration changes do not rewrite history; and exercise deletion is represented by deactivation.

Review whether warm-up values need persistence, whether arbitrary custom exercises are required in V1, and whether a below-60-second recommendation should use a fixed reduction percentage.
