# Template-first creation flow

The old template-selection/editor entry flow has been replaced with a category-first creation journey.

## New navigation

`Create Website` → `/create` → choose an occasion → `/templates/<occasion>` → choose one template → `See demo` or `Use template` → `/builder/new?template=<slug>` → `/builder/<id>` editor.

## Main template library

`/templates` now displays every installed template as one flat list. Templates are not grouped into multiple category sections on that page.

## Category pages

Each installed category gets its own page at `/templates/<category>` and shows only that category's templates, one by one. Every template card has:

- `See demo` — opens the live template preview in a muted modal.
- `Use template` / `Create website` — creates/selects that exact template and opens its editor.

## Editor safety

- `/builder/new` without a valid `template` now redirects to `/create` instead of silently creating the first catalog template.
- The old first-run canvas editor onboarding layer was removed.
- User-facing editor copy now says `Editor` instead of `canvas editor`.

## Kept intact

The supplied template source files and existing editor behavior remain in place. The next phase can focus on making each selected template's editor controls more complete and template-specific.


## Birthday Template Reset
- Removed **Master Birthday** from the public template catalog.
- Added **Master Template** as the only Birthday template (`slug: master`).
- New Birthday websites now open the existing Master Template editor.
- Legacy `master-birthday` runtime/editor code remains hidden for compatibility with older saved websites and is not offered as a new choice.
