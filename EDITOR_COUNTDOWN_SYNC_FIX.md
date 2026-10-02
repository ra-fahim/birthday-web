# Editor countdown sync fix

The Birthday Master editor canvas now renders the real configured birthday countdown from the same timezone-aware cycle state used by the published experience. Editing a future date/time immediately updates the canvas instead of leaving stale `00:00:00:00` values.

Preview mode remains separate: future targets use the 10-second preview simulation, an active birthday window opens Greeting immediately, and published/live pages remain real-time.
