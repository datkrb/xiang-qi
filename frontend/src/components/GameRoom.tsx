import { useState } from "react";
import { useGame } from "../context/GameContext";

interface GameRoomProps {
  userData: {
    userId: string;
    username: string;
    elo: number;
  };
}

/**
 * Example component showing how to use socket room features
 * This component demonstrates:
 * - Creating a room for play with friends
 * - Joining an existing room
 * - Playing as red or black
 */
export function GameRoom({ userData }: GameRoomProps) {
  const { createRoom, joinRoom, roomId } = useGame();
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateRoom = (color: boolean | "random") => {
    createRoom(userData, color);
  };

  const handleJoinRoom = () => {
    if (joinRoomId.trim()) {
      joinRoom(joinRoomId, userData);
      setJoinRoomId("");
    }
  };

  return (
    <div className="glass-panel p-6 border-border space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold font-heading text-main mb-4">Create Room</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCreateRoom(true)}
            className="px-5 py-2.5 bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/30 hover:border-danger rounded-xl transition-colors font-semibold"
          >
            Create as Red
          </button>
          <button
            onClick={() => handleCreateRoom(false)}
            className="px-5 py-2.5 bg-surface-opaque hover:bg-surface-hover text-main border border-border rounded-xl transition-colors font-semibold shadow-sm"
          >
            Create as Black
          </button>
          <button
            onClick={() => handleCreateRoom("random")}
            className="px-5 py-2.5 btn-primary rounded-xl font-semibold shadow-lg shadow-primary/20"
          >
            Create Random
          </button>
        </div>
        {roomId && (
          <p className="mt-4 text-success font-medium flex items-center gap-2 bg-success/10 p-3 rounded-xl border border-success/20">
            ✓ Room created: <strong className="text-success-foreground">{roomId}</strong>
          </p>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="text-xl font-bold font-heading text-main mb-4">Join Room</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="flex-1 px-4 py-3 bg-surface-opaque border border-border rounded-xl text-main placeholder:text-muted focus:border-primary outline-none transition-colors"
          />
          <button
            onClick={handleJoinRoom}
            className="px-8 py-3 btn-primary rounded-xl font-bold whitespace-nowrap"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
