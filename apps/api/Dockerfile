# ---- Stage 1: Build ----
FROM node:20-slim AS builder

# Install build dependencies for native modules (argon2) and openssl for Prisma
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy workspace config files first (for layer caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy only the package.json files needed for install
COPY apps/api/package.json apps/api/
COPY packages/schemas/package.json packages/schemas/

# Install all dependencies (cached unless package.json or lockfile changes)
RUN pnpm install --frozen-lockfile

# Copy source code for schemas and api
COPY packages/schemas/ packages/schemas/
COPY apps/api/ apps/api/

# Build everything via Turbo: @repo/schemas -> db:generate -> api build
RUN pnpm turbo build --filter=api

# ---- Stage 2: Production ----
FROM node:20-slim AS production

# Install openssl (required by Prisma at runtime)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built api output
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./

# Copy node_modules (includes @prisma/client with generated engine)
COPY --from=builder /app/apps/api/node_modules ./node_modules

# Copy the built schemas package (referenced by api at runtime)
COPY --from=builder /app/packages/schemas/dist ./node_modules/@repo/schemas/dist
COPY --from=builder /app/packages/schemas/package.json ./node_modules/@repo/schemas/package.json

ENV NODE_ENV=production

EXPOSE 7000

CMD ["node", "dist/main.js"]
