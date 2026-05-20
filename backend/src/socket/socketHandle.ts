import { Server, Socket } from "socket.io";
import { matchmakingQueue, activeRooms } from "./gameState";
import { registerMatchmakingHandlers } from "./matchmaking";
import { registerRoomHandlers } from "./room";
import { registerGameplayHandlers } from "./gameplay";

export const setUpSocketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Register modules
    registerMatchmakingHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerGameplayHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // 1. Remove from generic matchmaking queue
      const queueIndex = matchmakingQueue.findIndex(
        (p) => p.socketId === socket.id,
      );
      if (queueIndex !== -1) matchmakingQueue.splice(queueIndex, 1);

      // 2. Find if they were in an active room
      for (const [roomId, room] of activeRooms.entries()) {
        if (
          room.playerRed?.socketId === socket.id ||
          room.playerBlack?.socketId === socket.id
        ) {
          // Professional Practice: Reconnection Grace Period
          // Instead of ending instantly, we tell the opponent the player disconnected
          socket.to(roomId).emit("opponent_disconnected");

          // Start a 60-second timer to allow them to reconnect
          setTimeout(() => {
            const currentRoom = activeRooms.get(roomId);
            if (!currentRoom) return;

            // Check if they failed to reconnect with a new socketId
            const stillMissing =
              currentRoom.playerRed?.socketId === socket.id ||
              currentRoom.playerBlack?.socketId === socket.id;

            if (stillMissing) {
              activeRooms.delete(roomId);
              io.to(roomId).emit("game_abandoned");
              // TODO: Decrease Elo for the abandoning player in database
            }
          }, 60000);
          break;
        }
      }
    });
  });
};
