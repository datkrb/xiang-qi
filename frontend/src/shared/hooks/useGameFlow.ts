import { useCallback, useState, useEffect } from "react";
import { useGame } from "@app/providers/GameProvider";

interface UserData {
  userId: string;
  username: string;
  elo: number;
}

export enum GameMode {
  MENU = "menu",
  MATCHMAKING = "matchmaking",
  ROOM = "room",
  IN_GAME = "in_game",
  GAME_OVER = "game_over",
}

export interface GameFlowReturnType {
  // State
  gameMode: GameMode;
  isSearching: boolean;
  error: string | null;
  roomId: string | null;
  gameState: any;
  opponentDisconnected: boolean;

  // Actions
  playQuickMatch: () => Promise<void>;
  playWithFriend: (isCreateRoom: boolean, roomIdToJoin?: string) => void;
  submitMove: (move: any, newFen: string) => void;
  finishGame: (winnerId: string) => void;
  returnToMenu: () => void;
}

/**
 * Custom hook for managing the complete game flow
 * Handles transitions between different game states
 * and manages socket communication
 */
export function useGameFlow(userData: UserData | null) {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MENU);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    roomId,
    gameState,
    opponentDisconnected,
    findMatch,
    createRoom,
    joinRoom,
    makeMove,
    endGame,
  } = useGame();

  // Transition to matchmaking
  const startMatchmaking = useCallback(async () => {
    if (!userData) {
      setError("User data is required");
      return;
    }

    try {
      setError(null);
      setIsSearching(true);
      setGameMode(GameMode.MATCHMAKING);

      // Randomly assign player color
      const isPlayRed = Math.random() < 0.5;
      findMatch(userData, isPlayRed);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start matchmaking",
      );
      setGameMode(GameMode.MENU);
      setIsSearching(false);
    }
  }, [userData, findMatch]);

  // Transition to game when match is found
  useEffect(() => {
    if (roomId && gameMode === GameMode.MATCHMAKING) {
      setGameMode(GameMode.IN_GAME);
      setIsSearching(false);
    }
  }, [roomId, gameMode]);

  // Transition to game over
  useEffect(() => {
    if (gameState.isGameOver && gameMode === GameMode.IN_GAME) {
      setGameMode(GameMode.GAME_OVER);
    }
  }, [gameState.isGameOver, gameMode]);

  // Handle opponent disconnection
  useEffect(() => {
    if (opponentDisconnected) {
      setError("Opponent disconnected");
    }
  }, [opponentDisconnected]);

  // Start a quick match
  const playQuickMatch = useCallback(async () => {
    await startMatchmaking();
  }, [startMatchmaking]);

  // Play with a friend
  const playWithFriend = useCallback(
    (isCreateRoom: boolean, roomIdToJoin?: string) => {
      if (!userData) {
        setError("User data is required");
        return;
      }

      try {
        setError(null);
        setGameMode(GameMode.ROOM);

        if (isCreateRoom) {
          const isPlayRed = Math.random() < 0.5;
          createRoom(userData, isPlayRed);
        } else if (roomIdToJoin) {
          joinRoom(roomIdToJoin, userData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to setup room");
        setGameMode(GameMode.MENU);
      }
    },
    [userData, createRoom, joinRoom],
  );

  // Make a move in the game
  const submitMove = useCallback(
    (move: any, newFen: string) => {
      try {
        makeMove(move, newFen);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to make move");
      }
    },
    [makeMove],
  );

  // End the game
  const finishGame = useCallback(
    (winnerId: string) => {
      try {
        endGame(winnerId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to end game");
      }
    },
    [endGame],
  );

  // Return to menu
  const returnToMenu = useCallback(() => {
    setGameMode(GameMode.MENU);
    setIsSearching(false);
    setError(null);
  }, []);

  return {
    // State
    gameMode,
    isSearching,
    error,
    roomId,
    gameState,
    opponentDisconnected,

    // Actions
    playQuickMatch,
    playWithFriend,
    submitMove,
    finishGame,
    returnToMenu,
  };
}
