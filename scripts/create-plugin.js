#!/usr/bin/env node

/**
 * Plugin Generator CLI
 * Creates a new plugin with the standard structure:
 * - src/client/       React components
 * - src/server/       NestJS modules
 * - src/shared/       DTOs and interfaces
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const PLUGINS_DIR = path.join(__dirname, "..", "libs", "plugins");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ Error: ${message}`, "red");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "cyan");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

/**
 * Validate plugin name
 * @param {string} name - Plugin name to validate
 * @returns {{ valid: boolean, error?: string }}
 */
function validatePluginName(name) {
  if (!name || name.trim() === "") {
    return { valid: false, error: "Plugin name cannot be empty" };
  }

  const trimmedName = name.trim().toLowerCase();

  // Check for valid characters (lowercase letters, numbers, hyphens)
  if (!/^[a-z][a-z0-9-]*$/.test(trimmedName)) {
    return {
      valid: false,
      error:
        "Plugin name must start with a letter and contain only lowercase letters, numbers, and hyphens",
    };
  }

  // Check minimum length
  if (trimmedName.length < 2) {
    return {
      valid: false,
      error: "Plugin name must be at least 2 characters long",
    };
  }

  // Check maximum length
  if (trimmedName.length > 50) {
    return {
      valid: false,
      error: "Plugin name must be less than 50 characters",
    };
  }

  // Check for reserved names
  const reservedNames = ["core", "shared", "common", "utils", "lib", "plugin"];
  if (reservedNames.includes(trimmedName)) {
    return {
      valid: false,
      error: `"${trimmedName}" is a reserved name. Please choose a different name`,
    };
  }

  // Check if plugin already exists
  const pluginPath = path.join(PLUGINS_DIR, trimmedName);
  if (fs.existsSync(pluginPath)) {
    return {
      valid: false,
      error: `Plugin "${trimmedName}" already exists at ${pluginPath}`,
    };
  }

  return { valid: true };
}

/**
 * Convert kebab-case to PascalCase
 * @param {string} str - String to convert
 * @returns {string}
 */
function toPascalCase(str) {
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Convert kebab-case to camelCase
 * @param {string} str - String to convert
 * @returns {string}
 */
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert kebab-case to SCREAMING_SNAKE_CASE
 * @param {string} str - String to convert
 * @returns {string}
 */
function toScreamingSnakeCase(str) {
  return str.replace(/-/g, "_").toUpperCase();
}

/**
 * Generate plugin files
 * @param {string} pluginName - Name of the plugin (kebab-case)
 */
function generatePlugin(pluginName) {
  const pluginPath = path.join(PLUGINS_DIR, pluginName);
  const pascalName = toPascalCase(pluginName);
  const camelName = toCamelCase(pluginName);
  const screamingName = toScreamingSnakeCase(pluginName);

  logInfo(`Creating plugin "${pluginName}" at ${pluginPath}`);

  // Create directory structure
  const directories = [
    pluginPath,
    path.join(pluginPath, "src"),
    path.join(pluginPath, "src", "client"),
    path.join(pluginPath, "src", "client", "components"),
    path.join(pluginPath, "src", "server"),
    path.join(pluginPath, "src", "shared"),
  ];

  for (const dir of directories) {
    fs.mkdirSync(dir, { recursive: true });
    logSuccess(`Created directory: ${path.relative(process.cwd(), dir)}`);
  }

  // Generate files
  const files = getPluginFiles(pluginName, pascalName, camelName, screamingName);

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(pluginPath, filePath);
    fs.writeFileSync(fullPath, content);
    logSuccess(`Created file: ${path.relative(process.cwd(), fullPath)}`);
  }

  return pluginPath;
}

/**
 * Get all plugin files content
 * @param {string} pluginName - kebab-case name
 * @param {string} pascalName - PascalCase name
 * @param {string} camelName - camelCase name
 * @param {string} screamingName - SCREAMING_SNAKE_CASE name
 * @returns {Record<string, string>}
 */
function getPluginFiles(pluginName, pascalName, camelName, screamingName) {
  return {
    // package.json
    "package.json": `{
  "name": "@no-blogg/plugin-${pluginName}",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./client": {
      "types": "./dist/client/index.d.ts",
      "import": "./dist/client/index.mjs",
      "require": "./dist/client/index.js"
    },
    "./server": {
      "types": "./dist/server/index.d.ts",
      "import": "./dist/server/index.mjs",
      "require": "./dist/server/index.js"
    },
    "./shared": {
      "types": "./dist/shared/index.d.ts",
      "import": "./dist/shared/index.mjs",
      "require": "./dist/shared/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "lint": "eslint src/",
    "clean": "rm -rf dist node_modules .turbo"
  },
  "dependencies": {
    "@no-blogg/core": "workspace:*"
  },
  "devDependencies": {
    "@nestjs/common": "^10.4.17",
    "@no-blogg/eslint-config": "workspace:*",
    "@no-blogg/tsconfig": "workspace:*",
    "@types/react": "^18.3.20",
    "eslint": "^8.57.0",
    "tsup": "^8.5.0",
    "typescript": "^5.8.3"
  },
  "peerDependencies": {
    "@nestjs/common": "^10.0.0",
    "react": "^18.0.0"
  }
}
`,

    // tsconfig.json
    "tsconfig.json": `{
  "extends": "@no-blogg/tsconfig/base.json",
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2022",
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
`,

    // tsup.config.ts
    "tsup.config.ts": `import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/client/index.ts",
    "src/server/index.ts",
    "src/shared/index.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "@nestjs/common", "@nestjs/core"],
});
`,

    // .eslintrc.js
    ".eslintrc.js": `/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@no-blogg/eslint-config/react-internal.js"],
};
`,

    // src/index.ts
    "src/index.ts": `// Plugin exports
export * from "./shared";
export { ${screamingName}_PLUGIN_NAME, ${screamingName}_PLUGIN_VERSION } from "./constants";
`,

    // src/constants.ts
    "src/constants.ts": `export const ${screamingName}_PLUGIN_NAME = "${pluginName}";
export const ${screamingName}_PLUGIN_VERSION = "1.0.0";
`,

    // src/shared/index.ts
    "src/shared/index.ts": `// Shared types and DTOs for ${pascalName} plugin
export * from "./types";
export * from "./dto";
`,

    // src/shared/types.ts
    "src/shared/types.ts": `export interface ${pascalName} {
  id: string;
  tenantId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ${pascalName}Status = "ACTIVE" | "INACTIVE" | "ARCHIVED";
`,

    // src/shared/dto.ts
    "src/shared/dto.ts": `import type { ${pascalName}Status } from "./types";

export interface Create${pascalName}Dto {
  name: string;
}

export interface Update${pascalName}Dto {
  name?: string;
  status?: ${pascalName}Status;
}
`,

    // src/server/index.ts
    "src/server/index.ts": `// Server-side NestJS modules for ${pascalName} plugin
export { ${pascalName}Module } from "./${pluginName}.module";
export { ${pascalName}Controller } from "./${pluginName}.controller";
export { ${pascalName}Service } from "./${pluginName}.service";
`,

    // src/server/{pluginName}.module.ts
    [`src/server/${pluginName}.module.ts`]: `import { Module, DynamicModule } from "@nestjs/common";
import { ${pascalName}Service } from "./${pluginName}.service";
import { ${pascalName}Controller } from "./${pluginName}.controller";

@Module({})
export class ${pascalName}Module {
  static forRoot(): DynamicModule {
    return {
      module: ${pascalName}Module,
      controllers: [${pascalName}Controller],
      providers: [${pascalName}Service],
      exports: [${pascalName}Service],
    };
  }
}
`,

    // src/server/{pluginName}.service.ts
    [`src/server/${pluginName}.service.ts`]: `import type { ${pascalName} } from "../shared/types";
import type { Create${pascalName}Dto, Update${pascalName}Dto } from "../shared/dto";

export class ${pascalName}Service {
  private items: Map<string, ${pascalName}> = new Map();

  async create(tenantId: string, dto: Create${pascalName}Dto): Promise<${pascalName}> {
    const item: ${pascalName} = {
      id: this.generateId(),
      tenantId,
      name: dto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.set(item.id, item);
    return item;
  }

  async findAll(tenantId: string): Promise<${pascalName}[]> {
    return Array.from(this.items.values()).filter(
      (item) => item.tenantId === tenantId
    );
  }

  async findById(id: string): Promise<${pascalName} | undefined> {
    return this.items.get(id);
  }

  async update(id: string, dto: Update${pascalName}Dto): Promise<${pascalName} | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;

    const updated: ${pascalName} = {
      ...item,
      ...dto,
      updatedAt: new Date(),
    };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
`,

    // src/server/{pluginName}.controller.ts
    [`src/server/${pluginName}.controller.ts`]: `import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from "@nestjs/common";
import { ${pascalName}Service } from "./${pluginName}.service";
import type { Create${pascalName}Dto, Update${pascalName}Dto } from "../shared/dto";

@Controller("${pluginName}")
export class ${pascalName}Controller {
  constructor(private readonly ${camelName}Service: ${pascalName}Service) {}

  @Post()
  async create(
    @Headers("x-tenant-id") tenantId: string,
    @Body() dto: Create${pascalName}Dto
  ) {
    return this.${camelName}Service.create(tenantId, dto);
  }

  @Get()
  async findAll(@Headers("x-tenant-id") tenantId: string) {
    return this.${camelName}Service.findAll(tenantId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.${camelName}Service.findById(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: Update${pascalName}Dto
  ) {
    return this.${camelName}Service.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.${camelName}Service.delete(id);
  }
}
`,

    // src/client/index.ts
    "src/client/index.ts": `// Client-side React components for ${pascalName} plugin
export { ${pascalName}List } from "./components/${pluginName}-list";
export { ${pascalName}Form } from "./components/${pluginName}-form";
`,

    // src/client/components/{pluginName}-list.tsx
    [`src/client/components/${pluginName}-list.tsx`]: `import * as React from "react";
import type { ${pascalName} } from "../../shared/types";

export interface ${pascalName}ListProps {
  items: ${pascalName}[];
  onSelect?: (item: ${pascalName}) => void;
  className?: string;
}

export function ${pascalName}List({
  items,
  onSelect,
  className = "",
}: ${pascalName}ListProps) {
  if (items.length === 0) {
    return (
      <div className={\`text-center py-8 text-gray-500 \${className}\`}>
        No items yet
      </div>
    );
  }

  return (
    <ul className={\`divide-y divide-gray-200 \${className}\`}>
      {items.map((item) => (
        <li
          key={item.id}
          className="py-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect?.(item)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
`,

    // src/client/components/{pluginName}-form.tsx
    [`src/client/components/${pluginName}-form.tsx`]: `import * as React from "react";
import type { Create${pascalName}Dto } from "../../shared/dto";

export interface ${pascalName}FormProps {
  onSubmit: (data: Create${pascalName}Dto) => void | Promise<void>;
  loading?: boolean;
  className?: string;
}

export function ${pascalName}Form({
  onSubmit,
  loading = false,
  className = "",
}: ${pascalName}FormProps) {
  const [name, setName] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={\`space-y-4 \${className}\`}>
      <div>
        <label
          htmlFor="${pluginName}-name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="${pluginName}-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Enter name"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
`,
  };
}

/**
 * Print usage instructions
 */
function printUsage() {
  console.log(`
${colors.cyan}Plugin Generator CLI${colors.reset}

${colors.yellow}Usage:${colors.reset}
  node scripts/create-plugin.js <plugin-name>
  pnpm create:plugin <plugin-name>

${colors.yellow}Arguments:${colors.reset}
  plugin-name    Name of the plugin (kebab-case, e.g., "user-profile")

${colors.yellow}Examples:${colors.reset}
  node scripts/create-plugin.js billing
  node scripts/create-plugin.js user-profile
  node scripts/create-plugin.js analytics-dashboard
  pnpm create:plugin billing

${colors.yellow}Generated Structure:${colors.reset}
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

${colors.yellow}After creation:${colors.reset}
  1. Run \`pnpm install\` to install dependencies
  2. Import the module in apps/api/src/app.module.ts
  3. Use components in apps/web
`);
}

/**
 * Interactive mode - prompt for plugin name
 */
async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `${colors.cyan}Enter plugin name (kebab-case): ${colors.reset}`,
      (answer) => {
        rl.close();
        resolve(answer);
      }
    );
  });
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Help flag
  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  let pluginName = args[0];

  // Interactive mode if no name provided
  if (!pluginName) {
    logInfo("No plugin name provided. Entering interactive mode...\n");
    pluginName = await interactiveMode();
  }

  // Normalize the name
  pluginName = pluginName.trim().toLowerCase();

  // Validate
  const validation = validatePluginName(pluginName);
  if (!validation.valid) {
    logError(validation.error);
    process.exit(1);
  }

  // Confirm
  log(`\n📦 Creating plugin: ${colors.cyan}${pluginName}${colors.reset}`);
  log(`   Package name: ${colors.cyan}@no-blogg/plugin-${pluginName}${colors.reset}`);
  log(`   Location: ${colors.cyan}libs/plugins/${pluginName}${colors.reset}\n`);

  try {
    const pluginPath = generatePlugin(pluginName);

    log("\n" + "=".repeat(60));
    logSuccess(`Plugin "${pluginName}" created successfully!`);
    log("=".repeat(60));

    log(`\n${colors.yellow}Next steps:${colors.reset}`);
    log(`  1. Run ${colors.cyan}pnpm install${colors.reset} to install dependencies`);
    log(`  2. Import the module in ${colors.cyan}apps/api/src/app.module.ts${colors.reset}:`);
    log(`     ${colors.green}import { ${toPascalCase(pluginName)}Module } from "@no-blogg/plugin-${pluginName}/server";${colors.reset}`);
    log(`  3. Add to imports: ${colors.green}${toPascalCase(pluginName)}Module.forRoot()${colors.reset}`);
    log(`  4. Use components in ${colors.cyan}apps/web${colors.reset}:`);
    log(`     ${colors.green}import { ${toPascalCase(pluginName)}List, ${toPascalCase(pluginName)}Form } from "@no-blogg/plugin-${pluginName}/client";${colors.reset}`);
    log(`  5. Run ${colors.cyan}pnpm build${colors.reset} to build the plugin\n`);
  } catch (error) {
    logError(`Failed to create plugin: ${error.message}`);
    process.exit(1);
  }
}

main();
