# Editor UX v2

- Hint line ("Click / tap any highlighted ...") restyled to the light builder theme, now mentions the pencil icon.
- Every highlighted editable element now has a pencil badge. Tap the badge OR the element itself to edit.
  Shared script: `lib/edit-badge-script.ts` (also inlined at the end of `public/templates/master-birthday/runtime.html`).
  Used by: Master Birthday, Miss You 1 / Master Proposal (GenericEditableIframe), Wedding Proposal. Standard templates use a CSS badge (globals.css).
- Phone/tablet: template sits inside a bordered, rounded box (same as PC) with its own bounded height; scroll is contained.
- New always-visible "Edit options" container directly below the template box. Shows an empty hint until something is tapped,
  then the options for that text/photo/button. "Done" closes it and scrolls back to the template (phone/tablet).
- Old fixed bottom-sheet on phone/tablet replaced by this in-flow container.
Files: app/builder/[id]/page.tsx, app/globals.css (block appended at end), lib/edit-badge-script.ts,
components/template/{GenericEditableIframe.tsx,wedding-proposal-builder.ts}, public/templates/master-birthday/runtime.html
