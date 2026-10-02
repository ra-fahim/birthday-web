# Owner button + draft/live lifecycle + undo/redo/reset

Implemented in this build:

- Removed the public `Message owner` button from published `/site/[slug]` pages.
- `Use Template` now reuses the newest existing `draft` for the same template for the current user instead of creating duplicate drafts.
- Auto-save continues to write drafts for unpublished sites.
- Published sites stay published while auto-saving edits, so an existing live link remains live and receives the edited content.
- Added `Undo`, `Redo`, and `Reset` controls to the editor top bar.
- Undo/redo keep up to 50 content snapshots and participate in normal auto-save/live preview flow.
- Reset restores the selected template's default content; Master Template reset restores the full Master Birthday defaults.
- Added a larger responsive contextual editor area for desktop/tablet/mobile.
- Master Template countdown title (`Something special is unlocking...⌛`) remains editable through the countdown/title binding.

Validation:
- npm run preflight: PASS
- TypeScript/TSX syntax transpile checks for changed pages: PASS
- Owner button static check: PASS (removed from published site page)
- ZIP integrity: PASS

A full Next production build was not run because the workspace does not have the project's installed dependency tree; `npm ci` could not complete in this environment.
