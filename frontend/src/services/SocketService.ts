/**
 * Socket Service
 * Manages all socket.io communication with the backend
 * Provides a clean API for emitting and listening to game events
 */

import { Socket } from "socket.io-client";

export interface GameRoomData {
  roomId: string;
  playerRed: any;
  playerBlack: any;
  fen: string;
  isRanked: boolean;
  createdAt: number;
}

export interface MoveData {
  move: any;
  newFen: string;
}

export class SocketService {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  // Matchmaking
  findMatch(userData: any, isPlayRed: boolean) {
    this.socket.emit("find_match", userData, isPlayRed);
  }

  // Room creation and joining
  createRoom(userData: any, isPlayRed: boolean) {
    this.socket.emit("create_room", userData, isPlayRed);
  }

  joinRoom(roomId: string, userData: any) {
    this.socket.emit("join_room", { roomId, userData });
  }

  spectateRoom(roomId: string, userData: any) {
    this.socket.emit("spectate_room", { roomId, userData });
  }

  // Gameplay
  makeMove(roomId: string, move: any, newFen: string) {
    this.socket.emit("make_move", { roomId, move, newFen });
  }

  endGame(roomId: string, winnerId: string) {
    this.socket.emit("game_over", { roomId, winnerId });
  }

  // Event listeners - Matchmaking
  onMatchFound(callback: (data: GameRoomData) => void) {
    this.socket.on("match_found", callback);
  }

  // Event listeners - Room
  onRoomCreated(callback: (data: { roomId: string }) => void) {
    this.socket.on("room_created", callback);
  }

  onPlayerJoined(callback: (data: GameRoomData) => void) {
    this.socket.on("player_joined", callback);
  }

  onSpectatorJoined(callback: (data: { roomId: string }) => void) {
    this.socket.on("spectator_joined", callback);
  }

  onNewSpectator(callback: (data: { userId: string }) => void) {
    this.socket.on("new_spectator", callback);
  }

  // Event listeners - Gameplay
  onMoveMade(callback: (data: MoveData) => void) {
    this.socket.on("move_made", callback);
  }

  onGameOver(callback: (data: { winnerId: string }) => void) {
    this.socket.on("game_over", callback);
  }

  onEloUpdate(
    callback: (data: { newEloRed: number; newEloBlack: number }) => void,
  ) {
    this.socket.on("elo_update", callback);
  }

  // Event listeners - Disconnection
  onOpponentDisconnected(callback: () => void) {
    this.socket.on("opponent_disconnected", callback);
  }

  onGameAbandoned(callback: () => void) {
    this.socket.on("game_abandoned", callback);
  }

  // Error handling
  onError(callback: (data: { message: string }) => void) {
    this.socket.on("error", callback);
  }

  // Cleanup
  removeAllListeners() {
    this.socket.removeAllListeners();
  }

  offMatchFound(callback: (data: GameRoomData) => void) {
    this.socket.off("match_found", callback);
  }

  offPlayerJoined(callback: (data: GameRoomData) => void) {
    this.socket.off("player_joined", callback);
  }

  offMoveMade(callback: (data: MoveData) => void) {
    this.socket.off("move_made", callback);
  }

  offGameOver(callback: (data: { winnerId: string }) => void) {
    this.socket.off("game_over", callback);
  }

  offOpponentDisconnected(callback: () => void) {
    this.socket.off("opponent_disconnected", callback);
  }

  offError(callback: (data: { message: string }) => void) {
    this.socket.off("error", callback);
  }
}
