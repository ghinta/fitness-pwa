# 0003: Use hash-based routing

## Status

Accepted

## Context

GitHub Pages serves static files and does not provide arbitrary SPA fallback rewrites. The application needs only Start, Verlauf, and Einstellungen routes.

## Decision

Use a small route table driven by `location.hash`: `#/`, `#/verlauf`, and `#/einstellungen`. Unknown routes resolve to Start.

## Consequences

Deep links work on GitHub Pages without a custom 404 workaround or router dependency. URLs contain `#`, and route parsing/navigation behavior remains project-owned.

## Alternatives considered

History API routing was rejected because it complicates static-host deep links. A routing library is unnecessary for the initial route set.
