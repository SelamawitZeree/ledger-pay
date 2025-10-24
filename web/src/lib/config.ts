// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090',
  timeout: 10000,
  retryAttempts: 3
};

// Auth Configuration
export const AUTH_CONFIG = {
  tokenKey: 'lp_token',
  tenantKey: 'lp_tenantId',
  roleKey: 'lp_role',
  usernameKey: 'lp_username',
  loginTimeKey: 'lp_loginTime'
};

// Application Configuration
export const APP_CONFIG = {
  name: 'LedgerPay',
  version: '1.0.0',
  environment: process.env.NEXT_PUBLIC_APP_ENV || 'development'
};