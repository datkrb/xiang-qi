/**
 * Environment Configuration
 *
 * Centralized configuration for environment variables and settings.
 * Supports multiple environments through Vite's import.meta.env
 */

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "http://localhost:8080";

export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT
  ? parseInt(import.meta.env.VITE_API_TIMEOUT)
  : 30000; // 30 seconds default

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Xiangqi";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "0.0.1";

// Feature Flags
export const ENABLE_ANALYTICS =
  import.meta.env.VITE_ENABLE_ANALYTICS === "true";
export const ENABLE_DEV_TOOLS = import.meta.env.DEV;
export const ENABLE_I18N = import.meta.env.VITE_ENABLE_I18N === "true";

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  SETTINGS: "app-settings",
  THEME: "app-theme",
  LANGUAGE: "app-language",
  GUEST_SESSION: "guest-session",
} as const;

// Session Configuration
export const SESSION_CONFIG = {
  TOKEN_REFRESH_THRESHOLD: 60000, // Refresh token 1 minute before expiry
  SESSION_CHECK_INTERVAL: 300000, // Check session validity every 5 minutes
} as const;

// Validation Configuration
export const VALIDATION_CONFIG = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
} as const;
