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
