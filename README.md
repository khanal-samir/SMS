# SMS

SMS is a school management system for Prithvi Narayan Campus, B.Sc. CSIT. The repository is a Turborepo with a NestJS API, a Next.js web app, and shared schema/config packages.

## Overview

- `apps/api`: NestJS backend with Prisma, PostgreSQL, Redis-backed jobs, Swagger docs, JWT auth, Google OAuth, SMTP email, AWS S3 storage, and Socket.IO chat.
- `apps/web`: Next.js 15 frontend with role-based routing for admin, teacher, and student workflows.
- `packages/schemas`: shared Zod schemas, enums, and API response types.
- `packages/eslint-config`: shared lint rules.
- `packages/typescript-config`: shared TypeScript base configs.

## Core Features

- Role-based authentication for `ADMIN`, `TEACHER`, and `STUDENT` users.
- Public landing page plus separate login, register, forgot-password, and reset-password flows.
- Admin dashboards for users, semesters, batches, subjects, assignments, announcements, resources, and chat.
- Teacher dashboards for schedules, batches, subjects, assignments, resources, announcements, and chat.
- Student dashboards for courses, assignments, resources, announcements, and chat.
- Course and batch management with semester enrollment, resource publishing, and assignment tracking.
- Backend support for notifications, email delivery, background jobs, and file uploads.

## Tech Stack

- Monorepo orchestration: Turborepo, pnpm, TypeScript
- Frontend: Next.js 15, React 19, Tailwind CSS 4, TanStack Query, Zustand, Socket.IO client, Radix UI, Motion
- Backend: NestJS 11, Prisma, PostgreSQL, Redis, BullMQ, Swagger, Passport, JWT, Zod
- Integrations: Google OAuth, Nodemailer, AWS S3

## Repository Layout

```text
apps/
	api/   NestJS backend
	web/   Next.js frontend
packages/
	eslint-config/      shared linting presets
	schemas/            shared schemas and API types
	typescript-config/   shared tsconfig presets
```

## Prerequisites

- Node.js 18 or newer
- pnpm 9
- PostgreSQL
- Redis
- An SMTP provider
- Google OAuth credentials
- An AWS S3 bucket and credentials

## Installation

```bash
pnpm install
```

## Environment Variables

Create an environment file for the API at `apps/api/.env` and one for the web app at `apps/web/.env.local`.

### API environment

```bash
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
PUBLIC_WEB_URL=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
REDIS_URL=
ADMIN_EMAILS=
COOKIE_DOMAIN=
NODE_ENV=development
BE_PORT=8000
AWS_S3_BUCKET=
AWS_S3_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### Web environment

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_COOKIE_DOMAIN=
ADMIN_SECRET_KEY=
NODE_ENV=development
```

## Running Locally

Start everything from the monorepo root:

```bash
pnpm dev
```

Common task filters:

```bash
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter api build
pnpm --filter web build
```

If you need the API container stack, use the scripts in `apps/api`:

```bash
pnpm --filter api compose:up
pnpm --filter api compose:logs
pnpm --filter api compose:down
```

## Database Tasks

The API package owns Prisma tasks:

```bash
pnpm --filter api db:generate
pnpm --filter api db:migrate
pnpm --filter api db:deploy
pnpm --filter api db:reset
pnpm --filter api db:studio
```

## Scripts

At the repo root:

```bash
pnpm build
pnpm dev
pnpm lint
pnpm check-types
pnpm format
```

In `apps/api`:

```bash
pnpm build
pnpm dev
pnpm start
pnpm test
pnpm test:e2e
pnpm db:migrate
pnpm db:studio
```

In `apps/web`:

```bash
pnpm build
pnpm dev
pnpm start
pnpm lint
pnpm check-types
```

## Backend Notes

- Global route prefix: `v1`
- Swagger UI: `/docs`
- Health check: `/v1/health`
- Global validation uses Zod.
- Global auth and roles guards protect the API by default.
- Main backend modules cover auth, users, semesters, subjects, batches, assignments, announcements, chat, dashboard, resources, storage, mail, queue processing, seeding, and Prisma access.

## Frontend Notes

- Public landing page: `/`
- Auth routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/google/callback`
- Student routes: `/student/*`
- Teacher routes: `/teacher/*`
- Admin routes: `/admin/*`
- Route protection is handled in `apps/web/middleware.ts` using the session cookie and backend auth cookies.

## Data Model

The Prisma schema centers on these entities:

- `User`
- `Batch`
- `Semester`
- `StudentSemester`
- `Subject`
- `SubjectTeacher`
- `Resource`
- `Assignment`
- `Announcement`
- `AnnouncementRead`
- `ChatGroup`
- `ChatMessage`

## Useful Commands

```bash
pnpm --filter api test
pnpm --filter api test:cov
pnpm --filter api lint
pnpm --filter web lint
pnpm --filter api check-types
pnpm --filter web check-types
```

## Notes

- The web app expects `NEXT_PUBLIC_API_URL` to point at the API origin.
- The API must know the frontend origin through `PUBLIC_WEB_URL` for CORS and websocket access.
- `ADMIN_EMAILS` is parsed as a comma-separated list.

