# Build Fix — Editor Preview Type Error

Fixed the Vercel TypeScript build error in `app/builder/[id]/page.tsx`.

## What was wrong
`previewContent` could be `null`, and the editor preview passed `previewContent || undefined` into `ExperienceTemplate`, whose `content` prop requires a `BirthdayContent`. Next/TypeScript therefore reported:

`Type 'undefined' is not assignable to type 'BirthdayContent'.`

## What changed
- Explicitly typed `previewContent` as `BirthdayContent | null`.
- The preview now stays in the loading state until `previewContent` is available.
- Once rendered, all three preview branches receive a guaranteed `BirthdayContent` value.
- Removed the `|| undefined` escape hatch that caused the type mismatch.

## Verification
- `npm run preflight`: PASS
- Searched the builder preview for remaining `content={... || undefined}` usage: none.

A full `next build` could not be executed in this sandbox because dependency installation timed out before `next` was available. The reported TypeScript error was fixed directly at its source.
