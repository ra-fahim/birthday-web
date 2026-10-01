# Master Template — Demo + Editor Update

- The supplied Birthday HTML remains the visual/source baseline for the Master Template; editor hooks are layered without replacing the design.
- Demo mode keeps the original 10-second countdown.
- Demo modal now has an explicit Audio On / Audio Off control.
- Demo audio is muted by default until the viewer enables it.
- Editor mode uses the same Master Template HTML but adds `edit=1`/`bbEdit=1` and starts directly on the Greeting screen.
- Editor mode never starts countdown audio, wishing/background audio, or other media audio.
- Editor-only Previous / Next navigation is rendered at the bottom of each editable screen: Greeting → Cake → Reasons → Photos → Video → Letter → Secret.
- Default supplied photos, default supplied video, countdown audio, and default wishing-audio source are preserved through the Master Template defaults/fallbacks.
- MasterTemplate now layers `templateConfig.masterBirthday` into the HTML runtime so the live editor and published site receive the actual saved Master Template values.
- Legacy `master-birthday` compatibility code remains hidden from the public catalog so older saved sites do not break.
- Legacy iframe `bbcanvas editor=1` query markers were removed from the remaining template wrappers.

## Validation

- Master Template inline JavaScript syntax: PASS
- Master Template editor HTML inline JavaScript syntax: PASS
- Changed TS/TSX transpile syntax checks: PASS
- Project preflight: PASS

A full Next.js production build could not be completed in this environment because dependency installation (`npm ci`) hit the container transport timeout. No production build failure was observed after the source-level checks above.
