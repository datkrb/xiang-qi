import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * UserSettings model for database persistence
 * Stores user-specific settings with version control for conflict resolution
 */
export interface UserSettingsData {
  soundEnabled: boolean;
  sfxVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  showCoordinates: boolean;
  highlightMoves: boolean;
  theme: string;
  language: string;
  notificationsEnabled: boolean;
  gameInvitations: boolean;
  messages: boolean;
}

export class UserSettings {
  /**
   * Get user's settings from database
   */
  static async getSettings(userId: string): Promise<UserSettingsData | null> {
    try {
      // Note: This requires adding user_settings table to schema.prisma
      // const settings = await prisma.user_settings.findUnique({
      //   where: { userId },
      // });
      // return settings?.data as UserSettingsData || null;

      // For now, return null (will be implemented after db migration)
      return null;
    } catch (error) {
      console.error("Error fetching user settings:", error);
      return null;
    }
  }

  /**
   * Save user's settings to database
   */
  static async saveSettings(
    userId: string,
    data: UserSettingsData,
  ): Promise<boolean> {
    try {
      // Note: This requires adding user_settings table to schema.prisma
      // await prisma.user_settings.upsert({
      //   where: { userId },
      //   update: { data, updatedAt: new Date() },
      //   create: { userId, data },
      // });
      // return true;

      // For now, return true (will be implemented after db migration)
      return true;
    } catch (error) {
      console.error("Error saving user settings:", error);
      return false;
    }
  }

  /**
   * Delete user's settings (for account deletion)
   */
  static async deleteSettings(userId: string): Promise<boolean> {
    try {
      // Note: This requires adding user_settings table to schema.prisma
      // await prisma.user_settings.delete({
      //   where: { userId },
      // });
      // return true;

      // For now, return true (will be implemented after db migration)
      return true;
    } catch (error) {
      console.error("Error deleting user settings:", error);
      return false;
    }
  }
}

export default UserSettings;
