# Master Template — Editable Birthday Experience Update

This update keeps the supplied Birthday HTML/CSS/JS experience as the visual source of truth and layers saved Master Template content over it.

## Editor flow
- Public catalog name: **Master Template**
- Birthday category exposes the Master Template.
- The Master Template editor uses a 10-second demo countdown in editor mode.
- The first content screen after that countdown is the greeting screen.

## Editable content
- Recipient name, age, birthday date, birthday time and timezone.
- Greeting heading, greeting text and Enter button text.
- Cake wording, cake name, wish text, cut instruction, cut status and next button.
- Reasons heading, button text, final button text, and add/edit/reorder/delete reasons.
- Individual photos with upload/public URL, title/date label, caption, alt text and optional destination URL.
- Photo section heading, subtitle and next button.
- Video entries with upload/public URL/YouTube/Vimeo link, title, caption, poster and alt text.
- Video section heading and next button.
- Full letter title, paragraphs, signature and return button.
- Secret photo, button text, icon/platform and destination URL.
- Optional countdown audio and optional wishing audio. When no custom source is supplied, the HTML's default source remains in place.
- Uploaded videos remain protected by the existing **25 MB** API limit; larger videos must use a public URL.

## Demo/audio safety
- Demo/editor preview uses a 10-second countdown.
- Demo/editor preview remains muted and does not initialize the wishing/background audio player.
- Published runtime can still use the configured/default audio flow.

## Validation
- Project preflight: PASS
- Inline JavaScript syntax check for both Master Template HTML files: PASS
- Master Template structural/editable-element checks: PASS
- Full `next build` was not executed in this container because the project dependencies were not available; `npm install` timed out in the environment.
