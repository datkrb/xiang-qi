import { AppSettings, SettingsResponse } from "@shared/types/settings";

const STORAGE_KEY = "app-settings";
const DEBOUNCE_DELAY = 1000; // 1 second
let syncTimeout: NodeJS.Timeout | null = null;

/**
 * SettingsService handles loading, saving, and syncing settings
 * with both localStorage and backend API.
 */
class SettingsService {
  /**
   * Load settings from localStorage
   */
  static loadFromStorage(): AppSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
      return null;
    }
  }

  /**
   * Save settings to localStorage
   */
  static saveToStorage(settings: AppSettings): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      if ((error as any).code === 22) {
        // QuotaExceededError
        console.error("localStorage quota exceeded. Settings not saved.");
      } else {
        console.error("Failed to save settings to localStorage:", error);
      }
      return false;
    }
  }

  /**
   * Check if user is authenticated by looking for auth token
   */
  static isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem("authToken");
      return !!token;
    } catch {
      return false;
    }
  }

  /**
   * Sync settings to backend with debouncing
   * Only syncs for authenticated users
   */
  static debouncedSyncToBackend(settings: AppSettings): void {
    // Clear existing timeout
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    // Only sync if authenticated
    if (!this.isAuthenticated()) {
      return;
    }

    // Set new timeout
    syncTimeout = setTimeout(() => {
      this.syncToBackend(settings);
    }, DEBOUNCE_DELAY);
  }

  /**
   * Sync settings to backend API
   */
  private static async syncToBackend(settings: AppSettings): Promise<void> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return; // Not authenticated
      }

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to sync settings to backend:", error);
      }
    } catch (error) {
      console.error("Error syncing settings to backend:", error);
    }
  }

  /**
   * Fetch settings from backend API
   */
  static async fetchFromBackend(): Promise<AppSettings | null> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null; // Not authenticated
      }

      const response = await fetch("/api/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch settings from backend");
        return null;
      }

      const data: SettingsResponse = await response.json();
      return data.data || null;
    } catch (error) {
      console.error("Error fetching settings from backend:", error);
      return null;
    }
  }

  /**
   * Change user password (account management)
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        error: data.error,
      };
    } catch (error) {
      console.error("Error changing password:", error);
      return { success: false, error: "Network error" };
    }
  }

  /**
   * Export user data as JSON
   */
  static async exportUserData(): Promise<{
    success: boolean;
    data?: string;
    error?: string;
  }> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      const response = await fetch("/api/users/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      const data = await response.text();
      return { success: true, data };
    } catch (error) {
      console.error("Error exporting user data:", error);
      return { success: false, error: "Network error" };
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return {
        success: response.ok,
        error: data.error,
      };
    } catch (error) {
      console.error("Error deleting account:", error);
      return { success: false, error: "Network error" };
    }
  }

  /**
   * Listen for storage changes from other tabs
   */
  static onStorageChange(
    callback: (settings: AppSettings | null) => void,
  ): () => void {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const settings = event.newValue ? JSON.parse(event.newValue) : null;
        callback(settings);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Return unsubscribe function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }
}

export default SettingsService;
