import { Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";

const profileSelect = {
  id: true,
  userId: true,
  username: true,
  elo: true,
  avatar: true,
} as const;

export type ProfileResponse = Prisma.ProfileGetPayload<{
  select: typeof profileSelect;
}>;

export type UpdateProfileInput = {
  username?: string;
  avatar?: string | null;
};

const findProfileByUserId = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: profileSelect,
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};

// Create a profile for a user if it does not already exist.
export const createProfile = async (
  userId: string,
  profileData?: UpdateProfileInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
    select: profileSelect,
  });

  if (existingProfile) {
    throw new Error("Profile already exists");
  }

  return prisma.profile.create({
    data: {
      userId,
      username: profileData?.username ?? `user_${userId.slice(0, 8)}`,
      avatar: profileData?.avatar ?? null,
      elo: 1200,
    },
    select: profileSelect,
  });
};

export const getProfileByUserId = async (userId: string) => {
  return findProfileByUserId(userId);
};

export const getMyProfile = async (userId: string) => {
  return findProfileByUserId(userId);
};

export const updateMyProfile = async (
  userId: string,
  profileData: UpdateProfileInput,
) => {
  await findProfileByUserId(userId);

  return prisma.profile.update({
    where: { userId },
    data: {
      ...(profileData.username !== undefined
        ? { username: profileData.username }
        : {}),
      ...(profileData.avatar !== undefined
        ? { avatar: profileData.avatar }
        : {}),
    },
    select: profileSelect,
  });
};
