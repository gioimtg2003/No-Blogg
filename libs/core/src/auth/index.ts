export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  tenantSlug: string;
}

export interface AuthContext {
  user: User;
  tenantId: string;
}
