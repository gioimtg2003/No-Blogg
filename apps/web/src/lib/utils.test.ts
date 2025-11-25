import { describe, it, expect } from 'vitest';
import type { Post } from '@no-blogg/types';
import { formatPostPreview, formatPostTitle, getApiUrl } from './utils';

describe('Web Utils', () => {
  describe('formatPostPreview', () => {
    const mockPost: Post = {
      id: '1',
      title: 'Test Post',
      content: 'This is a test post with some content that should be truncated when it exceeds the maximum length.',
      published: true,
      authorId: 'author1',
      tenantId: 'tenant1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should truncate long content', () => {
      const preview = formatPostPreview(mockPost, 20);
      expect(preview).toBe('This is a test po...');
    });

    it('should not truncate short content', () => {
      const shortPost: Post = {
        ...mockPost,
        content: 'Short',
      };
      const preview = formatPostPreview(shortPost, 100);
      expect(preview).toBe('Short');
    });
  });

  describe('formatPostTitle', () => {
    it('should capitalize title', () => {
      expect(formatPostTitle('hello world')).toBe('Hello world');
    });

    it('should handle empty string', () => {
      expect(formatPostTitle('')).toBe('');
    });
  });

  describe('getApiUrl', () => {
    it('should return default API URL', () => {
      expect(getApiUrl()).toBe('http://localhost:3001');
    });
  });
});
