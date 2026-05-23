import authRouter from "./modules/auth/auth.routes";
import usersRouter from "./modules/users/user.routes";
import { Router } from "express";
import { activeRooms } from "./socket/gameState";
import { Request, Response } from "express";
import { GameRoom } from "./socket/gameState";
import devRouter from "./modules/dev/dev.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);

// Dev endpoints (testing helpers)
router.use("/dev", devRouter);

// GET /match/:roomId - return in-memory room snapshot (useful for shareable links)
router.get("/match/:roomId", (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room: GameRoom | undefined = activeRooms.get(roomId);
  if (!room) {
    return res
      .status(404)
      .json({ code: 404, message: "Match not found", data: null });
  }

  return res
    .status(200)
    .json({ code: 200, message: "Match retrieved", data: room });
});
export default router;
