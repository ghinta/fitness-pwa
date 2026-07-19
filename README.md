# Fitness PWA

Production: [https://ghinta.github.io/fitness-pwa/](https://ghinta.github.io/fitness-pwa/)

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

Requires Node.js 24 LTS and npm. Install the locked dependencies, then start Vite:

```sh
npm ci
npm run dev
```

The development server exposes the app below
`http://localhost:5173/fitness-pwa/`, matching the repository subpath used in
production.

## Build and verification

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run preview
```

`npm run test:e2e` runs the essential journeys against the built application with an
iPhone-sized mobile WebKit profile at `/fitness-pwa/`. Run `npm run build` first
after source changes. `npm run preview` serves that production build at
`http://localhost:4173/fitness-pwa/`. Physical iPhone installation and
standalone-mode behavior remain manual release checks.

## GitHub Pages deployment

Pushes to `main` and manual runs of **Deploy GitHub Pages** execute the release
workflow. It installs with `npm ci`, checks formatting, lint and types, runs unit
tests, builds with the production `/fitness-pwa/` base, uploads only `dist/` as the
Pages artifact, and deploys it with GitHub's official Pages actions. Pull requests
do not deploy previews. `dist/` remains ignored and no `gh-pages` branch is used.

For the repository's first release, an administrator must open **Settings → Pages**
and select **GitHub Actions** under **Build and deployment → Source**. No custom
domain is required. After a successful workflow run, verify the production URL
above, installability, offline reload, and update prompting on a physical iPhone.
Repository settings and deployments are intentionally not changed by local tooling.

## Architecture and privacy

The TypeScript/Vite application uses semantic DOM APIs without a UI framework.
Dexie wraps IndexedDB; `vite-plugin-pwa` generates the manifest and Workbox service
worker. All user text is rendered with text DOM APIs. Exports are plain, unencrypted
JSON and should be stored securely.

See [Product](docs/PRODUCT.md), [Architecture](docs/ARCHITECTURE.md),
[Data model](docs/DATA_MODEL.md), [UI](docs/UI.md), [Security](docs/SECURITY.md),
[Testing](docs/TESTING.md), [Roadmap](docs/ROADMAP.md), and the
[ADRs](docs/decisions/README.md).
