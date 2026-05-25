import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth"; // Assuming auth middleware exists
import { validateSettings } from "../middleware/validateSettings";
import UserSettings from "../models/UserSettings";

const router = Router();

/**
 * GET /api/settings
 * Fetch user's settings
 */
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Set by auth middleware

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const settings = await UserSettings.getSettings(userId);

    if (!settings) {
      // Return default settings if user has no saved settings
      return res.json({
        success: true,
        data: {
          audio: {
            soundEnabled: true,
            sfxVolume: 70,
            musicEnabled: true,
            musicVolume: 50,
          },
          display: {
            showCoordinates: true,
            highlightMoves: true,
            theme: "blue",
          },
          language: {
            language: "vi",
          },
          notifications: {
            notificationsEnabled: true,
            gameInvitations: true,
            messages: true,
          },
        },
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ success: false, error: "Failed to fetch settings" });
  }
});

/**
 * POST /api/settings
 * Create new user settings
 */
router.post(
  "/",
  authenticate,
  validateSettings,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const success = await UserSettings.saveSettings(userId, req.body);

      if (!success) {
        return res
          .status(500)
          .json({ success: false, error: "Failed to save settings" });
      }

      res.status(201).json({ success: true, data: req.body });
    } catch (error) {
      console.error("Error creating settings:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to create settings" });
    }
  },
);

/**
 * PUT /api/settings
 * Update user's settings
 */
router.put(
  "/",
  authenticate,
  validateSettings,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const success = await UserSettings.saveSettings(userId, req.body);

      if (!success) {
        return res
          .status(500)
          .json({ success: false, error: "Failed to update settings" });
      }

      res.json({ success: true, data: req.body });
    } catch (error) {
      console.error("Error updating settings:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update settings" });
    }
  },
);

export default router;
