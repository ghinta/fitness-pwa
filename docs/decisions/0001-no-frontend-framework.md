# 0001: Use no frontend framework

## Status

Accepted

## Context

The application has three initial routes, local-only state, and a deliberately narrow single-user workflow. A component framework would add runtime weight and architectural conventions before they are needed.

## Decision

Use TypeScript, semantic DOM APIs, and modern CSS with small view and component functions. Keep domain and service modules independent of rendering.

## Consequences

The bundle and dependency surface remain small. The project owns rendering, lifecycle, focus management, and state coordination directly; this choice should be revisited only if demonstrated UI complexity warrants it.

## Alternatives considered

React, Vue, Svelte, and other component frameworks were rejected for the initial scope.
