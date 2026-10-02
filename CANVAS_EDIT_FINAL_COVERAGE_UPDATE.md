# Canvas Edit Coverage + Demo Media Update

- Dynamic Master Template reason cards now carry stable `mb.reasons.items` + item index metadata, so each reason opens its own editor field.
- Letter paragraphs are individually selectable in edit mode.
- Secret page exposes an editor-only profile-link control for `mb.secret.socialUrl` (Facebook, Instagram, website, or any public profile URL).
- Editable elements have clearer edit-mode hover highlighting and a `Click to edit` hint.
- Selecting an element automatically scrolls the page to the selected-element editor when that panel is not visible.
- Master Birthday defaults now include a fourth demo photo and second demo video, with title/caption content, so both appear in editor and demo by default.
- Previous/Next navigation remains canvas-side and edit mode stays interactive only through editor navigation and selection.

Validation:
- `node scripts/preflight.mjs`: PASS
- Master Template inline JS parse: PASS (5 blocks)
- Reason/media/secret-link static checks: PASS
