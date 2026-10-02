# Master Template Countdown / Preview / Live Link Fix

- Restored the standalone Master Birthday countdown default to the supplied HTML's August 22 birthday behavior, with the next year calculated at runtime.
- Master Birthday defaults now use the same source-aligned August 22 date and 17 candle/age default instead of the mismatched September 24 / 24 configuration.
- Preview iframe routing now tracks the `preview` prop correctly and receives an explicit preview-mode bridge message.
- Preview continues to use the current edited `BB_CONTENT`; it does not switch to template-default data.
- Published Master Birthday pages now render the iframe in a standalone full-viewport wrapper (`standalone`) so `/site/<slug>` does not collapse or crop the experience.
- Published metadata now recognizes both `master` and legacy `master-birthday` template IDs.
- Existing catalog/demo silent behavior remains unchanged.

Validation:
- Supabase preflight: PASS
- Changed TS/TSX parse: PASS
- Runtime inline JavaScript parse: PASS
- Default countdown/media/secret static checks: PASS
- `npm ci` was attempted but the environment transport timed out before dependencies were fully installed, so a full `next build` could not be completed here.
