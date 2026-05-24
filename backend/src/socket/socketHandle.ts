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
import { verifyAccessToken } from "../utils/token";

export const setUpSocketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`\n🟢 Socket connected: ${socket.id}`);

    const role = socket.handshake.auth["role"] || "USER";

    // ===== HANDSHAKE JWT VERIFICATION =====
    if (role === "USER") {
      const token: string | undefined = socket.handshake.auth["token"];
      if (!token) {
        console.log(`   ❌ No token provided — disconnecting ${socket.id}`);
        socket.emit("unauthorized", { message: "Access token required" });
        socket.disconnect(true);
        return;
      }

      const payload = verifyAccessToken(token) as {
        id: string;
        role: string;
      } | null;

      if (!payload) {
        console.log(`   ❌ Invalid token — disconnecting ${socket.id}`);
        socket.emit("unauthorized", { message: "Invalid or expired token" });
        socket.disconnect(true);
        return;
      }

      // Attach verified identity server-side — do NOT trust client-supplied userId
      socket.data["userId"] = payload.id;
      socket.data["role"] = payload.role;
      console.log(`   ✅ USER authenticated: ${socket.data["userId"]}`);
    } else if (role === "GUEST") {
      const guestToken: string | undefined = socket.handshake.auth["guestToken"];
      if (!guestToken) {
        socket.emit("unauthorized", { message: "Guest token required" });
        socket.disconnect(true);
        return;
      }
      socket.data["guestId"] = guestToken;
      socket.data["role"] = "GUEST";
      console.log(`   👤 GUEST connected (token redacted)`);
    } else {
      socket.emit("unauthorized", { message: "Unknown role" });
      socket.disconnect(true);
      return;
    }

    // ===== RECONNECTION =====
    if (socket.data["role"] === "GUEST") {
      handleGuestReconnection(io, socket, socket.data["guestId"] as string);
    } else if (socket.data["role"] === "USER") {
      handleUserReconnection(io, socket, socket.data["userId"] as string);
    }

    // Register event handlers
    registerMatchmakingHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerGameplayHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`\n🔴 Socket disconnected: ${socket.id}`);
      handleDisconnection(io, socket);
    });
  });
};

// ===== RECONNECTION HANDLERS =====
function handleGuestReconnection(
  _io: Server,
  socket: Socket,
  guestId?: string,
) {
  if (!guestId) return;

  for (const [roomId, room] of activeRooms.entries()) {
    if (room.playerRed?.guestId === guestId) {
      console.log(`✅ Guest reconnected (Red) to ${roomId}`);
      room.playerRed.socketId = socket.id;

      if (gracePeriodTimers.has(roomId)) {
        clearTimeout(gracePeriodTimers.get(roomId)!.timer);
        gracePeriodTimers.delete(roomId);
      }

      socket.join(roomId);
      socket.emit("reconnected", {
        roomId,
        currentFen: room.fen,
        playerColor: "red",
        opponentUsername: room.playerBlack?.displayName ?? null,
      });
      socket.to(roomId).emit("opponent_reconnected");
      return;
    }

    if (room.playerBlack?.guestId === guestId) {
      console.log(`✅ Guest reconnected (Black) to ${roomId}`);
      room.playerBlack.socketId = socket.id;

      if (gracePeriodTimers.has(roomId)) {
        clearTimeout(gracePeriodTimers.get(roomId)!.timer);
        gracePeriodTimers.delete(roomId);
      }

      socket.join(roomId);
      socket.emit("reconnected", {
        roomId,
        currentFen: room.fen,
        playerColor: "black",
        opponentUsername: room.playerRed?.displayName ?? null,
      });
      socket.to(roomId).emit("opponent_reconnected");
      return;
    }
  }

  socket.emit("no_active_match");
}

function handleUserReconnection(
  _io: Server,
  socket: Socket,
  userId?: string,
) {
  if (!userId) return;

  for (const [roomId, room] of activeRooms.entries()) {
    if (room.playerRed?.userId === userId) {
      console.log(`✅ User reconnected (Red) to ${roomId}`);
      room.playerRed.socketId = socket.id;

      if (gracePeriodTimers.has(roomId)) {
        clearTimeout(gracePeriodTimers.get(roomId)!.timer);
        gracePeriodTimers.delete(roomId);
      }

      socket.join(roomId);
      socket.emit("reconnected", {
        roomId,
        currentFen: room.fen,
        playerColor: "red",
        opponentUsername: room.playerBlack?.displayName ?? null,
      });
      socket.to(roomId).emit("opponent_reconnected");
      return;
    }

    if (room.playerBlack?.userId === userId) {
      console.log(`✅ User reconnected (Black) to ${roomId}`);
      room.playerBlack.socketId = socket.id;

      if (gracePeriodTimers.has(roomId)) {
        clearTimeout(gracePeriodTimers.get(roomId)!.timer);
        gracePeriodTimers.delete(roomId);
      }

      socket.join(roomId);
      socket.emit("reconnected", {
        roomId,
        currentFen: room.fen,
        playerColor: "black",
        opponentUsername: room.playerRed?.displayName ?? null,
      });
      socket.to(roomId).emit("opponent_reconnected");
      return;
    }
  }

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
      console.log(`   Player Red disconnected from room ${roomId}`);
      if (room.playerRed) room.playerRed.socketId = "" as any;
      handlePlayerDisconnection(io, roomId, "red", room);
      return;
    }

    if (room.playerBlack?.socketId === socket.id) {
      console.log(`   Player Black disconnected from room ${roomId}`);
      if (room.playerBlack) room.playerBlack.socketId = "" as any;
      handlePlayerDisconnection(io, roomId, "black", room);
      return;
    }
  }
}

// ===== GRACE PERIOD LOGIC =====
function handlePlayerDisconnection(
  io: Server,
  roomId: string,
  playerRole: "red" | "black",
  room: GameRoom,
) {
  const GRACE_PERIOD = 90000; // 90 seconds
  const opponentSocketId =
    playerRole === "red"
      ? room.playerBlack?.socketId
      : room.playerRed?.socketId;

  const opponentSocket = opponentSocketId
    ? io.sockets.sockets.get(opponentSocketId)
    : undefined;

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

  const timer = setTimeout(() => {
    const currentRoom = activeRooms.get(roomId);
    if (!currentRoom) {
      console.log(`   Room ${roomId} already deleted`);
      return;
    }

    const stillDisconnected =
      playerRole === "red"
        ? !currentRoom.playerRed?.socketId
        : !currentRoom.playerBlack?.socketId;

    if (stillDisconnected) {
      console.log(`⏱️  Grace period expired for room ${roomId} — ending game`);

      activeRooms.delete(roomId);
      gracePeriodTimers.delete(roomId);

      io.to(roomId).emit("game_abandoned", {
        reason: "opponent_timeout",
        playerRole,
      });

      // TODO: Update ELO — penalize disconnected player
    }
  }, GRACE_PERIOD);

  gracePeriodTimers.set(roomId, { roomId, playerRole, timer });
}
