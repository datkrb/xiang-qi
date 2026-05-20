import { Server, Socket } from "socket.io";
import { Player, matchmakingQueue, GameRoom, activeRooms } from "./gameState";
import { v4 as uuidv4 } from "uuid";

const startPos =
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1";

export const registerMatchmakingHandlers = (io: Server, socket: Socket) => {
  // RANDOM MATCHMAKING
  socket.on("find_match", (userData, isPlayRed) => {
    // 0. Create a player object for the current socket
    const player: Player = {
      socketId: socket.id,
      userId: userData.userId,
      // username: userData.username,
      elo: userData.elo,
    };

    //1. Add player to queue
    matchmakingQueue.push(player);
    console.log(
      `Player ${player.userId} added to matchmaking queue. Queue length: ${matchmakingQueue.length}`,
    );

    //2. Find a match If there are 2 or more players in the queue
    if (matchmakingQueue.length >= 2) {
      const player1 = matchmakingQueue.shift()!;
      const player2 = matchmakingQueue.shift()!;

      // Create game
      const roomId = uuidv4();
      //randomly assign colors
      const isPlayRed = Math.random() < 0.5;
      const newGame: GameRoom = {
        roomId,
        playerRed: isPlayRed ? player1 : player2,
        playerBlack: !isPlayRed ? player1 : player2,

        fen: startPos,
        isRanked: true,
        createdAt: Date.now(),
      };

      activeRooms.set(roomId, newGame);
      console.log(
        `Match found! Room ID: ${roomId}, Players: ${player1.userId} vs ${player2.userId}`,
      );

      // Make both players join the Socket.IO room
      io.sockets.sockets.get(player1.socketId)?.join(roomId);
      io.sockets.sockets.get(player2.socketId)?.join(roomId);

      // Notify players
      io.to(roomId).emit("match_found", newGame);
    }
  });
};
