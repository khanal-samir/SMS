# Web

This package contains the Next.js frontend for the SMS monorepo.

## What It Does

- Renders the public landing page and all authenticated role-based routes.
- Uses cookie-based session state plus backend auth cookies to keep users in the correct role area.
- Includes admin, teacher, and student dashboards for announcements, assignments, resources, chat, semesters, batches, subjects, and course pages.
- Uses the API at the URL defined by `NEXT_PUBLIC_API_URL`.

## Routes

- Public: `/`
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/google/callback`
- Student: `/student/*`
- Teacher: `/teacher/*`
- Admin: `/admin/*`

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm check-types
```

## Environment

The frontend uses the variables documented in the root README, especially `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_COOKIE_DOMAIN`, and `ADMIN_SECRET_KEY`.

## Local Development

```bash
pnpm install
pnpm dev
```

Open the app on port 3000 when the dev server is running. For the full project overview and backend setup, see the root [README.md](../../README.md).
