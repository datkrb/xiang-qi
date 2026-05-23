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
    <div className="space-y-4 p-4 border rounded">
      <div>
        <h3 className="text-lg font-bold mb-2">Create Room</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleCreateRoom(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Create as Red
          </button>
          <button
            onClick={() => handleCreateRoom(false)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Create as Black
          </button>
          <button
            onClick={() => handleCreateRoom("random")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Random
          </button>
        </div>
        {roomId && (
          <p className="mt-2 text-green-600">✓ Room created: {roomId}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-bold mb-2">Join Room</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
