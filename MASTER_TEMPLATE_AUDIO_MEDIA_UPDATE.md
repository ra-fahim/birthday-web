# Master Template — Audio / Default Media / Navigation Update

This update keeps the supplied Master Template experience as the active Birthday Master Template and fixes the latest demo/editor behavior.

## Updated behavior

- The active `master` catalog entry now points to `public/templates/master-birthday/runtime.html` instead of the legacy `public/master-template.html`.
- Master Template demo opens with a fresh 10-second countdown.
- Demo audio is enabled by default and can be switched ON/OFF from the demo controls.
- Countdown audio remains configurable from the countdown screen in the canvas editor.
- Wishing/background audio is configurable from the greeting screen in the canvas editor.
- Wishing audio uses the supplied YouTube Shorts URL by default:
  `https://youtube.com/shorts/AfybMbBSwaA?si=1DXBJcLnIL-89zya`
- Wishing/background audio is non-looping and plays once after the countdown unlocks.
- The countdown audio and wishing audio do not play while the editor canvas is active.
- The default supplied photos are restored as the initial HTML media and as the runtime defaults:
  - `https://picsum.photos/seed/anime1/800/600`
  - `https://picsum.photos/seed/anime2/800/600`
  - `https://picsum.photos/seed/anime3/800/600`
- The supplied default video is restored as the initial HTML media and runtime default:
  - `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
- Previous/Next canvas navigation continues to use the fixed screen order:
  Countdown → Greeting → Cake → Reasons → Photos → Video → Letter → Secret.
- Automatic track setup no longer loads/plays the YouTube wishing source before the countdown completes.
- Default audio playback is browser-policy dependent; the runtime attempts the requested autoplay and the demo provides an explicit audio toggle if the browser blocks autoplay.

## Validation

- `npm run preflight`: PASS
- Master Template inline JavaScript syntax parse: PASS
- ZIP created without `node_modules`, `.git`, or build caches
- A full Next production build could not be completed in this environment because the available workspace does not contain the Next executable (`next: not found`).
