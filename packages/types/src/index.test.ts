import { describe, it, expect } from 'vitest';
import { Role } from './index';

describe('Types', () => {
  describe('Role enum', () => {
    it('should have ADMIN role', () => {
      expect(Role.ADMIN).toBe('ADMIN');
    });

    it('should have EDITOR role', () => {
      expect(Role.EDITOR).toBe('EDITOR');
    });

    it('should have VIEWER role', () => {
      expect(Role.VIEWER).toBe('VIEWER');
    });

    it('should have exactly 3 roles', () => {
      const roles = Object.values(Role);
      expect(roles).toHaveLength(3);
    });
  });
});
