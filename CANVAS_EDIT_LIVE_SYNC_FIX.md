# Canvas edit + live preview fix

- Previous/Next now uses one navigation path per click, preventing double-advance and stuck navigation.
- Master Birthday Preview now mounts the same runtime in `demo=1` mode, so Preview starts from the 10-second countdown and runs the real demo flow.
- Master Birthday runtime already reads `templateConfig.masterBirthday` as the source of truth; the React wrapper now also forwards first-class recipient/date/time/age fields for safer live updates.
- Countdown date/time/age edits refresh the active runtime configuration immediately.
- Greeting text/heading remain direct-click editable through the runtime selector map.
- Photo/video elements remain direct-click editable through the same canvas selector system.
- Edit mode remains silent; Preview/Demo is the visitor experience.
