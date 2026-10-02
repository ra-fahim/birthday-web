# Template Selection Fix

The editor now treats the selected template as the source of truth.

- Every `Use template` action passes the exact template slug.
- `/builder/new` creates the website with that exact `templateId`.
- `/builder/new` redirects to `/builder/:id?template=<slug>` so the builder has the selection immediately.
- The builder reads the requested template slug and prefers it over the initial `master` state.
- Existing saved websites still use their persisted `templateId`.
- A missing/deleted template no longer silently becomes Master; the builder may remain empty or use only the same occasion's installed template as a compatibility fallback.
- Demo modal `Use template` uses the same exact slug.
