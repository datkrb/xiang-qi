import { ArrowLeft } from "lucide-react";
import { GameRoom } from "./GameRoom";

interface FriendLobbyScreenProps {
  onBack: () => void;
  userData: {
    userId: string;
    username: string;
    elo: number;
  };
}

export default function FriendLobbyScreen({
  onBack,
  userData,
}: FriendLobbyScreenProps) {
  return (
    <div className="w-full p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-surface-opaque hover:bg-surface-hover text-muted hover:text-main transition-colors rounded-xl border border-border"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold font-heading text-main">
            Play with Friend
          </h1>
        </div>

        <div className="glass-panel rounded-2xl p-8 border-border">
          <GameRoom userData={userData} />
        </div>
      </div>
    </div>
  );
}
