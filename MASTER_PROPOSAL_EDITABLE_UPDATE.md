# Master Proposal – fully editable canvas

Scope: **Master Proposal template only.**

## Root causes fixed
- Edits stored in `templateConfig` never reached the template iframe (it only read a `?config=` URL param that the
  Next.js side never set), so edits were invisible in the canvas, preview and published site.
- In edit mode the intro gate could not be passed (all clicks are blocked), so only the intro screen was reachable.
- Only hero / story / intro gate / date planner were tagged `data-bb-key`.

## What changed
- Template reads its content from a live store: the parent sends `BB_SITE_CONFIG` (on request and after every edit);
  everything re-renders without losing the visitor's position. First render waits (max 2.5 s) for the config, so
  default text never flashes.
- Every text is now clickable in the canvas: intro lines/questions/buttons, hero, story chapters (+ add chapter),
  museum (photo/video, title, date, description, + add memory), comfort corner (headings + each feeling's button/message),
  date planner (headings, options, plan title/description, ticket delivery email/names), garden, love jar (headings +
  every note, + add), bucket list (headings, items, + add), final letter (title, paragraphs, sign-off), footer,
  background music chip.
- Editor Previous / Next walk: Intro → Opening → Story → Museum → Comfort corner → Date planner → Garden → Love jar →
  Bucket list → Final letter. Intro has a ‹ Question › stepper (add / remove questions).
- Preview (visitor mode) plays the real experience with the latest content.
- `GenericEditableIframe`: elements with `data-bb-key` now select their dedicated field on a single click
  (instead of a DOM-path `gx.*` edit); answers `BB_CONFIG_REQUEST`.
- `UniversalElementEditor`: new panels for `heroTitle/heroSubtitle`, `texts.*`, `loveNotes`, `bucketList`,
  `comfortResponses.*`, `finalLetter.*`, `ticketSettings`, story / intro-question add & remove, music URL + remove.
- Removed the old ✏ pencil layer from `public/templates/master-proposal/index.html` (it injected nodes into React elements).

## Files
- `public/templates/master-proposal/source-original/**` (source) and the rebuilt bundle in `public/templates/master-proposal/`
  (`npm ci && npx vite build` in `source-original`, copy `dist` over; keep the demo scripts at the end of `index.html`)
- `components/template/ExperienceTemplates.tsx`, `components/template/GenericEditableIframe.tsx`,
  `app/builder/[id]/UniversalElementEditor.tsx`

## Known, unchanged
- Default museum photos point to `/museum-gallery/*`, which is not in `public/`; users replace them in the editor.
