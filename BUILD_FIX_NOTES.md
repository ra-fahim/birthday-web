# Build Fix Notes

## Fixed
- Fixed a TypeScript syntax error in `lib/master-birthday.ts` caused by an apostrophe in the `memory-3` caption (`You're...`) inside a single-quoted string.
- Converted that caption to a double-quoted string so the apostrophe is parsed as normal text.

## Verification
- `tsc --noEmit --target ES2020 --module ESNext --moduleResolution node --skipLibCheck lib/master-birthday.ts` — PASS
- `node scripts/preflight.mjs` — PASS
- Scanned source for malformed Markdown-style URLs (`[https://...](...)`) — none found.

A full Next/Vercel production build still requires project dependencies to be installed in the deployment environment.
