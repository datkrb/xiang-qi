export interface Player {
  socketId: string;
  userId?: string;
  guestId?: string;
  displayName?: string;
  elo: number;
  role: "USER" | "GUEST";
}

export interface GameRoom {
  roomId: string;
  playerRed: Player | null;
  playerBlack: Player | null;
  spectators?: Player[];
  fen: string;
  isRanked: boolean;
  isGuest: boolean;
  createdAt: number;
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
