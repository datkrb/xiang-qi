import { useGame } from "../context/GameContext";

interface GameMatchmakingProps {
  userData: {
    userId: string;
    username: string;
    elo: number;
  };
}

/**
 * Example component showing how to use socket matchmaking
 * This component demonstrates:
 * - Finding a match through the socket
 * - Listening for match found events
 * - Handling player disconnection
 */
export function GameMatchmaking({ userData }: GameMatchmakingProps) {
  const { findMatch, roomId, opponentDisconnected } = useGame();

  const handleFindMatch = () => {
    // Randomly assign player color (or let backend decide)
    const isPlayRed = Math.random() < 0.5;
    findMatch(userData, isPlayRed);
  };

  if (roomId) {
    return (
      <div className="p-4 bg-green-100 border border-green-400 rounded">
        <p className="text-green-800">✓ Match found! Room ID: {roomId}</p>
      </div>
    );
  }

  if (opponentDisconnected) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <p className="text-red-800">✗ Opponent disconnected</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleFindMatch}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Find Match
    </button>
  );
}
