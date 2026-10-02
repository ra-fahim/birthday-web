# Canvas Editing Behavior Update

## What changed
- Canvas editing is always enabled in edit mode.
- The old inline pencil/edit icon is removed. Editable text/media is selected by clicking directly on it.
- In edit mode, template buttons and visitor actions are blocked so button labels can be edited without accidentally navigating.
- Preview mode remains the only place where the template behaves like a real visitor experience.
- Previous/Next editor navigation moved from the top toolbar to left/right edge controls on the canvas.
- Master Template navigation remains: Countdown -> Greeting -> Cake -> Reasons -> Photos -> Video -> Letter -> Secret.
- Countdown numbers now select the birthday date/time editor correctly.
- The countdown selection editor includes both birthday date/time and birthday age; changing age also updates the candle count.
- Countdown date/time is edited as a local value without timezone conversion drift.
- Letter paragraphs are directly selectable and editable on the Master Template.
- SVG cake text is selectable for direct editing.
- Generic Experience Template editable blocks also use direct-click editing without an edit icon.

## Verification
- `npm run preflight`: PASS
- Changed TS/TSX syntax transpile parse: PASS
- Master Template inline JavaScript syntax: PASS
- Full `npm run build` is blocked in this environment because the installed dependency tree is incomplete and `next` is unavailable.
