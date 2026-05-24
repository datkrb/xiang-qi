import { Router } from "express";
import * as authMiddleware from "../../shared/middlewares/auth.middleware";
import * as profilesController from "./profiles.controller";

const profilesRouter = Router();

profilesRouter.get("/users/:id/profile", profilesController.getUserProfile);

profilesRouter.get(
  "/me/profile",
  authMiddleware.authenticate,
  profilesController.getMyProfile,
);

profilesRouter.patch(
  "/me/profile",
  authMiddleware.authenticate,
  profilesController.updateMyProfile,
);

export default profilesRouter;
