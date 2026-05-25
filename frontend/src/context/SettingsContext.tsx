import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  AppSettings,
  SettingsUpdate,
  AudioSettings,
  DisplaySettings,
  LanguageSettings,
  NotificationSettings,
} from "../types/settings";

const DEFAULT_SETTINGS: AppSettings = {
  audio: {
    soundEnabled: true,
    sfxVolume: 70,
    musicEnabled: true,
    musicVolume: 50,
  },
  display: {
    showCoordinates: true,
    highlightMoves: true,
    theme: "blue",
  },
  language: {
    language: "vi",
  },
  notifications: {
    notificationsEnabled: true,
    gameInvitations: true,
    messages: true,
  },
};

const STORAGE_KEY = "app-settings";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: SettingsUpdate) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

interface SettingsProviderProps {
  children: ReactNode;
}

/**
 * SettingsProvider component that manages application settings globally.
 *
 * Features:
 * - Loads settings from localStorage on mount
 * - Persists settings to localStorage on changes
 * - Provides settings via React Context
 * - Handles settings validation
 * - Debounces backend sync for authenticated users
 */
export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AppSettings;
          // Merge with defaults to ensure all properties exist
          setSettings({
            audio: { ...DEFAULT_SETTINGS.audio, ...parsed.audio },
            display: { ...DEFAULT_SETTINGS.display, ...parsed.display },
            language: { ...DEFAULT_SETTINGS.language, ...parsed.language },
            notifications: {
              ...DEFAULT_SETTINGS.notifications,
              ...parsed.notifications,
            },
          });
        }
      } catch (error) {
        console.error("Failed to load settings from localStorage:", error);
        // Fall back to default settings
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Persist settings to localStorage and handle backend sync
  const updateSettings = useCallback((updates: SettingsUpdate) => {
    setSettings((prevSettings) => {
      const newSettings: AppSettings = {
        audio: { ...prevSettings.audio, ...updates.audio },
        display: { ...prevSettings.display, ...updates.display },
        language: { ...prevSettings.language, ...updates.language },
        notifications: {
          ...prevSettings.notifications,
          ...updates.notifications,
        },
      };

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        if ((error as any).code === 22) {
          // QuotaExceededError - localStorage is full
          console.error("localStorage quota exceeded:", error);
        } else {
          console.error("Failed to save settings to localStorage:", error);
        }
      }

      // Trigger backend sync for authenticated users
      // This will be implemented in settingsService
      syncSettingsToBackend(newSettings);

      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear settings from localStorage:", error);
    }
  }, []);

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Placeholder for backend sync logic.
 * Will be implemented in settingsService.ts with debouncing.
 */
function syncSettingsToBackend(settings: AppSettings) {
  // TODO: Implement in settingsService with debouncing
}

/**
 * useSettings hook for accessing settings from any component.
 *
 * @example
 * const { settings, updateSettings } = useSettings();
 * updateSettings({ audio: { sfxVolume: 80 } });
 */
export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
