import * as authMiddleware from "../../shared/middlewares/auth.middleware";
import { Router } from "express";
import * as userController from "./users.controller";

const usersRouter = Router();

// Get all users (Admin only)
usersRouter.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["ADMIN"]),
  userController.getAllUsers,
);

// Get user by ID (Admin only)
usersRouter.get(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize(["ADMIN"]),
  userController.getUserById,
);

// Create user (Admin only)
usersRouter.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["ADMIN"]),
  userController.createUser,
);

// Update user (Admin only)
usersRouter.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize(["ADMIN"]),
  userController.updateUser,
);

// Delete user (Admin only)
usersRouter.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize(["ADMIN"]),
  userController.deleteUser,
);

export default usersRouter;
