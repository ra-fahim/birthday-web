# Reasons + Letter interaction update

## Editor mode behavior
- The Reasons `Click Here...` button remains functional while editing so each reason can be revealed and edited directly on the canvas.
- A dedicated pencil control is attached to the Reasons button. Clicking only the pencil opens the button-text editor (`mb.reasons.buttonText`) without advancing the reason flow.
- The letter envelope remains functional while editing. Opening it reveals the letter content instead of being blocked by the editor interaction guard.
- Letter paragraphs created by the typewriter animation are re-marked as editable after the envelope opens.
- Dynamic reason cards are re-marked as editable after each reason is revealed.

## Validation
- `node scripts/preflight.mjs`: PASS
- Master Template inline JavaScript: 6/6 blocks parse
