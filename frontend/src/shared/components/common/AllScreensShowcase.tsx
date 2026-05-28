import HomeScreen from "@features/play/screens/HomeScreen";
import GameModeScreen, { GameConfig } from "@features/game/screens/GameModeScreen";
import MainGameScreen from "@features/game/screens/MainGameScreen";
import LoadGameScreen from "@features/play/screens/LoadGameScreen";

const noop = () => {};
const noopNav = (_: string) => {};
const noopStart = (_: GameConfig) => {};
const noopLoad = (_: string) => {};

const demoConfig: GameConfig = {
  mode: 'pvp',
  playerColor: 'red',
  timeLimit: '10',
} as GameConfig;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b-4 border-amber-900/40">
      <div className="sticky top-0 z-10 bg-amber-900 text-amber-50 px-6 py-2 font-bold shadow">
        {title}
      </div>
      <div className="bg-white">{children}</div>
    </section>
  );
}

export default function AllScreensShowcase() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Section title="HomeScreen">
        <HomeScreen onNavigate={noopNav} />
      </Section>

      <Section title="GameModeScreen — Offline (PvP)">
        <GameModeScreen mode="offline" onBack={noop} onStartGame={noopStart} />
      </Section>

      <Section title="GameModeScreen — AI">
        <GameModeScreen mode="ai" onBack={noop} onStartGame={noopStart} />
      </Section>

      <Section title="GameModeScreen — Online">
        <GameModeScreen mode="online" onBack={noop} onStartGame={noopStart} />
      </Section>

      <Section title="LoadGameScreen">
        <LoadGameScreen onBack={noop} onLoadGame={noopLoad} />
      </Section>

      <Section title="MainGameScreen (with board, captured tray, history, popups)">
        <MainGameScreen config={demoConfig} onExit={noop} />
      </Section>
    </div>
  );
}
