import { useState } from "react";
import {
  Home,
  Gamepad2,
  FolderOpen,
  Settings,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AppSidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const primaryNav = [
  { id: "home", label: "Home", icon: Home },
  { id: "play", label: "Play", icon: Gamepad2 },
  { id: "tutorial", label: "Tutorial", icon: Shield },
];

const accountNav = [
  { id: "load", label: "Keep Project", icon: FolderOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AppSidebar({
  currentScreen,
  onNavigate,
  isOpen,
  onClose,
}: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col bg-surface/50 backdrop-blur-xl border-r border-border min-h-screen transform transition-all duration-300 lg:sticky lg:top-0 lg:flex lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-80"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-border lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-heading font-bold text-lg shrink-0">
              將
            </div>
            <div>
              <p className="text-sm font-semibold text-main leading-tight">
                Xiangqi Arena
              </p>
              <p className="text-[11px] text-muted">Mobile menu</p>
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

        <div className={`px-4 py-6 border-b border-border hidden lg:flex items-center transition-all ${isCollapsed ? "justify-center" : "gap-3 px-6"}`}>
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex shrink-0 items-center justify-center text-primary font-heading font-bold text-xl">
            將
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-lg font-bold font-heading text-main leading-tight">
                Xiangqi Arena
              </p>
              <p className="text-xs text-muted">Modern chess workspace</p>
            </div>
          )}
        </div>

        <div className="px-4 py-5 space-y-5 flex-1 overflow-y-auto overflow-x-hidden">
          <NavSection
            label="Play"
            items={primaryNav}
            currentScreen={currentScreen}
            onNavigate={onNavigate}
            isCollapsed={isCollapsed}
          />
          <NavSection
            label="Account"
            items={accountNav}
            currentScreen={currentScreen}
            onNavigate={onNavigate}
            isCollapsed={isCollapsed}
          />
        </div>

        <div className="p-4 border-t border-border hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-surface-opaque hover:bg-surface-hover text-muted hover:text-main transition-colors border border-transparent hover:border-border"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
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
  isCollapsed,
}: {
  label: string;
  items: { id: string; label: string; icon: any }[];
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isCollapsed: boolean;
}) {
  return (
    <div>
      {!isCollapsed && (
        <div className="px-3 pb-2 text-[11px] uppercase tracking-[0.3em] text-muted whitespace-nowrap overflow-hidden">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isCollapsed ? "justify-center px-0" : "gap-3 px-4"
              } ${
                active
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                  : "text-muted hover:bg-surface-hover hover:text-main"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
