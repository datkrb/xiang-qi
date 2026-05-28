import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@shared/components/layouts";
import { Card, Text, Button } from "@shared/components/ui";

interface GameModeScreenProps {
  onBack: () => void;
  onStartGame: (config: GameConfig) => void;
  mode: "offline" | "ai" | "online";
}

export interface GameConfig {
  mode: "pvp" | "ai" | "online";
  playerColor: "red" | "black" | "random";
  aiDifficulty?: "easy" | "medium" | "hard" | "expert";
  timeLimit: "unlimited" | "10" | "15" | "30";
}

export default function GameModeScreen({
  onBack,
  onStartGame,
  mode,
}: GameModeScreenProps) {
  const [playerColor, setPlayerColor] = useState<"red" | "black" | "random">(
    "random",
  );
  const [aiDifficulty, setAiDifficulty] = useState<
    "easy" | "medium" | "hard" | "expert"
  >("medium");
  const [timeLimit, setTimeLimit] = useState<"unlimited" | "10" | "15" | "30">(
    "unlimited",
  );

  const handleStartGame = () => {
    const config: GameConfig = {
      mode: mode === "offline" ? "pvp" : mode === "ai" ? "ai" : "online",
      playerColor,
      aiDifficulty: mode === "ai" ? aiDifficulty : undefined,
      timeLimit,
    };
    onStartGame(config);
  };

  return (
    <PageContainer maxWidth="2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="secondary"
          onClick={onBack}
          className="p-3"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Text variant="h1">Game Settings</Text>
      </div>

      <Card variant="elevated" padding="lg" className="space-y-8">
        {/* Player Color */}
        <div>
          <Text variant="h3" className="mb-4">
            Choose Your Color
          </Text>
          <div className="grid grid-cols-3 gap-4">
            {(["red", "black", "random"] as const).map((color) => (
              <Button
                key={color}
                variant={playerColor === color ? "primary" : "secondary"}
                onClick={() => setPlayerColor(color)}
                className="p-4"
              >
                <span className="capitalize">{color}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* AI Difficulty */}
        {mode === "ai" && (
          <div>
            <Text variant="h3" className="mb-4">
              AI Difficulty
            </Text>
            <div className="grid grid-cols-2 gap-4">
              {(["easy", "medium", "hard", "expert"] as const).map(
                (difficulty) => (
                  <Button
                    key={difficulty}
                    variant={aiDifficulty === difficulty ? "primary" : "secondary"}
                    onClick={() => setAiDifficulty(difficulty)}
                    className="p-4"
                  >
                    <span className="capitalize">{difficulty}</span>
                  </Button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Time Limit */}
        <div>
          <Text variant="h3" className="mb-4">
            Time Limit
          </Text>
          <div className="grid grid-cols-4 gap-4">
            {(["unlimited", "10", "15", "30"] as const).map((time) => (
              <Button
                key={time}
                variant={timeLimit === time ? "primary" : "secondary"}
                onClick={() => setTimeLimit(time)}
                className="p-4"
              >
                <span>
                  {time === "unlimited" ? "Unlimited" : `${time} min`}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex-1 p-4 text-lg"
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleStartGame}
            className="flex-1 p-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Game
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
