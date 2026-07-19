# ADR 0007: Repository-scoped GitHub Pages deployment

## Status

Accepted

## Context

Version 1 is a static PWA for the `ghinta/fitness-pwa` repository. GitHub Pages
publishes project sites below a repository path, while PWA identity, install URLs,
icon URLs, navigation fallback, and service-worker control must agree on a single
scope. Releases also need repeatable verification without committing generated
files or maintaining a deployment branch.

## Decision

Use the explicit Vite base and PWA scope `/fitness-pwa/`, with hash-based application
routing. Deploy `dist/` through a GitHub Actions workflow triggered only by pushes to
`main` or manual dispatch. The workflow runs all non-browser quality gates and the
production build before passing the generated directory to GitHub's official Pages
artifact and deployment actions.

The repository's Pages source is GitHub Actions. Deployments use the required Pages
permissions, the `github-pages` environment, and a concurrency group that prevents
overlap. Pull requests never create preview deployments.

The workflow uses Node.js 24 LTS for the application build and Node-24-based major
versions of all JavaScript GitHub Actions. Action majors are upgraded when GitHub
retires their embedded runtime; this is independent from the Node version configured
for `npm ci` and the Vite build.

## Consequences

- Production URLs, manifest resources, offline navigation, and service-worker scope
  are deterministic below `https://ghinta.github.io/fitness-pwa/`.
- Local preview and Playwright tests use the same repository subpath.
- `dist/` stays generated and ignored; no `gh-pages` branch is required.
- Moving the app to another repository path requires changing the single deployment
  base and the documented production URL.
- The repository administrator must enable GitHub Actions as the Pages publishing
  source before the first deployment.

## Alternatives considered

- A relative Vite base was rejected because install metadata and service-worker
  scope are clearer and testable with the actual production path.
- A `gh-pages` branch was rejected because it adds generated history and a second
  deployment mechanism.
- Pull-request previews were rejected because Version 1 requires only production
  deployment and previews would need a different base and lifecycle.
