# Birthday Master — Preview logic

- Preview click starts a fresh final 10-second simulation when the configured birthday is in the countdown state (including a birthday more than 24 hours in the past, which rolls to the next yearly target).
- If the configured birthday time has already arrived and the current time is still inside the 24-hour greeting window, Preview opens directly on the Greeting screen.
- Published/live websites use the real-time annual birthday cycle and are not accelerated by Preview.
- Edit Mode is separate: it starts on the countdown screen using the editor's current/default date-time and updates live when the date/time is edited.
