# 0008: Persist timers, exercise choices, and local images

## Status

Accepted

## Context

Real workout use requires duration capture without typing, choosing an alternative at
the moment it is performed, recognizing equipment visually, and extending both plans
to six movement slots. These additions must remain offline and preserve version-1
history and installations.

## Decision

Store one optional timestamp-based timer/draft on the active workout session and
derive elapsed whole seconds only when displaying or stopping it. Keep the existing
slot-to-exercise selection map, but allow its current unsaved slot to change and
update the slot primary only through an explicit **Als Standard verwenden** action.
Store one resized JPEG data URL and one square thumbnail data URL directly on each
exercise. Embed both in existing backup exercise rows and raise the bounded import
size to 50 MiB. IndexedDB schema version 2 preserves existing records and adds only
the stable-ID sixth slots and required seeded exercises.

## Consequences

Timers survive rerenders/reloads and cannot overlap; stopping never truncates at 90
seconds, while the measured value remains editable before result persistence. Images
work fully offline without another store or dependency, but enlarge IndexedDB and
JSON backups. Existing version-1 backups remain valid because the new image and timer
fields are optional additive fields.

## Alternatives considered

Interval counters were rejected because background throttling makes them inaccurate.
Blob URLs were rejected because they are not durable or directly exportable. A
separate image store and image-processing dependency were rejected because the
bounded single-user scope is handled by Canvas and existing exercise records.
