import { Home, Gamepad2, Bot, FolderOpen, BookOpen, Trophy, LogOut } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const menuItems = [
    { id: 'offline', label: 'Play Offline', icon: Gamepad2 },
    { id: 'online', label: 'Play Online', icon: Home },
    { id: 'ai', label: 'Play vs AI', icon: Bot },
    { id: 'load', label: 'Load Saved Game', icon: FolderOpen },
    { id: 'tutorial', label: 'Tutorial', icon: BookOpen },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-900 via-red-800 to-amber-900">
      {/* Header */}
      <header className="p-6 text-center border-b border-red-700/50">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center border-4 border-red-600">
            <span className="text-3xl">象</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-amber-100 mb-2">象棋 Xiangqi</h1>
        <p className="text-amber-200/70">Chinese Chess Master</p>
      </header>

      {/* Main Menu */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500
                         text-white p-5 rounded-xl flex items-center gap-4 transition-all transform hover:scale-105
                         shadow-lg hover:shadow-xl border border-red-500/30"
              >
                <Icon className="w-7 h-7" />
                <span className="text-xl font-semibold">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => window.close()}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white p-5 rounded-xl flex items-center gap-4
                     transition-all transform hover:scale-105 shadow-lg"
          >
            <LogOut className="w-7 h-7" />
            <span className="text-xl font-semibold">Exit</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-red-700/50">
        <p className="text-amber-200/50 text-sm">Version 1.0.0</p>
        <p className="text-amber-200/40 text-xs mt-1">© 2026 Xiangqi Game. All rights reserved.</p>
      </footer>
    </div>
  );
}
