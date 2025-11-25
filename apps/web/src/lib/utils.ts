import { truncate, capitalize } from '@no-blogg/utils';
import type { Post } from '@no-blogg/types';

/**
 * Formats a post for display.
 */
export function formatPostPreview(post: Post, maxLength: number = 100): string {
  return truncate(post.content, maxLength);
}

/**
 * Formats a post title.
 */
export function formatPostTitle(title: string): string {
  return capitalize(title);
}

/**
 * Gets the API URL from environment.
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}
