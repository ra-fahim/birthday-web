# Preview countdown/greeting audio fix

- Editor Preview now refreshes countdown state immediately after BB_CONTENT arrives, preventing stale `00:00:00:00` values.
- Editor Preview follows the real birthday state machine: future target => deterministic 10-second preview; active 24-hour greeting window => Greeting opens immediately; then the preview remains on Greeting after its simulated countdown finishes.
- Countdown audio is allowed during Editor Preview and still starts only in the final 10 seconds.
- Wishing audio is triggered automatically when Greeting opens in Editor Preview and on the published live website, subject to browser autoplay policy.
- Template-card/catalog demos remain isolated and retain their existing 10-second demo behavior.
