# AGENTS.md

## Purpose

- Quick guide for coding agents working in this repo.
- Follow existing scripts/config before adding custom workflow.
- Keep changes scoped to `apps/web`, `apps/api`, and `packages/schemas`.
- If Cursor/Copilot rule files exist, follow them first.

## Stack

- Monorepo: Turborepo + pnpm workspaces.
- Frontend: Next.js 15, React 19, TypeScript, Tailwind v4.
- Backend: NestJS 11, Prisma, Jest, Zod (`nestjs-zod`).
- Shared contracts: `@repo/schemas` from `packages/schemas`.

## Setup

- Node: `>=18` (CI uses 20).
- Package manager: `pnpm@9`.
- Install: `pnpm install`
- API env template: `apps/api/.env.example`

## Build / Lint / Test Commands

- Root:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm check-types`
  - `pnpm format`
- Targeted from root:
  - `pnpm --filter @repo/schemas build`
  - `pnpm --filter web dev`
  - `pnpm --filter web lint`
  - `pnpm --filter web check-types`
  - `pnpm --filter web build`
  - `pnpm --filter api dev`
  - `pnpm --filter api lint`
  - `pnpm --filter api test`
  - `pnpm --filter api test:e2e`
  - `pnpm --filter api build`

## Run a Single Test

- API unit test file:
  - `pnpm --filter api test -- src/prisma/prisma.service.spec.ts`
- API single test by name:
  - `pnpm --filter api test -- src/prisma/prisma.service.spec.ts -t "should be defined"`
- API single e2e file:
  - `pnpm --filter api test:e2e -- test/app.e2e-spec.ts`
- API watch mode:
  - `pnpm --filter api test:watch`

## API Local Commands (`apps/api`)

- `pnpm dev`
- `pnpm lint`
- `pnpm test`
- `pnpm test:watch`
- `pnpm test:cov`
- `pnpm test:e2e`
- `pnpm build`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:deploy`
- `pnpm db:reset`
- `pnpm db:studio`
- `pnpm compose:up`
- `pnpm compose:down`
- `pnpm compose:logs`

## CI-Like Check Order

- `pnpm install --frozen-lockfile`
- `pnpm --filter @repo/schemas build`
- `pnpm --filter api exec prisma generate`
- `pnpm --filter web lint && pnpm --filter web build`
- `pnpm --filter api lint && pnpm --filter api test && pnpm --filter api build`

## Code Style

- Formatting (Prettier):
  - `semi: false`
  - `singleQuote: true`
  - `tabWidth: 2`
  - `printWidth: 100`
  - `trailingComma: all`
- Imports:
  - Order: external -> internal aliases -> relative
  - Prefer `import type` for type-only imports
  - Web: prefer `@/` aliases
  - Backend: keep `@src/*` vs `src/*` consistent within file
- Types:
  - Prefer strict typing; avoid `any`
  - Keep shared request/response types in `packages/schemas`
  - Use `XxxSchema` + inferred types in shared schemas
  - API DTO classes should use `createZodDto(...)`
- Naming:
  - Files: kebab-case
  - React components: PascalCase
  - Hooks: `useXxx`
  - Stores: `*.store.ts`
  - Nest files: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/*.dto.ts`

## Backend Rules

- Keep controllers thin; put business logic in services.
- Return `{ message, data }` from controllers.
- Use guards/decorators for auth/roles (`@Roles`, `@CurrentUser`).
- Throw typed Nest exceptions for expected errors.
- Preserve global wrappers (`ResponseInterceptor`, `AllExceptionsFilter`).

## Frontend Rules

- Follow existing App Router structure in `apps/web/app`.
- Use `'use client'` only where required.
- Keep API calls in `apis/*.api.ts` and consume via React Query hooks.
- Keep query keys in `lib/query-keys.ts`.
- Reuse existing UI primitives in `components/ui`.
- Keep styling aligned with `app/globals.css` design tokens.
- Preserve route auth behavior in `middleware.ts`.

## Error Handling

- Backend: throw specific HTTP exceptions with safe messages.
- Frontend: route request/query failures through error store + toast flow.
- Clear auth/session state on refresh/auth failure.

## Handoff Checklist

- Run lint + type-check + relevant tests for changed packages.
- If `packages/schemas` changed, rebuild it and rerun dependent checks.
