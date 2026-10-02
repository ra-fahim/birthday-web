# Master Template — Final Canvas Stability Update

- Countdown is now removed from layout whenever another canvas screen is shown, so its overlay cannot block editing.
- Previous/Next keeps a single deterministic screen owner.
- Secret profile link selection now targets the actual editor-only `#secretButtonLink` control and opens the working URL editor.
- Dynamic Reason cards are re-marked after each reveal so their text remains editable.
- Demo audio ON/OFF no longer recreates or restarts the demo countdown.
- Turning demo audio OFF clears playback guards; turning it back ON can resume countdown audio during the final 10 seconds or resume wishing audio after unlock.
- Demo uses one stable `demoCountdownEndsAt` timestamp per session.
