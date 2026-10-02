# Birthday Master: realtime greeting + letter editor navigation fix

- Realtime cycle now normalizes ISO and slash-form birthday dates before calculating the target.
- Editor mode now enters the Greeting screen during the real 24-hour birthday window instead of clamping to `00:00:00:00`.
- Editor countdown continues to use the configured birthday target for future dates.
- Edit mode keeps normal template actions locked, but the letter envelope is explicitly allowed to open the letter-edit view.
- The envelope opening path re-renders the editable letter paragraphs in editor mode and reports the existing editor history state.
- Published/live mode keeps its normal birthday cycle and audio behavior.
