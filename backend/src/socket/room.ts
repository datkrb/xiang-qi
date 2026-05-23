import { Server, Socket } from "socket.io";
import { Player, activeRooms } from "./gameState";
import { v4 as uuidv4 } from "uuid";

const startPos =
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1";

export const registerRoomHandlers = (io: Server, socket: Socket) => {
  //Play with friend
  //1. Create room
  socket.on("create_room", (userData, isPlayRed) => {
    const roomId = uuidv4();
    const player: Player = {
      socketId: socket.id,
      ...userData,
    };

    // Handle random color assignment
    let creatorIsRed: boolean;
    if (isPlayRed === "random") {
      creatorIsRed = Math.random() < 0.5;
    } else {
      creatorIsRed = isPlayRed;
    }

    activeRooms.set(roomId, {
      roomId,
      playerRed: creatorIsRed ? player : null,
      playerBlack: !creatorIsRed ? player : null,
      fen: startPos,
      isRanked: false,
      createdAt: Date.now(),
    });

    socket.join(roomId);
    socket.emit("room_created", { roomId });
  });

  // 2. Join room
  socket.on("join_room", ({ roomId, userData }) => {
    const room = activeRooms.get(roomId);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    const player: Player = {
      socketId: socket.id,
      ...userData,
    };

    // Auto-assign to the empty seat
    if (!room.playerRed) {
      room.playerRed = player;
    } else if (!room.playerBlack) {
      room.playerBlack = player;
    } else {
      // Both seats taken, join as spectator
      room.spectators?.push(player);
      socket.join(roomId);
      socket.emit("error", { message: "Room full, joined as spectator" });
      socket.emit("spectator_joined", { roomId });
      socket.to(roomId).emit("new_spectator", { userId: player.userId });
      return;
    }

    // Explicitly join the room
    socket.join(roomId);
    // Notify the room that a player joined
    io.to(roomId).emit("player_joined", room);
  });

  //SPECTATATE ROOM
  socket.on("spectate_room", ({ roomId, userData }) => {
    const room = activeRooms.get(roomId);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }
    const player: Player = {
      socketId: socket.id,
      ...userData,
    };
    room.spectators?.push(player);
    socket.join(roomId);
    socket.emit("spectator_joined", { roomId });
    socket.to(roomId).emit("new_spectator", { userId: player.userId });
  });
};
