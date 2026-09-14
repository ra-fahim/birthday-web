# Wishly Studio — Masterclass Upgrade

This upgrade turns the existing Birthday Builder v2 into a visual-first studio.

## What changed

- Premium light dashboard inspired by modern website-builder workspaces.
- Builder now uses a three-zone workflow: navigation, live canvas, contextual editor.
- Desktop / tablet / mobile preview controls.
- **Edit on canvas** mode for the master cinematic template.
- Click a supported canvas element to select it; double-click text to edit it directly.
- Selected canvas content is mirrored into the contextual inspector.
- Direct edits update the same `BirthdayContent` state used by Save/Publish.
- Existing cinematic `master-template.html` remains the published experience rather than being replaced by a static mockup.
- Existing Reasons, Gallery, Letter, Theme, Effects, Timeline, Memories, Wishlist, Guestbook, Growth and Advanced controls remain available.
- Dashboard project cards now feel like a proper website-builder home.

## Direct canvas fields

The master template exposes these editable areas:

- Greeting
- Hero subtitle
- Reasons heading
- Reason cards
- Secret message
- Primary / continuation buttons

The existing form panels remain available for the rest of the content model.

## Architecture

`BirthdayContent` remains the source of truth:

`Content state → Builder inspector + canvas preview → Save/Publish → Published master template`

The iframe editor communicates with the builder using `postMessage`, so the original cinematic HTML can stay isolated while still behaving like a visual editor.

## Validation

The repository includes the original dependencies from the uploaded project. The supplied archive had incomplete `@types` package contents in `node_modules`, so a full TypeScript build could not be completed in the sandbox without reinstalling dependencies.
