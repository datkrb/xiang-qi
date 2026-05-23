import { useState, useCallback, Suspense, lazy } from "react";
import { useEffect } from "react";
import api from "./services/apiClient";
import { GuestStorage } from "./utils/GuestStorage";
import "./App.css";
import { GameProvider, useGame } from "./context/GameContext";
import { GameConfig } from "./components/GameModeScreen";

// Define Screen types
type Screen =
  | "login"
  | "register"
  | "forgot"
  | "home"
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
const LoginScreen = lazy(() => import("./components/LoginScreen"));
const RegisterScreen = lazy(() => import("./components/RegisterScreen"));
const ForgotPasswordScreen = lazy(
  () => import("./components/ForgotPasswordScreen"),
);
const ProfileScreen = lazy(() => import("./components/ProfileScreen"));
const FriendsScreen = lazy(() => import("./components/FriendsScreen"));
const SettingsScreen = lazy(() => import("./components/SettingsScreen"));
const HomeScreen = lazy(() => import("./components/HomeScreen"));
const OnlineGameScreen = lazy(() => import("./components/OnlineGameScreen"));
const MainGameScreen = lazy(() => import("./components/MainGameScreen"));
const LoadGameScreen = lazy(() => import("./components/LoadGameScreen"));

// Named exports loaded via dynamic imports
const OfflineGameModeScreen = lazy(() =>
  import("./components/OfflineGameModeScreen").then((m) => ({
    default: m.OfflineGameModeScreen,
  })),
);
const AIGameModeScreen = lazy(() =>
  import("./components/AIGameModeScreen").then((m) => ({
    default: m.AIGameModeScreen,
  })),
);
const TutorialScreen = lazy(() =>
  import("./components/TutorialScreen").then((m) => ({
    default: m.TutorialScreen,
  })),
);
const LeaderboardScreen = lazy(() =>
  import("./components/LeaderboardScreen").then((m) => ({
    default: m.LeaderboardScreen,
  })),
);

// Fallback Loading Screen for lazy components
const ScreenFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-955 via-red-900 to-amber-955 flex flex-col items-center justify-center text-amber-100 gap-4">
    <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-lg" />
    <p className="text-xl font-bold animate-pulse text-amber-300">
      Loading Battleground...
    </p>
  </div>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [deepLinkRoomId, setDeepLinkRoomId] = useState<string | null>(null);

  // Correct React State pattern: use useState with lazy initializer instead of useMemo for session userId
  const [userId] = useState(
    () => `user-${Math.random().toString(36).substring(2, 9)}`,
  );

  // Stabilize callbacks using useCallback
  const handleNavigate = useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
  }, []);

  const handleNavigateToForgotOrRegister = useCallback((screen: string) => {
    setCurrentScreen(screen === "register" ? "register" : "forgot");
  }, []);

  const handleLogin = useCallback(
    async (emailOrPayload: any) => {
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
    },
    [],
  );

  const handleRegister = useCallback(async (data: any) => {
    try {
      const res = await api.register(data.username, data.email, data.password || "");
      if (res?.accessToken) {
        localStorage.setItem("authToken", res.accessToken);
      }
      if (res?.user?.id) {
        localStorage.setItem("authUserId", res.user.id);
      } else if (res?.id) {
        localStorage.setItem("authUserId", res.id);
      }
      setCurrentScreen("home");
    } catch (err: any) {
      console.error("Register failed:", err);
      alert(err.message || "Register failed");
    }
  }, []);

  const handleLogout = useCallback(() => {
    console.log("Logout");
    setCurrentScreen("login");
  }, []);

  const handleStartGame = useCallback((config: GameConfig) => {
    setGameConfig(config);
    setCurrentScreen("game");
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentScreen("home");
    setGameConfig(null);
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

          {currentScreen === "profile" ? (
            <ProfileScreen onBack={handleBackToHome} />
          ) : null}

          {currentScreen === "friends" ? (
            <FriendsScreen onBack={handleBackToHome} />
          ) : null}

          {currentScreen === "settings" ? (
            <SettingsScreen onBack={handleBackToHome} onLogout={handleLogout} />
          ) : null}

          {currentScreen === "home" ? (
            <HomeScreen onNavigate={handleNavigate} />
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
            <MainGameScreen config={gameConfig!} onExit={handleBackToHome} />
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
        </Suspense>
      </div>
    </GameProvider>
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

        const isPlayer =
          (!!authUserId &&
            (room?.playerRed?.userId === authUserId ||
              room?.playerBlack?.userId === authUserId)) ||
          (!!guestToken &&
            (room?.playerRed?.guestId === guestToken ||
              room?.playerBlack?.guestId === guestToken));

        if (isPlayer) {
          if (authUserId) {
            joinRoom(roomId, { userId: authUserId, role: "USER" });
          } else if (guestToken) {
            joinRoom(roomId, {
              guestId: guestToken,
              displayName: "Guest",
              elo: GuestStorage.getGuestElo(),
              role: "GUEST",
            });
          }
        } else {
          const spectatorId =
            authUserId || (guestToken ? `guest-${guestToken.slice(0, 8)}` : "spectator");
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
