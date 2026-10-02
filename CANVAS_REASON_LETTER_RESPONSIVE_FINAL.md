# Master Template — Reason, Letter & Responsive Edit Fix

## Updated
- Default Secret “See Your Friend” profile URL changed to `https://www.instagram.com/rafahimn` for new configurations.
- The live `Click Here...` Reasons button now works while Edit mode is on so the four dynamic reason cards can be revealed and edited.
- Added a dedicated `✎ Edit button text` control above the Reasons button; selecting it edits only the button label.
- The envelope remains a live interaction while Edit mode is on, so it opens and reveals the letter for editing.
- Dynamic reason cards are re-wired through a MutationObserver after each card is rendered.
- Editable overlays/highlights remain active for dynamically created reason/photo/video elements.
- Context editor inputs, textareas, selects and panel width are tightened for mobile/tablet breakpoints.
- The same Master Template fixes are applied to both `master-template.html` and `master-template-editor.html`.

## Validation
- Supabase preflight: PASS
- `public/master-template.html` inline scripts: 8/8 syntax PASS
- `public/master-template-editor.html` inline scripts: 8/8 syntax PASS
- `public/templates/master-birthday/runtime.html` inline scripts: 6/6 syntax PASS
- Default demo media remains 4 photos + 2 videos.
