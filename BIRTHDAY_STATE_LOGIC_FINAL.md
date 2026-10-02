# Birthday state logic final

- Published/live website: real-time birthday cycle.
  - Before target: real countdown.
  - When target is reached: greeting for 24 hours.
  - After 24 hours: next year's countdown.
- Builder Preview: independent 10-second simulation, then Greeting. This is used even when the configured birthday time has already passed, so preview never gets stuck at 00.
- Editor mode: always opens on the Countdown screen using the current/default editor data (default 8 January 2030, 00:00 Asia/Dhaka). Date/time changes are reflected live. Editor navigation is controlled by Previous/Next and does not auto-jump to Greeting.
- Template Demo/catalog: remains independently simulated and does not share the live birthday clock.
