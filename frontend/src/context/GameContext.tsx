import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { GameState, Position } from "../types";
import { initialBoard } from "../logic";
import { useSocket } from "../hooks/useSocket";

interface GameContextType {
  gameState: GameState;
  selectedSquare: Position | null;
  setSelectedSquare: (pos: Position | null) => void;
  handleSquareClick: (position: Position) => void;
  handleReset: () => void;
  handleUndo: () => void;
  // Socket-related
  roomId: string | null;
  playerColor: "red" | "black" | null; // The color assigned to this player
  currentFen: string; // Synchronized FEN from server
  findMatch: (userData: any, isPlayRed: boolean) => void;
  createRoom: (userData: any, isPlayRed: boolean | "random") => void;
  joinRoom: (roomId: string, userData: any) => void;
  makeMove: (move: any, newFen: string) => void;
  endGame: (winnerId: string) => void;
  opponentDisconnected: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_FEN =
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1";

export function GameProvider({ children }: { children: ReactNode }) {
  const { emit, on, off, socketId } = useSocket();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<"red" | "black" | null>(null);
  const [currentFen, setCurrentFen] = useState<string>(INITIAL_FEN);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

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

  // Socket event listeners
  useEffect(() => {
    const handleMatchFound = (roomData: any) => {
      console.log("Match found:", roomData);
      setRoomId(roomData.roomId);
      setCurrentFen(roomData.fen || INITIAL_FEN);

      // Determine which color this player is
      const isThisPlayerRed = roomData.playerRed?.socketId === socketId;
      const assignedColor = isThisPlayerRed ? "red" : "black";
      setPlayerColor(assignedColor);
      console.log(`Player assigned color: ${assignedColor}`);

      setGameState((prev) => ({
        ...prev,
        board: initialBoard(),
        currentPlayer: "red",
      }));
    };

    const handleRoomCreated = (data: any) => {
      console.log("Room created:", data.roomId);
      setRoomId(data.roomId);
      // Player color will be set when opponent joins
    };

    const handlePlayerJoined = (roomData: any) => {
      console.log("Player joined:", roomData);
      setRoomId(roomData.roomId);
      setCurrentFen(roomData.fen || INITIAL_FEN);

      // Determine which color this player is
      const isThisPlayerRed = roomData.playerRed?.socketId === socketId;
      const assignedColor = isThisPlayerRed ? "red" : "black";
      setPlayerColor(assignedColor);
      console.log(`Player assigned color: ${assignedColor}`);
    };

    const handleMoveMade = (data: any) => {
      console.log("Opponent move received:", data);
      // Apply the opponent's move - update FEN to reflect the new board position
      setCurrentFen(data.newFen);
      setGameState((prev) => ({
        ...prev,
        currentPlayer: prev.currentPlayer === "red" ? "black" : "red",
      }));
    };

    const handleGameOver = (data: any) => {
      console.log("Game over - Winner:", data.winnerId);
      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
        winner: data.winnerId === "red" ? "red" : "black",
      }));
    };

    const handleOpponentDisconnected = () => {
      console.log("Opponent disconnected");
      setOpponentDisconnected(true);
    };

    const handleError = (data: any) => {
      console.error("Socket error:", data.message);
    };

    on("match_found", handleMatchFound);
    on("room_created", handleRoomCreated);
    on("player_joined", handlePlayerJoined);
    on("move_made", handleMoveMade);
    on("game_over", handleGameOver);
    on("opponent_disconnected", handleOpponentDisconnected);
    on("error", handleError);

    return () => {
      off("match_found", handleMatchFound);
      off("room_created", handleRoomCreated);
      off("player_joined", handlePlayerJoined);
      off("move_made", handleMoveMade);
      off("game_over", handleGameOver);
      off("opponent_disconnected", handleOpponentDisconnected);
      off("error", handleError);
    };
  }, [on, off, socketId]);

  const findMatch = useCallback(
    (userData: any, isPlayRed: boolean) => {
      emit("find_match", userData, isPlayRed);
    },
    [emit],
  );

  const createRoom = useCallback(
    (userData: any, isPlayRed: boolean | "random") => {
      emit("create_room", userData, isPlayRed);
    },
    [emit],
  );

  const joinRoom = useCallback(
    (roomIdToJoin: string, userData: any) => {
      emit("join_room", { roomId: roomIdToJoin, userData });
    },
    [emit],
  );

  const makeMove = useCallback(
    (move: any, newFen: string) => {
      if (roomId) {
        emit("make_move", { roomId, move, newFen });
      }
    },
    [roomId, emit],
  );

  const endGame = useCallback(
    (winnerId: string) => {
      if (roomId) {
        emit("game_over", { roomId, winnerId });
      }
    },
    [roomId, emit],
  );

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
    setRoomId(null);
    setOpponentDisconnected(false);
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
    roomId,
    playerColor,
    currentFen,
    findMatch,
    createRoom,
    joinRoom,
    makeMove,
    endGame,
    opponentDisconnected,
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
