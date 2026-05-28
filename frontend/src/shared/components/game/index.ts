// Game-specific UI Components - Xiangqi board, pieces, game UI
// To be populated with game component exports during migration
// Example:
// export { XiangqiBoard } from './xiangqi/XiangqiBoard';
// export { MoveHistory } from './MoveHistory';
// export { PlayerCard } from './PlayerCard';

// Game-specific UI Components - Xiangqi board, pieces, game UI
// Re-export selected components from the legacy `components/` folder
export { default as XiangqiBoard } from "./XiangqiBoard";
export { GameBoard } from "./GameBoard";
export { MoveHistory } from "./MoveHistory";
export * from "@shared/components/game/PlayerCard";
export { PlayerInfoCard } from "@shared/components/game/PlayerInfoCard";
export * from "./xiangqi/types";
