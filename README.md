# No-Blogg - Multi-tenant SaaS System

A production-ready multi-tenant SaaS starter built with modern technologies. This monorepo uses a **Modular/Plugin-based architecture** where features are separated into plugins containing both UI and Server logic.

## 🏗️ Architecture

This is a **Turborepo** monorepo with **pnpm** as the package manager, following a modular plugin-based architecture.

### Apps (Host Applications)
- **`apps/web`** - Next.js 14+ frontend (App Router, TypeScript)
  - Server-side rendering
  - Tailwind CSS styling
  - Shared UI component consumption
  
- **`apps/api`** - NestJS 10+ backend (TypeScript)
  - REST API endpoints
  - Multi-tenant support
  - Plugin module integration

### Packages (Shared Technical Libraries / Infrastructure)
- **`packages/ui`** - Shared React UI Components (Tailwind-based)
- **`packages/tsconfig`** - Shared TypeScript configurations (base, next, nest, react-library)
- **`packages/eslint-config`** - Shared ESLint rules
- **`packages/logger`** - Shared Logger utility

### Libs (Business Logic & Plugins / Vertical Slices)
- **`libs/core`** - Core domain logic (Auth, Tenant Management)
- **`libs/plugins/*`** - Feature Plugins (e.g., newsletter)
  - Each plugin contains:
    - `src/client/` - React components
    - `src/server/` - NestJS modules
    - `src/shared/` - DTOs and interfaces

## 🚀 Tech Stack

- **Language**: TypeScript
- **Frontend**: Next.js 14+, React 18
- **Backend**: NestJS 10+
- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 9+

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/gioimtg2003/No-Blogg.git
   cd No-Blogg
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build all packages**
   ```bash
   pnpm build
   ```

4. **Start development servers**
   ```bash
   pnpm dev
   ```

   This will start:
   - API: http://localhost:3001
   - Web: http://localhost:3000

## 📁 Project Structure

```
No-Blogg/
├── apps/
│   ├── web/                     # Next.js Application (Client Host)
│   │   ├── src/
│   │   │   └── app/             # App Router pages
│   │   └── package.json
│   │
│   └── api/                     # NestJS Application (Server Host)
│       ├── src/
│       │   ├── app.module.ts    # Root module
│       │   └── main.ts          # Entry point
│       └── package.json
│
├── packages/                    # Shared Technical Libraries (Infrastructure)
│   ├── ui/                      # Shared React UI Components (Tailwind based)
│   │   └── src/
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── tsconfig/                # Shared TS Configs
│   │   ├── base.json
│   │   ├── next.json
│   │   ├── nest.json
│   │   └── react-library.json
│   ├── eslint-config/           # Shared Linting rules
│   │   ├── base.js
│   │   ├── next.js
│   │   ├── nest.js
│   │   └── react-internal.js
│   └── logger/                  # Shared Logger utility
│       └── src/
│           └── index.ts
│
├── libs/                        # Business Logic & Plugins (Vertical Slices)
│   ├── core/                    # Core domain logic
│   │   └── src/
│   │       ├── auth/            # Auth types & interfaces
│   │       └── tenant/          # Tenant management types
│   │
│   └── plugins/                 # Feature Plugins
│       └── newsletter/          # Example Newsletter Plugin
│           └── src/
│               ├── client/      # React Components
│               │   └── components/
│               ├── server/      # NestJS Modules
│               │   ├── newsletter.module.ts
│               │   ├── newsletter.service.ts
│               │   └── subscriber.service.ts
│               └── shared/      # DTOs and Interfaces
│                   ├── types.ts
│                   └── dto.ts
│
├── turbo.json                   # Turborepo config
├── pnpm-workspace.yaml          # pnpm workspace config
└── package.json                 # Root package.json
```

## 🔧 Available Scripts

### Root Level
```bash
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start Next.js web app in dev mode
pnpm dev:api          # Start NestJS API in dev mode
pnpm build            # Build all apps and packages
pnpm build:web        # Build Next.js web app
pnpm build:api        # Build NestJS API
pnpm build:packages   # Build all packages
pnpm build:libs       # Build all libs
pnpm start:web        # Start Next.js production server
pnpm start:api        # Start NestJS production server
pnpm lint             # Lint all apps and packages
pnpm lint:web         # Lint Next.js web app
pnpm lint:api         # Lint NestJS API
pnpm clean            # Clean all build artifacts
pnpm format           # Format code with Prettier
pnpm create:plugin    # Create a new plugin (CLI tool)
```

### Package-specific
```bash
pnpm --filter @no-blogg/api dev              # Start API in dev mode
pnpm --filter @no-blogg/api build            # Build API
pnpm --filter @no-blogg/web dev              # Start web in dev mode
pnpm --filter @no-blogg/web build            # Build web
pnpm --filter @no-blogg/logger build         # Build logger package
pnpm --filter @no-blogg/core build           # Build core library
pnpm --filter @no-blogg/plugin-newsletter build  # Build newsletter plugin
```

## 🔨 Plugin Generator CLI

Create new plugins quickly using the built-in CLI tool:

```bash
# Using npm script
pnpm create:plugin <plugin-name>

# Or directly
node scripts/create-plugin.js <plugin-name>

# Examples
pnpm create:plugin billing
pnpm create:plugin user-profile
pnpm create:plugin analytics-dashboard
```

### Generated Structure

```
libs/plugins/<plugin-name>/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .eslintrc.js
└── src/
    ├── index.ts
    ├── constants.ts
    ├── client/
    │   ├── index.ts
    │   └── components/
    │       ├── <plugin-name>-list.tsx
    │       └── <plugin-name>-form.tsx
    ├── server/
    │   ├── index.ts
    │   ├── <plugin-name>.module.ts
    │   ├── <plugin-name>.controller.ts
    │   └── <plugin-name>.service.ts
    └── shared/
        ├── index.ts
        ├── types.ts
        └── dto.ts
```

### Validation Rules

The CLI validates plugin names with the following rules:
- Must start with a letter
- Can only contain lowercase letters, numbers, and hyphens
- Must be at least 2 characters long
- Must be less than 50 characters
- Cannot use reserved names (core, shared, common, utils, lib, plugin)
- Cannot duplicate existing plugin names

### After Creating a Plugin

1. Run `pnpm install` to install dependencies
2. Import the module in `apps/api/src/app.module.ts`:
   ```typescript
   import { YourPluginModule } from "@no-blogg/plugin-your-plugin/server";
   
   @Module({
     imports: [YourPluginModule.forRoot()],
     // ...
   })
   export class AppModule {}
   ```
3. Use components in `apps/web`:
   ```typescript
   import { YourPluginList, YourPluginForm } from "@no-blogg/plugin-your-plugin/client";
   ```
4. Run `pnpm build` to build the plugin

## 🔌 Plugin Architecture

Each plugin is a self-contained vertical slice that includes:

### Client Components (`src/client/`)
React components that can be imported and used in the Next.js app:
```typescript
import { NewsletterSubscribeForm, NewsletterList } from "@no-blogg/plugin-newsletter/client";
```

### Server Modules (`src/server/`)
NestJS modules that can be imported into the API:
```typescript
import { NewsletterModule, NewsletterService } from "@no-blogg/plugin-newsletter/server";
```

### Shared Types (`src/shared/`)
DTOs and interfaces shared between client and server:
```typescript
import { Newsletter, CreateNewsletterDto } from "@no-blogg/plugin-newsletter/shared";
```

## 📚 Key Features

✅ **Turborepo** - Efficient monorepo build system with caching  
✅ **pnpm Workspaces** - Fast, disk-efficient package management  
✅ **Plugin Architecture** - Modular feature development  
✅ **Type Safety** - End-to-end TypeScript  
✅ **Shared Components** - Reusable UI library with Tailwind  
✅ **Shared Configs** - Consistent TS and ESLint configurations  
✅ **Hot Reload** - Fast development experience

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
- API powered by [NestJS](https://nestjs.com/)
- Monorepo by [Turborepo](https://turbo.build/)
- Package management by [pnpm](https://pnpm.io/)

---

**Happy coding! 🎉**
