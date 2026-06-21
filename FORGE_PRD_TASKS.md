# Forge PRD Tasks

Source status: read `PRD.md` and `BUILD_INSTRUCTIONS.md` end-to-end on 2026-06-21, then reviewed the existing implementation before making changes. The requested local Next guide path, `node_modules/next/dist/docs/`, is not present in this Next 16.2.7 install, so Next behavior was verified by build/runtime checks.

## Foundation

- [x] Read `AGENTS.md`, `PRD.md`, and `BUILD_INSTRUCTIONS.md`.
- [x] Confirm `next/font/google` is absent and the app uses CSS/system fonts.
- [x] Configure `next.config.ts` with `output: "standalone"`.
- [x] Maintain Tailwind/shadcn-style UI primitives, responsive app shell, sidebar, header, tables, tabs, dialogs, forms, and badges.
- [x] Replace remaining emoji marketing cards with lucide icon UI.
- [x] Generate Prisma Client after dependency install.

## Data Model

- [x] Prisma SQLite datasource with local `dev.db` fallback.
- [x] User, Account, Session, VerificationToken models for auth.
- [x] Subscription model with trial/plan state and Stripe identifiers.
- [x] Project model with title, author, client/publisher, platform, format, status, word count, estimated hours, due date, notes, PFH/royalty/payment/rights fields.
- [x] PronunciationEntry model with term, phonetic spelling, source, category, notes, and status.
- [x] CharacterNote model with name, voice notes, accent notes, relationships, first appearance, and notes.
- [x] PickupNote model with chapter, time/location, issue type, original/corrected text, notes, and status.
- [x] Audition model with title, author/client, platform, dates, rate/terms, status, and notes.
- [x] Invoice model with invoice number, amount, sent/due/paid dates, and status.
- [x] ReminderLog model to dedupe reminder emails.

## Auth

- [x] Email/password signup API with validation, bcrypt hashing, and trial subscription creation.
- [x] NextAuth credential login with JWT sessions.
- [x] Guarded Google OAuth provider support when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` exist.
- [x] Google login buttons remain hidden unless `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`.
- [x] OAuth-created users receive a trial subscription through a guarded `createUser` event.
- [x] App route protection via `src/proxy.ts`.
- [x] Server-side `requireUser()` guard for app pages and server actions.
- [x] Profile update and account deletion actions.

## User-Facing Pages

- [x] `/app` dashboard with onboarding, plan badge, active projects, open pickups, overdue invoices, auditions, recent projects, and sample project loader.
- [x] `/app/projects` project list with status filters and counts.
- [x] `/app/projects/new` project creation form covering project and business fields.
- [x] `/app/projects/[projectId]` workspace with pronunciation, character, pickup, business, and invoice tabs.
- [x] `/app/auditions` audition tracker with filters, CRUD dialog, CSV export, and copy.
- [x] `/app/invoices` cross-project invoice tracker with filters, edit/delete, and CSV export.
- [x] `/app/billing` plan cards, current subscription state, and guarded Stripe checkout/portal buttons.
- [x] `/app/settings` profile/account management.

## API Routes And Server Actions

- [x] Project create/update/delete/archive/read actions with ownership checks and plan limits.
- [x] Pronunciation create/update/delete actions with project ownership checks.
- [x] Character create/update/delete actions with project ownership checks.
- [x] Pickup create/update/delete actions with project ownership checks.
- [x] Business field updates through project update action with enum-safe UI controls.
- [x] Invoice create/update/delete/list actions with ownership checks.
- [x] Audition create/update/delete/list actions with ownership checks.
- [x] Sample data action for first-run onboarding.
- [x] Account update/delete actions.
- [x] Stripe checkout, portal, and webhook routes with missing-env fallbacks and lazy SDK initialization.
- [x] Reminder cron route with shared-secret guard and Resend missing-key fallback.

## Core Workflows

- [x] Create and update audiobook projects.
- [x] Track project statuses and reminders for invoices, pickups, payments, and rights dates.
- [x] Search/filter/copy/export pronunciation dictionaries.
- [x] Search character/name consistency sheets.
- [x] Add/edit/delete/copy/export pickup notes.
- [x] Track PFH, royalty share, payment due, expected payment, contract date, and rights reversion fields.
- [x] Track invoices per project and across all projects.
- [x] Track auditions separately from contracted projects.
- [x] Enforce trial/Solo active-project limits.
- [x] Load realistic sample project data.

## Billing, Email, Storage, And Safe Fallbacks

- [x] Stripe SDK is dynamically imported inside request-time helper code.
- [x] Billing UI and API fail gracefully when Stripe credentials are absent.
- [x] Resend is dynamically imported only inside the reminder cron handler.
- [x] Reminder cron skips email sends when `RESEND_API_KEY` is absent.
- [x] Local SQLite persistence works without external storage credentials.
- [x] Credential requirements documented in `HUMAN_INPUT_NEEDED.md`.

## Marketing And SEO Pages

- [x] `/` landing page with product positioning, workflow pains, feature grid, pricing preview, and CTA.
- [x] `/pricing` plan details and FAQ.
- [x] `/templates` template resource index with download links.
- [x] `/templates/acx-pronunciation-sheet` PRD route plus legacy `/templates/pronunciation-guide`.
- [x] `/templates/audiobook-pickup-notes` PRD route plus legacy `/templates/pickup-tracker`.
- [x] `/templates/acx-audition-tracker` template page.
- [x] Downloadable CSV assets for pronunciation, pickup notes, and ACX audition tracker.
- [x] `/blog`, `/blog/acx-narrator-workflow`, and `/blog/pronunciation-guide-for-narrators`.
- [x] Root metadata title and description.

## Docker And Deploy Config

- [x] `next.config.ts` uses standalone output.
- [x] Dockerfile uses `npm ci`, Prisma generate, Next standalone build, and copies existing `public/`.
- [x] Dockerfile includes Prisma CLI/runtime files needed for startup `prisma db push`.
- [x] Dockerfile provides writable SQLite fallback at `/app/data/prod.db`.
- [x] `.env.example` documents auth, Google OAuth, Stripe, Resend, cron, app URL, and database variables.

## Verification

- [x] `npm ci` completed.
- [x] `npx prisma generate` completed.
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] Dev server starts at `http://localhost:3000`.
- [x] Public routes smoke-tested: `/`, `/pricing`, `/templates`, PRD template routes, `/blog`, `/login`, `/signup`.
- [x] `/app` smoke-tested and redirects unauthenticated users to login.
- [x] Signup API smoke-tested and creates a local trial user.
- [x] Cron route rejects invalid secret.
- [x] Dockerfile reviewed and updated for standalone runtime.
- [ ] `docker build .` executed successfully. Blocked by Docker socket permission in this environment.
- [ ] Browser screenshot visual review. Blocked because no Chromium/Playwright/Puppeteer binary is installed in this environment.
- [x] Create `FORGE_COMPLETION_AUDIT.md`.
