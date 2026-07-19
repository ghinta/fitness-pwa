# Security and Privacy

## Threat model

The app has no server, credentials, or authorization boundary. Protected assets are workout history, notes, and backups stored on or exported from the device. Relevant threats are accidental deletion or corruption, malicious import files, script injection through user text, compromised third-party code, stale service-worker assets, and disclosure through a shared/unlocked device or exported file.

Device compromise and physical access to an unlocked phone are outside V1 protection; IndexedDB is not encrypted by the app. The UI must state that anyone with device access may read the data.

## Controls

- Load no third-party scripts, remote fonts, trackers, analytics, or external APIs.
- Render user text with DOM text APIs; never pass untrusted content to `innerHTML`.
- Validate every imported field, collection size, relationship, identifier, date, number range, and format version before writing.
- Replace data only in one transaction after showing a summary and explicit confirmation. Never silently discard the current database.
- Use a restrictive deployment Content Security Policy, initially: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; manifest-src 'self'; worker-src 'self'`.
- Avoid inline JavaScript and unnecessary permissions. Store no secrets.
- Cache only application assets. Set exported JSON responses/downloads so the service worker ignores them.

## Data lifecycle

Data remains in IndexedDB until the user clears site data or explicitly replaces it through import. Export creates a plain JSON file; the app must warn that the file is readable and should be stored securely. Deactivation preserves history. A future “delete all data” feature is outside V1 unless separately approved.

## Recovery and reporting

Storage and migration errors must be visible and must not trigger automatic reset. When readable, offer export before recovery. Security-relevant dependency or policy changes require an ADR and review. No security guarantee should imply encrypted local storage.

## Open questions

Confirm the deployment host and its CSP/header capabilities, maximum accepted backup size, and whether exports should support optional client-side encryption after V1.
