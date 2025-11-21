# Production Dockerfile for Web
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/types/package.json ./packages/types/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY apps/web/package.json ./apps/web/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps/web ./apps/web
COPY tsconfig.json ./

# Build packages
RUN pnpm --filter @no-blogg/types build
RUN pnpm --filter @no-blogg/utils build

# Build web app
RUN pnpm --filter @no-blogg/web build

# Production stage
FROM node:20-alpine AS production

RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copy built files
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=base /app/apps/web/package.json ./apps/web/package.json
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/apps/web/next.config.js ./apps/web/next.config.js

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["pnpm", "start"]
