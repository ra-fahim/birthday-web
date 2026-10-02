# Demo Countdown Message Fix

Fixed the Master Birthday demo countdown so the `Something is coming soon...` line is visible.

- The runtime now defaults `countdown.message` to `⏰ Something is coming soon...` instead of an empty string.
- `applyCountdown()` also falls back to the same message whenever a saved configuration has an empty countdown message.
- This specifically fixes demo/preview mode, where the forced 10-second countdown bypasses the normal live `updateCountdown()` message writer.

Validation:
- Master Birthday runtime inline JavaScript: PASS
- Master template/editor inline JavaScript: PASS
