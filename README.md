# Birthday Builder SaaS

Production-oriented birthday website builder using **Next.js + Supabase + Vercel**.

## Quick setup
1. Create a Supabase project.
2. Run `supabase_schema.sql` in Supabase SQL Editor.
3. In Supabase Authentication, enable Email and Google providers. Configure Google Client ID/Secret inside Supabase.
4. Configure Gmail SMTP under Supabase Authentication > SMTP Settings using a Google App Password.
5. Copy `.env.example` to `.env.local` and fill the Supabase variables.
6. Set the same variables in Vercel.
7. Deploy.

## Important environment variables
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- optional direct `SMTP_*` variables for application/admin messages

There is no Supabase setup and no `Supabase`/`Supabase`.

## Google redirect
In Supabase Authentication > URL Configuration, add:
`https://YOUR-DOMAIN/api/auth/google/callback`

## Admin
Create/sign up a user, then set that user's `profiles.role` to `admin` in Supabase Table Editor/SQL Editor. Admin routes are protected server-side and no public admin-login button is exposed.

## Verification
Run `npm run build`. The project contains a Supabase-only preflight script and no Supabase build step.


## Product direction
The platform is now structured around a flagship Master Template plus unique alternative experiences, multiple celebration occasions, theme customization, publishing, analytics, guestbook/reactions, and member-to-member chat. Run `supabase/migrations/005_social_chat.sql` after the existing migrations to enable chat.

## Master proposal ticket email

The `master-proposal` experience includes a Date Planner. Visitors choose a date option, preferred time, and their Gmail/email address. The Send Ticket action posts to `/api/proposal-ticket` and sends the ticket through the server-side SMTP configuration in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_APP_PASSWORD`, and `EMAIL_FROM`. It does not open a `mailto:` link.
