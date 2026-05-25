import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

/**
 * useSettings hook provides access to application settings from any component.
 *
 * The hook returns the settings context which includes:
 * - settings: Current app settings
 * - updateSettings: Function to update specific settings
 * - resetSettings: Function to reset settings to defaults
 * - isLoading: Loading state while settings are being loaded
 *
 * @throws Error if used outside of SettingsProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { settings, updateSettings } = useSettings();
 *
 *   const handleVolumeChange = (volume: number) => {
 *     updateSettings({ audio: { sfxVolume: volume } });
 *   };
 *
 *   return (
 *     <div>
 *       Current volume: {settings.audio.sfxVolume}
 *       <input
 *         type="range"
 *         value={settings.audio.sfxVolume}
 *         onChange={(e) => handleVolumeChange(Number(e.target.value))}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettings must be used within a SettingsProvider. " +
        "Wrap your component tree with <SettingsProvider> at the root.",
    );
  }
  return context;
};

export default useSettings;
