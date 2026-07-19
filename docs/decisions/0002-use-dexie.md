# 0002: Use Dexie for IndexedDB

## Status

Accepted

## Context

Native IndexedDB is asynchronous and event-oriented. The planned schema needs explicit versions, transactions, indexes, migrations, and testable repository boundaries.

## Decision

Use Dexie as the only production data dependency. Storage modules will wrap Dexie behind repository interfaces; domain modules will not import it. Phase 1 installs Dexie but creates no stores.

## Consequences

Transactions and migrations become easier to read and test, at the cost of one production dependency. Dexie upgrades require review because persistence reliability is critical.

## Alternatives considered

The native IndexedDB API avoids a dependency but adds ceremony and error-prone request handling. Other wrappers were not selected because Dexie is established and narrowly focused.
