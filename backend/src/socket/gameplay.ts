import { Server, Socket } from "socket.io";
import { activeRooms } from "./gameState";
import { calculateElo } from "../utils/elo";
import prisma from "../utils/prisma";

// ===== HELPERS =====

/** Extract the side-to-move from a FEN string ('w' = red, 'b' = black) */
function fenSideToMove(fen: string): "w" | "b" {
  const parts = fen.trim().split(" ");
  return (parts[1] as "w" | "b") ?? "w";
}

/** Determine the color of the socket making the request, or null if not a player */
function getPlayerColor(
  socketId: string,
  room: ReturnType<typeof activeRooms.get>,
): "red" | "black" | null {
  if (!room) return null;
  if (room.playerRed?.socketId === socketId) return "red";
  if (room.playerBlack?.socketId === socketId) return "black";
  return null;
}

// ===== HANDLERS =====

export const registerGameplayHandlers = (io: Server, socket: Socket) => {
  // ─── 1. Make move ────────────────────────────────────────────────────────────
  socket.on("make_move", ({ roomId, move, newFen }) => {
    const room = activeRooms.get(roomId);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    // Guard: emitter must be a player in this room
    const playerColor = getPlayerColor(socket.id, room);
    if (!playerColor) {
      socket.emit("error", { message: "You are not a player in this room" });
      return;
    }

    // Guard: it must be this player's turn
    const sideToMove = fenSideToMove(room.fen); // from current FEN before update
    const isRedTurn = sideToMove === "w";
    if (
      (isRedTurn && playerColor !== "red") ||
      (!isRedTurn && playerColor !== "black")
    ) {
      socket.emit("error", { message: "Not your turn" });
      return;
    }

    // Guard: basic FEN sanity
    if (!newFen || typeof newFen !== "string" || newFen.trim() === "") {
      socket.emit("error", { message: "Invalid FEN" });
      return;
    }

    // Apply move
    room.fen = newFen;
    room.moves.push({ notation: move, fenAfter: newFen });

    socket.to(roomId).emit("move_made", { move, newFen });
  });

  // ─── 2. Game over ─────────────────────────────────────────────────────────────
  socket.on("game_over", async ({ roomId, winnerId }) => {
    const room = activeRooms.get(roomId);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    // Guard: emitter must be a player in this room
    const playerColor = getPlayerColor(socket.id, room);
    if (!playerColor) {
      socket.emit("error", { message: "You are not a player in this room" });
      return;
    }

    // Broadcast game over immediately so clients can react
    io.to(roomId).emit("game_over", { winnerId });
    activeRooms.delete(roomId);

    // ─── ELO + Persistence (ranked games with two registered players) ──────────
    if (
      room.isRanked &&
      room.playerRed?.userId &&
      room.playerBlack?.userId
    ) {
      const redUserId = room.playerRed.userId;
      const blackUserId = room.playerBlack.userId;

      const redWon = winnerId === redUserId;
      const blackWon = winnerId === blackUserId;

      const newEloRed = calculateElo(
        room.playerRed.elo ?? 1000,
        room.playerBlack.elo ?? 1000,
        redWon,
      );
      const newEloBlack = calculateElo(
        room.playerBlack.elo ?? 1000,
        room.playerRed.elo ?? 1000,
        blackWon,
      );

      // Determine GameStatus
      const status = redWon
        ? "RED_WON"
        : blackWon
          ? "BLACK_WON"
          : "DRAW";

      try {
        // Fetch profile IDs for both players
        const [redProfile, blackProfile] = await Promise.all([
          prisma.profile.findUnique({ where: { userId: redUserId } }),
          prisma.profile.findUnique({ where: { userId: blackUserId } }),
        ]);

        if (!redProfile || !blackProfile) {
          console.error(
            `⚠️  Could not find profiles for game_over in room ${roomId}`,
          );
        } else {
          await prisma.$transaction(async (tx) => {
            // 1. Create Game record
            const game = await tx.game.create({
              data: {
                status,
                currentFen: room.fen,
                redPlayerId: redProfile.id,
                blackPlayerId: blackProfile.id,
              },
            });

            // 2. Persist move history
            if (room.moves.length > 0) {
              await tx.move.createMany({
                data: room.moves.map((m, idx) => ({
                  gameId: game.id,
                  moveNumber: idx + 1,
                  notation: m.notation,
                  fenAfter: m.fenAfter,
                })),
              });
            }

            // 3. Update ELO on both profiles
            await tx.profile.update({
              where: { id: redProfile.id },
              data: { elo: newEloRed },
            });
            await tx.profile.update({
              where: { id: blackProfile.id },
              data: { elo: newEloBlack },
            });
          });

          console.log(
            `✅ Game persisted for room ${roomId} | Red ELO: ${room.playerRed.elo} → ${newEloRed} | Black ELO: ${room.playerBlack.elo} → ${newEloBlack}`,
          );

          // Notify players of new ELOs
          io.to(roomId).emit("elo_update", { newEloRed, newEloBlack });
        }
      } catch (err) {
        console.error(`❌ Failed to persist game result for room ${roomId}:`, err);
      }
    }
  });
};
