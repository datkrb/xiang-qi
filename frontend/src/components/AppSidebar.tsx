import {
  Home,
  Gamepad2,
  Bot,
  FolderOpen,
  Trophy,
  User,
  Users,
  Settings,
  LogOut,
  Swords,
  Shield,
  Menu,
} from "lucide-react";

interface AppSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const primaryNav = [
  { id: "home", label: "Home", icon: Home },
  { id: "online", label: "Play Online", icon: Swords },
  { id: "offline", label: "Offline", icon: Gamepad2 },
  { id: "ai", label: "Vs AI", icon: Bot },
  { id: "load", label: "Saved Games", icon: FolderOpen },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
];

const accountNav = [
  { id: "profile", label: "Profile", icon: User },
  { id: "friends", label: "Friends", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AppSidebar({
  currentScreen,
  onNavigate,
  onLogout,
}: AppSidebarProps) {
  return (
    <aside className="hidden lg:flex w-80 shrink-0 flex-col bg-slate-950/95 border-r border-white/10 text-white min-h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl">
            將
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">Xiangqi Arena</p>
            <p className="text-xs text-slate-400">Modern chess workspace</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 flex-1 overflow-y-auto">
        <NavSection label="Play" items={primaryNav} currentScreen={currentScreen} onNavigate={onNavigate} />
        <NavSection label="Account" items={accountNav} currentScreen={currentScreen} onNavigate={onNavigate} />
      </div>

      <div className="px-4 py-5 border-t border-white/10 space-y-3">
        <button
          onClick={onNavigate.bind(null, "tutorial")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          Tutorial
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-sm font-semibold text-rose-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavSection({
  label,
  items,
  currentScreen,
  onNavigate,
}: {
  label: string;
  items: { id: string; label: string; icon: any }[];
  currentScreen: string;
  onNavigate: (screen: string) => void;
}) {
  return (
    <div>
      <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">
        {label}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-amber-400 text-slate-950"
                  : "text-slate-200 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
