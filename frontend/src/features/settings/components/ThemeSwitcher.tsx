import React, { useRef, useState } from "react";
import { useTheme } from "@shared/theme/ThemeProvider";

type Theme = "blue" | "dark" | "light";

interface ThemeOption {
  id: Theme;
  label: string;
  description: string;
  preview: {
    background: string;
    accent: string;
  };
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "blue",
    label: "Blue",
    description: "Cool deep blue with cyan accents",
    preview: {
      background: "#0f172a",
      accent: "#0ea5e9",
    },
  },
  {
    id: "dark",
    label: "Dark",
    description: "Ultra-dark theme for low-light environments",
    preview: {
      background: "#0a0e27",
      accent: "#38bdf8",
    },
  },
  {
    id: "light",
    label: "Light",
    description: "Bright theme for daytime use",
    preview: {
      background: "#f8fafc",
      accent: "#2563eb",
    },
  },
];

// Task 4.1: Create ThemeSwitcher component with preview UI
export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Task 4.5: Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, themeId: Theme) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setTheme(themeId);
    }
  };

  return (
    // Task 4.6: Add accessible labels and ARIA attributes
    <div
      ref={containerRef}
      className="theme-switcher-container"
      aria-label="Theme selector"
      role="group"
    >
      <div className="flex flex-col gap-4">
        {/* Task 4.2: Implement theme option selection with visual indicators */}
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => (
            <div key={option.id} className="relative">
              {/* Task 4.3 & 4.4: Add hover/focus theme preview with visual indicator */}
              <button
                onClick={() => setTheme(option.id)}
                onKeyDown={(e) => handleKeyDown(e, option.id)}
                onMouseEnter={() => setPreviewTheme(option.id)}
                onMouseLeave={() => setPreviewTheme(null)}
                onFocus={() => setPreviewTheme(option.id)}
                onBlur={() => setPreviewTheme(null)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === option.id
                    ? "border-2 border-cyan-400 shadow-lg shadow-cyan-500/50"
                    : "border-gray-600 hover:border-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400`}
                aria-label={`${option.label} theme`}
                aria-pressed={theme === option.id}
                aria-describedby={`theme-desc-${option.id}`}
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Task 4.4: Implement theme preview/icon */}
                  <div
                    className="w-12 h-12 rounded-full border border-gray-400"
                    style={{
                      background: `linear-gradient(135deg, ${option.preview.background} 0%, ${option.preview.accent} 100%)`,
                    }}
                    role="img"
                    aria-label={`${option.label} theme preview`}
                  />
                  <div className="text-sm font-semibold">{option.label}</div>

                  {/* Show selected indicator */}
                  {theme === option.id && (
                    <div className="text-xs text-cyan-400 font-medium">
                      ✓ Active
                    </div>
                  )}
                </div>
              </button>

              {/* Hidden description for screen readers */}
              <span id={`theme-desc-${option.id}`} className="sr-only">
                {option.description}
              </span>
            </div>
          ))}
        </div>

        {/* Show preview info on hover/focus */}
        {previewTheme && previewTheme !== theme && (
          <div className="text-xs text-gray-400 text-center transition-opacity duration-200">
            {THEME_OPTIONS.find((o) => o.id === previewTheme)?.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
