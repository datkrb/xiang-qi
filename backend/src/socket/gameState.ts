export interface Player {
  socketId: string;
  userId?: string;
  guestId?: string;
  displayName?: string;
  elo: number;
  role: "USER" | "GUEST";
}

export interface MoveRecord {
  notation: string;
  fenAfter: string;
}

export interface GameRoom {
  roomId: string;
  playerRed: Player | null;
  playerBlack: Player | null;
  spectators?: Player[];
  fen: string;
  isRanked: boolean;
  isGuest: boolean;
  matchUrl?: string;
  createdAt: number;
  /** Accumulated move history — used to persist to DB on game_over */
  moves: MoveRecord[];
  /** DB Game.id once persisted (set on game_over) */
  dbGameId?: string;
}

export interface MatchmakingQueues {
  guestQueue: Player[];
  userQueue: Player[];
}

// Separated matchmaking queues
export const matchmakingQueues: MatchmakingQueues = {
  guestQueue: [],
  userQueue: [],
};

export const activeRooms = new Map<string, GameRoom>();

// For tracking grace periods
interface DisconnectTimer {
  roomId: string;
  playerRole: "red" | "black";
  timer: NodeJS.Timeout;
}

export const gracePeriodTimers: Map<string, DisconnectTimer> = new Map();

// ===== SAFE SERIALIZER =====
/** Returns only public, non-sensitive fields of a GameRoom (no socketId, guestId, etc.) */
export function toPublicRoom(room: GameRoom) {
  return {
    roomId: room.roomId,
    fen: room.fen,
    isRanked: room.isRanked,
    isGuest: room.isGuest,
    createdAt: room.createdAt,
    players: {
      red: room.playerRed
        ? {
            userId: room.playerRed.userId ?? null,
            username: room.playerRed.displayName ?? null,
            elo: room.playerRed.elo ?? null,
          }
        : null,
      black: room.playerBlack
        ? {
            userId: room.playerBlack.userId ?? null,
            username: room.playerBlack.displayName ?? null,
            elo: room.playerBlack.elo ?? null,
          }
        : null,
    },
  };
}
