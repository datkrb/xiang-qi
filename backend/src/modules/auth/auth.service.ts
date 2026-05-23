import { hashPassword, comparePassword } from "../../utils/bcrypt";
import prisma from "../../utils/prisma";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";

export const register = async (email: string, password: string) => {
  //Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  //Hash password
  const hashedPassword = await hashPassword(password);

  //Save user to database, then create a unique profile username from the user id
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    await tx.profile.create({
      data: {
        userId: createdUser.id,
        username: `user_${createdUser.id.slice(0, 8)}`,
        elo: 1200,
      },
    });

    return createdUser;
  });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

export const login = async (email: string, password: string) => {
  //Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
      email: true,
      role: true,
    },
  });
  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  //Check password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  //Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  //Save refresh token to database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const logout = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};
