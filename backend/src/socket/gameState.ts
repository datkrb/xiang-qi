export interface Player {
  socketId: string;
  userId: string;
  // username: string;
  elo: number;
}

export interface GameRoom {
  roomId: string;
  playerRed: Player | null;
  playerBlack: Player | null;
  spectators?: Player[];
  fen: string;
  isRanked: boolean;
  createdAt: number;
}
// use redis later
export const matchmakingQueue: Player[] = [];

export const activeRooms = new Map<string, GameRoom>();
