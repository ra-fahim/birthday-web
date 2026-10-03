# Wedding Proposal – fully editable canvas

Scope: **Wedding Proposal template only** (Miss You 1, Master Proposal, Master Birthday are untouched).

## What changed
- Every visible text is now editable by clicking it in the canvas: intro title/greeting/text/hint, Begin button,
  game title, love letter, Continue button, heart-tap title, proposal title/question, Yes/No buttons,
  finale title/signature, Replay button. Each has its own content key (`proposalEyebrow`, `proposalGreeting`,
  `proposalIntroText`, `proposalStartButton`, `proposalHintText`, `proposalGameTitle`, `proposalLetterText`,
  `proposalContinueButton`, `proposalHeartTitle`, `proposalFinalEyebrow`, `proposalQuestion`, `proposalYesButton`,
  `proposalNoButton`, `proposalFinaleTitle`, `proposalFinaleSub`, `proposalReplayButton`).
- `{name}` = receiver name, `{sender}` = sender name (works in any text).
- In edit mode all template buttons/interactions are blocked (Begin, Continue, Yes, No running away, heart tap).
  Only Previous / Next move through: Intro → Game → Letter → Heart tap → Proposal → Finale.
- Letter is shown in full while editing (no typewriter), finale text is visible.
- Preview (visitor mode) still plays the real experience and now uses the latest edited content.

## Fixes
- Removed the old pencil-button layer that fought with the generic editor (double selection, `✏` leaking into text,
  Next button state being overwritten).
- User text is escaped everywhere (no HTML / `</script>` injection from letter, question, names).
- `String.replace` now uses function replacers (so `$&`, `$1` in user text are safe).

## Files
- `components/template/wedding-proposal-builder.ts` (new – field list, HTML builder, editor bridge)
- `components/template/WeddingProposalTemplate.tsx` (uses the builder, no duplicate listeners)
- `components/template/GenericEditableIframe.tsx` (one opt-in line: `__BB_CUSTOM_HISTORY__`; other templates unaffected)
- `app/builder/[id]/UniversalElementEditor.tsx` (new branch for `wedding-proposal` + `proposal*` keys)

---
# Update 2 – mobile/tablet/PC editing + first-time guide

## Mobile bug (root cause)
The template iframes called `preventDefault()` on `touchstart`. On phones that cancels the browser's follow-up
`click`, and selection only happened on `click` → tapping text did nothing. Touch is now handled as a real *tap*
(`touchstart` records, `touchend` with <12px movement selects, scrolling still works, no double-select).
Fixed in: `public/templates/master-birthday/runtime.html`, `components/template/GenericEditableIframe.tsx`
(Miss You 1, Master Proposal), `components/template/wedding-proposal-builder.ts` (Wedding Proposal).

## Highlight
Editable text/photos/buttons now always show a dashed highlight in edit mode (was hover-only, invisible on touch).
Generic templates highlight only the innermost element so nested text is not cluttered.

## Edit hint
Edit mode shows: "Click (on phone: tap) any highlighted text, photo or button on the preview to edit it."

## First-time guide
`app/builder/[id]/BuilderGuide.tsx` – 5 steps, opens automatically the first time the builder is opened,
**Skip guide** at any step (also Esc), remembered in localStorage (`wishly_builder_guide_v1`).
"? Guide" button in the top bar reopens it any time.

## Phone/tablet: edit box
After selecting an element the page now scrolls to the edit box on phone/tablet too (was desktop-only).
