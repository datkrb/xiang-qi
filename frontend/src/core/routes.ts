/**
 * Centralized route definitions for the application
 * Use these constants throughout the app to avoid hardcoded route strings
 */

export const ROUTES = {
  // Home and authentication
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Game
  GAME: "/game",
  GAME_DETAIL: "/game/:gameId",
  GAME_ROOM: "/game/:gameId/room",
  OFFLINE_GAME: "/game/offline",
  AI_GAME: "/game/ai",

  // Social
  PROFILE: "/profile",
  PROFILE_DETAIL: "/profile/:userId",
  FRIENDS: "/friends",
  LEADERBOARD: "/leaderboard",

  // Settings
  SETTINGS: "/settings",

  // Other
  NOT_FOUND: "/404",
} as const;

/**
 * Type-safe route navigation helper
 * Ensures route parameters are provided when needed
 */
export type RouteParams = {
  [ROUTES.GAME_DETAIL]: { gameId: string };
  [ROUTES.GAME_ROOM]: { gameId: string };
  [ROUTES.PROFILE_DETAIL]: { userId: string };
};

/**
 * Helper to build routes with parameters
 * @example
 * buildRoute(ROUTES.GAME_DETAIL, { gameId: '123' }) // '/game/123'
 */
export function buildRoute<T extends keyof RouteParams>(
  route: T,
  params: RouteParams[T],
): string {
  let path: string = route as string;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });
  return path;
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  const publicRoutes = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.HOME,
  ];
  return !publicRoutes.includes(pathname as any);
}
