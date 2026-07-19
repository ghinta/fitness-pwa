# Mobile-First UI

## Navigation

A compact bottom navigation exposes **Start**, **Verlauf**, and **Einstellungen** when no workout is active. During a workout, the active-session flow takes priority and navigation warns before leaving. Content is designed from a 320 px viewport upward without horizontal scrolling.

## Primary screen flow

```text
Start
  -> Training A or Training B
  -> Template overview / exercise choices
  -> Start workout
  -> Exercise step 1 of 5
       -> optional warm-up entry
       -> working-set weight + seconds + notes
       -> previous results and recommendation
       -> save and continue
  -> ... exercise step 5 of 5
  -> Review workout
  -> Complete -> Summary
```

If an active session exists, launch opens a prominent **Training fortsetzen** action with template, progress, and start time. Discarding requires confirmation. Values entered on the current step remain in memory after a recoverable save failure.

## Supporting flows

- **Verlauf**: sessions newest first → session detail; exercise name links to its result history.
- **Einstellungen**: configure templates and slot alternatives; deactivate exercises; export data; select and validate an import file; confirm replacement.
- **Update available**: unobtrusive banner → activate now only when no unsaved workout interaction is at risk.
- **Storage unavailable**: blocking explanation with retry and existing-data export where possible.

## Interaction rules

Use one card per exercise step, a persistent progress indicator, numeric keyboards for weight and seconds, sensible previous-value defaults, and at least 44×44 CSS-pixel targets. Saving gives visible confirmation and moves forward only after persistence succeeds. Recommendations state both the rule and suggested next weight; they are never applied silently.

Semantic headings, labels, error summaries, focus management, sufficient contrast, and reduced-motion support are required. Notes accept plain text only. German labels are concise; technical storage errors are translated into actionable language.

## Open design questions

Review whether history should be reachable inline without leaving the workout, whether warm-up entry starts collapsed, and whether the template overview permits per-session exercise substitution or only edits the saved template.
