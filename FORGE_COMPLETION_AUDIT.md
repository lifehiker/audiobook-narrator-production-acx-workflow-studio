# Forge Completion Audit

## Requirement Mapping

- Authentication: implemented by `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/signup/route.ts`, `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/proxy.ts`, and `src/lib/auth.ts`. Email/password works locally; Google OAuth is guarded by environment variables.
- User account and subscription status: `prisma/schema.prisma`, `src/components/app/PlanBadge.tsx`, `src/app/(app)/app/billing/page.tsx`, `src/app/(app)/app/settings/page.tsx`, and `src/actions/account.ts`.
- Project dashboard: `src/app/(app)/app/page.tsx` shows active projects, open pickups, overdue invoices, audition counts, onboarding, plan state, and recent projects.
- Create/edit audiobook project: `src/app/(app)/app/projects/new/page.tsx`, `src/components/app/tabs/BusinessTab.tsx`, `src/actions/projects.ts`, and `src/lib/validations/project.ts`.
- Project list and status filters: `src/app/(app)/app/projects/page.tsx` and `src/components/app/ProjectStatusBadge.tsx`.
- Pronunciation dictionary: `src/components/app/tabs/PronunciationsTab.tsx`, `src/actions/pronunciations.ts`, and `src/lib/export.ts`; includes add/edit/delete, status/category filters, search, copy, and CSV export.
- Character/name consistency sheet: `src/components/app/tabs/CharactersTab.tsx` and `src/actions/characters.ts`; includes add/edit/delete and search.
- Pickup notes: `src/components/app/tabs/PickupsTab.tsx`, `src/actions/pickups.ts`, and `src/lib/export.ts`; includes add/edit/delete, status filter, copy, and CSV export.
- Audition tracker: `src/app/(app)/app/auditions/page.tsx`, `src/actions/auditions.ts`, and `src/lib/export.ts`; includes CRUD, filters, copy, and CSV export.
- Contract/business fields: `prisma/schema.prisma`, `src/components/app/tabs/BusinessTab.tsx`, `src/app/(app)/app/projects/new/page.tsx`, and `src/actions/projects.ts`.
- Invoice tracker: `src/components/app/tabs/InvoicesTab.tsx`, `src/app/(app)/app/invoices/page.tsx`, `src/actions/invoices.ts`, and `src/lib/export.ts`.
- Reminder emails: `src/app/api/cron/reminders/route.ts`, `src/lib/emailTemplates.ts`, and `prisma/schema.prisma` `ReminderLog`.
- Template export: `src/lib/export.ts`, workflow tab copy/CSV buttons, `public/templates/*.csv`, and template resource pages.
- Billing: `src/app/(app)/app/billing/page.tsx`, `src/app/(app)/app/billing/BillingButtons.tsx`, `src/app/api/stripe/checkout/route.ts`, `src/app/api/stripe/portal/route.ts`, `src/app/api/webhooks/stripe/route.ts`, and `src/lib/stripe.ts`.
- Marketing/SEO pages: `src/app/page.tsx`, `src/app/(marketing)/pricing/page.tsx`, `src/app/(marketing)/templates/page.tsx`, `src/app/(marketing)/templates/acx-pronunciation-sheet/page.tsx`, `src/app/(marketing)/templates/audiobook-pickup-notes/page.tsx`, `src/app/(marketing)/templates/acx-audition-tracker/page.tsx`, `src/app/(marketing)/templates/audiobook-narrator-invoice-tracker/page.tsx`, `src/app/(marketing)/templates/royalty-share-rights-reversion-tracker/page.tsx`, `src/app/(marketing)/blog/page.tsx`, and blog article routes.
- Docker/deploy: `next.config.ts`, `Dockerfile`, `.env.example`, `prisma.config.ts`, and `prisma/schema.prisma`.

## External Credentials Deferred

- Google OAuth needs `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`. The app still runs with local email/password signup and login.
- Stripe billing needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and price IDs. The app still runs; billing buttons show safe missing-config behavior and API routes return graceful errors.
- Resend reminder email delivery needs `RESEND_API_KEY`, `REMINDER_FROM_EMAIL`, and a scheduler sending `CRON_SECRET`. The cron route still runs and skips sends without a Resend key.
- Production database can use `DATABASE_URL`; without it, local SQLite works for development/demo and Docker defaults to `/data/app.db`.

## Verification

- `npm ci`: passed.
- `npx prisma generate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- Dev server: started at `http://localhost:3100`.
- Route smoke tests: `/`, `/pricing`, `/templates`, `/templates/acx-pronunciation-sheet`, `/templates/audiobook-pickup-notes`, `/templates/acx-audition-tracker`, `/templates/audiobook-narrator-invoice-tracker`, `/templates/royalty-share-rights-reversion-tracker`, `/blog`, `/blog/best-software-for-audiobook-narration`, `/login`, and `/signup` returned 200.
- Auth guard smoke test: `/app` returned a redirect to `/login?callbackUrl=%2Fapp`.
- Signup API smoke test: created a local user with a trial subscription.
- Cron guard smoke test: invalid `x-cron-secret` returned 401.
- Runtime DB initialization smoke test: `npx prisma db push --url file:/tmp/forge-prisma-smoke.db` created and synced a fresh SQLite database successfully.
- Standalone output check: `.next/standalone/server.js`, `.next/static`, and `public` exist after `npm run build`; Dockerfile copy paths match the generated layout and Next 16 standalone-output docs.
- Docker build: attempted but blocked by Docker socket permission (`permission denied while trying to connect to the docker API`).
- Screenshot visual review: blocked because this environment has no Chromium, Playwright, or Puppeteer binary installed. UI was reviewed through component/code inspection and route smoke tests.
