# Demo Audio Stability Fix

- Demo countdown target is created once per iframe load and is never recreated by audio toggles.
- Demo audio defaults to ON for the actual demo modal.
- Audio ON/OFF no longer rebuilds the YouTube/audio player.
- Audio toggles no longer call `updateCountdown()` or alter the 10-second demo target.
- Wishing audio is one-shot (no loop) and is not stopped when moving from the cake screen to the reasons screen.
- Demo audio state is controlled by explicit `BB_DEMO_AUDIO_ENABLED` messages; UI toggles no longer resend `BB_DEMO_MODE`, avoiding a mute/reset cycle.
- The supplied YouTube Shorts URL is the default wishing audio source.
- Editor and catalog previews remain silent.

Validation: preflight PASS; master template inline JavaScript syntax PASS.
