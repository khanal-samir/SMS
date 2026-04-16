# API

This package contains the NestJS backend for the SMS monorepo.

## What It Does

- Exposes the versioned API under the `v1` prefix.
- Serves Swagger documentation at `/docs`.
- Handles authentication, authorization, user management, semesters, subjects, batches, assignments, announcements, chat, resources, dashboards, storage, mail, queues, and seeding.
- Uses Prisma for PostgreSQL access and BullMQ for background jobs.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm start:prod
pnpm lint
pnpm check-types
pnpm test
pnpm test:e2e
pnpm test:cov
pnpm db:generate
pnpm db:migrate
pnpm db:deploy
pnpm db:reset
pnpm db:studio
pnpm compose:up
pnpm compose:down
pnpm compose:logs
```

## Environment

The backend requires the variables documented in the root README, including database, JWT, Google OAuth, SMTP, Redis, S3, and frontend origin settings.

## Local Development

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

If you need the full setup guide or monorepo commands, see the root [README.md](../../README.md).
