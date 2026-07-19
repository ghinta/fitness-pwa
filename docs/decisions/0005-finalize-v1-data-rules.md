# 0005: Finalize Version 1 data rules

## Status

Accepted

## Context

Version 1 requires persisted warm-up sets, configurable exercises, bodyweight
movements, deterministic weight recommendations, and safe imports. The initial
documents left the exact rounding, exercise-name, and import-size rules open.

## Decision

Persist the optional warm-up result alongside the single required working result.
Allow users to create exercises and deactivate, but not delete, existing ones.
Bodyweight exercises may store no external weight; all other exercises require a
non-negative kilogram value. Each exercise has a configurable equipment increment,
defaulting to 2.5 kg. Recommendations above 90 seconds add 2.5 percent and round to
the nearest increment, with exact halves rounded upward; results of 90 seconds or
less retain the recorded weight. Exercise names must be unique after trimming,
collapsing whitespace, and locale-aware lowercasing. Imports are limited to 5 MiB.

## Consequences

Warm-up history survives reloads and backups, while recommendations continue to use
working sets only. Custom equipment can use an appropriate increment without a new
equipment model. Normalized uniqueness prevents confusing duplicates. The import
limit bounds memory and validation work on mobile devices while remaining far above
the expected single-user backup size.

## Alternatives considered

Discarding warm-ups, fixed increments, exact floating-point recommendations,
duplicate display names, and unlimited import files were rejected because they
would make required behavior ambiguous or reduce reliability on the primary mobile
platform.
