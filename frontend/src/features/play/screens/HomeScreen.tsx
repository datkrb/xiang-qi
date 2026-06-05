import { useState } from "react";
import {
  Gamepad2,
  Bot,
  FolderOpen,
  Trophy,
  LogOut,
  User,
  Users,
  Settings,
  ChevronDown,
  Zap,
} from "lucide-react";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showMenu, setShowMenu] = useState(false);

  const gameMenuItems = [
    { id: "offline", label: "Play Offline", icon: Gamepad2 },
    { id: "online", label: "Quick Match", icon: Zap },
    { id: "friend", label: "Play with Friend", icon: Users },
    { id: "ai", label: "Play vs AI", icon: Bot },
    { id: "load", label: "Load Saved Game", icon: FolderOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const handleNavigate = (screen: string) => {
    setShowMenu(false);
    onNavigate(screen);
  };

  return (
    <div className="flex flex-col animate-fade-in w-full">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-border bg-surface/30 backdrop-blur-md relative">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shrink-0">
            <span className="text-2xl font-bold font-heading text-primary">將</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading text-main">象棋 Xiangqi</h1>
            <p className="text-sm text-muted">Chinese Chess Master</p>
          </div>
        </div>

        {/* Right: User Avatar with Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-4 py-2 glass-panel-interactive rounded-xl"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-main">Cao Thủ 2026</p>
              <p className="text-xs text-muted">Elo 1820 · Rank #128</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <ChevronDown className="w-4 h-4 text-muted" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-opaque rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-fade-in">
              <button
                onClick={() => handleNavigate("profile")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-main hover:bg-surface-hover transition-colors border-b border-border"
              >
                <User className="w-5 h-5 text-primary" />
                <span className="font-semibold">My Profile</span>
              </button>
              <button
                onClick={() => handleNavigate("friends")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-main hover:bg-surface-hover transition-colors border-b border-border"
              >
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">Friends</span>
              </button>
              <button
                onClick={() => handleNavigate("settings")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-main hover:bg-surface-hover transition-colors border-b border-border"
              >
                <Settings className="w-5 h-5 text-primary" />
                <span className="font-semibold">Settings</span>
              </button>
              <button
                onClick={() => handleNavigate("login")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-danger hover:bg-surface-hover transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Menu */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-4">
          {/* Game Menu */}
          <div>
            <h2 className="text-lg font-bold font-heading text-primary mb-4 uppercase tracking-wide">
              Game Menu
            </h2>
            <div className="space-y-2">
              {gameMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="w-full glass-panel-interactive hover:border-primary hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] p-4 rounded-xl flex items-center gap-4 group transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors group-hover:shadow-[0_0_15px_rgba(14,165,233,0.6)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-semibold text-main group-hover:text-primary transition-colors">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-border mt-auto opacity-70">
        <p className="text-muted text-sm font-medium">Version 1.0.0</p>
        <p className="text-muted text-xs mt-1">
          © 2026 Xiangqi Arena. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
