/**
 * Socket Service
 * Manages all socket.io communication with the backend.
 * Provides a typed API for emitting and listening to game events.
 *
 * Event reference (aligned with backend socket handlers):
 *
 * ─ Auth ─
 *   S→C: unauthorized, no_active_match
 *
 * ─ Matchmaking ─
 *   C→S: find_match_guest, find_match_user, cancel_find_match
 *   S→C: match_found
 *
 * ─ Room ─
 *   C→S: create_room, join_room, spectate_room
 *   S→C: room_created, player_joined, spectator_joined, new_spectator
 *
 * ─ Gameplay ─
 *   C→S: make_move, game_over
 *   S→C: move_made, game_over, elo_update
 *
 * ─ Reconnection ─
 *   S→C: reconnected, opponent_reconnected,
 *         opponent_disconnected, game_abandoned
 *
 * ─ Error ─
 *   S→C: error
 */

import { Socket } from "socket.io-client";

// ─── Payload types ───────────────────────────────────────────────────────────

export interface PlayerData {
  socketId: string;
  userId?: string;
  guestId?: string;
  displayName?: string;
  elo: number;
  role: "USER" | "GUEST";
}

export interface GameRoomData {
  roomId: string;
  playerRed: PlayerData | null;
  playerBlack: PlayerData | null;
  fen: string;
  isRanked: boolean;
  isGuest: boolean;
  matchUrl?: string;
  createdAt: number;
}

export interface MoveData {
  move: any;
  newFen: string;
}

export interface ReconnectedData {
  roomId: string;
  currentFen: string;
  playerColor: "red" | "black";
  opponentUsername: string | null;
}

export interface EloUpdateData {
  newEloRed: number;
  newEloBlack: number;
}

// ─── Service class ───────────────────────────────────────────────────────────

export class SocketService {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  // ─── Emitters — Matchmaking ──────────────────────────────────────────────

  findMatchGuest(payload: {
    guestId: string;
    displayName: string;
    elo?: number;
  }) {
    this.socket.emit("find_match_guest", payload);
  }

  findMatchUser(payload: { userId: string; elo: number }) {
    this.socket.emit("find_match_user", payload);
  }

  cancelFindMatch() {
    this.socket.emit("cancel_find_match");
  }

  // ─── Emitters — Room ─────────────────────────────────────────────────────

  createRoom(userData: any, isPlayRed: boolean | "random") {
    this.socket.emit("create_room", userData, isPlayRed);
  }

  joinRoom(roomId: string, userData: any) {
    this.socket.emit("join_room", { roomId, userData });
  }

  spectateRoom(roomId: string, userData: any) {
    this.socket.emit("spectate_room", { roomId, userData });
  }

  // ─── Emitters — Gameplay ─────────────────────────────────────────────────

  makeMove(roomId: string, move: any, newFen: string) {
    this.socket.emit("make_move", { roomId, move, newFen });
  }

  endGame(roomId: string, winnerId: string) {
    this.socket.emit("game_over", { roomId, winnerId });
  }

  // ─── Listeners — Auth ────────────────────────────────────────────────────

  onUnauthorized(callback: (data: { message: string }) => void) {
    this.socket.on("unauthorized", callback);
  }

  onNoActiveMatch(callback: () => void) {
    this.socket.on("no_active_match", callback);
  }

  // ─── Listeners — Matchmaking ─────────────────────────────────────────────

  onMatchFound(callback: (data: GameRoomData) => void) {
    this.socket.on("match_found", callback);
  }

  // ─── Listeners — Room ────────────────────────────────────────────────────

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

  // ─── Listeners — Gameplay ────────────────────────────────────────────────

  onMoveMade(callback: (data: MoveData) => void) {
    this.socket.on("move_made", callback);
  }

  onGameOver(callback: (data: { winnerId: string }) => void) {
    this.socket.on("game_over", callback);
  }

  onEloUpdate(callback: (data: EloUpdateData) => void) {
    this.socket.on("elo_update", callback);
  }

  // ─── Listeners — Reconnection ────────────────────────────────────────────

  onReconnected(callback: (data: ReconnectedData) => void) {
    this.socket.on("reconnected", callback);
  }

  onOpponentReconnected(callback: () => void) {
    this.socket.on("opponent_reconnected", callback);
  }

  onOpponentDisconnected(
    callback: (data: { gracePeriod: number }) => void,
  ) {
    this.socket.on("opponent_disconnected", callback);
  }

  onGameAbandoned(
    callback: (data: { reason: string; playerRole: string }) => void,
  ) {
    this.socket.on("game_abandoned", callback);
  }

  // ─── Listeners — Error ──────────────────────────────────────────────────

  onError(callback: (data: { message: string }) => void) {
    this.socket.on("error", callback);
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────

  removeAllListeners() {
    this.socket.removeAllListeners();
  }

  off(event: string, callback: (...args: any[]) => void) {
    this.socket.off(event, callback);
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

  offOpponentDisconnected(
    callback: (data: { gracePeriod: number }) => void,
  ) {
    this.socket.off("opponent_disconnected", callback);
  }

  offError(callback: (data: { message: string }) => void) {
    this.socket.off("error", callback);
  }

  offUnauthorized(callback: (data: { message: string }) => void) {
    this.socket.off("unauthorized", callback);
  }

  offReconnected(callback: (data: ReconnectedData) => void) {
    this.socket.off("reconnected", callback);
  }

  offOpponentReconnected(callback: () => void) {
    this.socket.off("opponent_reconnected", callback);
  }

  offGameAbandoned(
    callback: (data: { reason: string; playerRole: string }) => void,
  ) {
    this.socket.off("game_abandoned", callback);
  }
}
