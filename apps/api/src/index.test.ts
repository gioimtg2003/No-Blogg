import { describe, it, expect } from 'vitest';
import { Role } from '@no-blogg/types';
import { getServerConfig, createTenantSlug, isAdmin, canEdit } from './index';

describe('API', () => {
  describe('getServerConfig', () => {
    it('should return default port 3001', () => {
      const config = getServerConfig();
      expect(config.port).toBe(3001);
    });

    it('should return nodeEnv from environment', () => {
      const config = getServerConfig();
      // During tests, NODE_ENV is typically 'test'
      expect(config.nodeEnv).toBe(process.env.NODE_ENV || 'development');
    });
  });

  describe('createTenantSlug', () => {
    it('should create valid slug from tenant name', () => {
      expect(createTenantSlug('Acme Corp')).toBe('acme-corp');
    });

    it('should handle special characters', () => {
      expect(createTenantSlug('My Company, Inc.')).toBe('my-company-inc');
    });
  });

  describe('isAdmin', () => {
    it('should return true for ADMIN role', () => {
      expect(isAdmin(Role.ADMIN)).toBe(true);
    });

    it('should return false for EDITOR role', () => {
      expect(isAdmin(Role.EDITOR)).toBe(false);
    });

    it('should return false for VIEWER role', () => {
      expect(isAdmin(Role.VIEWER)).toBe(false);
    });
  });

  describe('canEdit', () => {
    it('should return true for ADMIN role', () => {
      expect(canEdit(Role.ADMIN)).toBe(true);
    });

    it('should return true for EDITOR role', () => {
      expect(canEdit(Role.EDITOR)).toBe(true);
    });

    it('should return false for VIEWER role', () => {
      expect(canEdit(Role.VIEWER)).toBe(false);
    });
  });
});
