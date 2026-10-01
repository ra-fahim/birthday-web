# Canvas Editing / Preview / Navigation Update

Implemented on the current Canvas-only builder.

## Editor behavior
- Canvas editing is always active by default.
- The old canvas-edit toggle is replaced by a `Preview` button.
- `Preview` temporarily switches the iframe to normal visitor behavior.
- `Back to edit` returns to always-on canvas editing.
- While editing, template interactions are blocked: only the editor `Previous` / `Next` navigation buttons remain actionable.
- Clicking an editable element still opens/selects its contextual editor.

## Master Template navigation
- Master Template editor now starts on the **Countdown** screen.
- Editor sequence is: Countdown -> Greeting -> Cake -> Reasons -> Photos -> Video -> Letter -> Secret.
- The Master Template now emits `BB_CANVAS_HISTORY_STATE` updates.
- It also receives `BB_CANVAS_HISTORY` messages from the parent builder, so top-bar Previous / Next controls work correctly.

## Countdown editing
- Clicking the countdown box selects `Birthday date & time`.
- The contextual editor exposes a `datetime-local` picker.
- Countdown title/message are editable from the canvas too.
- Changing date and time updates both birthday date and time together.
- Birthday age / candle count is editable as a numeric field.

## Validation
- `npm run preflight`: PASS
- Changed TS/TSX syntax parse: PASS
- Master Template inline JavaScript syntax: PASS (8 script blocks)
