# Canvas Edit + Demo Fix v2

## Fixed in this phase
- Master Birthday editor navigation now uses a robust in-iframe navigation call plus postMessage fallback.
- The runtime now answers a parent history-state request after iframe load, preventing stale/empty Previous/Next button state.
- Editor screen switching now has a direct screen map and no longer depends on the original animation routing for Previous/Next.
- Countdown, Greeting, Cake, Reasons, Photos, Video, Letter and Secret remain the navigation order.
- In Edit mode, editable content gets a visible dashed hover highlight, pointer cursor, and a small “Click to edit” hint; media uses “Click to edit media”.
- Demo modals default to Audio ON, provide Audio ON/OFF control, and provide Full screen.
- The main Demo page and Template Library now use the current Master Birthday runtime instead of the stale `master-template.html` copy.
- Catalog/live card previews remain silent as intended.
- The builder editor remains silent.
- Master Birthday countdown date/age editing stays available through direct canvas selection.

## Validation
- `npm run preflight`: PASS
- Master Birthday inline JavaScript blocks: PASS (`node --check`)
- Static checks for navigation/highlight/demo-audio/fullscreen: PASS
- Full Next production build was not run because project dependencies are not installed in this working environment.
