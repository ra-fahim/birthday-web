# Generic Template Editing Update

All non-Birthday templates now use the same builder editing contract as the Birthday Master flow where practical.

- Wedding Proposal, Miss You 1, and Master Proposal now expose a generic DOM editing layer in editor mode.
- Visible text blocks, headings, buttons, links, images, videos/iframes, and audio can be selected and edited.
- Image/video/audio changes can use the existing upload controls and are stored under `templateConfig.genericEdits`.
- Generic edits are applied again on the published template, so editor changes persist to the live experience.
- Static occasion templates now also expose editable hero emoji, eyebrow, section heading, and “Today & always” label through `templateConfig.preset`.
- Existing specialized controls (story, museum, date planner, intro gate, music, etc.) remain available and are not removed.
- Generic editor selectors intentionally ignore existing editor affordances so template interactions remain separate from editing controls.

Validation performed on this update:
- Supabase preflight PASS
- Changed TS/TSX syntax parse PASS
- Generic inline editor JavaScript syntax PASS
- ZIP integrity PASS
