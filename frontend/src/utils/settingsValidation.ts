import { Language, Theme } from "../types/settings";

const VALID_LANGUAGES: Language[] = ["vi", "en", "zh"];
const VALID_THEMES: Theme[] = ["blue", "dark", "light"];
const MIN_PASSWORD_LENGTH = 8;
const VOLUME_MIN = 0;
const VOLUME_MAX = 100;

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a single volume value (0-100 range)
 */
export const validateVolume = (volume: number): ValidationResult => {
  const errors: string[] = [];

  if (typeof volume !== "number") {
    errors.push("Volume must be a number");
  } else if (volume < VOLUME_MIN || volume > VOLUME_MAX) {
    errors.push(`Volume must be between ${VOLUME_MIN} and ${VOLUME_MAX}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates language selection
 */
export const validateLanguage = (language: any): ValidationResult => {
  const errors: string[] = [];

  if (!language || typeof language !== "string") {
    errors.push("Language must be a string");
  } else if (!VALID_LANGUAGES.includes(language as Language)) {
    errors.push(`Language must be one of: ${VALID_LANGUAGES.join(", ")}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates theme selection
 */
export const validateTheme = (theme: any): ValidationResult => {
  const errors: string[] = [];

  if (!theme || typeof theme !== "string") {
    errors.push("Theme must be a string");
  } else if (!VALID_THEMES.includes(theme as Theme)) {
    errors.push(`Theme must be one of: ${VALID_THEMES.join(", ")}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates boolean toggle values
 */
export const validateBoolean = (
  value: any,
  fieldName: string,
): ValidationResult => {
  const errors: string[] = [];

  if (typeof value !== "boolean") {
    errors.push(`${fieldName} must be a boolean value`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates password complexity requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password || typeof password !== "string") {
    errors.push("Password must be a non-empty string");
    return { valid: false, errors };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates that two passwords match
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  const errors: string[] = [];

  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates complete audio settings
 */
export const validateAudioSettings = (audio: any): ValidationResult => {
  const errors: string[] = [];

  if (!audio || typeof audio !== "object") {
    errors.push("Audio settings must be an object");
    return { valid: false, errors };
  }

  // Validate sound enabled
  const soundEnabledValidation = validateBoolean(
    audio.soundEnabled,
    "soundEnabled",
  );
  errors.push(...soundEnabledValidation.errors);

  // Validate SFX volume
  const sfxVolumeValidation = validateVolume(audio.sfxVolume);
  if (!sfxVolumeValidation.valid) {
    errors.push("sfxVolume: " + sfxVolumeValidation.errors.join(", "));
  }

  // Validate music enabled
  const musicEnabledValidation = validateBoolean(
    audio.musicEnabled,
    "musicEnabled",
  );
  errors.push(...musicEnabledValidation.errors);

  // Validate music volume
  const musicVolumeValidation = validateVolume(audio.musicVolume);
  if (!musicVolumeValidation.valid) {
    errors.push("musicVolume: " + musicVolumeValidation.errors.join(", "));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates complete display settings
 */
export const validateDisplaySettings = (display: any): ValidationResult => {
  const errors: string[] = [];

  if (!display || typeof display !== "object") {
    errors.push("Display settings must be an object");
    return { valid: false, errors };
  }

  const showCoordinatesValidation = validateBoolean(
    display.showCoordinates,
    "showCoordinates",
  );
  errors.push(...showCoordinatesValidation.errors);

  const highlightMovesValidation = validateBoolean(
    display.highlightMoves,
    "highlightMoves",
  );
  errors.push(...highlightMovesValidation.errors);

  const themeValidation = validateTheme(display.theme);
  if (!themeValidation.valid) {
    errors.push("theme: " + themeValidation.errors.join(", "));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates complete notification settings
 */
export const validateNotificationSettings = (
  notifications: any,
): ValidationResult => {
  const errors: string[] = [];

  if (!notifications || typeof notifications !== "object") {
    errors.push("Notification settings must be an object");
    return { valid: false, errors };
  }

  const notificationsEnabledValidation = validateBoolean(
    notifications.notificationsEnabled,
    "notificationsEnabled",
  );
  errors.push(...notificationsEnabledValidation.errors);

  const gameInvitationsValidation = validateBoolean(
    notifications.gameInvitations,
    "gameInvitations",
  );
  errors.push(...gameInvitationsValidation.errors);

  const messagesValidation = validateBoolean(
    notifications.messages,
    "messages",
  );
  errors.push(...messagesValidation.errors);

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates complete settings object
 */
export const validateAppSettings = (settings: any): ValidationResult => {
  const errors: string[] = [];

  if (!settings || typeof settings !== "object") {
    errors.push("Settings must be an object");
    return { valid: false, errors };
  }

  // Validate each section
  const audioValidation = validateAudioSettings(settings.audio);
  if (!audioValidation.valid) {
    errors.push("audio: " + audioValidation.errors.join(", "));
  }

  const displayValidation = validateDisplaySettings(settings.display);
  if (!displayValidation.valid) {
    errors.push("display: " + displayValidation.errors.join(", "));
  }

  const languageValidation = validateLanguage(settings.language?.language);
  if (!languageValidation.valid) {
    errors.push("language: " + languageValidation.errors.join(", "));
  }

  const notificationValidation = validateNotificationSettings(
    settings.notifications,
  );
  if (!notificationValidation.valid) {
    errors.push("notifications: " + notificationValidation.errors.join(", "));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
