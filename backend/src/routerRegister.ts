import authRouter from "./modules/auth/auth.routes";
import usersRouter from "./modules/users/user.routes";
import { Router } from "express";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
export default router;
