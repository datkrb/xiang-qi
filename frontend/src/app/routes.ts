export const ROUTES = {
  HOME: "/home",
  PLAY: "/play",
  TUTORIAL: "/tutorial",
  LOAD: "/projects",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT: "/forgot",
  PROFILE: "/profile",
  FRIENDS: "/friends",
  OFFLINE: "/play/offline",
  ONLINE: "/play/online",
  AI: "/play/ai",
  LEADERBOARD: "/leaderboard",
} as const;

export type RouteParams = Record<string, string | number>;

export const buildRoute = (route: string, params?: RouteParams): string => {
  if (!params) return route;
  let finalRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`:${key}`, String(value));
  });
  return finalRoute;
};
