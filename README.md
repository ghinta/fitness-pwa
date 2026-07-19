# Fitness PWA

Offline-first, mobile-first HIT strength-training tracker for one person. The app
runs entirely in the browser, stores data in IndexedDB, uses German UI copy, and is
designed primarily for installation on iPhone Safari.

## Version 1

Version 1 provides configurable Training A/B plans, per-session exercise
alternatives, an optional warm-up and one working set per slot, bodyweight support,
exercise/session history, advisory 60–90-second weight recommendations, interrupted
workout recovery, complete JSON backup/restore, and a prompt-updated offline PWA.
There is no backend, account, synchronization, analytics, remote font, or external
API.

## Development

Requires a current Node.js/npm environment.

```sh
npm install
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run preview
```

`npm run test:e2e` runs the essential journeys against the built application with an
iPhone-sized mobile WebKit profile. Run `npm run build` first after source changes.
Physical iPhone installation and standalone-mode behavior remain manual release
checks.

## Architecture and privacy

The TypeScript/Vite application uses semantic DOM APIs without a UI framework.
Dexie wraps IndexedDB; `vite-plugin-pwa` generates the manifest and Workbox service
worker. All user text is rendered with text DOM APIs. Exports are plain, unencrypted
JSON and should be stored securely.

See [Product](docs/PRODUCT.md), [Architecture](docs/ARCHITECTURE.md),
[Data model](docs/DATA_MODEL.md), [UI](docs/UI.md), [Security](docs/SECURITY.md),
[Testing](docs/TESTING.md), [Roadmap](docs/ROADMAP.md), and the
[ADRs](docs/decisions/README.md).
