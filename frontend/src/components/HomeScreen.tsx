import { useState } from "react";
import {
  Home,
  Gamepad2,
  Bot,
  FolderOpen,
  Trophy,
  LogOut,
  User,
  Users,
  Settings,
  ChevronDown,
} from "lucide-react";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showMenu, setShowMenu] = useState(false);

  const gameMenuItems = [
    { id: "offline", label: "Play Offline", icon: Gamepad2 },
    { id: "online", label: "Play Online", icon: Home },
    { id: "ai", label: "Play vs AI", icon: Bot },
    { id: "load", label: "Load Saved Game", icon: FolderOpen },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const handleNavigate = (screen: string) => {
    setShowMenu(false);
    onNavigate(screen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-900 via-blue-800 to-cyan-800">
      {/* Header */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-blue-700/50 relative">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-900 shrink-0">
            <span className="text-2xl font-bold">將</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-50">象棋 Xiangqi</h1>
            <p className="text-sm text-blue-200/70">Chinese Chess Master</p>
          </div>
        </div>

        {/* Right: User Avatar with Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-blue-50 rounded-lg transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-semibold">Cao Thủ 2026</p>
              <p className="text-xs text-blue-200/70">Elo 1820 · Rank #128</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-900 shrink-0">
              <User className="w-5 h-5 text-blue-900" />
            </div>
            <ChevronDown className="w-4 h-4 text-blue-200" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-blue-200 overflow-hidden z-50">
              <button
                onClick={() => handleNavigate("profile")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-blue-900 hover:bg-blue-50 transition-colors border-b border-blue-100"
              >
                <User className="w-5 h-5 text-blue-700" />
                <span className="font-semibold">My Profile</span>
              </button>
              <button
                onClick={() => handleNavigate("friends")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-blue-900 hover:bg-blue-50 transition-colors border-b border-blue-100"
              >
                <Users className="w-5 h-5 text-blue-700" />
                <span className="font-semibold">Friends</span>
              </button>
              <button
                onClick={() => handleNavigate("settings")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-blue-900 hover:bg-blue-50 transition-colors border-b border-blue-100"
              >
                <Settings className="w-5 h-5 text-blue-700" />
                <span className="font-semibold">Settings</span>
              </button>
              <button
                onClick={() => handleNavigate("login")}
                className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-900 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-700" />
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
            <h2 className="text-lg font-bold text-blue-200 mb-3 uppercase tracking-wide">
              Game Menu
            </h2>
            <div className="space-y-2">
              {gameMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="w-full bg-linear-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500
                             text-white p-4 rounded-lg flex items-center gap-4 transition-all transform hover:scale-105
                             shadow-lg hover:shadow-xl border border-blue-500/30"
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-lg font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-blue-700/50">
        <p className="text-blue-200/50 text-sm">Version 1.0.0</p>
        <p className="text-blue-200/40 text-xs mt-1">
          © 2026 Xiangqi Game. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
