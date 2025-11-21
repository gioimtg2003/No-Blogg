# Quick Start Guide

This guide will help you get the No-Blogg multi-tenant CMS up and running in minutes.

## Prerequisites

- **Node.js** 18+ installed
- **pnpm** 8+ installed (`npm install -g pnpm`)
- **Docker** installed (for PostgreSQL database)
- **Git** installed

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/gioimtg2003/No-Blogg.git
cd No-Blogg
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Start PostgreSQL Database

```bash
# Using Docker
docker run -d \
  --name noblogg-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=noblogg \
  -p 5432:5432 \
  postgres:16-alpine
```

### 5. Build Shared Packages

```bash
pnpm --filter @no-blogg/types build
pnpm --filter @no-blogg/utils build
```

### 6. Set Up Database

```bash
# Generate Prisma client
pnpm --filter @no-blogg/api db:generate

# Run migrations
pnpm db:migrate

# Seed demo data
pnpm db:seed
```

### 7. Start Development Servers

```bash
# Start all services in development mode
pnpm dev
```

This will start:
- **API Server**: http://localhost:3001
- **Web App**: http://localhost:3000

## Demo Credentials

After seeding, you can login with these credentials:

### Tenant: Acme Corp (slug: `acme-corp`)
- **Admin**: admin@acme.com / password123
- **Editor**: editor@acme.com / password123

### Tenant: Demo Organization (slug: `demo-org`)
- **Admin**: admin@demo.com / password123

## Testing the System

### 1. Access the Web App
Open http://localhost:3000 in your browser

### 2. Login
1. Click "Get Started" or "Login"
2. Select a tenant (Acme Corp or Demo Organization)
3. Enter credentials
4. Click "Login"

### 3. Explore the Dashboard
- View tenant-specific posts
- Create new posts (if you're an ADMIN or EDITOR)
- See multi-tenant data isolation in action

### 4. Test the API Directly

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@acme.com",
    "password": "password123",
    "tenantSlug": "acme-corp"
  }'

# Get posts (replace TOKEN with the token from login)
curl http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Project Structure

```
No-Blogg/
├── apps/
│   ├── api/              # Express.js API
│   └── web/              # Next.js frontend
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Shared utilities
└── README.md             # Full documentation
```

## Available Scripts

```bash
# Development
pnpm dev                  # Start all services
pnpm build                # Build all packages
pnpm lint                 # Lint all packages

# Database
pnpm db:migrate           # Run migrations
pnpm db:seed              # Seed database
pnpm db:studio            # Open Prisma Studio

# Individual Services
pnpm --filter @no-blogg/api dev      # Start API only
pnpm --filter @no-blogg/web dev      # Start web only
```

## Docker Compose (Alternative Setup)

Instead of running services individually, you can use Docker Compose:

```bash
# Start all services (API, Web, PostgreSQL, Redis)
docker-compose up -d

# Access the API container to run migrations
docker exec -it noblogg-api sh
pnpm db:migrate:deploy
pnpm db:seed
exit

# Access the application
# Web: http://localhost:3000
# API: http://localhost:3001
```

## Next Steps

- Explore the [full README](README.md) for detailed documentation
- Check out the API endpoints in `apps/api/src/routes/`
- Customize the frontend in `apps/web/src/app/`
- Modify the database schema in `apps/api/prisma/schema.prisma`

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are already in use:
- Update the PORT in `apps/api/.env`
- Update NEXT_PUBLIC_API_URL in `apps/web/.env`

### Database Connection Error
- Ensure PostgreSQL is running: `docker ps`
- Check database URL in `apps/api/.env`

### Build Errors
- Clear build cache: `pnpm clean`
- Rebuild packages: `pnpm build`

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/gioimtg2003/No-Blogg/issues)
- Check the main [README](README.md) for detailed documentation

---

Happy coding! 🎉
