import { Request, Response } from "express";
import { ApiResponse } from "../../types/ApiResponse";
import * as profilesService from "./profiles.service";

const buildErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    const profile = await profilesService.getProfileByUserId(id);

    const response: ApiResponse<any> = {
      code: 200,
      message: "Profile retrieved successfully",
      data: profile,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: buildErrorMessage(error) });
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: No user in token" });
      return;
    }

    const profile = await profilesService.getMyProfile(userId);

    const response: ApiResponse<any> = {
      code: 200,
      message: "My profile retrieved successfully",
      data: profile,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: buildErrorMessage(error) });
  }
};

export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: No user in token" });
      return;
    }

    const { username, avatar } = req.body;
    const updatedProfile = await profilesService.updateMyProfile(userId, {
      username,
      avatar,
    });

    const response: ApiResponse<any> = {
      code: 200,
      message: "Profile updated successfully",
      data: updatedProfile,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: buildErrorMessage(error) });
  }
};
