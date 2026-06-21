# Human Input Needed

The app runs locally without external credentials using SQLite and safe fallbacks. To enable production integrations, provide:

## Auth

- `AUTH_SECRET`: A strong random secret for NextAuth.
- `NEXTAUTH_URL`: The deployed application URL, for example `https://app.example.com`.
- `NEXT_PUBLIC_APP_URL`: The deployed application URL used in redirects and email links.
- `GOOGLE_CLIENT_ID`: Google OAuth client ID for Google login.
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret for Google login.
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`: Set to `true` after Google OAuth credentials are configured; leave `false` to keep local email/password auth only.

## Stripe Billing

- `STRIPE_SECRET_KEY`: Stripe secret key.
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret for `/api/webhooks/stripe`.
- `STRIPE_PRICE_SOLO`: Server-side Stripe price ID for the Solo plan.
- `STRIPE_PRICE_PRO`: Server-side Stripe price ID for the Pro plan.
- `STRIPE_PRICE_STUDIO`: Server-side Stripe price ID for the Studio plan.
- `NEXT_PUBLIC_STRIPE_PRICE_SOLO`: Browser-readable Stripe price ID for the Solo plan button.
- `NEXT_PUBLIC_STRIPE_PRICE_PRO`: Browser-readable Stripe price ID for the Pro plan button.
- `NEXT_PUBLIC_STRIPE_PRICE_STUDIO`: Browser-readable Stripe price ID for the Studio plan button.

## Email Reminders

- `RESEND_API_KEY`: Resend API key for scheduled reminder email delivery.
- `REMINDER_FROM_EMAIL`: Verified sender address in Resend.
- `CRON_SECRET`: Shared secret sent as the `x-cron-secret` header when calling `/api/cron/reminders`.

## Production Database

- `DATABASE_URL`: Production database URL. The checked-in local default is SQLite (`file:./dev.db`) for development and demo use.
