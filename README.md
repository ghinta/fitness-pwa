# Fitness PWA

An offline-first, mobile-first fitness tracker for a single user performing HIT-style strength training. The primary target is an installed Progressive Web App on iPhone Safari. The default interface language is German.

Phase 1 provides the TypeScript/Vite application shell, three placeholder routes, project quality tooling, and PWA integration. Workout, persistence, history, and import/export features are not implemented yet.

## Version 1 at a glance

Version 1 supports two configurable workout templates (Training A and B), exercise alternatives, one optional warm-up set and one working set per slot, result history, local weight recommendations, offline persistence, and complete JSON export/import. It deliberately excludes accounts, backends, synchronization, analytics, integrations, subscriptions, and advanced statistics.

## Documentation

- [Product scope](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model and IndexedDB schema](docs/DATA_MODEL.md)
- [Mobile UI flow](docs/UI.md)
- [Security and privacy](docs/SECURITY.md)
- [Testing strategy](docs/TESTING.md)
- [Roadmap and open decisions](docs/ROADMAP.md)
- [Architecture decisions](docs/decisions/README.md)

## Technology

Semantic HTML, modern CSS, TypeScript, Vite, Dexie, and `vite-plugin-pwa`, without a UI framework. Vitest covers unit tests and Playwright covers essential mobile WebKit workflows. The primary platform is iOS 17+ Safari; the initial deployment target is GitHub Pages.

## Development

```sh
npm install
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

The SVG icons under `public/icons/` are development placeholders. Production releases require reviewed raster icons in appropriate Apple/PWA sizes.

## Status

Phase 1 project initialization is complete. The next phase is the tested domain core; do not add IndexedDB stores until the final schema is reviewed.
