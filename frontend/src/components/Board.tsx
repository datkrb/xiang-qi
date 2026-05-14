import React from "react";
import { Box } from "@mui/material";
import { Board, Position, Color } from "../types";
import { CHINESE_CHARS } from "./constants";

interface BoardProps {
  board: Board;
  selectedPosition: Position | null;
  legalMoves: Position[];
  onSquareClick: (r: number, c: number) => void;
}

const GameBoard: React.FC<BoardProps> = ({
  board,
  selectedPosition,
  legalMoves,
  onSquareClick,
}) => {
  return (
    <Box
      sx={{
        display: "inline-block",
        border: "2px solid #8B4513",
        backgroundColor: "#DEB887",
        padding: "8px",
        borderRadius: "4px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
      }}
    >
      {board.map((row, r) => (
        <Box key={`row-${r}`} sx={{ display: "flex" }}>
          {row.map((piece, c) => {
            const isSelected =
              selectedPosition &&
              selectedPosition[0] === r &&
              selectedPosition[1] === c;
            const isLegalMove = legalMoves.some(
              (m) => m[0] === r && m[1] === c,
            );
            const isRiverSide = r >= 4 && r <= 5;

            return (
              <Box
                key={`${r}-${c}`}
                onClick={() => onSquareClick(r, c)}
                sx={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #654321",
                  backgroundColor: isRiverSide ? "#D2B48C" : "#DEB887",
                  cursor: "pointer",
                  position: "relative",
                  fontSize: "24px",
                  fontWeight: "bold",
                  userSelect: "none",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#C19A6B",
                  },
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "36px",
                      height: "36px",
                      border: "3px solid #FFD700",
                      borderRadius: "50%",
                    }}
                  />
                )}

                {/* Legal move indicator */}
                {isLegalMove && !isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#FF6347",
                      borderRadius: "50%",
                    }}
                  />
                )}

                {/* Piece */}
                {piece && (
                  <Box
                    sx={{
                      color: piece.c === "red" ? "#DC143C" : "#000",
                      zIndex: 1,
                      fontFamily: '"Zhi Mang Xing", cursive',
                    }}
                  >
                    {piece.c === "black"
                      ? CHINESE_CHARS[
                          piece.t.toUpperCase() as keyof typeof CHINESE_CHARS
                        ]
                      : CHINESE_CHARS[
                          piece.t.toLowerCase() as keyof typeof CHINESE_CHARS
                        ]}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default GameBoard;
