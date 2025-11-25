export interface Tenant {
  id: string;
  name: string;
  slug: string;
  settings: TenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  theme?: TenantTheme;
  features?: TenantFeatures;
}

export interface TenantTheme {
  primaryColor?: string;
  logo?: string;
}

export interface TenantFeatures {
  newsletter?: boolean;
  analytics?: boolean;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  settings?: TenantSettings;
}

export interface UpdateTenantRequest {
  name?: string;
  settings?: TenantSettings;
}
