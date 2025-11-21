# Production Dockerfile for API
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/types/package.json ./packages/types/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps/api ./apps/api
COPY tsconfig.json ./

# Build packages
RUN pnpm --filter @no-blogg/types build
RUN pnpm --filter @no-blogg/utils build

# Generate Prisma client
RUN cd apps/api && pnpm db:generate

# Build API
RUN pnpm --filter @no-blogg/api build

# Production stage
FROM node:20-alpine AS production

RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy built files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=base /app/apps/api/package.json ./apps/api/package.json
COPY --from=base /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["sh", "-c", "pnpm db:migrate:deploy && node dist/index.js"]
