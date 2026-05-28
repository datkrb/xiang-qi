/**
 * API Client — covers all REST endpoints from specAPI.md
 *
 * All functions return unwrapped `data` from the standard
 * ApiResponse { code, message, data } envelope.
 */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:8080";

// ─── Internal helpers ────────────────────────────────────────────────────────

async function request<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = API_BASE + path;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string>),
  };

  const token = localStorage.getItem("authToken");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...opts, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message || res.statusText);
  }

  // unwrap ApiResponse { code, message, data }
  return body?.data ?? body;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth — POST /auth/register, /auth/login, /auth/logout
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  user: { id: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  return request("/auth/logout", { method: "POST", body: "{}" });
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile — GET /users/:id/profile, GET /me/profile, PATCH /me/profile
// ─────────────────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  userId: string;
  username: string;
  elo: number;
  avatar: string | null;
}

/** Public profile — no auth required */
export async function getUserProfile(userId: string): Promise<Profile> {
  return request<Profile>(`/users/${encodeURIComponent(userId)}/profile`);
}

/** Authenticated user's own profile */
export async function getMyProfile(): Promise<Profile> {
  return request<Profile>("/me/profile");
}

/** Update authenticated user's profile */
export async function updateMyProfile(data: {
  username?: string;
  avatar?: string;
}): Promise<Profile> {
  return request<Profile>("/me/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Users (Admin) — CRUD at /users
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/** Admin: list all users */
export async function getAllUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

/** Admin: get user by id */
export async function getUserById(userId: string): Promise<User> {
  return request<User>(`/users/${encodeURIComponent(userId)}`);
}

/** Admin: create user */
export async function createUser(
  email: string,
  password: string,
  role: string = "USER",
): Promise<User> {
  return request<User>("/users", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
}

/** Admin: update user */
export async function updateUser(
  userId: string,
  data: Record<string, unknown>,
): Promise<User> {
  return request<User>(`/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** Admin: delete user */
export async function deleteUser(userId: string): Promise<void> {
  return request(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Match snapshot — GET /match/:roomId
// ─────────────────────────────────────────────────────────────────────────────

export interface PublicPlayer {
  userId: string | null;
  username: string | null;
  elo: number | null;
}

export interface PublicRoom {
  roomId: string;
  fen: string;
  isRanked: boolean;
  isGuest: boolean;
  createdAt: number;
  players: {
    red: PublicPlayer | null;
    black: PublicPlayer | null;
  };
}

/** Get a public snapshot of an active room */
export async function getMatch(roomId: string): Promise<PublicRoom> {
  return request<PublicRoom>(`/match/${encodeURIComponent(roomId)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — backwards-compatible with existing `import api from`
// ─────────────────────────────────────────────────────────────────────────────

export default {
  // Auth
  login,
  register,
  logout,
  // Profile
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  // Users (Admin)
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  // Match
  getMatch,
};
