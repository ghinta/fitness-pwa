# Fitness PWA

An offline-first, mobile-first fitness tracker for a single user performing HIT-style strength training. The primary target is an installed Progressive Web App on iPhone Safari. The default interface language is German.

This repository currently contains the product and technical plan only. Application code, package metadata, and dependencies will be added in a separate initialization task after the decisions in these documents are reviewed.

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

## Planned technology

Semantic HTML, modern CSS, TypeScript, Vite, IndexedDB, a Web App Manifest, and a Service Worker. Vitest will cover domain and service logic; Playwright will cover essential mobile workflows. No framework or runtime dependency has been selected yet.

## Status

Planning foundation complete; implementation has not started. Before development, review the decisions listed in `docs/ROADMAP.md`, especially browser support, IndexedDB wrapper choice, recommendation rounding, and import conflict behavior.
