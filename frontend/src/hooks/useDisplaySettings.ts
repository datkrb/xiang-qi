import { useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

/**
 * useDisplaySettings hook provides reactive updates for display settings
 * Used by components like GameBoard to respond to coordinate and highlight changes
 *
 * @example
 * ```tsx
 * function GameBoard() {
 *   const { showCoordinates, highlightMoves } = useDisplaySettings();
 *
 *   return (
 *     <div>
 *       {showCoordinates && <Coordinates />}
 *       {highlightMoves && <ValidMoveHighlight />}
 *     </div>
 *   );
 * }
 * ```
 */
export const useDisplaySettings = () => {
  const { settings } = useSettings();

  return {
    showCoordinates: settings.display.showCoordinates,
    highlightMoves: settings.display.highlightMoves,
    theme: settings.display.theme,
  };
};

/**
 * useObserveDisplaySettings hook triggers a callback when display settings change
 * Useful for components that need to perform actions when settings change
 */
export const useObserveDisplaySettings = (
  callback: (settings: {
    showCoordinates: boolean;
    highlightMoves: boolean;
  }) => void,
) => {
  const { settings } = useSettings();

  useEffect(() => {
    callback({
      showCoordinates: settings.display.showCoordinates,
      highlightMoves: settings.display.highlightMoves,
    });
  }, [
    settings.display.showCoordinates,
    settings.display.highlightMoves,
    callback,
  ]);
};

export default useDisplaySettings;
