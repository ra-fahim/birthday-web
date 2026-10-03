# Name puzzle page (Master Birthday)

Flow: Letter -> "Again, Happy Birthday" button -> **Name puzzle** -> Continue -> Secret photo.

Files changed
- public/templates/master-birthday/runtime.html  (new #puzzleScreen, navigation, editor canvas mapping, theme)
- lib/master-birthday.ts                          (new `puzzle` config + defaults + merge)
- app/builder/[id]/MasterBirthdayEditor.tsx       (Letter tab -> "Name puzzle page" settings)

Behaviour
- Puzzle name = "Puzzle name" field, or the recipient name when empty (letters only, 2-12 letters).
- Turn it off in Letter tab -> "Show name puzzle": the letter button goes straight to the secret photo.
- Works in Edit (canvas shows the page, Previous/Next includes it), Preview, Live and Demo.
- Texts use {name} in the success message for the name.
- Colors follow the Theme tab, animation follows Theme -> animation intensity and Effects toggles.
