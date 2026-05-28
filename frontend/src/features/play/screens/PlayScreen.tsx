import { Gamepad2, Bot, Swords, ArrowLeft } from "lucide-react";
import { PageContainer } from "@shared/components/layouts";
import { Text, Button } from "@shared/components/ui";

interface PlayScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export default function PlayScreen({ onNavigate, onBack }: PlayScreenProps) {
  const gameMenuItems = [
    { id: "online", label: "Play Online", icon: Swords, desc: "Play against other players online" },
    { id: "offline", label: "Play Offline", icon: Gamepad2, desc: "Play locally on the same device" },
    { id: "ai", label: "Play vs AI", icon: Bot, desc: "Challenge the computer" },
  ];

  return (
    <PageContainer maxWidth="2xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="secondary"
          onClick={onBack}
          className="p-3"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Text variant="h1">Play Game</Text>
      </div>

        <div className="space-y-4">
          {gameMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onNavigate(item.id)}
                className="w-full text-left p-6 rounded-2xl flex items-center gap-6 group hover:bg-surface-interactive border border-transparent hover:border-primary transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <Text variant="h3" className="mb-1 group-hover:text-primary transition-colors">{item.label}</Text>
                  <Text variant="caption" className="text-muted">{item.desc}</Text>
                </div>
              </Button>
            );
          })}
        </div>
    </PageContainer>
  );
}
