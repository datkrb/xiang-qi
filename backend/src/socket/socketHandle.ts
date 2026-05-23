import { Server, Socket } from "socket.io";
import {
  matchmakingQueues,
  activeRooms,
  GameRoom,
  gracePeriodTimers,
} from "./gameState";
import { registerMatchmakingHandlers } from "./matchmaking";
import { registerRoomHandlers } from "./room";
import { registerGameplayHandlers } from "./gameplay";

export const setUpSocketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`\n🟢 User connected: ${socket.id}`);

    const role = socket.handshake.auth.role || "USER";
    console.log(`   Role: ${role}`);

    // Check for active session and attempt reconnection
    if (role === "GUEST") {
      const guestToken = socket.handshake.auth.guestToken;
      handleGuestReconnection(io, socket, guestToken);
    } else if (role === "USER") {
      const userToken = socket.handshake.auth.userToken;
      handleUserReconnection(io, socket, userToken);
    }

    // Register event handlers
    registerMatchmakingHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerGameplayHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`\n🔴 User disconnected: ${socket.id}`);
      handleDisconnection(io, socket);
    });
  });
};

// ===== RECONNECTION HANDLERS =====
function handleGuestReconnection(
  io: Server,
  socket: Socket,
  guestToken?: string,
) {
  if (!guestToken) return;

  // Find room where this guest is playing
  for (const [roomId, room] of activeRooms.entries()) {
    if (room.playerRed?.guestId === guestToken) {
      console.log(`✅ Guest reconnected (Red) to ${roomId}`);
      room.playerRed.socketId = socket.id;

      // Clear grace period timer if exists
      if (gracePeriodTimers.has(roomId)) {
        clearTimeout(gracePeriodTimers.get(roomId)!.timer);
        gracePeriodTimers.delete(roomId);
      }

      socket.join(roomId);

      socket.emit("reconnected", {
        roomId,
        currentFen: room.fen,
        playerColor: "red",
        opponent: room.playerBlack,
      });

      socket.to(roomId).emit("opponent_reconnected");
      return;
    }

    if (room.playerBlack?.guestId === guestToken) {
      console.log(`✅ Guest reconnected (Black) to ${roomId}`);
      room.playerBlack.socketId = socket.id;

      // Clear grace period timer if exists
      if (gracePeriodTimers.has(roomId)) {
        clearTimeout(gracePeriodTimers.get(roomId)!.timer);
        gracePeriodTimers.delete(roomId);
      }

      socket.join(roomId);

      socket.emit("reconnected", {
        roomId,
        currentFen: room.fen,
        playerColor: "black",
        opponent: room.playerRed,
      });

      socket.to(roomId).emit("opponent_reconnected");
      return;
    }
  }

  socket.emit("no_active_match");
}

function handleUserReconnection(
  io: Server,
  socket: Socket,
  userToken?: string,
) {
  if (!userToken) return;

  // TODO: Verify token with JWT
  // For now, find by userId from token decode

  socket.emit("no_active_match");
}

// ===== DISCONNECTION HANDLER =====
function handleDisconnection(io: Server, socket: Socket) {
  // Remove from matchmaking queues
  const guestIdx = matchmakingQueues.guestQueue.findIndex(
    (p) => p.socketId === socket.id,
  );
  if (guestIdx !== -1) {
    matchmakingQueues.guestQueue.splice(guestIdx, 1);
    console.log("   Removed from guest queue");
  }

  const userIdx = matchmakingQueues.userQueue.findIndex(
    (p) => p.socketId === socket.id,
  );
  if (userIdx !== -1) {
    matchmakingQueues.userQueue.splice(userIdx, 1);
    console.log("   Removed from user queue");
  }

  // Find and handle room disconnection
  for (const [roomId, room] of activeRooms.entries()) {
    if (room.playerRed?.socketId === socket.id) {
      console.log(`   Player Red disconnected from ${roomId}`);
      // mark player as disconnected so grace-period logic can detect it
      if (room.playerRed) room.playerRed.socketId = "" as any;
      handlePlayerDisconnection(io, socket, roomId, "red", room);
      return;
    }

    if (room.playerBlack?.socketId === socket.id) {
      console.log(`   Player Black disconnected from ${roomId}`);
      // mark player as disconnected so grace-period logic can detect it
      if (room.playerBlack) room.playerBlack.socketId = "" as any;
      handlePlayerDisconnection(io, socket, roomId, "black", room);
      return;
    }
  }
}

// ===== GRACE PERIOD LOGIC =====
function handlePlayerDisconnection(
  io: Server,
  socket: Socket,
  roomId: string,
  playerRole: "red" | "black",
  room: GameRoom,
) {
  const GRACE_PERIOD = 90000; // 90 seconds
  const opponentSocket = io.sockets.sockets.get(
    playerRole === "red"
      ? room.playerBlack?.socketId
      : room.playerRed?.socketId,
  );

  // Notify opponent
  if (opponentSocket) {
    opponentSocket.emit("opponent_disconnected", {
      gracePeriod: Math.floor(GRACE_PERIOD / 1000),
    });
    console.log(
      `   Notified opponent (${Math.floor(GRACE_PERIOD / 1000)}s grace period)`,
    );
  }

  // Cancel existing grace period if any
  if (gracePeriodTimers.has(roomId)) {
    clearTimeout(gracePeriodTimers.get(roomId)!.timer);
  }

  // Start new grace period
  const timer = setTimeout(() => {
    const currentRoom = activeRooms.get(roomId);

    if (!currentRoom) {
      console.log(`   Room ${roomId} already deleted`);
      return;
    }

    // Check if player still hasn't reconnected
    const stillDisconnected =
      playerRole === "red"
        ? !currentRoom.playerRed?.socketId
        : !currentRoom.playerBlack?.socketId;

    if (stillDisconnected) {
      console.log(`⏱️  Grace period expired for ${roomId} - Ending game`);

      activeRooms.delete(roomId);
      gracePeriodTimers.delete(roomId);

      io.to(roomId).emit("game_abandoned", {
        reason: "opponent_timeout",
        playerRole,
      });

      // TODO: Update ELO - penalize disconnected player
    }
  }, GRACE_PERIOD);

  gracePeriodTimers.set(roomId, {
    roomId,
    playerRole,
    timer,
  });
}
