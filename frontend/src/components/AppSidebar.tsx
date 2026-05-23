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
  X,
} from "lucide-react";

interface AppSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
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
  isOpen,
  onClose,
}: AppSidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 shrink-0 flex-col bg-surface-opaque border-r border-surface min-h-screen transform transition-transform duration-300 lg:sticky lg:top-0 lg:flex lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg">
              將
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                Xiangqi Arena
              </p>
              <p className="text-[11px] text-slate-400">Mobile menu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 border-b border-surface hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl">
              將
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">
                Xiangqi Arena
              </p>
              <p className="text-xs text-slate-400">Modern chess workspace</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 space-y-5 flex-1 overflow-y-auto">
          <NavSection
            label="Play"
            items={primaryNav}
            currentScreen={currentScreen}
            onNavigate={onNavigate}
          />
          <NavSection
            label="Account"
            items={accountNav}
            currentScreen={currentScreen}
            onNavigate={onNavigate}
          />
        </div>

        <div className="px-4 py-5 border-t border-surface space-y-3">
          <button
            onClick={() => onNavigate("tutorial")}
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
    </>
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
      <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.3em] text-muted">
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
                  ? "bg-primary text-on-primary"
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
