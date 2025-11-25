import { slugify } from '@no-blogg/utils';
import { Role } from '@no-blogg/types';

/**
 * Simple API server entry point placeholder.
 * This demonstrates the integration of shared packages.
 */
export function getServerConfig() {
  return {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

/**
 * Creates a tenant slug from a name.
 */
export function createTenantSlug(name: string): string {
  return slugify(name);
}

/**
 * Checks if a role has admin privileges.
 */
export function isAdmin(role: Role): boolean {
  return role === Role.ADMIN;
}

/**
 * Checks if a role can edit content.
 */
export function canEdit(role: Role): boolean {
  return role === Role.ADMIN || role === Role.EDITOR;
}

// Only run if this is the main module
if (require.main === module) {
  const config = getServerConfig();
  console.log(`API Server starting on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
}
