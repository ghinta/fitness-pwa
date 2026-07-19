AGENTS.md

Project

This repository contains a lightweight, offline-first fitness tracking Progressive Web App.

The application is intended primarily for one user on an iPhone. It records HIT-style strength-training sessions with two workout plans: Training A and Training B.

The application must remain simple, maintainable, secure, and usable without a network connection.

Product principles

1. Offline-first.
2. Mobile-first, with iPhone Safari as the primary target.
3. No backend.
4. No user accounts or authentication.
5. No cloud dependency.
6. No analytics, advertising, or external tracking.
7. User data remains on the device unless explicitly exported.
8. Prefer simple and reliable solutions over abstractions.
9. The interface must remain usable during a workout with minimal interaction.
10. German is the default user-interface language.

Initial scope

Version 1 must support:

* Training A and Training B.
* A configurable exercise selection for each workout.
* Primary exercises and alternative exercises.
* Recording:
    * date
    * exercise
    * weight
    * time under tension in seconds
    * optional notes
* Viewing previous results for an exercise.
* Automatic suggestion to increase weight when the recorded time exceeds 90 seconds.
* Local persistence.
* Offline use.
* Export and import of all application data as JSON.
* Installation as a Progressive Web App.

Version 1 must not include:

* accounts
* login
* cloud synchronization
* social functionality
* subscriptions
* health-platform integration
* external APIs
* server-side components
* complicated statistics
* artificial-intelligence features

Do not add out-of-scope functionality without an explicit task.

Technology constraints

Use:

* semantic HTML
* modern CSS
* TypeScript
* Vite
* IndexedDB
* a small, well-maintained IndexedDB wrapper if it materially reduces complexity
* Web App Manifest
* Service Worker
* Vitest for unit tests
* Playwright for essential end-to-end tests

Do not introduce React, Vue, Angular, Svelte, a backend, or a database server unless explicitly requested.

Avoid unnecessary production dependencies.

Before adding a dependency:

1. Explain why it is needed.
2. Check whether the functionality can reasonably be implemented with platform APIs.
3. Prefer established and actively maintained packages.
4. Record the decision in docs/decisions/.

Architecture

Use a modular frontend architecture.

Suggested structure:

src/
├── app/
├── components/
├── domain/
├── storage/
├── services/
├── styles/
├── views/
└── main.ts

Keep the domain model independent from DOM rendering and IndexedDB implementation details.

Suggested layers:

* domain: entities, validation, workout rules
* storage: IndexedDB repositories and migrations
* services: application use cases
* views: page-level UI rendering
* components: reusable UI elements
* app: routing, initialization, application state

Do not create abstractions before they are required.

Data model

Use stable identifiers and explicit schema versions.

Core entities should include:

Exercise

* id
* name
* muscleGroup
* category
* alternatives
* equipmentType
* defaultOrder
* active

WorkoutTemplate

* id
* name
* exerciseSlots
* active

WorkoutSession

* id
* workoutTemplateId
* startedAt
* completedAt
* notes

ExerciseResult

* id
* workoutSessionId
* exerciseId
* weight
* durationSeconds
* notes
* createdAt

The final model must be documented in docs/DATA_MODEL.md before persistence logic is implemented.

Training rules

The default training method is:

* one optional warm-up set
* one working set
* target time under tension: 60–90 seconds
* controlled execution
* if more than 90 seconds are achieved with correct form, suggest increasing the weight by 2–5 percent
* if fewer than 60 seconds are achieved, retain or reduce the weight depending on the result

The application provides recommendations only. It must not automatically overwrite recorded weights.

Initial workout templates

Training A

1. Kniebeuge or Beinpresse
2. Liegestütze, Bankdrücken, or Brustpresse
3. Langhantelrudern or Rudermaschine
4. Beinbeuger or rumänisches Kreuzheben
5. Hängendes Beinheben, Unterarmstütz, or Bauchmaschine

Training B

1. Kreuzheben, rumänisches Kreuzheben, or Rückenstrecker
2. Klimmzüge or Latzug
3. Schulterdrücken or Schulterpresse
4. Bulgarische Kniebeuge or Beinpresse
5. Hängendes Beinheben, Unterarmstütz, or Bauchmaschine

Exercise alternatives must belong to an exercise slot or movement category so that changing the concrete exercise does not lose the historical relationship.

User interface

The interface must:

* work well on narrow iPhone screens
* use large touch targets
* require minimal typing
* avoid horizontal scrolling
* show the current exercise clearly
* make weight and duration easy to enter
* preserve unfinished workout state
* provide clear confirmation after saving
* meet reasonable accessibility standards
* support keyboard navigation where applicable
* respect reduced-motion preferences
* use sufficient contrast

Do not reproduce the printable PDF as a wide desktop table on mobile.

Use a card-based or step-based workout interface.

Persistence

Use IndexedDB for application data.

Requirements:

* explicit schema versioning
* migrations for schema changes
* repository interfaces
* graceful handling of corrupted or unavailable storage
* no silent loss of user data
* import validation before replacing existing data
* export all user-created data in a documented JSON format

Do not use localStorage as the primary data store.

localStorage may only be used for small non-critical preferences.

Progressive Web App

Provide:

* valid web app manifest
* installable icons
* standalone display mode
* offline application shell
* safe service-worker update behavior
* an offline fallback
* clear indication if an update is available

Never cache user-generated exports unintentionally.

Security and privacy

* Do not load third-party scripts.
* Do not use remote fonts.
* Do not add trackers.
* Avoid inline JavaScript.
* Define an appropriate Content Security Policy for deployment.
* Validate imported JSON data.
* Escape or safely render all user-provided text.
* Do not use innerHTML for untrusted content.
* Do not request unnecessary browser permissions.
* Do not store secrets because the application has no secrets.

Document the threat model in docs/SECURITY.md.

Quality requirements

For every implementation task:

1. Inspect the relevant existing files first.
2. State the intended change briefly.
3. Implement the smallest coherent solution.
4. Add or update tests.
5. Run formatting, linting, type checking, and tests.
6. Report what changed and which checks passed.
7. Mention unresolved risks or assumptions.

Do not claim that a command passed unless it was actually executed successfully.

Commands

Use the commands defined in package.json.

Expected commands:

npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run test
npm run test:e2e

If these commands do not yet exist, create them during project initialization.

Git practices

* Keep changes focused.
* Do not mix unrelated refactoring with feature work.
* Do not rewrite existing working code without a specific reason.
* Use descriptive commit-ready change summaries.
* Never commit generated build output unless explicitly required.
* Never commit secrets or environment-specific credentials.

Documentation

Keep these documents current:

README.md
docs/PRODUCT.md
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/UI.md
docs/SECURITY.md
docs/TESTING.md
docs/ROADMAP.md
docs/decisions/

Major technical choices must be recorded as short Architecture Decision Records.

Agent coordination

When multiple agents work in parallel:

* one agent owns project architecture and shared contracts
* agents must not modify the same files concurrently
* UI work must not redefine the storage schema
* storage work must not redesign the UI
* cross-cutting changes require a dedicated integration task
* each agent must report modified files, test results, and assumptions

Prefer parallel work only for tasks with clearly separate file ownership.

Completion criteria

A task is complete only when:

* the requested behavior is implemented
* relevant tests exist and pass
* type checking passes
* linting passes
* the production build succeeds
* documentation is updated where necessary
* no unrelated changes are included