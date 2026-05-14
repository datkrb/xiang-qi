import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from "@mui/material";
import GameBoard from "./components/Board";
import CapturedTray from "./components/CapturedTray";
import GameControls from "./components/Controls";
import MoveLog from "./components/MoveLog";
import {
  initialBoard,
  getLegalMovesFiltered,
  applyMove,
  isInCheck,
  isCheckmate,
  isStalemate,
  getAIMoveAdaptive,
  evaluateBoard,
  recordWin,
  getWinLossStats,
} from "./logic";
import { GameState, Board, Position, Move, Color, Piece } from "./types";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard(),
    currentPlayer: "red",
    selectedPosition: null,
    legalMoves: [],
    moveHistory: [],
    capturedPieces: { red: [], black: [] },
    gameStatus: "playing",
    evaluation: 0,
  });

  const [aiConfig, setAiConfig] = useState({ skill: 3, isEnabled: true });
  const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");

  // Handle square click
  const onSquareClick = useCallback(
    (r: number, c: number) => {
      if (gameState.gameStatus !== "playing") return;
      if (aiConfig.isEnabled && gameState.currentPlayer === "black") return;

      const clickedPiece = gameState.board[r][c];

      // If clicking an empty square or opponent piece
      if (!clickedPiece || clickedPiece.c !== gameState.currentPlayer) {
        // Check if it's a legal move from selected piece
        if (
          gameState.selectedPosition &&
          gameState.legalMoves.some((m) => m[0] === r && m[1] === c)
        ) {
          makeMove(gameState.selectedPosition, [r, c]);
        }
        return;
      }

      // Clicking own piece - select it
      const moves = getLegalMovesFiltered(gameState.board, r, c);
      const validMoves = moves.filter(([nr, nc]) => {
        const testBoard = applyMove(gameState.board, [r, c], [nr, nc]);
        return !isInCheck(testBoard, gameState.currentPlayer);
      });

      setGameState((prev) => ({
        ...prev,
        selectedPosition: [r, c],
        legalMoves: validMoves,
      }));
    },
    [gameState],
  );

  // Make a move
  const makeMove = useCallback(
    (from: Position, to: Position) => {
      const newBoard = applyMove(gameState.board, from, to);
      const capturedPiece = gameState.board[to[0]][to[1]];
      const newCapturedPieces = { ...gameState.capturedPieces };

      if (capturedPiece) {
        newCapturedPieces[gameState.currentPlayer].push(capturedPiece);
      }

      const nextPlayer: Color =
        gameState.currentPlayer === "red" ? "black" : "red";
      const evaluation = evaluateBoard(newBoard);

      // Check game status
      let gameStatus: GameState["gameStatus"] = "playing";
      if (isCheckmate(newBoard, nextPlayer)) {
        gameStatus = "checkmate";
        recordWin(gameState.currentPlayer);
        setGameOverMessage(
          `${gameState.currentPlayer.toUpperCase()} wins by checkmate!`,
        );
        setGameOverDialogOpen(true);
      } else if (isStalemate(newBoard, nextPlayer)) {
        gameStatus = "stalemate";
        setGameOverMessage("Draw by stalemate!");
        setGameOverDialogOpen(true);
      }

      const newMove: Move = {
        from,
        to,
        captured: capturedPiece,
      };

      setGameState((prev) => ({
        board: newBoard,
        currentPlayer: nextPlayer,
        selectedPosition: null,
        legalMoves: [],
        moveHistory: [...prev.moveHistory, newMove],
        capturedPieces: newCapturedPieces,
        gameStatus,
        evaluation,
      }));
    },
    [gameState],
  );

  // AI move
  useEffect(() => {
    if (
      gameState.currentPlayer === "black" &&
      aiConfig.isEnabled &&
      gameState.gameStatus === "playing"
    ) {
      const timer = setTimeout(() => {
        const move = getAIMoveAdaptive(
          gameState.board,
          "black",
          aiConfig.skill,
        );
        if (move) {
          makeMove(move[0], move[1]);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    gameState.currentPlayer,
    gameState.gameStatus,
    aiConfig.isEnabled,
    aiConfig.skill,
    makeMove,
    gameState.board,
  ]);

  // Reset game
  const onReset = useCallback(() => {
    setGameState({
      board: initialBoard(),
      currentPlayer: "red",
      selectedPosition: null,
      legalMoves: [],
      moveHistory: [],
      capturedPieces: { red: [], black: [] },
      gameStatus: "playing",
      evaluation: 0,
    });
    setGameOverDialogOpen(false);
  }, []);

  // Undo move
  const onUndo = useCallback(() => {
    if (gameState.moveHistory.length === 0) return;
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    let newBoard = gameState.board;
    newBoard[lastMove.from[0]][lastMove.from[1]] =
      newBoard[lastMove.to[0]][lastMove.to[1]];
    newBoard[lastMove.to[0]][lastMove.to[1]] = lastMove.captured || null;

    const newCapturedPieces = { ...gameState.capturedPieces };
    if (lastMove.captured) {
      const color = gameState.currentPlayer === "red" ? "black" : "red";
      newCapturedPieces[color] = newCapturedPieces[color].slice(0, -1);
    }

    const nextPlayer: Color =
      gameState.currentPlayer === "red" ? "black" : "red";

    setGameState((prev) => ({
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedPosition: null,
      legalMoves: [],
      moveHistory: prev.moveHistory.slice(0, -1),
      capturedPieces: newCapturedPieces,
      gameStatus: "playing",
      evaluation: evaluateBoard(newBoard),
    }));
  }, [gameState]);

  const stats = getWinLossStats();

  return (
    <Container maxWidth="lg" sx={{ padding: "24px" }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontFamily: '"Zhi Mang Xing", cursive' }}
      >
        象棋 Xiangqi
      </Typography>

      <Grid container spacing={3}>
        {/* Board */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <GameBoard
              board={gameState.board}
              selectedPosition={gameState.selectedPosition}
              legalMoves={gameState.legalMoves}
              onSquareClick={onSquareClick}
            />

            {/* Captured pieces */}
            <Box>
              <Typography variant="subtitle2">Red Captured:</Typography>
              <CapturedTray pieces={gameState.capturedPieces.red} color="red" />
            </Box>
            <Box>
              <Typography variant="subtitle2">Black Captured:</Typography>
              <CapturedTray
                pieces={gameState.capturedPieces.black}
                color="black"
              />
            </Box>
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {/* Current player */}
            <Box
              sx={{
                padding: "12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <Typography variant="subtitle2">
                Current Player:{" "}
                <strong>{gameState.currentPlayer.toUpperCase()}</strong>
              </Typography>
              <Typography variant="caption">
                Status: {gameState.gameStatus}
              </Typography>
            </Box>

            {/* Controls */}
            <GameControls
              onUndo={onUndo}
              onReset={onReset}
              onAIToggle={() =>
                setAiConfig((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))
              }
              aiEnabled={aiConfig.isEnabled}
              skill={aiConfig.skill}
              onSkillChange={(skill: number) =>
                setAiConfig((prev) => ({ ...prev, skill }))
              }
            />

            {/* Stats */}
            <Box
              sx={{
                padding: "12px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <Typography variant="subtitle2">Stats</Typography>
              <Typography variant="caption">
                Red Wins: {stats.redWins}
              </Typography>
              <br />
              <Typography variant="caption">
                Black Wins: {stats.blackWins}
              </Typography>
            </Box>

            {/* Move log */}
            <MoveLog moves={gameState.moveHistory} />
          </Stack>
        </Grid>
      </Grid>

      {/* Game over dialog */}
      <Dialog open={gameOverDialogOpen} onClose={onReset}>
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>
          <Typography>{gameOverMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onReset} variant="contained">
            Play Again
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
