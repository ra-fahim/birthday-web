# Master Birthday interaction/media final fix

- Removed the builder-host countdown writer so the embedded Master Birthday runtime is the single source of truth for Edit / Preview / Live countdown state.
- Candle tapping is handled through delegated pointer/click events and remains usable on touch devices.
- Live/preview microphone flow is permission-aware, with a visible fallback mic button when permission is denied or blocked.
- Blow detection now uses average + peak microphone levels with a short cooldown for more reliable blowing detection.
- Cake cutting still supports drag and also completes on a simple tap after all candles are blown; drag threshold reduced for touch devices.
- Letter panel is height-bounded with internal scrolling on desktop/mobile so the complete content remains accessible.
- Uploaded/direct Cloudinary/Supabase video URLs are treated as playable video sources.
- Configured soundtrack items are used for the post-countdown wishing audio before falling back to the dedicated wishing-audio URL.
- Editor Preview and Published Live Website continue to consume the saved per-site media configuration; the public Template Catalog Demo remains isolated/default by design.
