import { Gamepad2, Bot, Swords, ArrowLeft } from "lucide-react";

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
    <div className="w-full p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-surface-opaque rounded-xl transition-colors border border-border text-muted hover:text-main hover:border-primary"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold font-heading text-main">Play Game</h1>
        </div>

        <div className="space-y-4">
          {gameMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full glass-panel-interactive text-left p-6 rounded-2xl flex items-center gap-6 group"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-main mb-1 group-hover:text-primary transition-colors">{item.label}</h3>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
