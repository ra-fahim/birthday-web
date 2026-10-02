# Reason + Cake + Letter Flow Fix

Updated the active Master Birthday runtime and its editor/source copies.

## Fixed
- Reasons now preserve the current visible reason while editing; changing reason 1 no longer resets the flow back to reason 1.
- The live `Click Here...` button advances through reason 1 → 2 → 3 → 4 in normal/demo/preview mode.
- In Edit mode, the Reasons button remains a live navigation control; its label is edited via the dedicated Edit button text control.
- Every dynamically-rendered reason card/text carries `mb.reasons.items` + the correct index, so all four reason texts can be edited one by one.
- Cake SVG labels have stable editable metadata for the happy/birthday/name text.
- In Edit mode, opening the envelope renders all letter paragraphs at once, so selecting one paragraph exposes the full letter immediately instead of requiring multiple waits/selections.
- Letter paragraphs keep their individual indices so each paragraph can still be edited separately.

## Validation
- Supabase preflight: PASS
- Changed TSX transpile/syntax checks: PASS
- Master Birthday runtime HTML inline JS: PASS
- Master template HTML inline JS: PASS
- Master template editor HTML inline JS: PASS
- Reason flow model check: PASS (editing reason 1 preserves the visible reason and the next click advances to reason 2)

## Build note
Full `next build` / `tsc --noEmit` was not available in this working copy because the project dependencies are not installed. The typecheck command therefore reports missing `next/react` and other dependency types rather than a source parse error.
