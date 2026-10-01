# Stability pass — October 2026

This package keeps the existing design and template structure while fixing the demo/preview audio lifecycle and adding repeatable project checks.

## Fixed

- Master Birthday demo/preview is now always silent.
- Countdown audio cannot autoplay inside demo mode.
- Birthday soundtrack cannot autoplay inside demo mode, including the hidden YouTube player path.
- Demo mode cannot request microphone permission automatically.
- Parent/editor demo messages cannot re-enable Master Birthday audio.
- The standalone Demo page now explicitly puts embedded previews into muted demo mode.
- The reusable Master Birthday iframe wrapper now sends the same muted demo state.
- Added the missing `.env.example` required by the existing preflight check.
- Added `.gitignore` for local/generated files.
- Added `npm run preflight` and `npm run typecheck` commands; production build now runs preflight first.
- Preflight now verifies the installed template files and Master Birthday demo-safety guards.

## Verification

- Master Birthday and other checked inline JavaScript blocks pass Node syntax parsing.
- All TypeScript/TSX source files pass TypeScript parser-level syntax validation.
- Project preflight passes.
- A full `npm run build` was not executed because dependency installation in the execution environment repeatedly timed out; the package is intentionally shipped without `node_modules`.
