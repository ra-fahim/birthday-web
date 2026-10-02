# Final Master Template Data, Media & Preview Fix

- Demo mode now uses the built-in template defaults only; it does not apply account/site content.
- Builder Preview uses a separate `preview=1` mode so edited content still appears live in preview.
- Master Birthday demo keeps 4 default photos, 2 default videos, and a stable default secret photo.
- Fixed Master Birthday `applyVideos()` index bug that stopped the second video from rendering.
- Fixed direct canvas selection for photo image/title/caption and video title/caption/video targets.
- Fixed editor countdown calculations to honor the selected birthday year immediately.
- Existing per-user draft reuse remains keyed by `userId + templateId`; published sites remain separate website records.
