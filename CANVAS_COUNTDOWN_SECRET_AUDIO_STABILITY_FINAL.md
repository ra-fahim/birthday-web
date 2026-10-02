# Master Template — final canvas stability fix

- Countdown is now forced out of layout when hidden, so it cannot overlay Greeting, Cake, Reasons, Photos, Video, Letter or Secret screens in canvas editing.
- Editor Previous/Next remains the sole screen-navigation owner.
- Secret profile-link editor now targets the actual `#secretButtonLink` control and edits `mb.secret.socialUrl`.
- Dynamic Reason cards are re-marked after each reveal so their text remains directly editable.
- Demo audio toggle now resets playback guards without rebuilding the iframe or restarting the 10-second countdown.
- Turning demo audio back on can resume countdown audio during the final 10 seconds or resume the wishing audio after the demo unlocks.
- Demo countdown keeps a stable end timestamp and is not recreated by audio toggles.
