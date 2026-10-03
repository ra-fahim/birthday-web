# Editor UX v2

- Hint line ("Click / tap any highlighted ...") restyled to the light builder theme, now mentions the pencil icon.
- No edit icons: editable elements are shown by their dashed highlight box only (tap/click the element itself to edit).
- Phone/tablet scroll fix: when a finger drags over the template and the template cannot scroll further, the builder page scrolls instead.
  Shared script `lib/edit-scroll-script.ts` (also inlined at the end of `public/templates/master-birthday/runtime.html`);
  used by Master Birthday, Miss You 1 / Master Proposal (GenericEditableIframe) and Wedding Proposal. Edit/preview mode only.
- Phone/tablet: template sits inside a bordered, rounded box (same as PC) with its own bounded height; scroll is contained.
- New always-visible "Edit options" container directly below the template box. Shows an empty hint until something is tapped,
  then the options for that text/photo/button. "Done" closes it and scrolls back to the template (phone/tablet).
- Old fixed bottom-sheet on phone/tablet replaced by this in-flow container.
Files: app/builder/[id]/page.tsx, app/globals.css (block appended at end), lib/edit-scroll-script.ts,
components/template/{GenericEditableIframe.tsx,wedding-proposal-builder.ts}, public/templates/master-birthday/runtime.html
