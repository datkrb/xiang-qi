import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "blue" | "dark" | "light";

const VALID_THEMES: Theme[] = ["blue", "dark", "light"];
const STORAGE_KEY = "app-theme";
const DEFAULT_THEME: Theme = "blue";

/**
 * ThemeContext - Provides theme state and setter to components
 *
 * Contains:
 * - theme: Current active theme
 * - setTheme: Function to change theme
 */
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: DEFAULT_THEME, setTheme: () => {} });

/**
 * ThemeProvider component - manages application theme state and persistence
 *
 * Features:
 * - Reads/writes theme preference to localStorage
 * - Provides useTheme() hook for consuming components
 * - Applies theme via CSS classes for CSS variable cascading
 * - Validates theme names and handles errors gracefully
 *
 * Usage:
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read theme from localStorage on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      if (storedTheme && VALID_THEMES.includes(storedTheme as Theme)) {
        setThemeState(storedTheme as Theme);
      } else {
        // No valid stored theme, use default
        localStorage.setItem(STORAGE_KEY, DEFAULT_THEME);
      }
    } catch (error) {
      console.warn("Failed to read theme from localStorage:", error);
      // Fall back to default theme
    }
    setIsHydrated(true);
  }, []);

  /**
   * Change the active theme
   *
   * @param newTheme - Theme name ("blue", "dark", or "light")
   *
   * Example usage:
   * ```tsx
   * const { setTheme } = useTheme();
   * setTheme("dark");
   * ```
   */
  const setTheme = (newTheme: Theme) => {
    // Validate theme name before applying
    if (!VALID_THEMES.includes(newTheme)) {
      console.warn(
        `Invalid theme: ${newTheme}. Valid themes are: ${VALID_THEMES.join(", ")}`,
      );
      return;
    }

    setThemeState(newTheme);

    // Save to localStorage with error handling
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // QuotaExceededError - localStorage is full
        console.error(
          "localStorage quota exceeded. Theme applied for this session only.",
          error,
        );
        // Show non-blocking notification to user (UI will be handled in component)
      } else {
        console.error("Failed to save theme to localStorage:", error);
      }
    }

    // Update document class for CSS variable cascade
    const root = document.documentElement;
    VALID_THEMES.forEach((t) => {
      root.classList.remove(`theme-${t}`);
    });
    root.classList.add(`theme-${newTheme}`);
  };

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    if (!isHydrated) return;

    const root = document.documentElement;
    VALID_THEMES.forEach((t) => {
      root.classList.remove(`theme-${t}`);
    });
    root.classList.add(`theme-${theme}`);
  }, [theme, isHydrated]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme state and setter from any component
 *
 * Returns:
 * - theme: Current active theme ("blue", "dark", or "light")
 * - setTheme: Function to change the theme
 *
 * Example usage:
 * ```tsx
 * const { theme, setTheme } = useTheme();
 * console.log(theme); // "blue"
 * setTheme("dark");
 * ```
 *
 * Building Theme-Aware Components:
 * ================================
 *
 * **Preferred Approach: Use CSS Variables**
 * CSS variables automatically cascade when the theme changes. No component code needed.
 *
 * Example:
 * ```tsx
 * // In index.css
 * .my-component {
 *   background: var(--color-surface);
 *   color: var(--color-text-main);
 *   transition: 0.3s ease;
 * }
 *
 * // Component - no theme logic needed!
 * export const MyComponent = () => (
 *   <div className="my-component">Content</div>
 * );
 * ```
 *
 * **Theme Color Palette - All Three Themes Include:**
 * - --color-background: Main background color
 * - --color-surface: Opaque surface for panels
 * - --color-surface-opaque: Solid surface (no transparency)
 * - --color-surface-hover: Hover state for surfaces
 * - --color-primary: Primary action color
 * - --color-primary-hover: Hover state for primary
 * - --color-primary-foreground: Text on primary
 * - --color-accent: Accent/secondary color
 * - --color-accent-hover: Hover state for accent
 * - --color-border: Border color
 * - --color-text-main: Primary text color
 * - --color-text-muted: Secondary/disabled text
 * - --color-success: Success state color
 * - --color-danger: Error/danger color
 * - --bg-image: Background image URL for theme
 *
 * **Advanced: Using useTheme Hook**
 * Only use when CSS variables don't fit the use case.
 *
 * Example:
 * ```tsx
 * const { theme } = useTheme();
 *
 * // Conditional rendering based on theme
 * const icon = theme === 'light'
 *   ? <SunIcon />
 *   : <MoonIcon />;
 * ```
 */
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
