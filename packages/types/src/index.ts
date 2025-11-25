/**
 * User role enum representing the available roles in the system.
 */
export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

/**
 * Base entity interface with common fields.
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tenant represents an organization in the multi-tenant system.
 */
export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
}

/**
 * User represents a user belonging to a tenant.
 */
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: Role;
  tenantId: string;
}

/**
 * Post represents content created by users.
 */
export interface Post extends BaseEntity {
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  tenantId: string;
}

/**
 * Login request payload.
 */
export interface LoginRequest {
  email: string;
  password: string;
  tenantSlug: string;
}

/**
 * Login response payload.
 */
export interface LoginResponse {
  token: string;
  user: Omit<User, 'tenantId'> & { tenant: Tenant };
}

/**
 * API Response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
