/**
 * Core API Module
 *
 * Centralized API client and services for communicating with the backend.
 */

export {
  login,
  register,
  logout,
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMatch,
  type LoginResponse,
  type RegisterResponse,
  type Profile,
  type User,
  type PublicPlayer,
  type PublicRoom,
} from "./apiClient";

export { default as apiClient } from "./apiClient";
