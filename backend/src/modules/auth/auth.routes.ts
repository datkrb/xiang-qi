import { Router } from "express";
import * as authController from "./auth.controller";
import * as middleware from "../../shared/middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", middleware.authenticate, authController.logout);

export default authRouter;
