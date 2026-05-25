import { Request, Response, NextFunction } from "express";

/**
 * Validation rules for settings fields
 */
const VALIDATION_RULES = {
  volume: (value: any) => {
    if (typeof value !== "number") return false;
    return value >= 0 && value <= 100;
  },
  boolean: (value: any) => typeof value === "boolean",
  language: (value: any) => ["vi", "en", "zh"].includes(value),
  theme: (value: any) => ["blue", "dark", "light"].includes(value),
  password: (value: any) => {
    if (typeof value !== "string" || value.length < 8) return false;
    // Must have uppercase and numbers
    return /[A-Z]/.test(value) && /[0-9]/.test(value);
  },
};

/**
 * Middleware to validate settings before processing
 */
export const validateSettings = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;

  // Validate audio settings if present
  if (body.audio) {
    if (!VALIDATION_RULES.boolean(body.audio.soundEnabled)) {
      return res.status(400).json({ error: "soundEnabled must be boolean" });
    }
    if (!VALIDATION_RULES.volume(body.audio.sfxVolume)) {
      return res.status(400).json({ error: "sfxVolume must be 0-100" });
    }
    if (!VALIDATION_RULES.boolean(body.audio.musicEnabled)) {
      return res.status(400).json({ error: "musicEnabled must be boolean" });
    }
    if (!VALIDATION_RULES.volume(body.audio.musicVolume)) {
      return res.status(400).json({ error: "musicVolume must be 0-100" });
    }
  }

  // Validate display settings if present
  if (body.display) {
    if (!VALIDATION_RULES.boolean(body.display.showCoordinates)) {
      return res.status(400).json({ error: "showCoordinates must be boolean" });
    }
    if (!VALIDATION_RULES.boolean(body.display.highlightMoves)) {
      return res.status(400).json({ error: "highlightMoves must be boolean" });
    }
    if (!VALIDATION_RULES.theme(body.display.theme)) {
      return res
        .status(400)
        .json({ error: "theme must be blue, dark, or light" });
    }
  }

  // Validate language settings if present
  if (body.language) {
    if (!VALIDATION_RULES.language(body.language.language)) {
      return res.status(400).json({ error: "language must be vi, en, or zh" });
    }
  }

  // Validate notification settings if present
  if (body.notifications) {
    if (!VALIDATION_RULES.boolean(body.notifications.notificationsEnabled)) {
      return res
        .status(400)
        .json({ error: "notificationsEnabled must be boolean" });
    }
    if (!VALIDATION_RULES.boolean(body.notifications.gameInvitations)) {
      return res.status(400).json({ error: "gameInvitations must be boolean" });
    }
    if (!VALIDATION_RULES.boolean(body.notifications.messages)) {
      return res.status(400).json({ error: "messages must be boolean" });
    }
  }

  next();
};

/**
 * Middleware to validate password change requests
 */
export const validatePasswordChange = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || typeof currentPassword !== "string") {
    return res.status(400).json({ error: "currentPassword is required" });
  }

  if (!newPassword || typeof newPassword !== "string") {
    return res.status(400).json({ error: "newPassword is required" });
  }

  if (!VALIDATION_RULES.password(newPassword)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters with uppercase and numbers",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      error: "New password must be different from current password",
    });
  }

  next();
};

export default { validateSettings, validatePasswordChange };
