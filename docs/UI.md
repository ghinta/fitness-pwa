# Mobile-First UI

## Navigation and workout flow

A safe-area-aware bottom navigation exposes **Start**, **Verlauf**, and
**Einstellungen**. During the active step flow it is hidden so the current exercise
takes priority; **Später fortsetzen** returns to the resume card and warns before
discarding dirty input.

```text
Start → Training A/B exercise choices → Start
  → exercise 1…5
      → optional persisted warm-up
      → required working weight/load, seconds, notes
      → previous results and advisory recommendation
  → review with recommendation per result → complete → history
```

Reload resumes the first slot without a working set and retains the session-local
exercise choices. Saving confirms through the visible next state only after
persistence succeeds. A failure leaves entered values in the form.

## Supporting flows

- **Verlauf** lists completed sessions newest first, session details, notes, warm-ups,
  working sets, and per-exercise working history.
- **Einstellungen** edits plan names/activation, slot order/activation/primary and
  alternative exercises, exercise names/muscle groups/increments/activation, and
  creates custom exercises.
- **Sicherung** exports all stores; import shows a validated summary, confirms full
  replacement, and downloads a pre-import backup.
- **Update** uses an unobtrusive status banner and refuses activation while an active
  or dirty workout could be interrupted.
- **Storage failure** shows a blocking German explanation and retry without resetting
  data.

## Interaction and accessibility

The layout has no horizontal scrolling at 320 px, uses cards/steps instead of tables,
provides 44 px or larger visible touch targets, safe-area padding, numeric input
modes, previous-weight defaults, plain-text notes, and concise German labels.
Semantic headings, native forms/labels/fieldsets/progress, status/alert regions, a
skip link, focus-visible outlines, keyboard operation, sufficient contrast, and a
reduced-motion media query are implemented. Bodyweight exercises label external
weight as optional.
