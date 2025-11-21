# No-Blogg - Multi-tenant CMS Monorepo

A production-ready multi-tenant CMS starter built with modern technologies. This monorepo supports multiple organizations (tenants) with complete data isolation and role-based access control.

## 🏗️ Architecture

This is a **Turborepo** monorepo containing:

### Apps
- **`apps/api`** - Express.js REST API with TypeScript
  - JWT authentication
  - Multi-tenant data isolation
  - PostgreSQL with Prisma ORM
  - Role-based access control (ADMIN, EDITOR, VIEWER)
  
- **`apps/web`** - Next.js 14 frontend with TypeScript
  - Server-side rendering
  - Authentication flow
  - Admin dashboard
  - Content management UI

### Packages
- **`packages/types`** - Shared TypeScript types and interfaces
- **`packages/utils`** - Common utility functions

## 🚀 Tech Stack

- **Language**: TypeScript
- **Frontend**: Next.js 14, React 18
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Caching**: Redis
- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose (for containerized setup)
- PostgreSQL 16 (for local development without Docker)

## 🛠️ Getting Started

### Option 1: Local Development (Recommended for Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/gioimtg2003/No-Blogg.git
   cd No-Blogg
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # API
   cp apps/api/.env.example apps/api/.env
   
   # Web
   cp apps/web/.env.example apps/web/.env
   ```

4. **Start PostgreSQL** (if not using Docker)
   ```bash
   # Using Docker for just the database
   docker run -d \
     --name noblogg-postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=noblogg \
     -p 5432:5432 \
     postgres:16-alpine
   ```

5. **Build shared packages**
   ```bash
   pnpm --filter @no-blogg/types build
   pnpm --filter @no-blogg/utils build
   ```

6. **Generate Prisma client**
   ```bash
   pnpm --filter @no-blogg/api db:generate
   ```

7. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

8. **Seed the database**
   ```bash
   pnpm db:seed
   ```

9. **Start development servers**
   ```bash
   pnpm dev
   ```

   This will start:
   - API: http://localhost:3001
   - Web: http://localhost:3000

### Option 2: Docker Compose (Production-like Setup)

1. **Clone and configure**
   ```bash
   git clone https://github.com/gioimtg2003/No-Blogg.git
   cd No-Blogg
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Run migrations and seed**
   ```bash
   # Access the API container
   docker exec -it noblogg-api sh
   
   # Run migrations
   pnpm db:migrate:deploy
   
   # Seed data
   pnpm db:seed
   ```

4. **Access the application**
   - Web: http://localhost:3000
   - API: http://localhost:3001

## 🔑 Demo Credentials

The seed script creates two demo tenants with users:

### Tenant: Acme Corp (slug: `acme-corp`)
- **Admin**: admin@acme.com / password123
- **Editor**: editor@acme.com / password123

### Tenant: Demo Organization (slug: `demo-org`)
- **Admin**: admin@demo.com / password123

## 📁 Project Structure

```
No-Blogg/
├── apps/
│   ├── api/                    # Express.js API
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── seed.ts        # Seed script
│   │   ├── src/
│   │   │   ├── routes/        # API routes
│   │   │   ├── middleware/    # Auth & error handling
│   │   │   └── index.ts       # Server entry point
│   │   └── package.json
│   │
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/           # App router pages
│       │   └── lib/           # API client
│       └── package.json
│
├── packages/
│   ├── types/                  # Shared TypeScript types
│   └── utils/                  # Shared utilities
│
├── docker-compose.yml          # Docker Compose config
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml         # pnpm workspace config
└── package.json                # Root package.json
```

## 🔧 Available Scripts

### Root Level
```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps and packages
pnpm lint         # Lint all apps and packages
pnpm clean        # Clean all build artifacts
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed the database
pnpm db:studio    # Open Prisma Studio
```

### API-specific
```bash
pnpm --filter @no-blogg/api dev              # Start API in dev mode
pnpm --filter @no-blogg/api build            # Build API
pnpm --filter @no-blogg/api db:generate      # Generate Prisma client
pnpm --filter @no-blogg/api db:migrate       # Run migrations
pnpm --filter @no-blogg/api db:seed          # Seed database
pnpm --filter @no-blogg/api db:studio        # Open Prisma Studio
```

### Web-specific
```bash
pnpm --filter @no-blogg/web dev              # Start web in dev mode
pnpm --filter @no-blogg/web build            # Build web
pnpm --filter @no-blogg/web start            # Start production server
```

## 🗄️ Database Schema

### Multi-tenant Architecture

The system uses **shared database with tenant isolation**:

- **Tenant**: Organization/company data
- **User**: Users belonging to a tenant (unique per tenant)
- **Post**: Content created by users (isolated per tenant)

All queries are automatically filtered by `tenantId` to ensure data isolation.

### Roles

- **ADMIN**: Full access - can create, edit, delete all content
- **EDITOR**: Can create and edit posts
- **VIEWER**: Read-only access

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email, password, and tenant slug
- `POST /api/auth/register` - Register a new user

### Tenants
- `GET /api/tenants` - List all tenants (public)
- `GET /api/tenants/me` - Get current tenant (authenticated)

### Posts
- `GET /api/posts` - List posts (filtered by tenant)
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a post (EDITOR/ADMIN)
- `PUT /api/posts/:id` - Update a post (EDITOR/ADMIN)
- `DELETE /api/posts/:id` - Delete a post (ADMIN only)

## 🌐 Environment Variables

### API (apps/api/.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/noblogg?schema=public
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Web (apps/web/.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🧪 Testing the System

1. **Start the development servers** (see Getting Started)

2. **Open the web app** at http://localhost:3000

3. **Login** with demo credentials:
   - Select tenant: `Acme Corp`
   - Email: `admin@acme.com`
   - Password: `password123`

4. **Explore the dashboard** to see:
   - List of posts for the tenant
   - Create new posts (if ADMIN/EDITOR)
   - Multi-tenant isolation (switch tenants to see different data)

5. **Test API directly** with curl or Postman:
   ```bash
   # Login
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@acme.com",
       "password": "password123",
       "tenantSlug": "acme-corp"
     }'
   
   # Get posts (use token from login response)
   curl http://localhost:3001/api/posts \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove all data (including volumes)
docker-compose down -v
```

## 🚀 Deployment

### Prerequisites for Production
1. Change `JWT_SECRET` to a strong random value
2. Update CORS settings to match your domain
3. Use a managed PostgreSQL instance (AWS RDS, Heroku Postgres, etc.)
4. Set up Redis for sessions/caching in production
5. Configure proper environment variables

### Build for Production
```bash
# Build all apps and packages
pnpm build

# Run migrations on production database
pnpm db:migrate:deploy

# Start production servers
pnpm --filter @no-blogg/api start
pnpm --filter @no-blogg/web start
```

## 📚 Key Features

✅ **Multi-tenancy** - Complete data isolation per organization  
✅ **Authentication** - Secure JWT-based auth  
✅ **Authorization** - Role-based access control  
✅ **Type Safety** - End-to-end TypeScript  
✅ **Modern Stack** - Latest versions of Next.js, Prisma, etc.  
✅ **Monorepo** - Efficient code sharing with Turborepo  
✅ **Database Migrations** - Version-controlled schema changes  
✅ **Seed Data** - Quick setup with demo data  
✅ **Docker Ready** - Easy deployment with Docker Compose  
✅ **Developer Experience** - Hot reload, TypeScript, ESLint, Prettier  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- API powered by [Express](https://expressjs.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Monorepo by [Turborepo](https://turbo.build/)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Happy coding! 🎉**