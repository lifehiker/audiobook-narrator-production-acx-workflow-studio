# NarratorStudio

NarratorStudio is a production workflow app for audiobook narrators managing ACX-style projects. It tracks projects, pronunciations, character notes, pickups, auditions, invoices, billing state, and reminder dates from one workspace.

## Getting Started

First, install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

The local build uses SQLite at `dev.db` by default. External Stripe and Resend credentials are optional; when missing, billing and reminder paths show safe fallback behavior instead of crashing.

## Production Build

```bash
npm run build
```

The Next.js config emits standalone output for Docker/self-hosting.

## Docker

```bash
docker build .
```

See `.env.example` and `HUMAN_INPUT_NEEDED.md` for production environment variables.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
