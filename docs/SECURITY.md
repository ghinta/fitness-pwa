# Security and Privacy

## Threat model

The app has no server, credentials, or authorization boundary. Protected assets are
workout history, notes, and exported backups. Relevant threats are accidental loss,
corruption, malicious import files, injection through user text, compromised
third-party code, stale service-worker assets, and disclosure from an unlocked device
or exported file. Physical access to an unlocked phone and device compromise are
outside V1; IndexedDB and exports are not encrypted by the app.

## Implemented controls

- No remote scripts, fonts, APIs, trackers, analytics, permissions, or secrets.
- User text is assigned through DOM text properties; untrusted content is never sent
  to `innerHTML`.
- Import is limited to 5 MiB and validates the exact format/version, fields,
  collection bounds, identifiers, dates, numbers, uniqueness, references, and domain
  invariants before storage is touched.
- The current database is downloaded before a confirmed import; replacement is one
  transaction and rolls back on write failure.
- The document defines a restrictive CSP for scripts, styles, images, connections,
  fonts, objects, base/form/frame behavior, manifest, and workers. Production hosting
  should also deliver this as an HTTP header because `frame-ancestors` is not enforced
  from a meta policy.
- Workbox precaches versioned local shell assets only. JSON exports are generated as
  Blob downloads and excluded from precache/navigation fallback.
- A waiting worker activates only on explicit action and never while active/dirty
  workout state could be interrupted.
- Storage/migration failures are visible and never reset the database automatically.

## Data lifecycle and recovery

Data remains in IndexedDB until site data is cleared or a confirmed import replaces
it. Deactivation preserves history. Exports are readable JSON; the UI warns users to
store them securely and states that anyone with device access may read local data.
When storage can be opened, settings provides a full export. A startup-open failure
offers retry and does not claim that unreadable data was removed.

Security-relevant dependency, hosting, or policy changes require an ADR and review.
Optional encrypted backups remain outside V1.
