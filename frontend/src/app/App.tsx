import { useState, useCallback, Suspense, lazy } from "react";
import { useEffect } from "react";
import api from "@shared/services/apiClient";
import { GuestStorage } from "@shared/utils/GuestStorage";
import "../App.css";
import { GameProvider, useGame } from "./providers/GameProvider";
import ThemeProvider from "@shared/theme/ThemeProvider";
import { GameConfig } from "@features/game/screens/GameModeScreen";
import AppSidebar from "@shared/components/layouts/AppSidebar";
import { Menu } from "lucide-react";

// Define Screen types
type Screen =
  | "login"
  | "register"
  | "forgot"
  | "home"
  | "play"
  | "offline"
  | "online"
  | "ai"
  | "game"
  | "load"
  | "tutorial"
  | "leaderboard"
  | "profile"
  | "friends"
  | "settings";

// Lazy-loaded screen components for code-splitting
const LoginScreen = lazy(() => import("@features/auth/screens/LoginScreen"));
const RegisterScreen = lazy(() => import("@features/auth/screens/RegisterScreen"));
const ForgotPasswordScreen = lazy(() => import("@features/auth/screens/ForgotPasswordScreen"));
const ProfileScreen = lazy(() => import("@features/profile/screens/ProfileScreen"));
const FriendsScreen = lazy(() => import("@features/friends/screens/FriendsScreen"));
const SettingsScreen = lazy(() => import("@features/settings/screens/SettingsScreen"));
const HomeScreen = lazy(() => import("@features/play/screens/HomeScreen"));
const OnlineGameScreen = lazy(() => import("@features/game/screens/OnlineGameScreen"));
const MainGameScreen = lazy(() => import("@features/game/screens/MainGameScreen"));
const LoadGameScreen = lazy(() => import("@features/play/screens/LoadGameScreen"));
const PlayScreen = lazy(() => import("@features/play/screens/PlayScreen"));

// Named exports loaded via dynamic imports
const OfflineGameModeScreen = lazy(() =>
  import("@features/game/screens/OfflineGameModeScreen").then((m) => ({
    default: m.OfflineGameModeScreen,
  })),
);
const AIGameModeScreen = lazy(() =>
  import("@features/game/screens/AIGameModeScreen").then((m) => ({
    default: m.AIGameModeScreen,
  })),
);
const TutorialScreen = lazy(() =>
  import("@features/game/screens/TutorialScreen").then((m) => ({
    default: m.TutorialScreen,
  })),
);
const LeaderboardScreen = lazy(() =>
  import("@features/leaderboard/screens/LeaderboardScreen").then((m) => ({
    default: m.LeaderboardScreen,
  })),
);

// Fallback Loading Screen for lazy components
const ScreenFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-muted gap-4">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg" />
    <p className="text-xl font-bold font-heading animate-pulse text-muted">
      Loading Battleground...
    </p>
  </div>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [deepLinkRoomId, setDeepLinkRoomId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Correct React State pattern: use useState with lazy initializer instead of useMemo for session userId
  const [userId] = useState(
    () => `user-${Math.random().toString(36).substring(2, 9)}`,
  );

  // Stabilize callbacks using useCallback
  const handleNavigate = useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
    setIsSidebarOpen(false);
    
    // push URL to history
    let path = "/";
    switch (screen) {
      case "home": path = "/home"; break;
      case "play": path = "/play"; break;
      case "tutorial": path = "/tutorial"; break;
      case "load": path = "/projects"; break;
      case "settings": path = "/settings"; break;
      case "login": path = "/login"; break;
      case "register": path = "/register"; break;
      case "forgot": path = "/forgot"; break;
      case "profile": path = "/profile"; break;
      case "friends": path = "/friends"; break;
      case "offline": path = "/play/offline"; break;
      case "online": path = "/play/online"; break;
      case "ai": path = "/play/ai"; break;
      case "leaderboard": path = "/leaderboard"; break;
      default: break;
    }
    if (path !== "/") window.history.pushState({}, "", path);
  }, []);

  const handleNavigateToForgotOrRegister = useCallback((screen: string) => {
    setCurrentScreen(screen === "register" ? "register" : "forgot");
  }, []);

  const handleLogin = useCallback(async (emailOrPayload: any) => {
    try {
      // expected payload: { email, password }
      const { email, password } =
        typeof emailOrPayload === "string"
          ? { email: emailOrPayload, password: "" }
          : emailOrPayload;
      const res = await api.login(email, password);
      // res should include accessToken and user info
      if (res?.accessToken) {
        localStorage.setItem("authToken", res.accessToken);
      }
      if (res?.user?.id) {
        localStorage.setItem("authUserId", res.user.id);
      }
      setCurrentScreen("home");
    } catch (err: any) {
      console.error("Login failed:", err);
      alert(err.message || "Login failed");
    }
  }, []);

  const handleRegister = useCallback(async (data: any) => {
    try {
      const res = await api.register(data.email, data.password || "");
      if (res?.accessToken) {
        localStorage.setItem("authToken", res.accessToken);
      }
      if (res?.id) {
        localStorage.setItem("authUserId", res.id);
      }
      setCurrentScreen("home");
    } catch (err: any) {
      console.error("Register failed:", err);
      alert(err.message || "Register failed");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api.logout();
    } catch (_) {
      // Ignore errors — we clear local state regardless
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUserId");
    console.log("Logout");
    setIsSidebarOpen(false);
    setCurrentScreen("login");
  }, []);

  const handleGuestPlay = useCallback(() => {
    GuestStorage.getOrCreateGuest();
    setIsSidebarOpen(false);
    setCurrentScreen("home");
  }, []);

  const handleStartGame = useCallback((config: GameConfig) => {
    setGameConfig(config);
    setCurrentScreen("game");
  }, []);

  const handleBackToHome = useCallback(() => {
    setIsSidebarOpen(false);
    setCurrentScreen("home");
    setGameConfig(null);
    window.history.pushState({}, "", "/");
  }, []);

  const handleStartOnlineGame = useCallback(() => {
    setGameConfig({
      mode: "online",
      playerColor: "random",
      timeLimit: "unlimited",
    });
    setCurrentScreen("game");
  }, []);

  const handleLoadGame = useCallback((gameId: string) => {
    console.log("Loading game:", gameId);
    setCurrentScreen("game");
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    // Perform deletion logic (e.g. GuestStorage or API)
    console.log("Deleting project/game...");
    setIsDeleteModalOpen(false);
    // Optionally show a toast here
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    
    // Mount URL parsing
    if (path.startsWith("/match/")) return;

    if (path === "/home" || path === "/") setCurrentScreen("home");
    else if (path === "/play") setCurrentScreen("play");
    else if (path === "/tutorial") setCurrentScreen("tutorial");
    else if (path === "/projects") setCurrentScreen("load");
    else if (path === "/settings") setCurrentScreen("settings");
    else if (path === "/login") setCurrentScreen("login");
    else if (path === "/register") setCurrentScreen("register");
    else if (path === "/forgot") setCurrentScreen("forgot");
    else if (path === "/profile") setCurrentScreen("profile");
    else if (path === "/friends") setCurrentScreen("friends");
    else if (path === "/play/offline") setCurrentScreen("offline");
    else if (path === "/play/online") setCurrentScreen("online");
    else if (path === "/play/ai") setCurrentScreen("ai");
    else if (path === "/leaderboard") setCurrentScreen("leaderboard");
  }, []);

  useEffect(() => {
    const match = window.location.pathname.match(/^\/match\/([^/]+)/);
    if (!match) return;

    const roomId = decodeURIComponent(match[1]);
    setDeepLinkRoomId(roomId);
  }, []);

  const handleMatchDeepLinkReady = useCallback((roomId: string) => {
    setGameConfig({
      mode: "online",
      playerColor: "random",
      timeLimit: "unlimited",
    });
    setCurrentScreen("game");
    GuestStorage.setCurrentMatch(roomId);
  }, []);

  return (
    <ThemeProvider>
      <GameProvider>
        {/* Ensure guest token exists for anonymous users */}
        {/* Initialize guest token on app mount */}
        <GuestInitializer />
        {deepLinkRoomId ? (
          <MatchRouteHandler
            roomId={deepLinkRoomId}
            onReady={handleMatchDeepLinkReady}
          />
        ) : null}
        <div className="size-full">
          <Suspense fallback={<ScreenFallback />}>
            {currentScreen === "login" ? (
              <LoginScreen
                onLogin={handleLogin}
                onGuestPlay={handleGuestPlay}
                onNavigate={handleNavigateToForgotOrRegister}
              />
            ) : null}

            {currentScreen === "register" ? (
              <RegisterScreen
                onRegister={handleRegister}
                onNavigate={handleNavigate}
              />
            ) : null}

            {currentScreen === "forgot" ? (
              <ForgotPasswordScreen onNavigate={handleNavigate} />
            ) : null}

            {currentScreen !== "login" &&
            currentScreen !== "register" &&
            currentScreen !== "forgot" ? (
              <div className="relative flex min-h-screen">
                <AppSidebar
                  currentScreen={currentScreen}
                  onNavigate={handleNavigate}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                />
                <main className="flex-1 min-w-0 w-full lg:ml-0">
                  <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border glass-panel px-4 py-3 lg:hidden">
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="inline-flex items-center justify-center rounded-lg bg-surface-opaque p-2 hover:bg-surface-hover transition-colors"
                      aria-label="Open navigation"
                    >
                      <Menu className="h-5 w-5 text-main" />
                    </button>
                    <div className="text-center">
                      <p className="text-sm font-bold font-heading text-main leading-tight">
                        Xiangqi Arena
                      </p>
                      <p className="text-[11px] text-muted capitalize">
                        {currentScreen}
                      </p>
                    </div>
                    <div className="w-9" />
                  </div>

                  <div className="mx-auto w-full max-w-400">
                    {currentScreen === "profile" ? (
                      <ProfileScreen onBack={handleBackToHome} />
                    ) : null}

                    {currentScreen === "friends" ? (
                      <FriendsScreen onBack={handleBackToHome} />
                    ) : null}

                    {currentScreen === "settings" ? (
                      <SettingsScreen
                        onBack={handleBackToHome}
                        onLogout={handleLogout}
                      />
                    ) : null}

                    {currentScreen === "home" ? (
                      <HomeScreen onNavigate={handleNavigate} />
                    ) : null}

                    {currentScreen === "play" ? (
                      <PlayScreen
                        onNavigate={handleNavigate}
                        onBack={handleBackToHome}
                      />
                    ) : null}

                    {currentScreen === "offline" ? (
                      <OfflineGameModeScreen
                        onBack={handleBackToHome}
                        onStartGame={handleStartGame}
                      />
                    ) : null}

                    {currentScreen === "online" ? (
                      <OnlineGameScreen
                        onBack={handleBackToHome}
                        onStartGame={handleStartOnlineGame}
                        userData={{
                          userId,
                          username: "Player",
                          elo: 1000,
                        }}
                      />
                    ) : null}

                    {currentScreen === "ai" ? (
                      <AIGameModeScreen
                        onBack={handleBackToHome}
                        onStartGame={handleStartGame}
                      />
                    ) : null}

                    {currentScreen === "game" ? (
                      <MainGameScreen
                        config={gameConfig!}
                        onExit={handleBackToHome}
                      />
                    ) : null}

                    {currentScreen === "load" ? (
                      <LoadGameScreen
                        onBack={handleBackToHome}
                        onLoadGame={handleLoadGame}
                      />
                    ) : null}

                    {currentScreen === "tutorial" ? (
                      <TutorialScreen onBack={handleBackToHome} />
                    ) : null}

                    {currentScreen === "leaderboard" ? (
                      <LeaderboardScreen onBack={handleBackToHome} />
                    ) : null}
                  </div>
                </main>
              </div>
            ) : null}
          </Suspense>

          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="glass-panel rounded-2xl p-6 max-w-sm w-full border-border shadow-2xl transform transition-all">
                <h3 className="text-xl font-bold font-heading text-danger mb-2">Delete Item</h3>
                <p className="text-muted text-sm mb-6">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-surface-opaque text-muted hover:text-main transition-colors border border-border hover:border-primary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 rounded-lg btn-danger shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </GameProvider>
    </ThemeProvider>
  );
}

function GuestInitializer() {
  useEffect(() => {
    GuestStorage.getOrCreateGuest();
  }, []);
  return null;
}

function MatchRouteHandler({
  roomId,
  onReady,
}: {
  roomId: string;
  onReady: (roomId: string) => void;
}) {
  const { joinRoom, spectateRoom } = useGame();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const room = await api.getMatch(roomId);
        if (cancelled || !room) return;

        const authUserId = localStorage.getItem("authUserId");
        const guestToken = GuestStorage.getGuestToken();

        // toPublicRoom returns players.red / players.black with { userId }
        const isPlayer =
          !!authUserId &&
          (room.players?.red?.userId === authUserId ||
            room.players?.black?.userId === authUserId);

        if (isPlayer && authUserId) {
          joinRoom(roomId, { userId: authUserId, role: "USER" });
        } else if (guestToken) {
          // Guest deep-link: try to join — server will sort by guestId
          joinRoom(roomId, {
            guestId: guestToken,
            displayName: "Guest",
            elo: GuestStorage.getGuestElo(),
            role: "GUEST",
          });
        } else {
          const spectatorId =
            authUserId ||
            (guestToken ? `guest-${guestToken.slice(0, 8)}` : "spectator");
          spectateRoom(roomId, {
            userId: spectatorId,
            role: authUserId ? "USER" : "GUEST",
            displayName: authUserId ? "User" : "Guest Spectator",
          });
        }

        onReady(roomId);
      } catch (err) {
        console.error("Failed to open match from URL", err);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [roomId, joinRoom, spectateRoom, onReady]);

  return null;
}
