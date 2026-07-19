# Data Model and IndexedDB Schema

## Domain model

All identifiers are stable UUID strings. Timestamps are ISO 8601 UTC strings; weights are finite non-negative decimal kilograms; durations are positive whole seconds. Historical records reference immutable IDs, not display names.

- **Exercise**: `id`, `name`, `muscleGroup`, `movementCategory`, `equipmentType`, `active`, `createdAt`, `updatedAt`.
- **WorkoutTemplate**: `id`, `name`, `active`, `createdAt`, `updatedAt`.
- **ExerciseSlot**: `id`, `templateId`, `movementCategory`, `label`, `order`, `primaryExerciseId`, `alternativeExerciseIds`, `active`.
- **WorkoutSession**: `id`, `workoutTemplateId`, `templateNameSnapshot`, `status` (`active|completed`), `startedAt`, `completedAt`, `notes`.
- **ExerciseResult**: `id`, `workoutSessionId`, `exerciseSlotId`, `exerciseId`, `exerciseNameSnapshot`, `setType` (`warmup|working`), `weightKg`, `durationSeconds`, `notes`, `createdAt`.

Snapshots preserve meaningful history after configuration changes. Alternatives live on a slot and share its movement category; switching an exercise therefore preserves the slot relationship.

## IndexedDB version 1

Database name: `fitness-pwa`; schema version: `1`.

| Store              | Key   | Indexes                                                                             |
| ------------------ | ----- | ----------------------------------------------------------------------------------- |
| `exercises`        | `id`  | `by-active`, `by-movement-category`, unique normalized name (pending decision)      |
| `workoutTemplates` | `id`  | `by-active`                                                                         |
| `exerciseSlots`    | `id`  | `by-template-id`, compound `[templateId, order]`                                    |
| `workoutSessions`  | `id`  | `by-status`, `by-started-at`, `by-template-id`                                      |
| `exerciseResults`  | `id`  | `by-session-id`, `by-exercise-id`, compound `[exerciseId, createdAt]`, `by-slot-id` |
| `meta`             | `key` | none                                                                                |

`meta` stores seed version and other storage metadata, not user preferences. Initial templates and exercises are seeded once in the database creation transaction. Foreign-key integrity is enforced by repositories because IndexedDB does not provide it.

## Invariants and transactions

Only one session may have `status: active`. A completed session has `completedAt`; an active one does not. Each session has at most one warm-up and one working result per slot. Template/slot changes are rejected while they would invalidate an active session. Results are append-only; corrections replace a record explicitly and preserve its identity.

## Export contract

The JSON root contains `format: "fitness-pwa-backup"`, `formatVersion: 1`, `exportedAt`, and arrays matching every durable store. Import rejects unknown format versions, invalid types, dangling references, duplicate IDs, unsafe lengths, and violated invariants. V1 import first creates a downloadable backup of current data, then replaces the whole database atomically after explicit confirmation; merging is deferred.

Dexie is the approved IndexedDB wrapper, but Phase 1 intentionally defines no database class, stores, or migrations. This proposed schema must receive final review before persistence implementation.

## Migration policy

Each schema change increments the IndexedDB version and supplies a forward migration. Migration tests start from every supported prior version. Downgrades are not supported; failures leave the prior transaction intact and show recovery/export guidance.
