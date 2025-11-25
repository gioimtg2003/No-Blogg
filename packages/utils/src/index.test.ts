import { describe, it, expect } from 'vitest';
import { slugify, formatDate, truncate, isValidEmail, capitalize } from './index';

describe('Utils', () => {
  describe('slugify', () => {
    it('should convert text to lowercase slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello! World?')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });

    it('should trim leading and trailing dashes', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('truncate', () => {
    it('should return original text if shorter than max length', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate text with ellipsis', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email without @', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('should return false for invalid email without domain', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should return false for invalid email with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should preserve rest of string', () => {
      expect(capitalize('hELLO')).toBe('HELLO');
    });
  });
});
