# Reason + Letter + Greeting Canvas Fix

Fixed the Master Birthday canvas editor so the interaction rules are:

- The Reasons `Click Here...` button remains fully live in Edit mode, matching the normal website flow.
- The `Click Here...` button label is edited only through the dedicated `✎ Edit button text` control directly above it.
- All four reason phases render with stable editor metadata and each reason text is selectable/editable.
- The letter envelope remains live in Edit mode, so opening it reveals the letter for editing.
- Dynamically typed letter paragraphs carry stable editor metadata.
- The greeting message `Hey You Know What! ...` has explicit canvas metadata and can be selected directly.
- Explicit `[data-bb-key]` elements are now part of the editor target selector so direct-click selection is reliable.
- Demo/static defaults include 4 photos and 2 videos consistently with the TypeScript template defaults.
- Existing default secret profile link remains `https://www.instagram.com/rafahimn`.

Validation performed:
- `node scripts/preflight.mjs` — PASS
- Inline JS syntax checks for runtime/editor/legacy template HTML — PASS
