/**
 * Settings type definitions for the application.
 * Defines the structure of all user settings including audio, display, language, and notifications.
 */

export type Language = "vi" | "en" | "zh";
export type Theme = "blue" | "dark" | "light";

/**
 * Audio settings for controlling sound and music playback
 */
export interface AudioSettings {
  soundEnabled: boolean;
  sfxVolume: number; // 0-100
  musicEnabled: boolean;
  musicVolume: number; // 0-100
}

/**
 * Display settings for game board appearance and behavior
 */
export interface DisplaySettings {
  showCoordinates: boolean;
  highlightMoves: boolean;
  theme: Theme;
}

/**
 * Language and localization settings
 */
export interface LanguageSettings {
  language: Language;
}

/**
 * Notification preferences for game events and messages
 */
export interface NotificationSettings {
  notificationsEnabled: boolean;
  gameInvitations: boolean;
  messages: boolean;
}

/**
 * Complete settings object combining all categories
 */
export interface AppSettings {
  audio: AudioSettings;
  display: DisplaySettings;
  language: LanguageSettings;
  notifications: NotificationSettings;
  // Account-specific settings managed separately
}

/**
 * Settings update payload (partial updates allowed)
 */
export type SettingsUpdate = Partial<AppSettings>;

/**
 * API response type for settings endpoints
 */
export interface SettingsResponse {
  success: boolean;
  data?: AppSettings;
  error?: string;
}
