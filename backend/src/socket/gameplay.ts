import { Server, Socket } from "socket.io";
import { activeRooms } from "./gameState";
import { calculateElo } from "../utils/elo";

export const registerGameplayHandlers = (io: Server, socket: Socket) => {
  // IN-GAME EVENTS
  // 1. Make move
  socket.on("make_move", ({ roomId, move, newFen }) => {
    const room = activeRooms.get(roomId);
    if (room) {
      room.fen = newFen;
      socket.to(roomId).emit("move_made", { move, newFen });
    } else {
      socket.emit("error", { message: "Room not found" });
    }
  });

  // 2. game over
  socket.on("game_over", ({ roomId, winnerId }) => {
    const room = activeRooms.get(roomId);
    if (room) {
      io.to(roomId).emit("game_over", { winnerId });
      activeRooms.delete(roomId);

      if (room.isRanked && room.playerRed && room.playerBlack) {
        // Calculate ELO
        const redWon = winnerId === room.playerRed.userId;
        const blackWon = winnerId === room.playerBlack.userId;

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

        // Update player objects in memory (optional, since room is deleted, but good practice)
        room.playerRed.elo = newEloRed;
        room.playerBlack.elo = newEloBlack;

        // Broadcast the new ELOs
        io.to(roomId).emit("elo_update", {
          newEloRed,
          newEloBlack,
        });

        // TODO: Save the new ELOs to the database (Prisma)
        // e.g., await prisma.user.update({ where: { id: room.playerRed.userId }, data: { elo: newEloRed } })
      }
    } else {
      socket.emit("error", { message: "Room not found" });
    }
  });
};
