import { Server, Socket } from "socket.io";
import { Player, GameRoom, activeRooms, matchmakingQueues } from "./gameState";
import { v4 as uuidv4 } from "uuid";

const startPos =
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1";

export const registerMatchmakingHandlers = (io: Server, socket: Socket) => {
  // ===== GUEST MATCHMAKING =====
  socket.on("find_match_guest", (guestData) => {
    const player: Player = {
      socketId: socket.id,
      guestId: guestData.guestId,
      displayName: guestData.displayName,
      elo: 1200, // Fixed for guests
      role: "GUEST",
    };

    matchmakingQueues.guestQueue.push(player);
    console.log(
      `🔵 Guest ${player.displayName} added to guest queue. Length: ${matchmakingQueues.guestQueue.length}`,
    );

    // Try to find match in guest queue
    if (matchmakingQueues.guestQueue.length >= 2) {
      const player1 = matchmakingQueues.guestQueue.shift()!;
      const player2 = matchmakingQueues.guestQueue.shift()!;

      createMatch(io, player1, player2, { isGuest: true, isRanked: false });
    }
  });

  // ===== USER MATCHMAKING =====
  socket.on("find_match_user", (userData) => {
    const player: Player = {
      socketId: socket.id,
      userId: userData.userId,
      elo: userData.elo,
      role: "USER",
    };

    matchmakingQueues.userQueue.push(player);
    console.log(
      `👤 User ${player.userId} added to user queue. Length: ${matchmakingQueues.userQueue.length}`,
    );

    // Try to find match in user queue
    if (matchmakingQueues.userQueue.length >= 2) {
      const player1 = matchmakingQueues.userQueue.shift()!;
      const player2 = matchmakingQueues.userQueue.shift()!;

      createMatch(io, player1, player2, { isGuest: false, isRanked: true });
    }
  });

  // ===== CANCEL MATCHMAKING =====
  socket.on("cancel_find_match", () => {
    // Remove from guest queue
    const guestIdx = matchmakingQueues.guestQueue.findIndex(
      (p) => p.socketId === socket.id,
    );
    if (guestIdx !== -1) {
      matchmakingQueues.guestQueue.splice(guestIdx, 1);
      console.log(`❌ Guest cancelled matchmaking`);
    }

    // Remove from user queue
    const userIdx = matchmakingQueues.userQueue.findIndex(
      (p) => p.socketId === socket.id,
    );
    if (userIdx !== -1) {
      matchmakingQueues.userQueue.splice(userIdx, 1);
      console.log(`❌ User cancelled matchmaking`);
    }
  });
};

// ===== HELPER FUNCTION =====
function createMatch(
  io: Server,
  player1: Player,
  player2: Player,
  options: { isGuest: boolean; isRanked: boolean },
) {
  const roomId = uuidv4();
  const isPlayRed = Math.random() < 0.5;

  const newGame: GameRoom = {
    roomId,
    playerRed: isPlayRed ? player1 : player2,
    playerBlack: !isPlayRed ? player1 : player2,
    fen: startPos,
    isRanked: options.isRanked,
    isGuest: options.isGuest,
    createdAt: Date.now(),
  };

  activeRooms.set(roomId, newGame);

  console.log(
    `✅ Match created: ${roomId} | ${player1.displayName || player1.userId} vs ${
      player2.displayName || player2.userId
    }`,
  );

  // Join players to room
  io.sockets.sockets.get(player1.socketId)?.join(roomId);
  io.sockets.sockets.get(player2.socketId)?.join(roomId);

  // Notify players
  io.to(roomId).emit("match_found", newGame);
}
