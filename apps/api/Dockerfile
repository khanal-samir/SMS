

FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS pruner

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm add -g turbo

COPY . .

# Prune the monorepo down to only what "api" needs, in Docker-optimized format
RUN turbo prune api --docker

FROM base AS installer

# Build toolchain for native addons (argon2 needs python3, make, g++)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# --- Phase A: Install dependencies (cached unless lockfile/package.jsons change) ---

COPY --from=pruner /app/out/json/ .

COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile

# --- Phase B: Build the application ---

# Copy the full pruned source code
COPY --from=pruner /app/out/full/ .

RUN pnpm --filter @repo/schemas build

RUN pnpm --filter api exec prisma generate

RUN pnpm --filter api build

# 4. Create a self-contained production deployment using `pnpm deploy`.
#    This resolves all pnpm symlinks and copies only production dependencies
#    into a flat node_modules — perfect for the final Docker stage.
RUN pnpm --filter api deploy --prod /app/deployed

# Copy build output and Prisma schema + migrations into the deployed directory
# (pnpm deploy respects .gitignore, which excludes dist/ and prisma/)
RUN cp -r /app/apps/api/dist /app/deployed/dist
RUN cp -r /app/apps/api/prisma /app/deployed/prisma

# Regenerate Prisma client in the deployed node_modules.
# pnpm deploy --prod creates a fresh node_modules where @prisma/client exists
# but the generated runtime (enums, types, query engine) is missing.
# prisma is a devDep so we use npx to run it one-time against the deployed dir.
RUN cd /app/deployed && npx --yes prisma@6 generate --schema=./prisma/schema.prisma


FROM node:20-alpine AS runner

# libc6-compat needed at runtime for native modules (argon2, prisma query engine)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Run as non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

ENV NODE_ENV=production

# Copy the self-contained deployment from the installer stage
COPY --from=installer --chown=nestjs:nodejs /app/deployed/package.json ./package.json
COPY --from=installer --chown=nestjs:nodejs /app/deployed/dist ./dist
COPY --from=installer --chown=nestjs:nodejs /app/deployed/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/deployed/prisma ./prisma

USER nestjs

EXPOSE 8000

CMD ["node", "dist/main"]
