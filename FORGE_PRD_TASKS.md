# Forge PRD Task Checklist

Implementation order: foundation -> data/auth -> core workflows -> secondary workflows -> marketing/pages -> deployment -> QA.

## Foundation
- [x] Next.js App Router project exists with TypeScript, Tailwind, shadcn-style UI components.
- [x] App shell exists for authenticated product routes.
- [x] Public marketing shell exists.
- [x] Prisma is configured for local/server persistence with a deployment-safe SQLite fallback.
- [x] `next.config.ts` uses `output: "standalone"` for container deployment.
- [x] Verify dependencies install cleanly from lockfile.
- [x] Verify `npm run build` passes after final fixes.

## Data Model
- [x] User, Account, Session, VerificationToken models exist.
- [x] Subscription model exists with plan/status/trial/Stripe fields.
- [x] Project model exists with audiobook metadata, status, due dates, notes, and business fields.
- [x] PronunciationEntry model exists with term, phonetic, source, category, notes, and status.
- [x] CharacterNote model exists with voice/accent/relationship/first appearance fields.
- [x] PickupNote model exists with location, issue, text, notes, and status fields.
- [x] Audition model exists with platform, dates, terms, status, and notes.
- [x] Invoice model exists with amount, dates, and status.
- [x] ReminderLog model exists for reminder processing audit.
- [x] Confirm Prisma client generation works in build and Docker runtime schema initialization contexts.

## Auth
- [x] Auth.js/NextAuth route exists.
- [x] Google OAuth is enabled when credentials are present.
- [x] Credentials login/signup fallback exists for no-OAuth local/demo operation.
- [x] User subscription/trial is created on signup.
- [x] Protected app routes redirect unauthenticated users.
- [x] Confirm auth works without Google credentials and does not crash at build/runtime.

## User-Facing App Pages
- [x] `/app` dashboard exists with project/reminder summary.
- [x] `/app/projects` list exists with status filtering.
- [x] `/app/projects/new` create project form exists.
- [x] `/app/projects/new` form controls have associated labels for keyboard/screen-reader use and reliable browser automation.
- [x] `/app/projects/[projectId]` detail workspace exists.
- [x] Project detail includes overview/business/pronunciation/character/pickup/invoice workflows.
- [x] `/app/auditions` audition tracker exists.
- [x] `/app/invoices` invoice tracker exists.
- [x] `/app/settings` account/settings page exists.
- [x] `/app/billing` billing page exists.
- [x] Smoke-test primary app routes in a running dev server.

## API Routes And Server Actions
- [x] Signup API exists.
- [x] Auth API exists.
- [x] Stripe checkout route exists with missing-env fallback.
- [x] Stripe portal route exists with missing-env fallback.
- [x] Stripe webhook route exists.
- [x] Reminder cron route exists.
- [x] Project server actions exist for create/update/delete/archive/read.
- [x] Pronunciation server actions exist.
- [x] Character server actions exist.
- [x] Pickup server actions exist.
- [x] Audition server actions exist.
- [x] Invoice server actions exist.
- [x] Confirm all actions compile with current Next/React/Prisma versions.

## Core Workflows
- [x] Create/edit/list/archive audiobook projects.
- [x] Filter projects by PRD statuses.
- [x] Show reminders for invoice due dates, payment due dates, pickup deadlines, and rights dates.
- [x] Manage project pronunciation dictionary with search/filter and copy/export support.
- [x] Manage character/name consistency notes with search support.
- [x] Manage pickup notes with status tracking and export/copy support.
- [x] Track auditions separately from contracted projects.
- [x] Track contract/business fields on projects.
- [x] Track invoices per project and globally.
- [x] Enforce trial/Solo/Pro/Studio active project limits.
- [x] Provide sample/demo data option for onboarding.
- [x] Verify key navigation, signup API, auth guard, export-capable pages, guarded cron behavior, browser signup/login, label-based project creation, and project detail navigation through dev-server smoke tests.

## Billing, Email, Storage, Analytics
- [x] Stripe subscription checkout/portal/webhook code exists.
- [x] Stripe integration is guarded when credentials are unavailable.
- [x] Resend reminder email code exists.
- [x] Reminder emails are skipped gracefully without `RESEND_API_KEY`.
- [x] Local SQLite storage works as a safe fallback for deployment without external database credentials.
- [x] Analytics helper exists with no-op fallback unless configured.
- [x] Document required production credentials in `HUMAN_INPUT_NEEDED.md`.

## Marketing And SEO Pages
- [x] `/` landing page exists.
- [x] `/pricing` page exists.
- [x] `/templates` page exists.
- [x] Initial template pages exist for pronunciation, pickup, and audition trackers.
- [x] Downloadable CSV template assets exist.
- [x] Add missing prioritized pages: invoice tracker template, royalty/rights tracker template.
- [x] Add missing prioritized blog pages: best software, pickup tracking, ACX pronunciation sheet, PFH vs royalty share.
- [x] Verify metadata titles/descriptions match PRD keyword patterns.

## Docker And Deploy Config
- [x] Dockerfile exists.
- [x] Dockerfile uses standalone output.
- [x] Dockerfile handles `public/` safely.
- [x] Runtime initializes SQLite schema before starting.
- [x] Check Dockerfile against actual generated standalone layout and installed Next 16 standalone-output docs.
- [x] Attempt `docker build .`; blocked by Docker socket permission in this environment.

## Verification
- [x] Run `npm ci`.
- [x] Run `npm run lint` and fix all failures.
- [x] Run `npm run build` and fix all failures.
- [x] Start dev server and ensure it does not crash.
- [x] Inspect primary public/app pages through route smoke tests, Playwright screenshots, and component review.
- [x] Test key interactions: signup/auto-login, label-based project creation, auth guard, public navigation routes, cron guard, Prisma runtime schema initialization, standalone server startup, and build-time compilation of server actions.
- [x] Create `FORGE_COMPLETION_AUDIT.md` mapping PRD requirements to implementation files/routes.
- [x] Final response includes `FORGE_BUILD_COMPLETE` only after all feasible checks pass.
