import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { GameState, Position } from "../types";
import { initialBoard } from "../logic";

interface GameContextType {
  gameState: GameState;
  selectedSquare: Position | null;
  setSelectedSquare: (pos: Position | null) => void;
  handleSquareClick: (position: Position) => void;
  handleReset: () => void;
  handleUndo: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard(),
    currentPlayer: "red",
    selectedSquare: null,
    legalMoves: [],
    moveHistory: [],
    capturedPieces: {
      red: [],
      black: [],
    },
    isGameOver: false,
    winner: null,
  });

  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);

  const handleSquareClick = useCallback((position: Position) => {
    setSelectedSquare(position);
    // TODO: Implement move validation and application
  }, []);

  const handleReset = useCallback(() => {
    setGameState({
      board: initialBoard(),
      currentPlayer: "red",
      selectedSquare: null,
      legalMoves: [],
      moveHistory: [],
      capturedPieces: {
        red: [],
        black: [],
      },
      isGameOver: false,
      winner: null,
    });
    setSelectedSquare(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (gameState.moveHistory.length > 0) {
      // TODO: Implement undo logic
      console.log("Undo move");
    }
  }, [gameState.moveHistory]);

  const value: GameContextType = {
    gameState,
    selectedSquare,
    setSelectedSquare,
    handleSquareClick,
    handleReset,
    handleUndo,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}
